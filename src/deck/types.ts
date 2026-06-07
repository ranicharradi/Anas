import type { ComponentType } from "react";

export type Act =
  | "Introduction"
  | "Méthodologie"
  | "Résultats"
  | "Recommandations"
  | "Conclusion";

export interface SlideProps {
  /** True while this slide is the current one — gate enter animations on it. */
  active: boolean;
}

export interface SlideDef {
  id: string;
  title: string;
  act: Act;
  /**
   * Background tone of the slide. Defaults to "light" (paper). "dark" tells the
   * Deck to render its chrome (counter, progress bar, nav) in a light palette so
   * it stays legible over a dark/teal slide.
   */
  tone?: "light" | "dark";
  Component: ComponentType<SlideProps>;
}
