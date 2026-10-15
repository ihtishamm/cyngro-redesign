"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { stats } from "@/lib/data";
import { RevealText } from "./ui";

const equation = ["Web", "+", "Apps", "+", "ERP", "=", "Growth"];

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) return;

      // Equation tokens pop in one after another
      gsap.from(q("[data-eq]"), {
        opacity: 0,
        y: 12,
        filter: "blur(6px)",
        duration: 0.5,
        stagger: 0.08,
        ease: "power1.out",
        scrollTrigger: { trigger: q("[data-eq-row]")[0], start: "top 85%" },
      });

      // Counters
      q("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: to,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(o.v).toString()),
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // Stat rules draw in
      gsap.from(q("[data-rule]"), {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "power2.inOut",
        stagger: 0.1,
        scrollTrigger: { trigger: q("[data-stats]")[0], start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="gutter relative bg-paper pb-[16vh] pt-[14vh] text-ink">
      <div data-eq-row className="mono flex justify-between text-[11px] text-green-deep md:mx-[10%] md:text-[13px]">
        {equation.map((t, i) => (
          <span key={i} data-eq>
            {t}
          </span>
        ))}
      </div>

      <div className="mt-[14vh] grid grid-cols-12 gap-y-12 md:gap-x-6">
        <RevealText
          as="h2"
          className="col-span-12 text-[clamp(36px,3.9vw,58px)] leading-[1.02] tracking-[-0.02em] md:col-span-6"
        >
          Your software isn&apos;t a cost centre.{" "}
          <span className="it text-green-deep">It&apos;s the engine your whole business runs on.</span>
        </RevealText>

        <div data-stats className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 self-end md:col-span-5 md:col-start-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-[clamp(44px,4.6vw,72px)] font-medium leading-none tracking-[-0.03em]">
                <span data-count={s.value}>{s.value}</span>
                <span className="text-green">{s.suffix}</span>
              </div>
              <div data-rule className="my-3 h-px bg-ink/20" />
              <div className="mono text-[11px] text-text">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-[16vh] grid grid-cols-12 gap-y-10 md:gap-x-6">
        <RevealText as="p" className="col-span-12 max-w-[34ch] text-[15px] leading-[1.35] text-text md:col-span-4">
          With 100+ developers, Cyngro builds powerful digital products — websites, apps, software and ERP — using the
          languages your business runs on. Over 300 projects shipped across 15+ industries.{" "}
          <span className="it text-[1.15em] text-ink">One partner → full stack.</span>
        </RevealText>
        <RevealText
          as="p"
          className="col-span-12 text-[clamp(30px,3.1vw,46px)] leading-[1.06] tracking-[-0.02em] md:col-span-6 md:col-start-7"
        >
          First, we understand where you are <span className="it text-green-deep">→ then we build the clearest path to where you&apos;re going.</span>
        </RevealText>
      </div>
    </section>
  );
}
