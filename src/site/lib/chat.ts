/** Browser chat client for the companion site. Talks to the serverless proxy
 *  at /api/chat (which holds the key) and reads its plain-text token stream.
 *  Never throws: resolves { ok: false } on any failure so the UI can show the
 *  canned fallback. */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const FALLBACK_ANSWER = `Se protéger des IST, c'est avant tout utiliser un préservatif à chaque rapport, se faire dépister régulièrement (beaucoup d'IST ne donnent aucun signe), et oser en parler sans honte. Pour un conseil adapté à ta situation, rapproche-toi d'un professionnel de santé ou du centre de santé le plus proche.`;

export async function streamChat(
  messages: ChatMessage[],
  onToken: (chunk: string) => void,
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok || !res.body) return { ok: false };

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let received = false;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk.length > 0) {
        received = true;
        onToken(chunk);
      }
    }
    return { ok: received };
  } catch {
    return { ok: false };
  }
}
