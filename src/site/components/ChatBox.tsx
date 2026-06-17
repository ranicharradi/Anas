import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import NurseLogo from "@/components/NurseLogo";
// Share the deck demo's chat client exactly: same OpenRouter call, same
// VITE_OPENROUTER_API_KEY, same system prompt, model, and fallback.
import { streamChat, FALLBACK_ANSWER, type ChatMessage } from "@/lib/openrouter";

interface DisplayMessage extends ChatMessage {
  fallback?: boolean;
}

export default function ChatBox({ suggestions = [] }: { suggestions?: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const history: ChatMessage[] = [
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: "user", content: trimmed },
    ];

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setLoading(true);

    const result = await streamChat(history, (token) => {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + token };
        return next;
      });
    });

    if (!result.ok) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: FALLBACK_ANSWER,
          fallback: true,
        };
        return next;
      });
    }
    setLoading(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="flex h-[34rem] max-h-[80vh] flex-col overflow-hidden rounded-3xl border border-hair/60 bg-white/80 shadow-[0_30px_90px_rgba(27,29,36,0.15)] backdrop-blur-sm">
      <header className="flex items-center gap-3 border-b border-hair/50 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-coral text-white">
          <NurseLogo crossColor="var(--color-coral)" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Assistant prévention</p>
          <p className="text-xs text-muted">Anonyme · sans jugement</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="mono-label ml-auto text-muted transition hover:text-coral focus-visible:text-coral"
          >
            Effacer
          </button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-end gap-4">
            <p className="text-center text-[17px] leading-relaxed text-muted">
              Pose ta question, c'est anonyme. Ou choisis ci-dessous.
            </p>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-coral/40 bg-coral/10 px-4 py-2 text-sm font-medium text-coral transition hover:bg-coral/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[82%] rounded-2xl rounded-br-sm bg-coral px-4 py-3 text-[17px] leading-relaxed text-white"
                    : "max-w-[88%] rounded-2xl rounded-bl-sm border border-hair/50 bg-paper px-4 py-3 text-[17px] leading-relaxed text-ink"
                }
              >
                {message.content || (loading && index === messages.length - 1 ? "…" : "")}
                {message.fallback && (
                  <span className="mt-2 block text-[11px] uppercase tracking-wider text-muted">
                    hors-ligne
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-hair/50 px-5 py-4"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Écris ta question…"
          aria-label="Ta question"
          className="flex-1 rounded-full border border-hair/60 bg-paper px-5 py-3 text-[17px] text-ink outline-none placeholder:text-muted focus:border-coral focus-visible:border-coral"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:opacity-40"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
