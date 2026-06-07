import type { SlideDef } from "./types";
import TitleSlide from "@/slides/TitleSlide";
import PlanSlide from "@/slides/PlanSlide";
import IntroSlide from "@/slides/IntroSlide";
import MethodoSlide from "@/slides/MethodoSlide";
import EtudeSlide from "@/slides/EtudeSlide";
import PopulationSlide from "@/slides/PopulationSlide";
import CollecteSlide from "@/slides/CollecteSlide";
import OutilsInformatiquesSlide from "@/slides/OutilsInformatiquesSlide";
import ResultatsDiscussionSlide from "@/slides/ResultatsDiscussionSlide";
import SocioDemoSlide from "@/slides/SocioDemoSlide";
import ProgrammeIstSidaSlide from "@/slides/ProgrammeIstSidaSlide";
import KnowledgeOverviewSlide from "@/slides/KnowledgeOverviewSlide";
import SignesCliniquesSlide from "@/slides/SignesCliniquesSlide";
import HpvDepistageSlide from "@/slides/HpvDepistageSlide";
import ConsequencesSlide from "@/slides/ConsequencesSlide";
import MotivationSlide from "@/slides/MotivationSlide";
import CommunicationSlide from "@/slides/CommunicationSlide";
import PratiquesEducativesSlide from "@/slides/PratiquesEducativesSlide";
import FormationDifficultesSlide from "@/slides/FormationDifficultesSlide";
import RecommandationsSlide from "@/slides/RecommandationsSlide";
import ChatbotSlide from "@/slides/ChatbotSlide";
import ConclusionSlide from "@/slides/ConclusionSlide";
import RemerciementsSlide from "@/slides/RemerciementsSlide";

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
    id: "outils-informatiques",
    title: "Outils informatiques",
    act: "Méthodologie",
    Component: OutilsInformatiquesSlide,
  },
  {
    id: "resultats-discussion",
    title: "Résultat et discussion",
    act: "Résultats",
    Component: ResultatsDiscussionSlide,
  },
  {
    id: "caracteristiques-sociodemographiques",
    title: "Caractéristiques sociodémographiques",
    act: "Résultats",
    Component: SocioDemoSlide,
  },
  {
    id: "programme-ist-sida",
    title: "Milieu d'exercice et programme national IST-Sida",
    act: "Résultats",
    Component: ProgrammeIstSidaSlide,
  },
  {
    id: "connaissances-transmission",
    title: "Connaissance des modes de transmission",
    act: "Résultats",
    Component: KnowledgeOverviewSlide,
  },
  {
    id: "signes-cliniques",
    title: "Identification des signes cliniques des IST",
    act: "Résultats",
    Component: SignesCliniquesSlide,
  },
  {
    id: "hpv-depistage",
    title: "HPV et indications du dépistage",
    act: "Résultats",
    Component: HpvDepistageSlide,
  },
  {
    id: "consequences-ist",
    title: "Conséquences des IST non traitées",
    act: "Résultats",
    Component: ConsequencesSlide,
  },
  {
    id: "motivation-formation",
    title: "Motivation et perception du rôle",
    act: "Résultats",
    Component: MotivationSlide,
  },
  {
    id: "communication-efficace",
    title: "Facteurs favorisant une communication efficace",
    act: "Résultats",
    Component: CommunicationSlide,
  },
  {
    id: "pratiques-educatives",
    title: "Méthodes éducatives et difficultés",
    act: "Résultats",
    Component: PratiquesEducativesSlide,
  },
  {
    id: "formation-difficultes",
    title: "Formation et difficultés rencontrées",
    act: "Résultats",
    Component: FormationDifficultesSlide,
  },
  {
    id: "recommandations",
    title: "Recommandations",
    act: "Recommandations",
    Component: RecommandationsSlide,
  },
  {
    id: "assistant-ist",
    title: "Un assistant pour la prévention",
    act: "Recommandations",
    Component: ChatbotSlide,
  },
  {
    id: "conclusion",
    title: "Conclusion",
    act: "Conclusion",
    Component: ConclusionSlide,
  },
  {
    id: "remerciements",
    title: "Remerciements",
    act: "Conclusion",
    tone: "dark",
    Component: RemerciementsSlide,
  },
];
