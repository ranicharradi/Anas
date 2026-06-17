import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/deck/gsap";
import { onSlideInnerNavigation } from "@/deck/keyboard";
import type { SlideProps } from "@/deck/types";
import tunisMap from "@/assets/tunis-map.jpg";

/**
 * Type, lieu et date de l'étude (page 8). Left: the study design as a clinical
 * "fiche" with tagged descriptors and an animated 4-week timeline. Right: a
 * REAL, continuously zoomable street map of Tunis (CARTO/OpenStreetMap tiles,
 * stitched at build time and bundled for offline use). A GSAP "camera rig"
 * (scale the camera + translate by the inverse offset) flies smoothly between
 * the district overview and each hospital at its true geocoded position — an
 * actual zoom on one map, not a swap. Pins counter-scale to stay constant.
 *
 * While this slide is active, Up/Down arrows step through the views
 * (overview -> each hospital). Left/Right remain reserved for deck paging.
 */

const DESIGN = ["Quantitative", "Transversale", "Descriptive"];

// Study sites, paired by index with the map markers (same colours = legend).
const CENTRES = ["CSB Sijoumi", "CSB Hrairia", "CSB Cité Zouhour"];

/*
 * Hospitals: real coordinates from OpenStreetMap Nominatim (La Rabta & Charles
 * Nicolle resolve exactly; Wassila Bourguiba is the maternity centre on the La
 * Rabta campus). fx/fy = Web-Mercator position as a fraction of the bundled
 * street-map image, so each marker sits on its real building.
 */
const HOSPITALS = [
  { name: "Hôpital Charles Nicolle", short: "Charles Nicolle", lat: 36.802848, lon: 10.161318, color: "var(--color-clinic-deep)", fx: 0.8446, fy: 0.5257, side: "left" as const },
  { name: "Hôpital La Rabta", short: "La Rabta", lat: 36.80229, lon: 10.155029, color: "var(--color-clinic)", fx: 0.3561, fy: 0.5798, side: "right" as const },
  { name: "Maternité Wassila Bourguiba", short: "Wassila Bourguiba", lat: 36.8042, lon: 10.1543, color: "var(--color-coral)", fx: 0.2995, fy: 0.3945, side: "right" as const },
];

const ZOOM = 3.2; // scale when focused on a single hospital
// Camera views: index 0 = district overview, 1..3 = each hospital.
const VIEWS = [
  { fx: 0.5, fy: 0.5, scale: 1 },
  ...HOSPITALS.map((h) => ({ fx: h.fx, fy: h.fy, scale: ZOOM })),
];

export default function EtudeSlide({ active }: SlideProps) {
  const root = useRef<HTMLDivElement>(null);
  const view = useRef(0);

  // Fly the camera so (fx,fy) of the map lands at the frame centre at `scale`.
  // transformOrigin 0 0 → xPercent/yPercent are fractions of the (square) frame.
  const flyTo = (i: number, snap = false) => {
    const v = VIEWS[i];
    const dur = snap ? 0 : 1.5;
    gsap.to(".cam", {
      scale: v.scale,
      xPercent: (0.5 - v.fx * v.scale) * 100,
      yPercent: (0.5 - v.fy * v.scale) * 100,
      transformOrigin: "0 0",
      duration: dur,
      ease: "power3.inOut",
      overwrite: true,
    });
    gsap.to(".pin-scale", {
      scale: 1 / v.scale,
      duration: dur,
      ease: "power3.inOut",
      overwrite: true,
    });
    // spotlight the focused pin
    root.current?.querySelectorAll<HTMLElement>(".map-marker").forEach((m, mi) =>
      gsap.to(m, { opacity: i === 0 || mi === i - 1 ? 1 : 0.25, duration: 0.4 }),
    );
    view.current = i;
  };

  const { contextSafe } = useGSAP(
    () => {
      if (!active) return;
      view.current = 0;
      flyTo(0, true); // reset to overview instantly on (re)enter

      const split = new SplitText(".etude-title", {
        type: "lines,words",
        linesClass: "split-line",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".etude-kicker", { y: 14, opacity: 0, duration: 0.5 })
        .from(split.words, { yPercent: 120, duration: 0.7, stagger: 0.05 }, 0)
        .from(".etude-reveal", { y: 22, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.2)
        .from(".tag", { scale: 0, opacity: 0, transformOrigin: "left center", duration: 0.5, stagger: 0.1, ease: "back.out(2)" }, 0.4)
        .from(".timeline-fill", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "power2.inOut" }, 0.7)
        .from(".timeline-cap", { scale: 0, transformOrigin: "center", duration: 0.4, stagger: 0.25 }, 0.9)
        // map frame: settle-in zoom + marker pops
        .from(".map-frame", { opacity: 0, duration: 0.6 }, 0.3)
        .fromTo(".cam", { scale: 1.16 }, { scale: 1, duration: 1.2, ease: "power3.out" }, 0.35)
        .fromTo(
          ".map-marker",
          { scale: 0, opacity: 0, y: -12, transformOrigin: "center bottom" },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: "back.out(2.2)" },
          0.9,
        )
        .from(".csb-chip", { opacity: 0, y: 10, duration: 0.5, stagger: 0.08 }, 1.1);

      return () => split.revert();
    },
    { scope: root, dependencies: [active] },
  );

  // GSAP's contextSafe defers these callbacks to click time, so the refs they
  // touch (view.current, the DOM scope inside flyTo) are never read during
  // render. The react-hooks/refs rule can't see through contextSafe and reports
  // a false positive, so it's scoped off for just these two handlers.
  /* eslint-disable react-hooks/refs */
  const onMarker = contextSafe((i: number) =>
    flyTo(view.current === i + 1 ? 0 : i + 1),
  );
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    if (!active) return;

    return onSlideInnerNavigation((direction) => {
      if (direction > 0 && view.current < VIEWS.length - 1) {
        flyTo(view.current + 1);
      } else if (direction < 0 && view.current > 0) {
        flyTo(view.current - 1);
      }
    });
  }, [active]);

  return (
    <div ref={root} className="grid h-full grid-cols-[1.05fr_0.95fr] items-center gap-12 px-20 py-12">
      {/* Left: study design fiche */}
      <div className="ml-auto max-w-xl">
        <p className="etude-kicker mono-label text-clinic">02 · Méthodologie</p>
        <h2 className="etude-title mt-3 max-w-lg font-display text-6xl font-light leading-[1.04] text-ink">
          Type, lieu et date de l'étude
        </h2>

        <div className="etude-reveal mt-9 flex flex-wrap gap-2.5">
          {DESIGN.map((d) => (
            <span key={d} className="tag rounded-full border border-clinic/40 bg-clinic-soft/50 px-5 py-2 text-base font-semibold text-clinic-deep">
              {d}
            </span>
          ))}
        </div>

        <p className="etude-reveal mt-7 max-w-lg text-xl leading-relaxed text-muted">
          Une enquête menée sur une période de{" "}
          <strong className="font-semibold text-ink">4 semaines</strong>, du
          18 février au 17 mars 2026.
        </p>

        <div className="etude-reveal mt-7 max-w-md">
          <div className="relative h-2 rounded-full bg-hair/50">
            <div className="timeline-fill h-full rounded-full bg-gradient-to-r from-clinic to-clinic-deep" />
            <span className="timeline-cap absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-clinic bg-paper" />
            <span className="timeline-cap absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-clinic-deep bg-clinic-deep" />
          </div>
          <div className="mt-2.5 flex justify-between text-sm font-medium text-muted">
            <span>18 février 2026</span>
            <span>17 mars 2026</span>
          </div>
        </div>
      </div>

      {/* Right: zoomable street map + study-site legend */}
      <div className="relative flex h-full flex-col items-start justify-center gap-4">
        <div
          className="map-frame relative overflow-hidden rounded-2xl border border-hair/70 shadow-xl"
          style={{ height: "min(80vh, 660px)", aspectRatio: "1 / 1" }}
        >
          {/* camera rig: one map, scaled + translated to fly between views */}
          <div className="cam absolute inset-0 will-change-transform">
            <img src={tunisMap} alt="Plan du quartier Bab Saadoun, Tunis" className="absolute inset-0 h-full w-full object-cover" draggable={false} />

            {HOSPITALS.map((h, i) => (
              <button
                key={h.name}
                type="button"
                onClick={() => onMarker(i)}
                className="map-marker absolute"
                style={{ left: `${h.fx * 100}%`, top: `${h.fy * 100}%`, transform: "translate(-50%,-100%)" }}
              >
                <div className="pin-scale origin-bottom" style={{ transformOrigin: "50% 100%" }}>
                  <div
                    className="absolute bottom-full mb-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold text-white shadow-md"
                    style={{ background: h.color, [h.side === "left" ? "right" : "left"]: "50%", transform: "translateX(-8px)" }}
                  >
                    <span className="mr-1 opacity-70">0{i + 1}</span>
                    {h.short}
                  </div>
                  <svg width="26" height="34" viewBox="0 0 26 34" className="drop-shadow">
                    <path d="M13 33C13 33 24 20 24 12A11 11 0 1 0 2 12C2 20 13 33 13 33Z" fill={h.color} stroke="white" strokeWidth={2} />
                    <circle cx="13" cy="12" r="4" fill="white" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* attribution */}
          <div className="pointer-events-none absolute bottom-0 right-0 bg-white/70 px-1.5 py-0.5 text-[9px] text-muted">
            © OpenStreetMap · CARTO
          </div>
        </div>

        {/* Study-site legend (matches the map markers) */}
        <div className="flex flex-wrap gap-2.5">
          {HOSPITALS.map((h, i) => (
            <span
              key={CENTRES[i]}
              className="csb-chip flex items-center gap-2 rounded-full border border-hair/60 bg-paper/70 px-4 py-2 text-sm font-semibold text-ink"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: h.color }} />
              {CENTRES[i]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
