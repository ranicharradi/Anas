# Flat Two-Tone Slide Illustrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the off-topic abstract SVG motifs on three pilot slides (Introduction, Conséquences, Pratiques éducatives) with concrete, topic-matching flat two-tone illustrations, as reusable components.

**Architecture:** One flat-SVG React component per topic in `src/components/illustrations/`, each `{ className? }`-only and GSAP-free. Every independently-revealable element carries the class `ill-piece`; the host slide's existing `useGSAP` timeline (gated on `active`) animates that hook, preserving the deck's "active flag owns animation, slides never animate on mount" contract. Each host slide swaps its decorative `<svg>` block for the component and re-points one decorative tween to `.ill-piece`. All data/cards/counters/SplitText stay frozen.

**Tech Stack:** React 19 + TypeScript (strict), Vite 8, Tailwind v4 (CSS `@theme` tokens), GSAP via `@/deck/gsap`.

**Correctness gate:** This repo has **no test runner**. `npm run build` (`tsc -b` strict: `noUnusedLocals`, `noUnusedParameters`, `strict`) is the only automated gate. Visual correctness is reviewed by the user in `npm run dev` — do **not** self-verify visuals via screenshots.

**Palette tokens (from `src/index.css` `@theme`):** `--color-paper #f5f2ea`, `--color-paper-deep #ece7da`, `--color-ink #1b1d24`, `--color-clinic #0d6e85`, `--color-clinic-deep #08515f`, `--color-clinic-soft #cfe6ea`, `--color-coral #cf5a4e`, `--color-muted #6c7079`, `--color-hair #c8c2b2`. Use these via `var(--color-…)` for every fill/stroke — never hard-coded hex.

---

## File Structure

- Create: `src/components/illustrations/RoleInfirmier.tsx` — nurse + adolescent education scene (Introduction).
- Create: `src/components/illustrations/TransmissionIST.tsx` — partner→partner and parent→infant transmission scene (Conséquences).
- Create: `src/components/illustrations/EducationGroupe.tsx` — nurse + adolescents around a board (Pratiques éducatives).
- Modify: `src/slides/IntroSlide.tsx` — swap top-right `DuotonePhoto` for `RoleInfirmier`; drop unused imports.
- Modify: `src/slides/ConsequencesSlide.tsx` — swap decorative `<svg>` for `TransmissionIST`; re-point decorative tween.
- Modify: `src/slides/PratiquesEducativesSlide.tsx` — swap decorative `<svg>` for `EducationGroupe`; remove cursor motionPath; re-point decorative tween.

Each illustration component is self-contained (one responsibility: draw one scene). No shared illustration base/registry — three static drawings don't warrant it (YAGNI).

### Shared conventions for all three components

- Root: `<svg viewBox="0 0 W H" className={className} aria-hidden role="img">`. `className` defaults to `""`.
- Prop type declared inline: `{ className?: string }`.
- Animatable groups carry `className="ill-piece"`. Static backdrop shapes do not.
- Any `<defs>` id is prefixed with the component slug (`role-`, `trans-`, `educ-`) to stay unique across the always-mounted deck.
- No GSAP import, no `active` prop, no `useGSAP`. Pure presentational SVG.

---

## Task 1: `RoleInfirmier` illustration component

**Files:**
- Create: `src/components/illustrations/RoleInfirmier.tsx`

- [ ] **Step 1: Create the component**

A nurse (teal scrubs, cross badge) presenting an education leaflet to an adolescent. Flat two-tone: clinic/clinic-deep + coral, paper negative space, ink for fine detail.

```tsx
/**
 * Le rôle infirmier: a nurse presenting an education leaflet to an adolescent.
 * Flat two-tone illustration. Each revealable group carries `ill-piece` so the
 * host slide's GSAP timeline animates it; this component owns no animation.
 */
export function RoleInfirmier({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      className={className}
      role="img"
      aria-label="Infirmière présentant un support éducatif à un adolescent"
    >
      {/* soft ground */}
      <ellipse cx="180" cy="268" rx="150" ry="16" fill="var(--color-clinic-soft)" opacity="0.55" />

      {/* Nurse (left) */}
      <g className="ill-piece">
        <rect x="66" y="150" width="78" height="104" rx="26" fill="var(--color-clinic)" />
        <rect x="66" y="150" width="78" height="104" rx="26" fill="var(--color-clinic-deep)" opacity="0.0" />
        {/* cross badge */}
        <path d="M98 178h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="var(--color-paper)" />
        {/* head */}
        <circle cx="105" cy="120" r="26" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        {/* hair / cap */}
        <path d="M79 116a26 26 0 0 1 52 0z" fill="var(--color-clinic-deep)" />
        {/* extended arm offering leaflet */}
        <rect x="138" y="172" width="56" height="18" rx="9" fill="var(--color-clinic)" />
      </g>

      {/* Leaflet */}
      <g className="ill-piece">
        <rect x="156" y="150" width="48" height="60" rx="5" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M164 164h32M164 174h32M164 184h22" stroke="var(--color-coral)" strokeWidth="3" strokeLinecap="round" />
        {/* small heart accent */}
        <path d="M180 196c-6-5-12-1-12 4 0 5 12 11 12 11s12-6 12-11c0-5-6-9-12-4z" fill="var(--color-coral)" />
      </g>

      {/* Adolescent (right) */}
      <g className="ill-piece">
        <rect x="222" y="156" width="70" height="98" rx="24" fill="var(--color-coral)" />
        <circle cx="257" cy="126" r="24" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M233 122a24 24 0 0 1 48 0z" fill="var(--color-ink)" />
        {/* arm reaching toward leaflet */}
        <rect x="200" y="178" width="34" height="17" rx="8.5" fill="var(--color-coral)" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: PASS (no TS errors). The component is imported in Task 4; building now confirms the file itself is valid TSX.

Note: an unused export does not fail `tsc -b` (`noUnusedLocals` is module-internal). If the build is slow, this step may be folded into Task 4's build.

- [ ] **Step 3: Commit**

```bash
git add src/components/illustrations/RoleInfirmier.tsx
git commit -m "Add RoleInfirmier flat illustration component"
```

---

## Task 2: `TransmissionIST` illustration component

**Files:**
- Create: `src/components/illustrations/TransmissionIST.tsx`

This sits as a board background behind the two stat cards in Conséquences, which are right-aligned in a 330px column. So the scene is weighted to the **left** of its viewBox, leaving the right third visually quiet for the cards. Two rows: partner→partner (coral) and parent→infant (clinic).

- [ ] **Step 1: Create the component**

```tsx
/**
 * Transmission des IST: two routes matching the slide's two stat cards —
 * partner→partner (top, coral) and parent→infant (bottom, clinic). Weighted to
 * the left so the right third stays quiet behind the overlaid cards. Flat
 * two-tone; each revealable group carries `ill-piece` (host slide animates).
 */
export function TransmissionIST({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 660 560"
      className={className}
      role="img"
      aria-label="Schéma de transmission des IST: au partenaire et de la mère à l'enfant"
    >
      <defs>
        <marker id="trans-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
          <path d="M0 0l6 3-6 3z" fill="var(--color-ink)" opacity="0.55" />
        </marker>
      </defs>

      {/* faint cross texture, left field only */}
      <g stroke="var(--color-clinic)" strokeWidth="1.1" strokeLinecap="round" opacity="0.12">
        {[60, 140, 220, 300].map((y) =>
          [50, 130, 210, 290].map((x) => (
            <path key={`${x}-${y}`} d={`M${x} ${y - 6}v12M${x - 6} ${y}h12`} />
          )),
        )}
      </g>

      {/* Row 1: partner -> partner (coral) */}
      <g className="ill-piece">
        <circle cx="90" cy="150" r="34" fill="var(--color-coral)" />
        <circle cx="90" cy="120" r="16" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx="250" cy="150" r="34" fill="var(--color-coral)" opacity="0.55" />
        <circle cx="250" cy="120" r="16" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M134 140h78" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#trans-arrow)" opacity="0.55" />
      </g>

      {/* Row 2: parent -> infant (clinic) */}
      <g className="ill-piece">
        <circle cx="90" cy="380" r="38" fill="var(--color-clinic)" />
        <circle cx="90" cy="346" r="17" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        {/* infant: smaller figure */}
        <circle cx="248" cy="392" r="24" fill="var(--color-clinic-deep)" />
        <circle cx="248" cy="370" r="11" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M134 374h74" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#trans-arrow)" opacity="0.55" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/illustrations/TransmissionIST.tsx
git commit -m "Add TransmissionIST flat illustration component"
```

---

## Task 3: `EducationGroupe` illustration component

**Files:**
- Create: `src/components/illustrations/EducationGroupe.tsx`

Sits behind the methods/freins card grid in Pratiques éducatives (cards fill most of the board). A nurse beside a flip-chart/board, with two adolescent learners — depicting group education. Scene weighted lower/left as a quiet backdrop.

- [ ] **Step 1: Create the component**

```tsx
/**
 * Éducation de groupe: a nurse beside a flip-chart presenting to two adolescent
 * learners. Flat two-tone; quiet backdrop behind the slide's card grid. Each
 * revealable group carries `ill-piece` (host slide animates).
 */
export function EducationGroupe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 560"
      className={className}
      role="img"
      aria-label="Infirmière animant une séance d'éducation de groupe"
    >
      {/* ground */}
      <ellipse cx="360" cy="500" rx="320" ry="22" fill="var(--color-clinic-soft)" opacity="0.5" />

      {/* Flip-chart / board */}
      <g className="ill-piece">
        <rect x="70" y="120" width="180" height="220" rx="10" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="3" />
        <path d="M100 170h120M100 200h120M100 230h80" stroke="var(--color-clinic)" strokeWidth="6" strokeLinecap="round" />
        {/* coral bar mimicking a chart on the board */}
        <rect x="100" y="262" width="36" height="46" rx="4" fill="var(--color-coral)" />
        <rect x="146" y="280" width="36" height="28" rx="4" fill="var(--color-clinic)" />
        {/* easel legs */}
        <path d="M96 340l-22 70M224 340l22 70" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Nurse presenting (teal) */}
      <g className="ill-piece">
        <rect x="300" y="270" width="86" height="150" rx="30" fill="var(--color-clinic)" />
        <path d="M334 300h10v10h10v10h-10v10h-10v-10h-10v-10h10z" fill="var(--color-paper)" />
        <circle cx="343" cy="232" r="30" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M313 228a30 30 0 0 1 60 0z" fill="var(--color-clinic-deep)" />
        {/* pointing arm toward board */}
        <rect x="262" y="298" width="48" height="18" rx="9" fill="var(--color-clinic)" transform="rotate(-12 286 307)" />
      </g>

      {/* Adolescent learners (coral), seated right */}
      <g className="ill-piece">
        <rect x="470" y="330" width="72" height="98" rx="26" fill="var(--color-coral)" />
        <circle cx="506" cy="300" r="24" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M482 296a24 24 0 0 1 48 0z" fill="var(--color-ink)" />
      </g>
      <g className="ill-piece">
        <rect x="560" y="346" width="68" height="92" rx="24" fill="var(--color-coral)" opacity="0.8" />
        <circle cx="594" cy="318" r="22" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M572 314a22 22 0 0 1 44 0z" fill="var(--color-clinic-deep)" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/illustrations/EducationGroupe.tsx
git commit -m "Add EducationGroupe flat illustration component"
```

---

## Task 4: Wire `RoleInfirmier` into IntroSlide

**Files:**
- Modify: `src/slides/IntroSlide.tsx`

The current top-right slot (lines ~140-148) renders `<VitalLine>` + a `<DuotonePhoto>` of `nurse-education.jpg`. Replace the photo with the illustration. Keep `VitalLine`. The `.intro-photo` tween (line ~78) is kept but re-pointed to the new element by reusing the `.intro-photo` class on the illustration wrapper — so the existing timeline is unchanged.

- [ ] **Step 1: Add the import, remove the photo import**

Add near the other component imports (after line 6 `DuotonePhoto` import):

```tsx
import { RoleInfirmier } from "@/components/illustrations/RoleInfirmier";
```

Remove these two now-unused imports (lines 6-7):

```tsx
import { DuotonePhoto } from "@/components/DuotonePhoto";
import nurseEducation from "@/assets/photos/nurse-education.jpg";
```

(Removal is required — `noUnusedLocals` would otherwise fail the build. Confirm `DuotonePhoto`/`nurseEducation` are not referenced elsewhere in the file before removing; per the current file they are used only in this slot.)

- [ ] **Step 2: Replace the photo element with the illustration**

Find (lines ~142-147):

```tsx
          <DuotonePhoto
            src={nurseEducation}
            alt="Infirmière partageant un support éducatif"
            position="center"
            className="intro-photo mt-3 h-28 w-full rounded-2xl ring-1 ring-hair/50 shadow-[0_28px_90px_rgba(27,29,36,0.16)]"
          />
```

Replace with:

```tsx
          <div className="intro-photo mt-3 rounded-2xl border border-hair/50 bg-white/55 p-3 shadow-[0_28px_90px_rgba(27,29,36,0.16)] backdrop-blur-sm">
            <RoleInfirmier className="h-32 w-full" />
          </div>
```

The wrapper keeps the `.intro-photo` class, so the existing `.from(".intro-photo", …)` tween (line ~78) still animates the slot — no timeline edit needed. (The inner `.ill-piece` groups are revealed together with the slot here; that is acceptable for this small top-right element. The per-piece stagger is exercised on the two background slides.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS, no unused-import errors.

- [ ] **Step 4: Commit**

```bash
git add src/slides/IntroSlide.tsx
git commit -m "Use RoleInfirmier illustration in Introduction slide"
```

---

## Task 5: Wire `TransmissionIST` into ConsequencesSlide

**Files:**
- Modify: `src/slides/ConsequencesSlide.tsx`

Replace the decorative `<svg>` block (lines ~93-113: `cs-cross` pattern rect, `cs-pulse` rings, `cs-route` paths, `cs-node` shapes) with `<TransmissionIST>`. Remove the now-dead `RISKS[].path` usage and the `smoothLinePath` import if unused. Re-point the timeline: the `.cs-route`/`.cs-node` tweens and the `.cs-pulse` repeating tween are replaced by one `.ill-piece` reveal.

- [ ] **Step 1: Add import, remove `smoothLinePath` import + `path` fields**

Add after line 3:

```tsx
import { TransmissionIST } from "@/components/illustrations/TransmissionIST";
```

Remove line 2 (`smoothLinePath` becomes unused after the next edit):

```tsx
import { smoothLinePath } from "@/components/chartGeometry";
```

In the `RISKS` array, remove the `path:` property from both objects (lines ~12 and ~20), since the illustration no longer uses per-risk paths:

```tsx
const RISKS = [
  {
    label: "Transmission au partenaire",
    value: 80,
    copy: "L'absence de prise en charge maintient une forte contagiosité.",
    color: "var(--color-coral)",
  },
  {
    label: "Transmission mère-enfant",
    value: 80,
    copy: "Les IST pendant la grossesse exposent le nouveau-né à des conséquences graves.",
    color: "var(--color-clinic)",
  },
];
```

- [ ] **Step 2: Replace the decorative `<svg>` block**

Find (lines ~93-113, the entire `<svg viewBox="0 0 660 560" …> … </svg>`):

```tsx
        <svg viewBox="0 0 660 560" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="cs-cross" width="38" height="38" patternUnits="userSpaceOnUse">
              <path d="M19 13v12M13 19h12" stroke="var(--color-clinic)" strokeWidth="1.1" strokeLinecap="round" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="660" height="560" fill="url(#cs-cross)" />
          <circle className="cs-pulse" cx="246" cy="280" r="94" fill="none" stroke="var(--color-coral)" strokeWidth="2" opacity="0.35" />
          <circle className="cs-pulse" cx="246" cy="280" r="138" fill="none" stroke="var(--color-clinic)" strokeWidth="2" opacity="0.3" />
          {RISKS.map((risk) => (
            <path key={risk.label} className="cs-route" d={risk.path} fill="none" stroke={risk.color} strokeWidth="5" strokeLinecap="round" strokeDasharray="12 14" />
          ))}
          <g>
            <circle className="cs-node" cx="246" cy="280" r="76" fill="var(--color-paper)" stroke="var(--color-clinic-deep)" strokeWidth="2" />
            <path className="cs-node" d="M246 232v96M198 280h96" stroke="var(--color-clinic-deep)" strokeWidth="7" strokeLinecap="round" />
          </g>
          <circle className="cs-node" cx="68" cy="210" r="22" fill="var(--color-coral)" />
          <circle className="cs-node" cx="410" cy="210" r="22" fill="var(--color-coral)" />
          <circle className="cs-node" cx="68" cy="330" r="22" fill="var(--color-clinic)" />
          <circle className="cs-node" cx="410" cy="330" r="22" fill="var(--color-clinic)" />
        </svg>
```

Replace with:

```tsx
        <TransmissionIST className="absolute inset-0 h-full w-full" />
```

- [ ] **Step 3: Re-point the timeline**

In the `useGSAP` timeline, replace the two decorative lines (~41-42):

```tsx
        .from(".cs-route", { drawSVG: "0%", duration: 1.15, stagger: 0.12, ease: "power2.inOut" }, 0.38)
        .from(".cs-node", { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.55, stagger: 0.08, ease: "back.out(2)" }, 0.62)
```

with a single illustration reveal:

```tsx
        .from(".ill-piece", { scale: 0.9, opacity: 0, transformOrigin: "center", duration: 0.6, stagger: 0.12, ease: "back.out(1.6)" }, 0.4)
```

Then delete the now-orphaned `.cs-pulse` repeating tween (lines ~64-72):

```tsx
      gsap.to(".cs-pulse", {
        scale: 1.2,
        opacity: 0,
        duration: 1.8,
        repeat: -1,
        stagger: 0.35,
        ease: "power2.out",
        transformOrigin: "center",
      });
```

(The `.cs-body`, `.cs-card`, `.cs-meter`, `.cs-count` tweens and the count-up loop are **unchanged**.)

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS. Watch for: unused `smoothLinePath` (must be removed), unused `risk.path` references (none should remain), unused `color` is still used by cards (keep it).

- [ ] **Step 5: Commit**

```bash
git add src/slides/ConsequencesSlide.tsx
git commit -m "Use TransmissionIST illustration in Conséquences slide"
```

---

## Task 6: Wire `EducationGroupe` into PratiquesEducativesSlide

**Files:**
- Modify: `src/slides/PratiquesEducativesSlide.tsx`

Replace the decorative `<svg>` block (lines ~100-112: `pe-grad` gradient, `pe-route` path, `pe-cursor` circle, `pe-step` dots) with `<EducationGroupe>`. Remove the `PRACTICE_ROUTE` constant and `smoothLinePath` import. Re-point the `.pe-route`/`.pe-step` tweens to `.ill-piece` and remove the `motionPath` cursor tween.

- [ ] **Step 1: Add import, remove `smoothLinePath` import + `PRACTICE_ROUTE`**

Add after line 3:

```tsx
import { EducationGroupe } from "@/components/illustrations/EducationGroupe";
```

Remove line 2:

```tsx
import { smoothLinePath } from "@/components/chartGeometry";
```

Remove the `PRACTICE_ROUTE` constant (lines ~18-26):

```tsx
const PRACTICE_ROUTE = smoothLinePath([
  [78, 410],
  [170, 240],
  [248, 280],
  [340, 162],
  [426, 52],
  [548, 120],
  [636, 246],
]);
```

- [ ] **Step 2: Replace the decorative `<svg>` block**

Find (lines ~100-112):

```tsx
        <svg viewBox="0 0 720 560" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="pe-grad" x1="90" x2="620" y1="110" y2="430" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-clinic)" />
              <stop offset="1" stopColor="var(--color-coral)" />
            </linearGradient>
          </defs>
          <path className="pe-route" d={PRACTICE_ROUTE} fill="none" stroke="url(#pe-grad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 14" />
          <circle className="pe-cursor" cx="78" cy="410" r="10" fill="var(--color-coral)" />
          {[78, 258, 456, 636].map((x, i) => (
            <circle key={x} className="pe-step" cx={x} cy={i === 0 ? 410 : i === 1 ? 276 : i === 2 ? 100 : 246} r="15" fill={i % 2 ? "var(--color-clinic)" : "var(--color-coral)"} />
          ))}
        </svg>
```

Replace with:

```tsx
        <EducationGroupe className="pointer-events-none absolute inset-0 h-full w-full" />
```

- [ ] **Step 3: Re-point the timeline and remove the cursor tween**

Replace the two decorative timeline lines (~46, ~49):

```tsx
        .from(".pe-route", { drawSVG: "0%", duration: 1.1, ease: "power2.inOut" }, 0.42)
```
and
```tsx
        .from(".pe-step", { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.45, stagger: 0.08, ease: "back.out(2)" }, 0.8);
```

The cleanest edit: remove the `.pe-route` line entirely, and change the `.pe-step` line (which is the timeline's terminal `.from(...)` ending in `;`) to target `.ill-piece`:

```tsx
        .from(".ill-piece", { scale: 0.9, opacity: 0, transformOrigin: "center", duration: 0.55, stagger: 0.1, ease: "back.out(1.6)" }, 0.5);
```

Then delete the `motionPath` cursor tween (lines ~69-79):

```tsx
      gsap.to(".pe-cursor", {
        motionPath: {
          path: ".pe-route",
          align: ".pe-route",
          alignOrigin: [0.5, 0.5],
        },
        duration: 5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
```

(The `.pe-board`, `.pe-card`, `.pe-bar` tweens and the `.pe-count` count-up loop are **unchanged**.)

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS. Watch for: unused `smoothLinePath` (removed), unused `PRACTICE_ROUTE` (removed), no remaining `.pe-route`/`.pe-cursor`/`.pe-step` references.

- [ ] **Step 5: Commit**

```bash
git add src/slides/PratiquesEducativesSlide.tsx
git commit -m "Use EducationGroupe illustration in Pratiques éducatives slide"
```

---

## Task 7: Final build gate + user visual review

**Files:** none (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: PASS — clean `tsc -b` + `vite build`, no unused locals/params, no missing references.

- [ ] **Step 2: Hand off for visual review**

Run: `npm run dev` and tell the user to review the three pilot slides (Introduction, Conséquences, Pratiques éducatives) in the browser. Do **not** self-verify via screenshots (project convention). Collect any adjustment requests (proportions, colors, placement) and treat them as follow-up edits to the relevant component file only.

---

## Self-Review

**Spec coverage:**
- Style = flat two-tone via palette CSS vars → Tasks 1-3 (all fills use `var(--color-…)`). ✓
- Architecture A: one component per topic in `src/components/illustrations/`, `{ className? }`, GSAP-free, `ill-piece` hook → Tasks 1-3 + shared conventions. ✓
- Host integration: swap svg + re-point one tween, freeze data/counters/SplitText → Tasks 4-6. ✓
- Intro removes `nurse-education.jpg`/`DuotonePhoto`, keeps `Decor` backdrop → Task 4 (Decor untouched). ✓
- Build is the only gate; user reviews visuals → Task 7. ✓
- Rollout deferred to after approval → not in this plan (correct; spec defers it). ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. ✓

**Type consistency:** All three components share the signature `({ className = "" }: { className?: string })`. Host imports use named exports (`{ RoleInfirmier }`, `{ TransmissionIST }`, `{ EducationGroupe }`) matching the `export function` declarations. ✓

**Risk note:** Each wiring task removes imports/constants that `noUnusedLocals`/`noUnusedParameters` would flag — these removals are called out explicitly in Steps so the build stays green.
