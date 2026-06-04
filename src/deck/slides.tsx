import type { SlideDef } from "./types";
import TitleSlide from "@/slides/TitleSlide";
import StatSlide from "@/slides/StatSlide";
import RingStatSlide from "@/slides/RingStatSlide";

/**
 * The ordered slide registry — adding a slide is one entry here. This scaffold
 * ships three pattern slides (title + bar-chart stat + ring stat); rebuild the
 * remaining Canva pages against these layouts.
 */
export const slides: SlideDef[] = [
  {
    id: "title",
    title: "Page de garde",
    act: "Introduction",
    Component: TitleSlide,
  },
  {
    id: "signes-cliniques",
    title: "Identification des signes cliniques des IST",
    act: "Résultats",
    Component: StatSlide,
  },
  {
    id: "motivation-formation",
    title: "Volonté de renforcer les compétences",
    act: "Résultats",
    Component: RingStatSlide,
  },
];
