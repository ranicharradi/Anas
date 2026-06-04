# Flat two-tone slide illustrations

## Problem

The deck's slides currently lean on abstract decorative SVG motifs (dashed
"route" paths, concentric pulse rings, tiled medical crosses, a moving cursor).
These read as generic clinical decoration and do not depict the actual subject of
each slide. We want concrete, topic-matching illustrations instead, in a single
cohesive style, so each visual reinforces what the slide is about.

## Style

Flat two-tone fills:

- Primary fills in **clinic teal** (`--color-clinic` / `--color-clinic-deep`) and
  **coral** (`--color-coral`), with **paper** (`--color-paper`) as negative space.
- **clinic-soft** (`--color-clinic-soft`) for soft fills / secondary planes.
- **ink** (`--color-ink`) reserved for fine details and thin outline accents.
- Poster-like, bold, reads from the back of the room. Minimal reliance on
  stroke-draw animation (that motif belongs to the line-art primitives like
  `VitalLine`); these are filled shapes.
- All colors via CSS custom properties so the deck reskins from the `@theme`
  block in `src/index.css`, never hard-coded hex.

## Architecture (Approach A)

One flat-SVG React component per topic, living in a new directory:

```
src/components/illustrations/
  RoleInfirmier.tsx        # Introduction
  TransmissionIST.tsx      # Conséquences des IST non traitées
  EducationGroupe.tsx      # Pratiques éducatives
```

This mirrors the existing reusable-SVG convention (`BarChart`, `StatRing`,
`VitalLine`) — it is the codebase's established pattern, not a new abstraction.

### Component contract

Each illustration component:

- Accepts a single prop: `{ className?: string }`, applied to its root `<svg>`,
  so the host slide controls size/position (e.g. `h-full w-full`, absolute
  positioning). Defaults to `""`.
- Renders a self-contained `<svg viewBox="0 0 W H" aria-hidden>` of flat
  two-tone shapes using palette CSS vars for every fill/stroke.
- Groups each independently-revealable element under a `<g>` (or shape) carrying
  the class **`ill-piece`**. This is the only animation hook the component
  exposes. No `id`s that could collide across slides; if internal `defs`
  (gradients/patterns) are needed, prefix ids with the component slug
  (e.g. `role-grad`) to stay unique across the always-mounted deck.
- Contains **no GSAP and no `active` logic**. Animation is owned entirely by the
  host slide. This preserves the deck's core contract: "the `active` flag is the
  animation contract" and "all slides stay mounted; never animate on mount."

### Host-slide integration

For each pilot slide, the change is narrow and logic-preserving:

1. Import the illustration component.
2. Replace the decorative `<svg>...</svg>` block (the abstract motif) with
   `<TopicIllustration className="..." />`, keeping the same wrapper positioning
   (absolute inset / the existing top-right photo slot).
3. Re-point the slide's existing decorative tween to the new hook. The slides
   already tween decorative elements (e.g. `.cs-route`/`.cs-node` in Conséquences,
   `.pe-route`/`.pe-step` in Pratiques, `.decor-ring` in Introduction). Those
   selectors are replaced by a single staggered reveal of `.ill-piece`, e.g.:

   ```ts
   .from(".ill-piece", {
     scale: 0, opacity: 0, transformOrigin: "center",
     duration: 0.5, stagger: 0.07, ease: "back.out(1.7)",
   }, <existing decorative offset>)
   ```

   The exact offset/ease is tuned to sit where the old decorative tween sat in
   each timeline so overall slide choreography is unchanged.

### Frozen interface (visual-refresh discipline)

Everything except the decorative SVG block and its one tween stays untouched:
data arrays, count-up loops, `.pe-bar`/`.cs-meter` width logic, SplitText title
reveals, the `useGSAP` `active` gate + `dependencies: [active]`, Introduction's
inner question-carousel state and `onSlideInnerNavigation`. No data values change
(placeholder numbers stay placeholder per the project data caveat).

## Pilot slides

1. **Introduction (`IntroSlide.tsx`) — `RoleInfirmier`.**
   A nurse presenting/handing an education leaflet to an adolescent: the nursing
   educational role. Occupies the existing top-right slot, replacing the
   `DuotonePhoto` of `nurse-education.jpg` (a stand-in for the same idea). The
   `nurse-education.jpg` import and that `<DuotonePhoto>` usage are removed. The
   faint `Decor` background (crosses + pulse rings) stays as-is — it is a quiet
   full-slide backdrop, not the off-topic motif being replaced.
   Reinforces the four pillars chips: Sensibilisation · Éducation · Dépistage ·
   Accompagnement.

2. **Conséquences des IST non traitées (`ConsequencesSlide.tsx`) — `TransmissionIST`.**
   Two transmission scenes matching the two stat cards: a partner→partner pair
   (*Transmission au partenaire*) and a parent→infant pair (*Transmission
   mère-enfant*). Sits as the board background behind the two existing stat cards
   (replaces the `cs-cross` pattern rect, `cs-pulse` rings, `cs-route` dashed
   paths, and `cs-node` cross/dots). The right-aligned card column and its
   count-up/meter logic are unchanged.

3. **Pratiques éducatives (`PratiquesEducativesSlide.tsx`) — `EducationGroupe`.**
   A group-education scene: a nurse with adolescents around a board/flip-chart,
   depicting "approche traditionnelle" and "éducation par les pairs." Sits behind
   the methods/freins card grid (replaces the `pe-grad` route, `pe-cursor`, and
   `pe-step` dots; the `motionPath` cursor tween is removed). The two card columns
   and their counters/meters are unchanged.

## Build sequence

1. `RoleInfirmier` component → wire into `IntroSlide`.
2. `TransmissionIST` component → wire into `ConsequencesSlide`.
3. `EducationGroupe` component → wire into `PratiquesEducativesSlide`.
4. `npm run build` (the only correctness gate; `tsc -b` strict) must pass.

## Verification

- Automated gate: `npm run build` compiles clean (strict TS, no unused
  locals/params — note removed imports like `smoothLinePath`/`DuotonePhoto` if no
  longer used).
- Visual: the **user** reviews the look in the running dev server. Per project
  convention, do not self-verify visuals via screenshots; rely on build + console
  for correctness and defer the aesthetic judgment to the user.

## Rollout (after pilot approval)

Once the trio is approved live, apply the same `illustrations/` component
convention to the remaining abstract-motif slides (Collecte, Méthodologie, Étude,
Population, Outils informatiques, Résultat & discussion, Motivation,
Communication, Recommandations, Conclusion, and any others whose primary visual is
decorative rather than a real data chart). Data-chart slides (SocioDemo,
Connaissances, HPV/Dépistage) and their charts are left as-is. Each rollout slide
is the same narrow swap: new component + re-pointed decorative tween.

## Non-goals

- No changes to slide copy, data values, slide order, or the registry.
- No reworking of real data charts (`BarChart`/`StatRing`-driven visuals).
- No new animation framework or illustration registry/config system.
- No CDN/online assets — everything stays inline SVG, offline-safe.
