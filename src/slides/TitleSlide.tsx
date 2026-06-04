import type { SlideProps } from "@/deck/types";
import pageDeGarde from "@/assets/page-de-garde.png";

/**
 * Page de garde imported verbatim from the original Canva deck (page 1) and kept
 * exactly as designed — full-bleed 16:9 image, aspect ratio preserved. Do not
 * restyle; re-export the asset from Canva if the cover changes.
 */
export default function TitleSlide(_: SlideProps) {
  return (
    <div className="grid h-full w-full place-items-center">
      <img
        src={pageDeGarde}
        alt="Page de garde — Projet de fin d'études : les pratiques éducatives des infirmiers pour la prévention des IST chez les adolescents"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
