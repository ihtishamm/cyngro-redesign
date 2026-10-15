"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { contact, services, type Service } from "@/lib/data";
import { barcodeGradient } from "@/lib/shapes";
import { RevealText } from "./ui";

const STUB = 128; // px — height of the tear-off stub
const SPRING = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

const notchMask = (y: "0" | "100%"): CSSProperties => {
  const m = `radial-gradient(circle at 0 ${y}, transparent 11px, #000 11.5px), radial-gradient(circle at 100% ${y}, transparent 11px, #000 11.5px)`;
  return { WebkitMaskImage: m, maskImage: m, WebkitMaskComposite: "source-in", maskComposite: "intersect" };
};

// Torn-paper teeth along the stub's top edge (shown once it rips away)
const TEETH = Array.from({ length: 41 }, (_, i) => `${(i * 100) / 40},${i % 2 ? 0 : 6}`).join(" ");

function Ticket({ s, i }: { s: Service; i: number }) {
  const subject = encodeURIComponent(`Free call — ${s.title.join(" ")}`);
  return (
    <article
      data-ticket
      className="relative flex flex-col text-ink [filter:drop-shadow(0_26px_28px_rgba(11,13,10,0.2))] will-change-transform"
    >
      {/* Ticket body */}
      <div className="relative flex flex-1 flex-col rounded-[14px] bg-paper p-5 pb-7" style={notchMask("100%")}>
        <div className="flex items-start justify-between">
          <h3 className="it text-[30px] leading-[0.95] text-green-deep">
            {s.title[0]}
            <br />
            {s.title[1]}
          </h3>
          <span className="mono rounded-full border border-ink/20 px-2 py-0.5 text-[10px]">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-4 text-[14px] leading-[1.3]">{s.blurb}</p>
        <ul className="mt-auto space-y-1 pt-6 text-[13px]">
          {s.points.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-green" />
              {p}
            </li>
          ))}
        </ul>
        {/* perforation */}
        <div className="absolute inset-x-5 bottom-0 border-t-2 border-dashed border-ink/15" />
      </div>

      {/* Tear-off stub: the static wrapper is the hover target, the inner piece moves */}
      <div className="group/stub relative" style={{ height: STUB }}>
        <div
          className={`absolute inset-0 origin-top-right transition-transform duration-700 ${SPRING} group-hover/stub:translate-x-[-6px] group-hover/stub:translate-y-[14px] group-hover/stub:rotate-[4.5deg] [@media(hover:none)]:transform-none`}
        >
          <svg
            aria-hidden
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            className="absolute inset-x-[14px] -top-[5px] h-[6px] w-[calc(100%-28px)] fill-paper opacity-0 transition-opacity duration-200 group-hover/stub:opacity-100"
          >
            <polygon points={`0,6 ${TEETH} 100,6`} />
          </svg>
          <div className="flex h-full flex-col justify-between rounded-[14px] bg-paper p-5 pt-4" style={notchMask("0")}>
            <div className="mono flex justify-between text-[10px]">
              <span>Service code:</span>
              <span className="text-green-deep">{s.code}</span>
            </div>

            <div className="relative h-11">
              <div
                aria-hidden
                className={`barcode absolute inset-0 transition-[opacity,transform] duration-500 ${SPRING} group-hover/stub:-translate-y-3 group-hover/stub:opacity-0 [@media(hover:none)]:opacity-0`}
                style={{ "--bars": barcodeGradient(s.code, "#0b0d0a") } as CSSProperties}
              />
              <a
                href={`mailto:${contact.email}?subject=${subject}`}
                className={`it absolute inset-0 flex translate-y-3 items-center justify-center gap-2 rounded-[6px] bg-green text-[22px] text-ink opacity-0 transition-[opacity,transform,background-color] duration-500 ${SPRING} hover:bg-ink hover:text-green group-hover/stub:translate-y-0 group-hover/stub:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100`}
              >
                Schedule Free Call <span className="not-italic text-[16px]">↗</span>
              </a>
            </div>

            <div className="mono text-[9px] text-text">{s.footer}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Green bloom grows from the bottom centre and floods the stage
      gsap.fromTo(
        q("[data-bloom]"),
        { scale: 0.25, yPercent: 55 },
        {
          scale: 2.2,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top -60%", scrub: true },
        },
      );

      // Heading blurs back as the tickets pass in front of it
      gsap.to(q("[data-heading]"), {
        filter: "blur(12px)",
        opacity: 0.55,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 95%", end: "top 25%", scrub: true },
      });

      // Tickets fly in tilted, then settle (scrubbed 3D)
      q("[data-ticket]").forEach((t, i) => {
        const side = i % 3 === 0 ? -1 : i % 3 === 2 ? 1 : 0;
        gsap.fromTo(
          t,
          {
            y: 260 + (i % 3) * 60,
            x: side * 120,
            rotateX: 55,
            rotateZ: side * 14 + (i % 2 ? 6 : -6),
            rotateY: side * -25,
            transformPerspective: 1100,
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            x: 0,
            rotateX: 0,
            rotateZ: 0,
            rotateY: 0,
            ease: "power2.out",
            scrollTrigger: { trigger: t, start: "top bottom", end: "top 55%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" data-theme="green" className="relative bg-paper">
      {/* Sticky stage: bloom + heading */}
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <div
          data-bloom
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, #7cc046 0%, #8fcb5e 45%, rgba(170,216,132,0.85) 62%, rgba(214,236,196,0.5) 78%, rgba(255,255,255,0) 100%)",
            filter: "blur(30px)",
          }}
        />
        <div data-heading className="relative px-4 text-center text-ink will-change-[filter]">
          <RevealText as="h2" className="text-[clamp(44px,5.4vw,84px)] leading-[0.98] tracking-[-0.03em]" start="top 70%">
            We keep our focus
            <br />
            on <span className="it">what moves your business</span>
          </RevealText>
        </div>
      </div>

      {/* Tickets scroll up over the stage */}
      <div className="gutter relative -mt-[100svh] pb-[18vh] pt-[120svh]">
        <div className="mb-10 flex justify-center">
          <span className="pill it bg-paper/40 text-[20px] text-ink backdrop-blur-sm">Our services</span>
        </div>
        <div data-grid className="mx-auto grid max-w-[1180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1100 }}>
          {services.map((s, i) => (
            <Ticket key={s.code} s={s} i={i} />
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-[560px] text-center text-[14px] leading-[1.35] text-ink">
          <span className="it text-[1.2em]">Quality is non-negotiable.</span>
          <br />
          Whatever the engagement, every build is responsive, performance-optimised, secure, SEO-ready, accessible and
          built on clean, maintainable architecture.
        </p>
      </div>
    </section>
  );
}
