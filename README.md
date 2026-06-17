# ist-thesis-deck

Thesis presentation deck (Vite + React + TypeScript).

## Setup

```bash
git clone https://github.com/ranicharradi/Anas.git
cd Anas
pnpm install
```

## Develop

```bash
pnpm dev      # start the dev server (http://localhost:5173)
pnpm build    # type-check and build to dist/
pnpm preview  # preview the production build
```

## Companion site

A public, adolescent-facing companion site lives at `site.html` (deck stays at `/`).
Its AI assistant calls the Vercel edge function `api/chat.ts`, which holds
`OPENROUTER_API_KEY` server-side. Set that env var in the Vercel project (no
`VITE_` prefix). Local function dev: `vercel dev`.
