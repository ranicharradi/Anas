import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/deck/gsap";
import Hero from "@/site/sections/Hero";
import AssistantSection from "@/site/sections/AssistantSection";
import Essentiel from "@/site/sections/Essentiel";
import Depistage from "@/site/sections/Depistage";
import SiteFooter from "@/site/sections/SiteFooter";

export default function SiteApp() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect reduced-motion: leave content in its final state, no reveal.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root },
  );

  return (
    <div ref={root} className="min-h-screen bg-paper text-ink">
      <Hero />
      <AssistantSection />
      <Essentiel />
      <Depistage />
      <SiteFooter />
    </div>
  );
}
