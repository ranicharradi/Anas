// Vercel edge function. Holds OPENROUTER_API_KEY server-side and re-emits a
// plain text token stream so the browser never sees the key or OpenRouter's
// SSE format. Not part of the app `tsc -b` build; Vercel builds api/.
export const config = { runtime: "edge" };

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

// Abort a stalled upstream so the function (and the UI) never hang. Matches the
// deck client's ceiling.
const REQUEST_TIMEOUT_MS = 20_000;

// Guard the shared key against abusive payloads.
const MAX_MESSAGES = 20;
const MAX_TOTAL_CHARS = 8_000;

const SYSTEM_PROMPT = `Tu es un assistant de prévention des infections sexuellement transmissibles (IST) destiné aux adolescents. Tutoie la personne. Sois bienveillant, simple, sans jugement et rassurant sur la confidentialité. Reste sur le thème de la prévention des IST, du dépistage et de la communication avec un soignant ou un partenaire. Ne pose jamais de diagnostic et ne prescris aucun traitement précis. Donne des réponses concises, de 2 à 4 phrases, en français. Si la question sort du sujet, ramène poliment la conversation vers la prévention des IST. Pour toute situation urgente, de détresse, ou qui nécessite un avis médical, invite à consulter un professionnel de santé ou le centre de santé le plus proche, sans jamais donner de numéro inventé.`;

interface Msg {
  role: "user" | "assistant";
  content: string;
}

function isMessages(value: unknown): value is Msg[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        m &&
        typeof m === "object" &&
        (m as Msg).role !== undefined &&
        ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
        typeof (m as Msg).content === "string",
    )
  );
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return new Response("Server not configured", { status: 500 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!isMessages(messages) || messages.length === 0) {
    return new Response("Bad request", { status: 400 });
  }

  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  if (messages.length > MAX_MESSAGES || totalChars > MAX_TOTAL_CHARS) {
    return new Response("Payload too large", { status: 413 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        reasoning: { enabled: false },
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timeout);
    return new Response("Upstream error", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(timeout);
    return new Response("Upstream error", { status: 502 });
  }

  // Transform OpenRouter SSE into a plain-text token stream.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  // Parse one SSE line and enqueue its token, if any.
  function emitLine(line: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const data = trimmed.slice(5).trim();
    if (data === "[DONE]") return;
    try {
      const json = JSON.parse(data);
      const token: unknown = json?.choices?.[0]?.delta?.content;
      if (typeof token === "string" && token.length > 0) {
        controller.enqueue(encoder.encode(token));
      }
    } catch {
      // partial/keep-alive line; ignore
    }
  }

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        // Flush any final line left without a trailing newline.
        if (buffer.length > 0) emitLine(buffer, controller);
        clearTimeout(timeout);
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) emitLine(line, controller);
    },
    cancel() {
      clearTimeout(timeout);
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
