# Companion website — design spec

**Date:** 2026-06-17
**Status:** Approved (design); pending implementation plan

## Summary

A public, adolescent-facing companion website for the nursing thesis project on
IST prevention. It shares the deck's visual identity but reframes it for teens:
warmer, *tutoiement*, mobile-first, with a **live AI assistant as the
centerpiece**. It lives in the same repo as the deck, built as a second Vite
entry so the offline-first defense deck stays completely untouched.

## Audience & voice

- **Who:** adolescents / general public (not the jury, not clinicians).
- **Voice:** warm, non-judgmental, confidential, *tutoiement* ("Pose ta
  question, c'est anonyme"). Plain French.
- **Skin:** same identity as the deck (Fraunces display, Inter body, the
  `@theme` tokens in `src/index.css`, faint medical-cross motif) but
  **coral-forward** rather than clinical-green-forward, so it reads approachable
  rather than institutional.
- **Layout:** mobile-first responsive (this audience is on phones); the deck is
  16:9 landscape, so the site is a genuine responsive build, not a reflow.

## Architecture

The deck is frozen. It remains the `index.html` entry, offline-first, with its
client-side `VITE_OPENROUTER_API_KEY` fallback behavior unchanged.

### Multi-entry Vite build
- New `site.html` at repo root → `src/site/main.tsx`.
- `vite.config.ts` gains `build.rollupOptions.input` listing both `index.html`
  (deck) and `site.html` (site). Dev server serves both; deck at `/`, site at
  `/site.html`.
- The `@` → `src` alias and the Tailwind/React plugins are already configured
  and shared.

### Serverless proxy (the key never ships to the browser)
- New `api/chat.ts` — a Vercel serverless function.
- Holds `OPENROUTER_API_KEY` from **server** env (no `VITE_` prefix, so it is
  never bundled) and the hardened system prompt (below).
- Receives `{ messages }`, calls OpenRouter (same model as the deck:
  `nvidia/nemotron-3-super-120b-a12b:free`, `reasoning.enabled = false`),
  parses the OpenRouter SSE **server-side**, and re-emits a **plain text token
  stream** to the client.
- Decouples the browser from OpenRouter's wire format and from the key.
- `api/` is excluded from the app `tsc -b` (the `npm run build` gate); Vercel
  compiles the function with its own pipeline.

### Site chat client
- `src/site/lib/chat.ts` — POSTs `{ messages }` to `/api/chat`, reads the
  response body as a text stream, calls `onToken(chunk)` per chunk. No key, no
  OpenRouter URL in the bundle. Mirrors the deck's `streamChat` ergonomics
  (never throws; resolves `{ ok }`) so a dead function shows a graceful fallback.

### Shared components
- Extract the inline nurse SVG currently in `src/slides/ChatbotSlide.tsx` into
  `src/components/NurseLogo.tsx`. Both the site and the deck's ChatbotSlide
  import it. This is the **only** edit to deck code; it is a pure refactor
  (inline function → import) verified by the build.

## Page sections

Composed in `src/site/SiteApp.tsx`; one component per section under
`src/site/sections/*`. GSAP is already set up app-wide (`src/deck/gsap.ts`,
ScrollTrigger registered); sections reveal on scroll, respecting
`prefers-reduced-motion`.

1. **Hero** (`Hero.tsx`) — headline ("Tes questions sur les IST, sans tabou"),
   a one-line promise (anonyme · confidentiel · sans jugement), and the
   assistant invitation. Load/scroll reveal.
2. **Assistant** (`AssistantSection.tsx`) — the chat box (adapted from
   `ChatbotSlide`, teen tone) plus tappable **suggested-question chips** that
   seed the conversation: "C'est quoi une IST ?", "Où me faire dépister ?",
   "Le préservatif, ça suffit ?". The chat UI itself lives in
   `src/site/components/ChatBox.tsx`.
3. **L'essentiel** (`Essentiel.tsx`) — three calm cards: *Se protéger*,
   *Se faire dépister*, *En parler*.
4. **Le dépistage** (`Depistage.tsx`) — reassuring and demystified: pourquoi,
   quand, et le fait que c'est confidentiel.
5. **Footer** (`SiteFooter.tsx`) — discreet thesis credit + the generic safety
   line.

## Safety

- **Server-side system prompt** (in `api/chat.ts`), hardened beyond the deck's:
  stays on IST prevention / dépistage / soignant-adolescent communication; gives
  **no diagnosis**; bienveillant and concise (2–4 sentences); for anything
  urgent, distressing, or out-of-scope, advises consulting a **health
  professional or the nearest health center** — generic guidance, **no
  fabricated phone number**.
- The same generic safety line appears in the footer.

## Quality floor

- Responsive down to mobile.
- Visible keyboard focus on the input, send button, and suggestion chips.
- `prefers-reduced-motion` respected (reveals degrade to no-motion).

## Verification

- No test runner exists in the repo; the correctness gate is `npm run build`
  (`tsc -b` strict + vite build). Must pass with both entries.
- Dev server renders `site.html` correctly.
- Chat path verified locally against the function (`vercel dev` or the function
  running with `OPENROUTER_API_KEY` set); confirm tokens stream and that a
  missing/failing function shows the graceful fallback.

## Deployment

- **Vercel.** `OPENROUTER_API_KEY` set as a server env var in the Vercel project
  (not `VITE_`-prefixed). The function lives in `api/`. The deck remains a
  static build and does not depend on the function.

## Explicitly out of scope (YAGNI)

- No auth, no accounts, no chat persistence across reloads.
- No CMS / no editable content; copy is hardcoded.
- No analytics.
- No specific helpline directory (generic guidance only, per decision).
- No moving the deck off `/` (site stays at `/site.html` for now).

## Decisions log

- Assistant mode: **serverless proxy** (key server-side). Not client-side, not
  canned answers.
- v1 scope: **full page** (all 5 sections).
- Safety resource: **generic guidance only** (no fabricated number).
- Skin: **coral-forward**; deck stays at `/`, site at `/site.html`.
