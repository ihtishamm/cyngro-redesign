"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { circlePath, polygonPath } from "@/lib/shapes";

// A geometric, stroke-built CYNGRO logotype (in the spirit of neutomni's
// stencil wordmark). Each letter is its own <g data-letter> so it can be
// animated; the "O" is a path that can morph through polygons.

const S = 18; // stroke width in viewBox units
const O_CX = 585;
const O_CY = 50;
const O_R = 41;

const letters = [
  { k: "C", d: "M79 21 A41 41 0 1 0 79 79" },
  { k: "Y", d: "M123 0 L159 50 L195 0 M159 50 L159 100" },
  { k: "N", d: "M227 100 L227 0 L299 100 L299 0" },
  { k: "G", d: "M401 21 A41 41 0 1 0 413 50 L376 50" },
  { k: "R", d: "M445 100 L445 9 L485 9 A22 22 0 0 1 485 53 L445 53 M480 53 L514 100" },
];

// The morph sequence for the "O": circle → triangle → square → … → circle
const O_SEQUENCE = [3, 4, 5, 6, 7, 8];

export default function Wordmark({
  className = "",
  morph = false,
  title = "Cyngro",
}: {
  className?: string;
  morph?: boolean;
  title?: string;
}) {
  const clipId = useId().replace(/:/g, "");
  const oRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!morph || !oRef.current || prefersReducedMotion()) return;
      const o = oRef.current;
      const shapes = O_SEQUENCE.map((n) => polygonPath(n, O_R * 1.12, O_CX, O_CY));
      const origin = `${O_CX} ${O_CY}`;

      // neutomni footer: #shape1 → #shape7 morph + 60° rotation each step, loop
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
      shapes.forEach((shape, i) => {
        tl.to(o, {
          morphSVG: { shape, shapeIndex: "auto" },
          rotation: 60 * (i + 1),
          svgOrigin: origin,
          duration: 1,
          ease: "power2.inOut",
        });
      });
      tl.to(o, {
        morphSVG: { shape: circlePath(O_R, O_CX, O_CY) },
        rotation: 450,
        svgOrigin: origin,
        duration: 1,
        ease: "power2.inOut",
      });
      tl.set(o, { rotation: 0, svgOrigin: origin });

      // Pause when off-screen
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
      if (svgRef.current) io.observe(svgRef.current);
      return () => io.disconnect();
    },
    { dependencies: [morph] },
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 635 100"
      className={`block w-full h-auto overflow-visible ${className}`}
      role="img"
      aria-label={title}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="-20" y="0" width="680" height="100" />
        </clipPath>
      </defs>
      <g
        clipPath={`url(#${clipId})`}
        fill="none"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="miter"
        strokeMiterlimit={10}
      >
        {letters.map((l) => (
          <g key={l.k} data-letter={l.k}>
            <path d={l.d} />
          </g>
        ))}
        <g data-letter="O">
          <path ref={oRef} d={circlePath(O_R, O_CX, O_CY)} />
        </g>
      </g>
    </svg>
  );
}
