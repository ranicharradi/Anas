# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, keyboard-driven **slide deck for a nursing thesis defense** (Projet de fin d'études): *"Les pratiques éducatives des infirmiers pour la prévention des IST chez les adolescents."* All UI copy is **French** — keep it that way. The deck is presented live ("defense day"), so offline reliability matters: fonts are bundled (`@fontsource-variable/*`), never linked from a CDN.

It currently ships as a **scaffold**: three pattern slides (title, bar-chart stat, ring stat) meant to be copied to rebuild the remaining ~27 slides from the original Canva deck.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b (typecheck, project refs) then vite build
npm run preview  # serve the production build locally
```

No test runner or linter is configured. `npm run build` is the only correctness gate — its `tsc -b` step enforces strict TS (`noUnusedLocals`, `noUnusedParameters`, `strict`). Run it before claiming a change compiles.

## Architecture

The deck is a **discrete-slide controller**, not a scroller:

- `src/deck/Deck.tsx` — owns the current `index`, handles keyboard/clicker paging (arrows, space, PageUp/Down, Home/End), and renders the progress bar + act/title/counter chrome. **All slides stay mounted at once** (only ~27 lightweight text+SVG slides); the inactive ones are `opacity:0` + `pointer-events:none`. Crossfade is a CSS opacity transition; the *content* motion is GSAP.
- `src/deck/slides.tsx` — the ordered slide **registry**. Adding/reordering a slide is a single entry here (`{ id, title, act, Component }`). This is the main file you touch to grow the deck.
- `src/deck/types.ts` — `SlideDef`, the five-value `Act` union (Introduction / Méthodologie / Résultats / Recommandations / Conclusion), and `SlideProps`.
- `src/slides/*` — one component per slide. Each receives `active: boolean`.
- `src/components/*` — reusable, GSAP-animated SVG primitives: `BarChart`, `StatRing`, `VitalLine` (ECG motif), `FigureLabel` (figure-caption chrome).

### The `active` flag is the animation contract

Because every slide is always mounted, slides must **not** run their enter animation on mount. The pattern (used in every slide and animated component):

```tsx
useGSAP(() => {
  if (!active) return;          // gate: only animate when current
  /* ...gsap timeline... */
  return () => split.revert();  // cleanup for SplitText
}, { scope: root, dependencies: [active] });
```

`useGSAP` (from `@gsap/react`) scopes selectors to `root` and auto-cleans via `gsap.context`, so React StrictMode's double-invoke doesn't stack timelines. Always pass `{ scope, dependencies: [active] }`.

### GSAP setup

`src/deck/gsap.ts` registers plugins **once, app-wide** and re-exports them — always import gsap/plugins from `@/deck/gsap`, never from `gsap` directly. Registered: `ScrollTrigger`, `SplitText` (word/char heading reveals), `DrawSVGPlugin` (stroke-draw for the ECG line + stat-ring arcs), `useGSAP`.

### Styling & design tokens

Tailwind v4, configured entirely in CSS (`@tailwindcss/vite`, no `tailwind.config`). All color/font tokens live in the `@theme` block of `src/index.css` and surface as utilities (`text-clinic`, `bg-paper`, `font-display`, etc.). **The current palette is an explicit placeholder skin** — reskin the whole deck by editing that one block. Shared chrome classes: `.mono-label` (small-caps figure labels), `.split-line` (clips SplitText line reveals).

`@/` is aliased to `src/` (in both `vite.config.ts` and `tsconfig`).

## Data caveat

Most numbers in the slides are **placeholders to demonstrate the chart patterns** — see the `NOTE:` comments (e.g. only the 86% / 94% headline figures are from the study). Replace placeholder data with real study values before the deck is final; don't treat existing values as authoritative.
