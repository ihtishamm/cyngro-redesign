"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { contact } from "@/lib/data";

/* ── Cyngro burst mark ─────────────────────────────────────────── */
export function LogoMark({ className = "", accent = "var(--ink)" }: { className?: string; accent?: string }) {
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {rays.map((deg) => (
        <rect
          key={deg}
          x="44"
          y="4"
          width="12"
          height="22"
          rx="1"
          fill={deg === 45 ? accent : "var(--green)"}
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill={accent} />
    </svg>
  );
}

export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-[1.6em] w-[1.6em]" accent={dark ? "#fff" : "var(--ink)"} />
      <span className="font-bold tracking-[-0.03em] text-[1.35em] leading-none">Cyngro</span>
    </span>
  );
}

/* ── Live London clock ("local time" in neutomni's hero/footer) ─── */
export function LocalTime({ className = "" }: { className?: string }) {
  const [text, setText] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: contact.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "shortOffset",
    });
    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      const tz = get("timeZoneName").replace("UTC", "GMT") || "GMT";
      setText(`${get("hour")}:${get("minute")}:${get("second")} (${tz})`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`mono text-[11px] leading-tight ${className}`}>
      London time
      <br />
      <span suppressHydrationWarning>{text}</span>
    </span>
  );
}

/* ── Blur line reveal (neutomni [data-reveal="blur"]) ───────────────
   SplitText lines: opacity 0 / blur(10px) / y 15 → 0, stagger .12 on
   ScrollTrigger "top 85%". */
export function RevealText({
  as = "div",
  children,
  className = "",
  start = "top 85%",
  delay = 0,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  start?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const split = SplitText.create(ref.current, {
        type: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.lines,
            { opacity: 0, filter: "blur(10px)", y: 15 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 0.6,
              delay,
              ease: "power1.out",
              stagger: 0.12,
              scrollTrigger: { trigger: ref.current, start, toggleActions: "play none none none" },
            },
          );
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );
  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ── Fixed-size design canvas scaled to its container ───────────── */
export function ScaledFrame({
  width = 1200,
  height = 750,
  children,
  className = "",
}: {
  width?: number;
  height?: number;
  children: ReactNode;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useIsoLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / width));
    ro.observe(el);
    setScale(el.clientWidth / width);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div
      ref={outer}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
