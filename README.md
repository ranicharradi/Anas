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
Its AI assistant behaves exactly like the deck's demo slide: it reuses
`src/lib/openrouter.ts`, calling OpenRouter directly from the browser with the
same `VITE_OPENROUTER_API_KEY`. Note that key is bundled into the client, so use
a capped, disposable key (see `.env.example`).
