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
  Component: ComponentType<SlideProps>;
}
