import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/deck/gsap";
import Hero from "@/site/sections/Hero";
import AssistantSection from "@/site/sections/AssistantSection";
import Essentiel from "@/site/sections/Essentiel";
import Depistage from "@/site/sections/Depistage";
import SiteFooter from "@/site/sections/SiteFooter";

/**
 * Companion site shell. On desktop the five sections are full-screen horizontal
 * slides, paged one at a time (arrow keys, on-screen arrows, dots, swipe) like
 * the deck; the active slide's `.reveal` elements animate in on entry. On narrow
 * screens it falls back to ordinary vertical scrolling with scroll-triggered
 * reveals, since horizontal paging is awkward for reading on phones. All motion
 * respects prefers-reduced-motion.
 */

const SECTIONS = [
  { key: "hero", Component: Hero },
  { key: "assistant", Component: AssistantSection },
  { key: "essentiel", Component: Essentiel },
  { key: "depistage", Component: Depistage },
  { key: "footer", Component: SiteFooter },
];
const COUNT = SECTIONS.length;
const ASSISTANT_INDEX = SECTIONS.findIndex((s) => s.key === "assistant");

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SiteApp() {
  const root = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 768px)").matches,
  );
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = (dir: number) =>
    setIndex((i) => Math.min(Math.max(i + dir, 0), COUNT - 1));

  // Track viewport so we can swap between paged (desktop) and scroll (mobile).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      setIsDesktop(mq.matches);
      setIndex(0);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keyboard paging (desktop only). Ignore while typing in the chat input.
  useEffect(() => {
    if (!isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      ) {
        return;
      }
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") {
        setIndex(0);
      } else if (e.key === "End") {
        setIndex(COUNT - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDesktop]);

  // Mobile: scroll-triggered reveals (set up once per layout mode).
  useGSAP(
    () => {
      if (isDesktop || prefersReducedMotion()) return;
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
    { scope: root, dependencies: [isDesktop] },
  );

  // Desktop: reveal the active slide's content as it pages in.
  useGSAP(
    () => {
      if (!isDesktop || prefersReducedMotion()) return;
      const reveals = root.current?.querySelectorAll<HTMLElement>(
        `[data-slide="${index}"] .reveal`,
      );
      if (reveals && reveals.length > 0) {
        gsap.from(reveals, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
        });
      }
    },
    { scope: root, dependencies: [index, isDesktop] },
  );

  // Mobile: ordinary vertical scroll.
  if (!isDesktop) {
    return (
      <div ref={root} className="min-h-screen bg-paper text-ink">
        {SECTIONS.map(({ key, Component }) => (
          <Component key={key} />
        ))}
      </div>
    );
  }

  // Desktop: full-screen horizontal slides.
  const reduce = prefersReducedMotion();
  return (
    <div
      ref={root}
      className="relative h-dvh w-screen overflow-hidden bg-paper text-ink"
      onClick={(e) => {
        // Hero's "Poser une question" anchor pages to the assistant slide
        // instead of trying to scroll to an off-screen element.
        const anchor = (e.target as HTMLElement).closest('a[href="#assistant"]');
        if (anchor) {
          e.preventDefault();
          setIndex(ASSISTANT_INDEX);
        }
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${index * 100}vw)`,
          transition: reduce
            ? undefined
            : "transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      >
        {SECTIONS.map(({ key, Component }, i) => (
          <div
            key={key}
            data-slide={i}
            aria-hidden={i !== index}
            className="h-full w-screen shrink-0 overflow-y-auto"
          >
            <div className="flex min-h-full items-center">
              <div className="w-full">
                <Component />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / next arrows */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Diapositive précédente"
          className="absolute left-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-hair/60 bg-white/70 text-ink shadow-md backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
        >
          <Chevron dir="left" />
        </button>
      )}
      {index < COUNT - 1 && (
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Diapositive suivante"
          className="absolute right-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-hair/60 bg-white/70 text-ink shadow-md backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
        >
          <Chevron dir="right" />
        </button>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5">
        {SECTIONS.map(({ key }, i) => (
          <button
            key={key}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Aller à la diapositive ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral ${
              i === index ? "w-8 bg-coral" : "w-2.5 bg-hair hover:bg-coral/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
