"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { contact } from "@/lib/data";
import { circlePath, polygonPath } from "@/lib/shapes";
import { RevealText } from "./ui";

/* Port of neutomni's morph track: a shape rides a dashed track following the
   cursor (hover on desktop, drag on touch). Between checkpoints it morphs
   (diamond → triangle → pentagon → hexagon → octagon → circle) while rotating,
   and every checkpoint crossed leaves a fading outline "trail". */

const SIZE = 220;
const C = SIZE / 2;
const R = 100;
const SHAPES = [
  polygonPath(4, R, C, C, -90),
  polygonPath(3, R, C, C + 12, -90),
  polygonPath(5, R, C, C + 5, -90),
  polygonPath(6, R, C, C, -90),
  polygonPath(8, R, C, C, -90),
  circlePath(R * 0.94, C, C),
];
const CHECKPOINTS = SHAPES.map((d, i) => ({ progress: i / (SHAPES.length - 1), rotation: i * 90, d }));

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const shapeWrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const trackEl = track.current!;
      const wrap = shapeWrap.current!;
      const shape = path.current!;
      const reduced = prefersReducedMotion();

      const tl = gsap.timeline({ paused: true });
      for (let i = 1; i < CHECKPOINTS.length; i++) {
        const prev = CHECKPOINTS[i - 1];
        const cp = CHECKPOINTS[i];
        tl.to(
          shape,
          {
            morphSVG: { shape: cp.d, type: "rotational", origin: "50% 50%" },
            rotation: cp.rotation,
            svgOrigin: `${C} ${C}`,
            duration: cp.progress - prev.progress,
            ease: "none",
          },
          prev.progress,
        );
      }

      let current = 0;
      const size = () => wrap.offsetWidth;
      const leftFor = (p: number) => p * (trackEl.clientWidth - size());
      const xTo = gsap.quickTo(wrap, "x", { duration: reduced ? 0 : 0.35, ease: "power3.out" });

      const spawnTrail = (i: number) => {
        if (reduced) return;
        const cp = CHECKPOINTS[i];
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
        svg.setAttribute("aria-hidden", "true");
        svg.style.cssText = `position:absolute;left:${leftFor(cp.progress)}px;top:0;width:${size()}px;height:${size()}px;transform:rotate(${cp.rotation}deg);pointer-events:none;z-index:0;color:var(--ink)`;
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", cp.d);
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "currentColor");
        p.setAttribute("stroke-width", "1");
        p.setAttribute("vector-effect", "non-scaling-stroke");
        svg.appendChild(p);
        trackEl.appendChild(svg);
        gsap.fromTo(svg, { opacity: 0.9 }, { opacity: 0, duration: 1.4, ease: "power2.out", onComplete: () => svg.remove() });
      };

      const setProgress = (p: number) => {
        const prev = current;
        current = gsap.utils.clamp(0, 1, p);
        tl.progress(current);
        xTo(leftFor(current));
        const up = current > prev;
        CHECKPOINTS.forEach((cp, i) => {
          const s = cp.progress;
          if ((up && prev < s + 0.001 && current >= s + 0.001) || (!up && prev > s - 0.001 && current <= s - 0.001)) spawnTrail(i);
        });
      };

      const fromClientX = (x: number) => {
        const r = trackEl.getBoundingClientRect();
        const half = size() / 2;
        return (gsap.utils.clamp(half, r.width - half, x - r.left) - half) / Math.max(1, r.width - size());
      };

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const section = root.current!;
      const onMove = (e: PointerEvent) => setProgress(fromClientX(e.clientX));

      let dragging = false;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        trackEl.setPointerCapture(e.pointerId);
      };
      const onDrag = (e: PointerEvent) => dragging && setProgress(fromClientX(e.clientX));
      const onUp = () => (dragging = false);

      if (fine) section.addEventListener("pointermove", onMove);
      else {
        trackEl.addEventListener("pointerdown", onDown);
        trackEl.addEventListener("pointermove", onDrag);
        trackEl.addEventListener("pointerup", onUp);
      }
      const onResize = () => gsap.set(wrap, { x: leftFor(current) });
      window.addEventListener("resize", onResize);
      setProgress(0);

      return () => {
        section.removeEventListener("pointermove", onMove);
        trackEl.removeEventListener("pointerdown", onDown);
        trackEl.removeEventListener("pointermove", onDrag);
        trackEl.removeEventListener("pointerup", onUp);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="relative overflow-hidden bg-paper pb-10 pt-[16vh] text-ink">
      <div className="gutter flex flex-col items-center text-center">
        <span className="pill it text-[18px]">Contact</span>
        <RevealText as="h2" className="mt-8 text-[clamp(44px,5.2vw,80px)] leading-[0.98] tracking-[-0.03em]">
          Ready to connect,
          <br />
          automate &amp; <span className="it text-green-deep">grow faster?</span>
        </RevealText>
        <RevealText as="p" className="mt-6 max-w-[40ch] text-[15px] leading-[1.35] text-text">
          Tell us your goals and challenges. We&apos;ll explore your vision, timeline and budget —{" "}
          <span className="it text-[1.15em] text-ink">no obligations</span>, and the first call is on us.
        </RevealText>
      </div>

      <div className="mt-[10vh]">
        <div className="mono gutter mb-2 flex justify-between text-[10px] text-text">
          <span>&lt; move me &gt;</span>
          <span className="hidden sm:inline">Book a free consultation</span>
        </div>
        <div ref={track} className="relative h-[150px] touch-pan-y sm:h-[220px]">
          <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-ink/25" />
          <div ref={shapeWrap} className="absolute left-0 top-0 z-[2] h-[150px] w-[150px] sm:h-[220px] sm:w-[220px]">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <path ref={path} d={SHAPES[0]} fill="var(--green)" />
            </svg>
            <a
              href={`mailto:${contact.email}?subject=Project%20enquiry`}
              className="mono absolute inset-0 z-[3] flex items-center justify-center text-[11px] text-ink sm:text-[12px]"
            >
              [ Let&apos;s talk ]
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
