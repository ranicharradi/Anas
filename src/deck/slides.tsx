import type { SlideDef } from "./types";
import TitleSlide from "@/slides/TitleSlide";
import PlanSlide from "@/slides/PlanSlide";
import IntroSlide from "@/slides/IntroSlide";
import MethodoSlide from "@/slides/MethodoSlide";
import EtudeSlide from "@/slides/EtudeSlide";
import PopulationSlide from "@/slides/PopulationSlide";
import CollecteSlide from "@/slides/CollecteSlide";
import StatSlide from "@/slides/StatSlide";
import RingStatSlide from "@/slides/RingStatSlide";

/**
 * The ordered slide registry. Adding a slide is one entry here. This scaffold
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
    id: "plan",
    title: "Plan de travail",
    act: "Introduction",
    Component: PlanSlide,
  },
  {
    id: "introduction",
    title: "Introduction",
    act: "Introduction",
    Component: IntroSlide,
  },
  {
    id: "methodologie",
    title: "Méthodologie",
    act: "Méthodologie",
    Component: MethodoSlide,
  },
  {
    id: "etude",
    title: "Type, lieu et date de l'étude",
    act: "Méthodologie",
    Component: EtudeSlide,
  },
  {
    id: "population",
    title: "Population d'étude",
    act: "Méthodologie",
    Component: PopulationSlide,
  },
  {
    id: "collecte",
    title: "Méthode de collecte des données",
    act: "Méthodologie",
    Component: CollecteSlide,
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
