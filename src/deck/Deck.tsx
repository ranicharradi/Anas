import { useCallback, useEffect, useState } from "react";
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
  const count = slides.length;

  const go = useCallback(
    (dir: number) =>
      setIndex((i) => Math.min(Math.max(i + dir, 0), count - 1)),
    [count],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          e.preventDefault();
          setIndex(0);
          break;
        case "End":
          e.preventDefault();
          setIndex(count - 1);
          break;
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

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end px-12 py-7 text-[11px] uppercase tracking-[0.28em] text-muted">
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </span>
      </footer>
    </main>
  );
}
