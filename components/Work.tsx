"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, getLenis } from "@/lib/gsap";
import { projects, type Project } from "@/lib/data";
import { RevealText, ScaledFrame } from "./ui";
import { ProjectMock } from "./Mockups";

/* Selected Work — neutomni's portfolio scroll, full-bleed.
   Left half: title + project list. Right half (edge to edge, full height):
   the intro text sits there until the first project wipes in. Each project is
   revealed by a clip-path polygon growing out of the bottom-right corner; the
   device inside drifts with parallax while the previous stage zooms back, the
   list item lights up and underlines, and scrolling snaps to the
   nearest project. */

const DIM = 0.28;
const HIDDEN = "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)";
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const SNAP_FORWARD_AT = 0.1;
const SNAP_BACK_AT = 0.9;
const SNAP_DELAY = 110;

const STAGE: Record<Project["kind"], { bg: string; ink: string; outline: string }> = {
  erp: { bg: "#e6e9ef", ink: "#14213d", outline: "rgba(20,33,61,0.22)" },
  app: { bg: "#d6eeec", ink: "#0e5f5e", outline: "rgba(14,124,123,0.25)" },
  fintech: { bg: "#17142b", ink: "#c6f432", outline: "rgba(198,244,50,0.22)" },
  saas: { bg: "#e9efe3", ink: "#3e7a1e", outline: "rgba(62,122,30,0.25)" },
};

function Stage({ p, i }: { p: Project; i: number }) {
  const s = STAGE[p.kind];
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: s.bg }}>
      {/* Outline display type behind the device */}
      <div
        data-outline
        aria-hidden
        className="pointer-events-none absolute -left-[4%] bottom-[4%] whitespace-nowrap text-[clamp(80px,11vw,220px)] font-semibold uppercase leading-[0.85] tracking-[-0.04em] text-transparent"
        style={{ WebkitTextStroke: `1.5px ${s.outline}` }}
      >
        {p.client}
        <br />
        {p.role.split(" ")[0]}
      </div>
      {/* Soft light */}
      <div
        aria-hidden
        className="absolute -right-[20%] -top-[30%] h-[80%] w-[80%] rounded-full opacity-60 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${s.outline}, transparent)` }}
      />
      {/* Device */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div data-device className="w-[76%] will-change-transform">
          <div className="rounded-[clamp(16px,1.8vw,30px)] bg-[#0b0d0a] p-[1.3%] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.55)]">
            <div className="overflow-hidden rounded-[clamp(10px,1.1vw,18px)]">
              <ScaledFrame>
                <ProjectMock kind={p.kind} />
              </ScaledFrame>
            </div>
          </div>
        </div>
      </div>
      <span
        className="mono absolute right-[var(--gutter)] top-[var(--gutter)] text-[10px]"
        style={{ color: s.ink }}
      >
        {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
      </span>
    </div>
  );
}

function Intro({ big = false }: { big?: boolean }) {
  return (
    <div data-intro className={big ? "max-w-[30ch]" : ""}>
      <RevealText
        as="p"
        className={
          big
            ? "text-[clamp(28px,2.6vw,46px)] leading-[1.08] tracking-[-0.02em]"
            : "max-w-[36ch] text-[15px] leading-[1.35] text-text"
        }
      >
        Engineered for reliability, delivered with care —{" "}
        <span className="it text-green-deep">for teams who want technology that simply works.</span>
      </RevealText>
      {big && (
        <div className="mono mt-8 flex items-center gap-3 text-[10px] text-text">
          <span className="inline-block h-px w-10 bg-ink/30" />
          {projects.length ? `${String(projects.length).padStart(2, "0")} selected projects — keep scrolling` : "New case studies coming soon"}
        </div>
      )}
    </div>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const hasProjects = projects.length > 0;

  useGSAP(
    () => {
      if (!hasProjects) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const pinEl = q("[data-pin]")[0];
        const items = q("[data-item]");
        const bars = q("[data-bar]");
        const masks = q("[data-mask]");
        const stages = q("[data-stage]");
        const devices = q("[data-device]");
        const outlines = q("[data-outline]");
        const intro = q("[data-intro-wrap]")[0];

        gsap.set(items, { opacity: DIM });
        gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(masks, { clipPath: HIDDEN });
        gsap.set(stages, { scale: 1.12, transformOrigin: "50% 50%", force3D: true });
        gsap.set(devices, { yPercent: 14, rotate: -2 });
        gsap.set(outlines, { xPercent: 12 });

        const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.inOut" } });
        const reveal = (i: number, at: number) => {
          tl.to(masks[i], { clipPath: FULL }, at)
            .to(stages[i], { scale: 1, ease: "power2.out" }, at)
            .to(devices[i], { yPercent: 0, rotate: 0, duration: 1.1, ease: "power2.out" }, at + 0.05)
            .to(outlines[i], { xPercent: 0, duration: 1.4, ease: "power2.out" }, at)
            .to(items[i], { opacity: 1, duration: 0.4, ease: "none" }, at + 0.2)
            .to(bars[i], { scaleX: 1, duration: 0.7 }, at + 0.25);
          if (i > 0) {
            tl.to(stages[i - 1], { scale: 1.12, ease: "power2.in" }, at)
              .to(devices[i - 1], { yPercent: -10, duration: 1, ease: "power2.in" }, at)
              .to(items[i - 1], { opacity: DIM, duration: 0.4, ease: "none" }, at)
              .to(bars[i - 1], { scaleX: 0, transformOrigin: "right center", duration: 0.5 }, at);
          }
        };

        // Intro text on the right fades back as the first project wipes in
        tl.addLabel("top", 0).to(intro, { opacity: 0, filter: "blur(8px)", y: -30, duration: 0.7, ease: "power2.in" }, 0.15);
        masks.forEach((_, i) => {
          reveal(i, i * 1.25);
          tl.addLabel("s" + i, i * 1.25 + 1.15);
        });
        tl.to({}, { duration: 0.15 });

        const dur = tl.duration();
        const labels = Array.from(new Set(Object.values(tl.labels).map((t) => t / dur))).sort((a, b) => a - b);
        const revealEase = gsap.parseEase("power3.inOut");
        const pickLabel = (p: number, dir: number) => {
          p = gsap.utils.clamp(0, 1, p);
          for (let i = 0; i < labels.length - 1; i++) {
            const lower = labels[i];
            const upper = labels[i + 1];
            if (p > upper) continue;
            const revealed = revealEase(gsap.utils.clamp(0, 1, (p - lower) / (upper - lower)));
            const threshold = dir > 0 ? SNAP_FORWARD_AT : dir < 0 ? SNAP_BACK_AT : 0.5;
            return revealed >= threshold ? upper : lower;
          }
          return labels[labels.length - 1];
        };

        const st = ScrollTrigger.create({
          id: "portfolio-scroll",
          animation: tl,
          trigger: root.current,
          start: "top top",
          end: () => "+=" + Math.round(dur * 0.85 * window.innerHeight),
          pin: pinEl,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 0.6,
        });

        // Snap to the nearest project once input stops (Lenis-aware)
        const lenis = getLenis();
        if (!lenis) return;
        let dir = 0;
        let lastY = st.scroll();
        let timer: ReturnType<typeof setTimeout> | undefined;
        let touching = false;
        const trySnap = () => {
          if (touching || lenis.isStopped) return;
          const range = st.end - st.start;
          const y = lenis.isScrolling === "smooth" ? lenis.targetScroll : st.scroll();
          if (range <= 0 || y < st.start || y > st.end) return;
          const target = Math.round(st.start + range * pickLabel((y - st.start) / range, dir));
          if (Math.abs(target - y) < 2) return;
          lenis.scrollTo(target, { duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) });
        };
        const queue = () => {
          clearTimeout(timer);
          timer = setTimeout(trySnap, SNAP_DELAY);
        };
        const onScroll = () => {
          const y = st.scroll();
          if (y !== lastY) {
            dir = y > lastY ? 1 : -1;
            lastY = y;
          }
          queue();
        };
        const onWheel = (e: WheelEvent) => {
          if (e.ctrlKey) return;
          if (e.deltaY) dir = e.deltaY > 0 ? 1 : -1;
          queue();
        };
        const onTouchStart = () => {
          touching = true;
          clearTimeout(timer);
        };
        const onTouchEnd = () => {
          touching = false;
          queue();
        };
        const off = lenis.on("scroll", onScroll);
        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        return () => {
          clearTimeout(timer);
          off();
          window.removeEventListener("wheel", onWheel);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchend", onTouchEnd);
        };
      });
    },
    { scope: root },
  );

  const title = (
    <h2 className="text-[clamp(64px,8.4vw,150px)] leading-[0.86] tracking-[-0.045em]">
      Selected
      <br />
      <span className="it pl-[0.06em] text-green-deep">Work</span>
    </h2>
  );

  /* No projects yet: title left, intro text right — no pinning */
  if (!hasProjects) {
    return (
      <section ref={root} id="work" className="gutter grid min-h-[70svh] grid-cols-1 items-center gap-10 bg-paper py-[14vh] text-ink lg:grid-cols-2">
        {title}
        <Intro big />
      </section>
    );
  }

  return (
    <section ref={root} id="work" className="relative bg-paper text-ink">
      {/* ── Desktop: pinned split screen ─────────────────────────── */}
      <div
        data-pin
        className="relative hidden h-svh grid-cols-[45fr_55fr] lg:grid motion-reduce:lg:hidden"
      >
        {/* Left */}
        <div className="gutter flex flex-col justify-between pb-[var(--gutter)] pt-[calc(var(--gutter)+56px)]">
          {title}
          <ol>
            {projects.map((p, i) => (
              <li key={p.id} data-item className="relative border-b border-ink/20">
                <span data-bar className="absolute -bottom-px left-0 h-px w-full bg-ink" />
                <div className="flex items-baseline gap-4 py-5">
                  <span className="mono text-[11px]">{String(i + 1).padStart(2, "0")}.</span>
                  <span className="it text-[clamp(26px,2.3vw,40px)] leading-none">{p.client}</span>
                  <span className="mono ml-auto text-[10px]">{p.tags}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Right: full-bleed stage */}
        <div className="relative h-full overflow-hidden bg-mist">
          <div data-intro-wrap className="absolute inset-0 flex items-center px-[8%]">
            <Intro big />
          </div>
          {projects.map((p, i) => (
            <div key={p.id} data-mask className="absolute inset-0 overflow-hidden will-change-[clip-path]">
              <div data-stage className="h-full w-full will-change-transform">
                <Stage p={p} i={i} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile / tablet / reduced motion: stacked ─────────────── */}
      <div className="gutter py-[12vh] lg:hidden motion-reduce:lg:block">
        <div className="flex flex-col gap-8">
          {title}
          <Intro />
        </div>
        <div className="mt-12 flex flex-col gap-14 motion-reduce:lg:grid motion-reduce:lg:grid-cols-2">
          {projects.map((p, i) => (
            <article key={p.id}>
              <div className="aspect-[4/3.2] overflow-hidden">
                <Stage p={p} i={i} />
              </div>
              <div className="mt-4 flex items-baseline gap-3 border-b border-ink/25 pb-3">
                <span className="mono text-[11px]">{String(i + 1).padStart(2, "0")}.</span>
                <h3 className="it text-[28px] leading-none">{p.client}</h3>
                <span className="mono ml-auto text-right text-[10px]">{p.tags}</span>
              </div>
              <p className="mt-3 text-[15px] leading-[1.35]">{p.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
