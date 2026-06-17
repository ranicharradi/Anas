# Companion Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public, adolescent-facing companion website for the IST-prevention thesis, with a live AI assistant as the centerpiece, in the same repo as the deck without touching the deck's offline-first behavior.

**Architecture:** A second Vite HTML entry (`site.html` → `src/site/*`) reusing the deck's design tokens, fonts, and GSAP setup. The assistant talks to a Vercel serverless **edge** function (`api/chat.ts`) that holds the OpenRouter key server-side and re-emits a plain text token stream, so no key or vendor wire-format reaches the browser.

**Tech Stack:** Vite 8 (multi-entry), React 19, Tailwind v4 (CSS `@theme`), GSAP (ScrollTrigger, already registered), Vercel edge function, OpenRouter.

## Global Constraints

- **Package manager: pnpm.** Never npm/npx. Build: `pnpm build`. Dev: `pnpm dev`.
- **All user-facing copy is French.** Keep it French.
- **No em dashes** in any output (prose, comments, copy). Use commas, colons, parentheses, or two sentences.
- **No test runner exists.** The correctness gate is `pnpm build` (`tsc -b` strict: `noUnusedLocals`, `noUnusedParameters`, `strict`, `verbatimModuleSyntax`). Type-only imports MUST use `import type`.
- **`@` is aliased to `src/`** in both `vite.config.ts` and tsconfig.
- **GSAP is imported from `@/deck/gsap`**, never from `gsap` directly (plugins are registered there once).
- **Deck is frozen.** Only one deck file may change: `src/slides/ChatbotSlide.tsx`, and only to swap an inline SVG for a shared import (pure refactor).
- **The OpenRouter key is server-only:** env var `OPENROUTER_API_KEY` (no `VITE_` prefix; a `VITE_` prefix would bundle it into the browser).
- **Model:** `nvidia/nemotron-3-super-120b-a12b:free` with `reasoning.enabled = false` (matches the deck; keeps replies fast).
- **Deck stays at `/`; site at `/site.html`.**

---

### Task 1: Multi-entry scaffold

Adds the second Vite entry and a placeholder page that builds and renders, proving the deck and site coexist.

**Files:**
- Create: `site.html` (repo root)
- Modify: `vite.config.ts`
- Create: `src/site/main.tsx`
- Create: `src/site/SiteApp.tsx`

**Interfaces:**
- Produces: `SiteApp` (default export, no props) rendered into `#root` of `site.html`.

- [ ] **Step 1: Create `site.html`** (mirrors `index.html`, points at the site entry)

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230d6e85'/%3E%3Cpath d='M30 14h4v16h16v4H34v16h-4V34H14v-4h16z' fill='%23f5f2ea'/%3E%3C/svg%3E" />
    <title>IST : tes questions, sans tabou</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/site/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Add both entries to `vite.config.ts`**

Replace the file with:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        deck: fileURLToPath(new URL("./index.html", import.meta.url)),
        site: fileURLToPath(new URL("./site.html", import.meta.url)),
      },
    },
  },
});
```

- [ ] **Step 3: Create `src/site/main.tsx`** (mirrors `src/main.tsx`: bundled fonts + shared CSS)

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fonts bundled for reliability, same as the deck. Never link Google Fonts.
import "@fontsource-variable/fraunces/index.css";
import "@fontsource-variable/inter/index.css";

import "@/index.css";
import SiteApp from "./SiteApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SiteApp />
  </StrictMode>,
);
```

- [ ] **Step 4: Create placeholder `src/site/SiteApp.tsx`**

```tsx
export default function SiteApp() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper text-ink">
      <h1 className="font-display text-5xl font-light">Site en construction</h1>
    </main>
  );
}
```

- [ ] **Step 5: Verify build passes**

Run: `pnpm build`
Expected: `tsc -b` clean, vite emits `dist/index.html` AND `dist/site.html`. No errors.

- [ ] **Step 6: Verify dev render**

Run: `pnpm dev`, open `http://localhost:5173/site.html`
Expected: "Site en construction" on the paper background. Deck still works at `http://localhost:5173/`.

- [ ] **Step 7: Commit**

```bash
git add site.html vite.config.ts src/site/main.tsx src/site/SiteApp.tsx
git commit -m "Scaffold companion site as second Vite entry"
```

---

### Task 2: Shared NurseLogo component

Extracts the inline nurse SVG from `ChatbotSlide` into a reusable component so both the deck and the site use one source. Pure refactor; deck output unchanged.

**Files:**
- Create: `src/components/NurseLogo.tsx`
- Modify: `src/slides/ChatbotSlide.tsx`

**Interfaces:**
- Produces: `NurseLogo` (default export). Props: `{ className?: string; crossColor?: string }`. Renders a 24x24 `<svg>`; `currentColor` fills cap/head/shoulders, `crossColor` (default `var(--color-clinic)`) fills the cap cross.

- [ ] **Step 1: Create `src/components/NurseLogo.tsx`**

```tsx
/** Nurse logo: white cap (with a clinical cross), head, and shoulders. The
 *  cap/head/shoulders use `currentColor`; the cross uses `crossColor`. */
export default function NurseLogo({
  className,
  crossColor = "var(--color-clinic)",
}: {
  className?: string;
  crossColor?: string;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M5.3 20.8C5.3 17.2 8.3 15 12 15s6.7 2.2 6.7 5.8a.7.7 0 0 1-.7.7H6a.7.7 0 0 1-.7-.7Z"
        fill="currentColor"
      />
      <circle cx="12" cy="11.6" r="3.1" fill="currentColor" />
      <path
        d="M6.4 9.1C8 6 9.8 4.5 12 4.5s4 1.5 5.6 4.6c.2.4-.1.9-.6.9H7c-.5 0-.8-.5-.6-.9Z"
        fill="currentColor"
      />
      <path
        d="M11.3 5.5h1.4v1h1v1.4h-1v1h-1.4v-1h-1V6.5h1z"
        fill={crossColor}
      />
    </svg>
  );
}
```

- [ ] **Step 2: Rewire `ChatbotSlide.tsx` to import it**

In `src/slides/ChatbotSlide.tsx`, add near the top imports:

```tsx
import NurseLogo from "@/components/NurseLogo";
```

Replace the inline avatar usage:

```tsx
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clinic text-paper">
              <NurseLogo />
            </span>
```

Then delete the local `function NurseAvatar() { ... }` definition entirely (the whole function block at the bottom of the file).

- [ ] **Step 3: Verify build passes (deck must still compile)**

Run: `pnpm build`
Expected: clean. `noUnusedLocals` would flag a leftover `NurseAvatar`; confirm it is gone.

- [ ] **Step 4: Verify deck render unchanged**

Run: `pnpm dev`, open the deck, navigate to the assistant slide.
Expected: the chat-header nurse badge looks identical to before.

- [ ] **Step 5: Commit**

```bash
git add src/components/NurseLogo.tsx src/slides/ChatbotSlide.tsx
git commit -m "Extract NurseLogo into shared component"
```

---

### Task 3: Serverless chat function

A Vercel edge function that holds the key + hardened system prompt and streams plain text to the client. Outside the `tsc -b` gate (Vercel builds `api/`).

**Files:**
- Create: `api/chat.ts`
- Create: `.env.example`
- Modify: `README.md` (append a "Companion site" section) — create it if absent.

**Interfaces:**
- Produces: `POST /api/chat` accepting JSON `{ messages: { role: "user" | "assistant"; content: string }[] }`, responding `200` with `Content-Type: text/plain; charset=utf-8` streaming reply text, or `4xx/5xx` with a plain message on bad input / missing key / upstream failure.

- [ ] **Step 1: Create `api/chat.ts`**

```ts
// Vercel edge function. Holds OPENROUTER_API_KEY server-side and re-emits a
// plain text token stream so the browser never sees the key or OpenRouter's
// SSE format. Not part of the app `tsc -b` build; Vercel builds api/.
export const config = { runtime: "edge" };

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

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
    });
  } catch {
    return new Response("Upstream error", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: 502 });
  }

  // Transform OpenRouter SSE into a plain-text token stream.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
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
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

- [ ] **Step 2: Create `.env.example`**

```
# Server-side only. Set in Vercel project env (NOT prefixed with VITE_).
OPENROUTER_API_KEY=
```

- [ ] **Step 3: Document in `README.md`** (append; create the file if missing)

```markdown
## Companion site

A public, adolescent-facing companion site lives at `site.html` (deck stays at `/`).
Its AI assistant calls the Vercel edge function `api/chat.ts`, which holds
`OPENROUTER_API_KEY` server-side. Set that env var in the Vercel project (no
`VITE_` prefix). Local function dev: `vercel dev`.
```

- [ ] **Step 4: Verify build still passes (function is excluded from `tsc -b`)**

Run: `pnpm build`
Expected: clean; `api/chat.ts` is not typechecked by the app build (only `src` is included), and vite ignores `api/`.

- [ ] **Step 5: (Optional) Verify the function locally**

If `vercel` CLI is available: `vercel dev`, then
`curl -N -X POST localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"C est quoi une IST ?"}]}'`
Expected (with a valid key): streamed French text. Without a key: `Server not configured`.

- [ ] **Step 6: Commit**

```bash
git add api/chat.ts .env.example README.md
git commit -m "Add serverless chat proxy for the companion site"
```

---

### Task 4: Site chat client

Browser-side client that POSTs to `/api/chat` and reads the plain-text stream. Never throws; mirrors the deck's `streamChat` ergonomics.

**Files:**
- Create: `src/site/lib/chat.ts`

**Interfaces:**
- Produces: `ChatMessage` (`{ role: "user" | "assistant"; content: string }`), `FALLBACK_ANSWER` (string), and `streamChat(messages: ChatMessage[], onToken: (chunk: string) => void): Promise<{ ok: boolean }>`.

- [ ] **Step 1: Create `src/site/lib/chat.ts`**

```ts
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
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build`
Expected: clean (the module is unused so far; importing it in Task 5 will exercise it. `noUnusedLocals` applies to locals, not exports, so an unimported module is fine).

- [ ] **Step 3: Commit**

```bash
git add src/site/lib/chat.ts
git commit -m "Add site chat client for the serverless proxy"
```

---

### Task 5: ChatBox component

The interactive chat UI for the site: transcript, streaming, input, reset, and seedable suggestion chips. Teen tone. Uses `NurseLogo` and the site chat client.

**Files:**
- Create: `src/site/components/ChatBox.tsx`

**Interfaces:**
- Consumes: `streamChat`, `FALLBACK_ANSWER`, `ChatMessage` from `@/site/lib/chat`; `NurseLogo` from `@/components/NurseLogo`.
- Produces: `ChatBox` (default export). Props: `{ suggestions?: string[] }`. Self-contained; manages its own message state.

- [ ] **Step 1: Create `src/site/components/ChatBox.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import NurseLogo from "@/components/NurseLogo";
import { streamChat, FALLBACK_ANSWER, type ChatMessage } from "@/site/lib/chat";

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
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/site/components/ChatBox.tsx
git commit -m "Add site ChatBox component"
```

---

### Task 6: Static sections

The four non-interactive sections: Hero, L'essentiel, Le dépistage, Footer. Each is a focused presentational component with `.reveal` hooks for Task 7's scroll animation.

**Files:**
- Create: `src/site/sections/Hero.tsx`
- Create: `src/site/sections/Essentiel.tsx`
- Create: `src/site/sections/Depistage.tsx`
- Create: `src/site/sections/SiteFooter.tsx`

**Interfaces:**
- Produces: `Hero`, `Essentiel`, `Depistage`, `SiteFooter` (default exports, no props). `Hero` includes an anchor link to `#assistant`.

- [ ] **Step 1: Create `src/site/sections/Hero.tsx`**

```tsx
export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[88vh] max-w-3xl flex-col justify-center px-6 py-20 text-center">
      <p className="reveal mono-label text-coral">Prévention des IST · pour les ados</p>
      <h1 className="reveal mt-5 font-display text-5xl font-light leading-[1.05] text-ink sm:text-6xl">
        Tes questions sur les IST, sans tabou.
      </h1>
      <p className="reveal mx-auto mt-6 max-w-xl text-xl leading-relaxed text-muted">
        Pose ta question à un assistant pensé pour toi. C'est anonyme,
        confidentiel, et sans jugement.
      </p>
      <div className="reveal mt-9 flex flex-col items-center gap-5">
        <a
          href="#assistant"
          className="rounded-full bg-coral px-8 py-4 text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          Poser une question
        </a>
        <div className="flex flex-wrap justify-center gap-2">
          {["Anonyme", "Confidentiel", "Sans jugement"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-hair/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-ink/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/site/sections/Essentiel.tsx`**

```tsx
const CARDS = [
  {
    title: "Se protéger",
    body: "Le préservatif reste le moyen le plus simple et efficace de se protéger des IST, à chaque rapport.",
  },
  {
    title: "Se faire dépister",
    body: "Beaucoup d'IST ne donnent aucun signe. Le dépistage est le seul moyen d'être sûr·e, et il est confidentiel.",
  },
  {
    title: "En parler",
    body: "Poser ses questions, en parler à un·e soignant·e ou à son ou sa partenaire, c'est déjà se protéger.",
  },
];

export default function Essentiel() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="reveal text-center font-display text-4xl font-light text-ink">
        L'essentiel
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="reveal rounded-3xl border border-hair/60 bg-white/70 p-7 shadow-[0_20px_60px_rgba(27,29,36,0.08)]"
          >
            <span className="block h-1 w-12 rounded-full bg-coral" aria-hidden />
            <h3 className="mt-5 font-display text-2xl font-light text-ink">{c.title}</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-muted">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/site/sections/Depistage.tsx`**

```tsx
const POINTS = [
  {
    q: "Pourquoi ?",
    a: "Beaucoup d'IST sont silencieuses : on peut en avoir une sans aucun symptôme. Le dépistage est le seul moyen de savoir.",
  },
  {
    q: "Quand ?",
    a: "Après un rapport non protégé, un changement de partenaire, ou simplement par précaution. Il n'est jamais trop tôt pour demander.",
  },
  {
    q: "C'est confidentiel ?",
    a: "Oui. Le dépistage se fait auprès d'un professionnel de santé, en toute confidentialité.",
  },
];

export default function Depistage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="reveal text-center font-display text-4xl font-light text-ink">
        Le dépistage, simplement
      </h2>
      <dl className="mt-12 space-y-8">
        {POINTS.map((p) => (
          <div key={p.q} className="reveal border-l-[3px] border-coral pl-6">
            <dt className="font-display text-2xl font-light text-coral">{p.q}</dt>
            <dd className="mt-2 text-[18px] leading-relaxed text-ink/85">{p.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/site/sections/SiteFooter.tsx`**

```tsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-hair/60 bg-white/50">
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-12 text-center">
        <p className="text-sm leading-relaxed text-muted">
          Cet assistant ne remplace pas un avis médical. Pour toute situation
          urgente ou inquiétante, consulte un professionnel de santé ou le centre
          de santé le plus proche.
        </p>
        <p className="text-xs leading-relaxed text-muted/80">
          Ce projet accompagne un mémoire de fin d'études en soins infirmiers :
          « Les pratiques éducatives des infirmiers pour la prévention des IST
          chez les adolescents ».
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Verify build passes**

Run: `pnpm build`
Expected: clean (sections unused until Task 7; exported modules are fine).

- [ ] **Step 6: Commit**

```bash
git add src/site/sections/Hero.tsx src/site/sections/Essentiel.tsx src/site/sections/Depistage.tsx src/site/sections/SiteFooter.tsx
git commit -m "Add static site sections"
```

---

### Task 7: Compose the page with scroll reveals

Replaces the placeholder `SiteApp` with the full composition, wires the assistant section (ChatBox + suggestion chips), and adds GSAP scroll reveals that respect reduced motion. Final integration + verification.

**Files:**
- Create: `src/site/sections/AssistantSection.tsx`
- Modify: `src/site/SiteApp.tsx`

**Interfaces:**
- Consumes: `ChatBox` from `@/site/components/ChatBox`; `Hero`, `Essentiel`, `Depistage`, `SiteFooter` from `@/site/sections/*`; `gsap`, `ScrollTrigger`, `useGSAP` from `@/deck/gsap`.
- Produces: `AssistantSection` (default export, no props; renders `#assistant` anchor). Final `SiteApp`.

- [ ] **Step 1: Create `src/site/sections/AssistantSection.tsx`**

```tsx
import ChatBox from "@/site/components/ChatBox";

const SUGGESTIONS = [
  "C'est quoi une IST ?",
  "Où me faire dépister ?",
  "Le préservatif, ça suffit ?",
  "Comment en parler à mon ou ma partenaire ?",
];

export default function AssistantSection() {
  return (
    <section id="assistant" className="mx-auto max-w-2xl px-6 py-20">
      <p className="reveal mono-label text-center text-coral">L'assistant</p>
      <h2 className="reveal mt-4 text-center font-display text-4xl font-light text-ink">
        Demande, on te répond simplement.
      </h2>
      <div className="reveal mt-10">
        <ChatBox suggestions={SUGGESTIONS} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace `src/site/SiteApp.tsx`**

```tsx
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/deck/gsap";
import Hero from "@/site/sections/Hero";
import AssistantSection from "@/site/sections/AssistantSection";
import Essentiel from "@/site/sections/Essentiel";
import Depistage from "@/site/sections/Depistage";
import SiteFooter from "@/site/sections/SiteFooter";

export default function SiteApp() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect reduced-motion: leave content in its final state, no reveal.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root },
  );

  return (
    <div ref={root} className="min-h-screen bg-paper text-ink">
      <Hero />
      <AssistantSection />
      <Essentiel />
      <Depistage />
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 3: Verify build passes**

Run: `pnpm build`
Expected: clean. Both `dist/index.html` and `dist/site.html` emitted.

- [ ] **Step 4: Verify dev render + behavior**

Run: `pnpm dev`, open `http://localhost:5173/site.html`.
Expected: hero with the coral CTA; "Poser une question" scrolls to the assistant; suggestion chips visible in the empty chat; sections fade up on scroll. Narrow the window to a phone width and confirm the single-column layout and that the chat is usable. Toggle OS reduced-motion and confirm content is fully visible without reveal animation. (Live replies require the function running with a key; otherwise the fallback message appears, which is expected.)

- [ ] **Step 5: Commit**

```bash
git add src/site/sections/AssistantSection.tsx src/site/SiteApp.tsx
git commit -m "Compose companion site page with scroll reveals"
```

---

## Self-Review

**Spec coverage:**
- Audience & coral-forward voice → Tasks 6/7 (copy, coral accents). ✓
- Multi-entry Vite build, deck frozen → Task 1. ✓
- Serverless proxy, key server-side, plain text stream, model + reasoning off → Task 3. ✓
- Site chat client, never throws → Task 4. ✓
- Shared NurseLogo (only deck edit) → Task 2. ✓
- Five sections (Hero, Assistant + chips, L'essentiel, Le dépistage, Footer) → Tasks 6/7. ✓
- Safety (server prompt: no diagnosis, generic guidance, no number; footer echo) → Tasks 3/6. ✓
- Quality floor (responsive, focus-visible, reduced-motion) → Tasks 5/6/7. ✓
- Verification = `pnpm build` + render → every task. ✓
- Deploy (Vercel, `OPENROUTER_API_KEY`) → Task 3 (README, .env.example). ✓
- Out of scope items honored (no auth/persistence/CMS/analytics/helpline directory). ✓

**Placeholder scan:** No TBD/TODO; all code blocks are complete; no "handle errors" hand-waving. ✓

**Type consistency:** `streamChat(messages, onToken) => Promise<{ ok: boolean }>` and `ChatMessage` are defined in Task 4 and consumed identically in Task 5. `NurseLogo` props (`className?`, `crossColor?`) defined in Task 2, used in Task 5. `ChatBox` prop `suggestions?: string[]` defined in Task 5, passed in Task 7. ✓
