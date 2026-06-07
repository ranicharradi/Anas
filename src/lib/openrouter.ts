/**
 * Thin OpenRouter client for the chatbot slide. All tunable config lives at the
 * top of this file. Streaming via SSE over fetch, under an AbortController
 * timeout. Never throws to callers: on any failure it resolves { ok: false } so
 * the slide can show the canned fallback answer instead of an error.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface StreamChatResult {
  /** false when the call failed and the caller should show FALLBACK_ANSWER. */
  ok: boolean;
}

/** Swap this one line to change models (e.g. a paid model, or Nemotron). */
export const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

/**
 * Abort the call after this long so the slide never hangs on stage. Tokens
 * stream in progressively, so this is just a ceiling for a dead connection;
 * 20s lets a full multi-sentence answer finish without truncation.
 */
export const REQUEST_TIMEOUT_MS = 20_000;

export const SYSTEM_PROMPT = `Tu es un·e infirmier·ère éducateur·rice spécialisé·e dans la prévention des infections sexuellement transmissibles (IST) chez les adolescents. Réponds toujours en français, de façon bienveillante, claire et adaptée à un public adolescent. Concentre-toi sur la prévention des IST, le dépistage, et la communication entre soignant et adolescent. Si une question sort de ce domaine, ramène poliment la conversation vers ce sujet. Donne des réponses concises, de 2 à 4 phrases.`;

export const FALLBACK_ANSWER = `La prévention des IST chez les adolescents repose sur trois piliers : une information claire et sans jugement, l'usage systématique du préservatif, et le recours au dépistage régulier. En tant qu'infirmier·ère, créer un climat de confiance et de confidentialité est essentiel pour que le jeune ose poser ses questions.`;

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Stream a reply from OpenRouter. Calls `onToken` for each text chunk as it
 * arrives. Resolves { ok: true } if at least one token was received, otherwise
 * { ok: false } (missing key, network error, timeout, bad response, no content).
 */
export async function streamChat(
  messages: ChatMessage[],
  onToken: (chunk: string) => void,
): Promise<StreamChatResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) return { ok: false };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        // Nemotron is a reasoning model; skip the thinking pass so replies arrive
        // in ~4s (full answer) instead of ~30s, comfortably under the timeout.
        reasoning: { enabled: false },
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) return { ok: false };

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let received = false;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue; // skips ": OPENROUTER PROCESSING" keep-alives
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const token: unknown = json?.choices?.[0]?.delta?.content;
          if (typeof token === "string" && token.length > 0) {
            received = true;
            onToken(token);
          }
        } catch {
          // partial/keep-alive JSON line; ignore
        }
      }
    }

    return { ok: received };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
}
