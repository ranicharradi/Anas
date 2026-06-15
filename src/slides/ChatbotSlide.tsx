import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import type { SlideProps } from "@/deck/types";
import NurseBot3D from "@/components/NurseBot3D";
import {
  streamChat,
  FALLBACK_ANSWER,
  type ChatMessage,
} from "@/lib/openrouter";

interface DisplayMessage extends ChatMessage {
  /** True when this assistant bubble is the canned offline fallback. */
  fallback?: boolean;
}

export default function ChatbotSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useGSAP(
    () => {
      if (!active) return;

      const split = new SplitText(".cb-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cb-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.72, stagger: 0.05 }, 0)
        .from(".cb-bot", { opacity: 0, scale: 0.92, duration: 0.7 }, 0.2)
        .from(".cb-panel", { opacity: 0, y: 30, duration: 0.65 }, 0.28);

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const history: ChatMessage[] = [
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: "user", content: text },
    ];

    // Append the user message and an empty assistant bubble to stream into.
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
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

  function handleReset() {
    setMessages([]);
    setInput("");
  }

  return (
    <div
      ref={root}
      className="grid h-full grid-cols-[0.85fr_1.15fr] items-center gap-14 px-20 py-12"
    >
      <section className="flex h-[610px] flex-col">
        <p className="cb-kicker mono-label text-clinic">Recommandations · Outil</p>
        <h2 className="cb-title mt-4 max-w-xl font-display text-6xl font-light leading-[1.03] text-ink">
          Un assistant pour l'éducation à la prévention
        </h2>
        <div className="cb-bot relative mt-4 min-h-0 flex-1">
          <NurseBot3D active={active} />
        </div>
      </section>

      <section className="cb-panel flex h-[610px] flex-col overflow-hidden rounded-lg border border-hair/60 bg-white/55 shadow-[0_28px_90px_rgba(27,29,36,0.12)] backdrop-blur-sm">
        <header className="flex items-center justify-between border-b border-hair/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clinic font-display text-lg text-paper">
              I
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Infirmier·ère éducateur·rice
              </p>
              <p className="text-xs text-muted">Prévention des IST · adolescents</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mono-label text-muted transition hover:text-clinic"
          >
            Réinitialiser
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.length === 0 && (
            <p className="mt-8 text-center text-sm text-muted">
              Posez une question sur la prévention des IST…
            </p>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-clinic px-4 py-3 text-[19px] leading-relaxed text-paper"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm border border-hair/50 bg-white/80 px-4 py-3 text-[19px] leading-relaxed text-ink"
                }
              >
                {message.content ||
                  (loading && index === messages.length - 1 ? "…" : "")}
                {message.fallback && (
                  <span className="mt-2 block text-[11px] uppercase tracking-wider text-muted">
                    hors-ligne
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-hair/50 px-6 py-4"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Écrivez votre question…"
            className="flex-1 rounded-full border border-hair/60 bg-white/80 px-5 py-3 text-[19px] text-ink outline-none placeholder:text-muted focus:border-clinic"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-clinic px-6 py-3 text-sm font-semibold text-paper transition hover:bg-clinic-deep disabled:opacity-40"
          >
            Envoyer
          </button>
        </form>
      </section>
    </div>
  );
}
