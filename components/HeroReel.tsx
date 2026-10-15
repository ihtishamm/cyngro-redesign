"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  getLenis,
  markIntroDone,
  prefersReducedMotion,
  setNavState,
} from "@/lib/gsap";
import { contact, navLinks, projects } from "@/lib/data";
import { Logo, LocalTime, ScaledFrame } from "./ui";
import { ProjectMock } from "./Mockups";

/* Hero + showreel as one pinned sequence.

   1. Preloader: green screen, 000 → 100 counter, tagline words light up, then
      the screen wipes up.
   2. Hero: kinetic type — chars rise out of line masks, a live project window
      sits inline in the headline, cursor-following glow, magnetic CTA,
      rotating subhead word.
   3. Scroll: the inline window expands to the full viewport (clip-path +
      counter-scaled content, so the reel is always shown whole), the headline
      lines fly apart, then the reel tracks horizontally through every project
      full-bleed. */

const PANEL_BG: Record<string, string> = {
  erp: "#14213d",
  app: "#0e7c7b",
  fintech: "#0c0a1d",
  saas: "#e9efe3",
};
const ROTATING = ["websites", "mobile apps", "custom software", "Odoo ERP"];

function ReelIntroPanel() {
  const row = [...projects, ...projects];
  return (
    <div className="relative flex h-full w-full flex-none flex-col justify-center gap-[2.5svh] overflow-hidden bg-ink">
      {[0, 1].map((r) => (
        <div
          key={r}
          className={`marquee flex w-max gap-[2.5svh] ${r ? "marquee-rev" : ""}`}
          style={{ ["--marquee-dur" as string]: r ? "46s" : "38s" }}
        >
          {[...row, ...row].map((p, i) => (
            <div
              key={i}
              className="flex-none overflow-hidden rounded-md"
              style={{ width: "calc(36svh * 1.6)" }}
            >
              <ScaledFrame>
                <ProjectMock
                  kind={
                    (r ? [...projects].reverse() : projects)[
                      i % projects.length
                    ].kind
                  }
                />
              </ScaledFrame>
            </div>
          ))}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,13,10,0.7),rgba(11,13,10,0.9))]" />
      <div
        data-reel-title
        className="gutter pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-paper"
      >
        <span className="mono text-[11px] text-green">
          Showreel — selected builds
        </span>
        <p className="mt-4 text-[clamp(40px,6vw,104px)] leading-[0.95] tracking-[-0.04em]">
          300+ products shipped.
          <br />
          <span className="it text-green">Zero templates.</span>
        </p>
      </div>
    </div>
  );
}

function ProjectPanel({ i }: { i: number }) {
  const p = projects[i];
  const light = p.kind === "saas";
  return (
    <div
      className={`gutter relative grid h-full w-full flex-none grid-cols-12 content-center gap-6 overflow-hidden ${light ? "text-ink" : "text-paper"}`}
      style={{ background: PANEL_BG[p.kind] }}
    >
      <div className="col-span-12 self-end md:col-span-4 md:self-center">
        <span className="mono text-[11px] opacity-70">
          {String(i + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")} — {p.role}
        </span>
        <h3 className="it mt-3 text-[clamp(48px,6.4vw,112px)] leading-[0.9] tracking-[-0.02em]">
          {p.client}
        </h3>
        <p className="mt-5 max-w-[36ch] text-[15px] leading-[1.35] opacity-80">
          {p.summary}
        </p>
        <span className="mono mt-6 inline-block text-[10px] opacity-70">
          {p.tags}
        </span>
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="overflow-hidden rounded-lg shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
          <ScaledFrame>
            <ProjectMock kind={p.kind} />
          </ScaledFrame>
        </div>
      </div>
    </div>
  );
}

export default function HeroReel() {
  const root = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = root.current!;
      const frame = q("[data-frame]")[0];
      const content = q("[data-content]")[0];
      const track = q("[data-track]")[0];
      const slot = q("[data-slot]")[0];
      const loader = loaderRef.current!;
      const reduced = prefersReducedMotion();

      // Geometry of the inline slot relative to the stage (transform-proof)
      const slotRect = () => {
        let x = 0,
          y = 0;
        let el: HTMLElement | null = slot;
        while (el && el !== stage) {
          x += el.offsetLeft;
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return { x, y, w: slot.offsetWidth, h: slot.offsetHeight };
      };
      const W = () => stage.clientWidth;
      const H = () => stage.clientHeight;
      const radius = () => Math.min(slot.offsetHeight * 0.14, 18);
      const clipFrom = () => {
        const r = slotRect();
        return `inset(${r.y}px ${W() - r.x - r.w}px ${H() - r.y - r.h}px ${r.x}px round ${radius()}px)`;
      };
      const contentFrom = () => {
        const r = slotRect();
        return {
          x: r.x + r.w / 2 - W() / 2,
          y: r.y + r.h / 2 - H() / 2,
          scale: r.w / W(),
        };
      };

      gsap.set(frame, { clipPath: clipFrom() });
      gsap.set(content, { ...contentFrom(), transformOrigin: "50% 50%" });

      if (reduced) {
        gsap.set(loader, { display: "none" });
        setNavState({ visible: true });
        markIntroDone();
        return;
      }

      /* ── Cursor glow + magnetic CTA ───────────────────────────── */
      const glow = q("[data-glow]")[0];
      const gx = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3.out" });
      const gy = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const b = stage.getBoundingClientRect();
        gx(e.clientX - b.left);
        gy(e.clientY - b.top);
      };
      stage.addEventListener("pointermove", onMove);

      const mag = q("[data-magnetic]")[0] as HTMLElement;
      const mx = gsap.quickTo(mag, "x", { duration: 0.5, ease: "power3.out" });
      const my = gsap.quickTo(mag, "y", { duration: 0.5, ease: "power3.out" });
      const onMag = (e: PointerEvent) => {
        const b = mag.getBoundingClientRect();
        mx((e.clientX - b.left - b.width / 2) * 0.35);
        my((e.clientY - b.top - b.height / 2) * 0.35);
      };
      const offMag = () => {
        gsap.to(mag, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.4)",
        });
      };
      mag.addEventListener("pointermove", onMag);
      mag.addEventListener("pointerleave", offMag);

      /* ── Rotating subhead word ────────────────────────────────── */
      const words = q("[data-word]");
      gsap.set(words, { yPercent: 110 });
      gsap.set(words[0], { yPercent: 0 });
      const rot = gsap.timeline({ repeat: -1, paused: true });
      words.forEach((w, i) => {
        const next = words[(i + 1) % words.length];
        rot
          .to(w, { yPercent: -110, duration: 0.7, ease: "expo.inOut" }, `+=1.6`)
          .fromTo(
            next,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.7,
              ease: "expo.inOut",
              immediateRender: false,
            },
            "<",
          );
      });

      /* ── Preloader → intro ────────────────────────────────────── */
      getLenis()?.stop();
      window.scrollTo(0, 0);
      const splits = q("[data-split]").map((el) =>
        SplitText.create(el, {
          type: "lines,chars",
          mask: "lines",
          linesClass: "split-line",
        }),
      );
      const chars = splits.flatMap((s) => s.chars);
      gsap.set(chars, { yPercent: 115, rotate: 6 });
      gsap.set(q("[data-curtain]"), { scaleX: 1 });
      gsap.set(q("[data-fade]"), { opacity: 0, y: 24 });
      gsap.set(q("[data-zoom]"), { scale: 1.35 });

      const countEl = loader.querySelector<HTMLElement>("[data-count]")!;
      const tagWords = gsap.utils.toArray<HTMLElement>("[data-tag]", loader);
      const proxy = { v: 0 };
      const intro = gsap.timeline();
      intro
        .to(proxy, {
          v: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate() {
            const v = Math.round(proxy.v);
            countEl.textContent = String(v).padStart(3, "0");
            tagWords.forEach(
              (t, i) => (t.style.opacity = v >= (i + 1) * 30 ? "1" : "0.18"),
            );
          },
        })
        .to(
          loader.querySelector("[data-loader-inner]"),
          { yPercent: -12, opacity: 0, duration: 0.6, ease: "power2.in" },
          "+=0.15",
        )
        .to(
          loader,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 1.1,
            ease: "expo.inOut",
          },
          "-=0.25",
        )
        .to(
          chars,
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.025,
          },
          "-=0.55",
        )
        .to(
          q("[data-curtain]"),
          { scaleX: 0, duration: 1.1, ease: "expo.inOut" },
          "-=0.9",
        )
        .to(
          q("[data-zoom]"),
          { scale: 1, duration: 1.6, ease: "expo.out" },
          "<",
        )
        .to(
          q("[data-fade]"),
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=1.1",
        )
        .add(() => {
          gsap.set(loader, { display: "none" });
          getLenis()?.start();
          rot.play();
          markIntroDone();
        });

      /* ── Scroll: expand to full screen, then track the reel ───── */
      const panels = q("[data-panel]").length;
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.addLabel("expand", 0)
        .fromTo(
          frame,
          { clipPath: clipFrom },
          {
            clipPath: "inset(0px 0px 0px 0px round 0px)",
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        )
        .fromTo(
          content,
          {
            x: () => contentFrom().x,
            y: () => contentFrom().y,
            scale: () => contentFrom().scale,
          },
          { x: 0, y: 0, scale: 1, duration: 1, ease: "power2.inOut" },
          0,
        )
        .to(
          q("[data-l1]"),
          { yPercent: -160, opacity: 0, duration: 0.8, ease: "power2.in" },
          0,
        )
        .to(
          q("[data-l3]"),
          { yPercent: 160, opacity: 0, duration: 0.8, ease: "power2.in" },
          0,
        )
        .to(
          q("[data-l2]"),
          { xPercent: -60, opacity: 0, duration: 0.8, ease: "power2.in" },
          0,
        )
        .to(q("[data-chrome]"), { opacity: 0, duration: 0.35 }, 0)
        .fromTo(
          q("[data-reel-title]"),
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4 },
          0.75,
        )
        .addLabel("full", 1.15)
        .to(
          q("[data-reel-title]"),
          { opacity: 0, y: -40, duration: 0.3 },
          "full",
        )
        .to(
          track,
          { x: () => -(panels - 1) * W(), duration: (panels - 1) * 0.9 },
          "full+=0.1",
        )
        .to({}, { duration: 0.25 });

      const fullAt = tl.labels.full / tl.duration();
      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + H() * (tl.duration() * 0.95),
        pin: true,
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate(self) {
          setNavState({ visible: self.progress > fullAt * 0.85, dark: true });
        },
        onLeave: () => setNavState({ visible: true, dark: false }),
        onEnterBack: () => setNavState({ visible: true, dark: true }),
        onLeaveBack: () => setNavState({ visible: false, dark: false }),
      });

      return () => {
        stage.removeEventListener("pointermove", onMove);
        mag.removeEventListener("pointermove", onMag);
        mag.removeEventListener("pointerleave", offMag);
        splits.forEach((s) => s.revert());
        rot.kill();
      };
    },
    { scope: root },
  );

  return (
    <>
      {/* Preloader */}
      <div
        ref={loaderRef}
        data-loader
        className="fixed inset-0 z-[90] bg-green text-ink"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div
          data-loader-inner
          className="gutter flex h-full flex-col justify-between py-5"
        >
          <div className="flex items-center justify-between">
            <Logo />
            <span className="mono text-[11px]">{contact.email}</span>
          </div>
          <div className="text-[clamp(36px,5.4vw,96px)] font-medium leading-[0.95] tracking-[-0.04em]">
            <span
              data-tag
              className="block opacity-20 transition-opacity duration-300"
            >
              Connect.
            </span>
            <span
              data-tag
              className="block opacity-20 transition-opacity duration-300"
            >
              Automate.
            </span>
            <span
              data-tag
              className="it block opacity-20 transition-opacity duration-300"
            >
              Grow faster.
            </span>
          </div>
          <div className="flex items-end justify-between">
            <span className="mono pb-[2vw] text-[11px]">
              Loading experience
            </span>
            <span
              data-count
              className="text-[clamp(96px,22vw,380px)] font-medium leading-[0.78] tracking-[-0.06em] tabular-nums"
            >
              000
            </span>
          </div>
        </div>
      </div>
      <section
        ref={root}
        id="top"
        className="relative h-svh overflow-hidden bg-paper text-ink"
      >
        {/* Cursor glow */}
        <div
          data-glow
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-[44vmax] w-[44vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(124,192,70,0.55), rgba(124,192,70,0))",
          }}
        />
        {/* Fine grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,rgba(11,13,10,0.06)_1px,transparent_1px)] [background-size:calc(100%/12)_100%]"
        />

        {/* Top bar */}
        <div
          data-chrome
          className="gutter absolute inset-x-0 top-0 z-30 flex items-center justify-between py-5"
        >
          <a
            data-fade
            href="#top"
            aria-label="Cyngro home"
            className="text-[16px]"
          >
            <Logo />
          </a>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 text-[14px] md:flex"
          >
            {navLinks.map((l) => (
              <a
                data-fade
                key={l.href}
                href={l.href}
                className="group relative"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-out)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <span data-fade>
            <a
              data-magnetic
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] text-paper transition-colors hover:bg-green hover:text-ink"
            >
              Schedule a call <span aria-hidden>↗</span>
            </a>
          </span>
        </div>

        {/* Headline */}
        <h1 className="gutter absolute inset-0 z-20 flex flex-col justify-center pb-[6svh] text-[clamp(56px,15.5vw,120px)] font-medium leading-[0.9] tracking-[-0.055em] md:text-[clamp(64px,10.8vw,230px)]">
          <span data-l1 className="block md:flex md:items-start md:justify-between">
            <span data-split className="inline-block">
              Connect.
            </span>
            <span
              data-fade
              className="hidden pt-[0.5em] text-[14px] font-normal leading-[1.45] tracking-normal md:grid md:grid-cols-[auto_auto] md:gap-x-10"
            >
              <span className="mono text-[10px] text-text">(What we build)</span>
              <span className="flex flex-col">
                {["Websites", "Mobile apps", "Custom software", "Odoo ERP", "Cloud & DevOps"].map((w, i) => (
                  <span key={w} className="flex gap-3">
                    <span className="mono pt-[3px] text-[10px] text-green-deep">{String(i + 1).padStart(2, "0")}</span>
                    {w}
                  </span>
                ))}
              </span>
            </span>
          </span>
          <span
            data-l2
            className="block md:flex md:items-center md:gap-[0.18em]"
          >
            <span data-split className="inline-block">
              Automate.
            </span>
            <a
              href="#work"
              aria-label="Watch the showreel"
              data-slot
              className="relative mt-3 block h-[26svh] w-full overflow-hidden rounded-[10px] md:mt-0 md:inline-block md:h-[0.74em] md:w-[2.35em] md:translate-y-[0.04em] md:rounded-[0.09em]"
            >
              <span
                data-curtain
                className="absolute inset-0 z-10 origin-right bg-green"
              />
              <span className="mono absolute bottom-2 right-2 z-[5] rounded-full bg-paper/90 px-2 py-0.5 text-[9px] font-normal tracking-normal text-ink">
                ▶ Reel
              </span>
            </a>
          </span>
          <span data-l3 className="block text-right">
            <span data-split className="inline-block">
              Grow{" "}
              <span className="it pr-[0.06em] text-green-deep">faster.</span>
            </span>
          </span>
        </h1>

        {/* Bottom row */}
        <div
          data-chrome
          className="gutter absolute inset-x-0 bottom-0 z-30 grid grid-cols-12 items-end gap-4 pb-5"
        >
          <p
            data-fade
            className="col-span-12 max-w-[36ch] text-[15px] leading-[1.3] md:col-span-4"
          >
            A UK tech partner for businesses that want to scale smarter — building{" "}
            <span className="relative inline-grid overflow-hidden align-bottom">
              {ROTATING.map((w) => (
                <span
                  data-word
                  key={w}
                  className="it col-start-1 row-start-1 whitespace-nowrap text-[1.2em] text-green-deep"
                >
                  {w}
                </span>
              ))}
            </span>
          </p>
          <div data-fade className="col-span-6 md:col-span-2 md:col-start-7">
            <LocalTime />
          </div>
          <div
            data-fade
            className="col-span-6 flex items-center justify-end gap-3 md:col-span-3 md:col-start-10"
          >
            <span className="mono text-[11px]">Scroll to explore</span>
            <span className="relative h-10 w-px overflow-hidden bg-ink/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-ink" />
            </span>
          </div>
        </div>

        {/* The expanding window (sits under the headline, above the page) */}
        <div
          data-frame
          className="absolute inset-0 z-10 overflow-hidden bg-ink will-change-[clip-path]"
        >
          <div data-content className="absolute inset-0 will-change-transform">
            <div data-zoom className="h-full w-full">
              <div
                data-track
                className="flex h-full w-full will-change-transform"
              >
                <div data-panel className="h-full w-full flex-none">
                  <ReelIntroPanel />
                </div>
                {projects.map((p, i) => (
                  <div
                    data-panel
                    key={p.id}
                    className="h-full w-full flex-none"
                  >
                    <ProjectPanel i={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
