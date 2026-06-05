import { useCallback, useEffect, useState } from "react";
import {
  emitSlideInnerNavigation,
  getKeyboardAction,
  isEditableTarget,
} from "./keyboard";
import { slides } from "./slides";

/**
 * Discrete-slide controller: one full-viewport slide visible at a time, paged by
 * keyboard / clicker. All slides stay mounted (only ~27 lightweight text+SVG
 * slides) and receive an `active` flag so each can run its GSAP enter timeline
 * exactly when it becomes current. Crossfade between slides is a cheap CSS
 * opacity transition; the *content* motion is GSAP.
 */
export default function Deck() {
  const [index, setIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (dir: number) =>
      setIndex((i) => Math.min(Math.max(i + dir, 0), count - 1)),
    [count],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      const action = getKeyboardAction(e);
      if (!action) return;

      e.preventDefault();

      switch (action.kind) {
        case "slide":
          go(action.direction);
          return;
        case "inner":
          emitSlideInnerNavigation(action.direction);
          return;
        case "home":
          setIndex(0);
          return;
        case "end":
          setIndex(count - 1);
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, count]);

  return (
    <main className="relative h-full w-full overflow-hidden">
      {slides.map((slide, i) => {
        const Comp = slide.Component;
        const isActive = i === index;
        return (
          <section
            key={slide.id}
            aria-hidden={!isActive}
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <Comp active={isActive} />
          </section>
        );
      })}

      {/* Deck chrome */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-hair/40">
        <div
          className="h-full bg-clinic transition-[width] duration-500 ease-out"
          style={{ width: `${((index + 1) / count) * 100}%` }}
        />
      </div>

      {/* Right-edge slide navigator: a faint dot rail that expands into a
          labeled panel on hover and collapses when the pointer leaves it. */}
      <nav
        onMouseEnter={() => setNavOpen(true)}
        onMouseLeave={() => setNavOpen(false)}
        className="pointer-events-auto absolute right-0 top-0 z-20 flex h-full items-center pr-4"
        aria-label="Navigation des diapositives"
      >
        <ul
          className={`flex flex-col gap-1.5 rounded-2xl py-3 pl-4 pr-3 transition-all duration-300 ease-out ${
            navOpen
              ? "bg-white/70 shadow-[0_20px_70px_rgba(27,29,36,0.16)] backdrop-blur-sm"
              : ""
          }`}
        >
          {slides.map((slide, i) => {
            const isCurrent = i === index;
            return (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={isCurrent ? "true" : undefined}
                  aria-label={`${i + 1}. ${slide.title}`}
                  className="group flex w-full items-center justify-end gap-3"
                >
                  <span
                    className={`overflow-hidden whitespace-nowrap text-right text-xs transition-all duration-300 ease-out ${
                      navOpen ? "max-w-[15rem] opacity-100" : "max-w-0 opacity-0"
                    } ${
                      isCurrent
                        ? "font-semibold text-ink"
                        : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {slide.title}
                  </span>
                  <span
                    className={`block shrink-0 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? "h-2.5 w-2.5 bg-clinic"
                        : "h-2 w-2 bg-ink/20 group-hover:bg-ink/40"
                    } ${navOpen ? "opacity-100" : "opacity-50"}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
