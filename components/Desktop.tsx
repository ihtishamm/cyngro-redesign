"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { awards, industries, pillars, projects, technologies } from "@/lib/data";
import { LogoMark } from "./ui";

/* neutomni's "desktop" band: draggable OS-style windows (FAQ.md,
   Testimonials, team cards…) that come to front on grab and open/close from
   desktop icons. */

type WinId = "testimonials" | "awards" | "industries" | "why" | "stack";

type Pos = { left: string; top: string; width: number; maxH: string };

const WINDOWS: { id: WinId; title: string; icon: string; pos: Pos }[] = [
  { id: "testimonials", title: "Testimonials.txt", icon: "txt", pos: { left: "3%", top: "5%", width: 540, maxH: "40svh" } },
  { id: "industries", title: "Industries.md", icon: "md", pos: { left: "60%", top: "4%", width: 360, maxH: "44svh" } },
  { id: "awards", title: "Awards/", icon: "dir", pos: { left: "33%", top: "33%", width: 440, maxH: "50svh" } },
  { id: "why", title: "Why-Cyngro.md", icon: "md", pos: { left: "7%", top: "58%", width: 400, maxH: "28svh" } },
  { id: "stack", title: "stack.json", icon: "json", pos: { left: "66%", top: "60%", width: 320, maxH: "28svh" } },
];

let topZ = 10;

function Win({
  id,
  title,
  pos,
  open,
  onClose,
  children,
}: {
  id: WinId;
  title: string;
  pos: Pos;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const front = () => {
    if (ref.current) ref.current.style.zIndex = String(++topZ);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const el = ref.current;
    if (!el || window.innerWidth < 992) return;
    front();
    const area = el.parentElement!.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY, l: el.offsetLeft, t: el.offsetTop };
    el.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
    const move = (ev: PointerEvent) => {
      const l = gsap.utils.clamp(0, area.width - el.offsetWidth, start.l + ev.clientX - start.x);
      const t = gsap.utils.clamp(0, area.height - el.offsetHeight, start.t + ev.clientY - start.y);
      el.style.left = l + "px";
      el.style.top = t + "px";
    };
    const up = () => {
      document.body.style.userSelect = "";
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  useEffect(() => {
    if (open) front();
  }, [open]);

  return (
    <div
      ref={ref}
      data-win={id}
      onPointerDown={front}
      className="relative mb-4 w-full transition-[opacity,transform] duration-300 ease-[var(--ease-out)] lg:absolute lg:mb-0"
      style={{
        left: pos.left,
        top: pos.top,
        maxWidth: pos.width,
        opacity: open ? 1 : 0,
        transform: open ? "scale(1)" : "scale(0.4)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div data-win-inner className="overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-[0_24px_60px_-24px_rgba(11,13,10,0.35)]">
      <div
        onPointerDown={onPointerDown}
        className="flex cursor-default items-center gap-2 border-b border-ink/10 bg-mist px-3 py-2 lg:cursor-grab lg:active:cursor-grabbing"
      >
        <button aria-label={`Close ${title}`} onClick={onClose} className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-green" />
        <span className="mono ml-2 flex-1 text-center text-[11px] normal-case">{title}</span>
        <span className="mono hidden text-[9px] text-text lg:inline">drag</span>
      </div>
      <div className="max-h-[60svh] overflow-auto lg:max-h-[var(--win-max)]" style={{ "--win-max": pos.maxH } as React.CSSProperties} data-lenis-prevent>
        {children}
      </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const people = projects.slice(0, 3);
  const [active, setActive] = useState(0);
  const p = people[active];
  return (
    <div className="grid grid-cols-[150px_1fr] text-[14px]">
      <ul className="border-r border-ink/10 p-2">
        {people.map((x, i) => (
          <li key={x.id}>
            <button
              onClick={() => setActive(i)}
              className={`w-full rounded-md px-2 py-2 text-left leading-tight ${i === active ? "bg-green text-ink" : "hover:bg-mist"}`}
            >
              {x.person.split(",")[0]}
              <span className="block text-[11px] opacity-70">{x.client}</span>
            </button>
          </li>
        ))}
      </ul>
      <figure className="p-5">
        <blockquote className="it text-[21px] leading-[1.15]">“{p.quote}”</blockquote>
        <figcaption className="mono mt-4 text-[10px] text-text">
          {p.person} — {p.client}
        </figcaption>
      </figure>
    </div>
  );
}

function Awards() {
  return (
    <div className="p-4">
      <p className="mb-3 text-[13px] text-text">130+ awards and accolades. A few from the trophy cabinet:</p>
      <div className="grid grid-cols-2 gap-3">
        {awards.map((a) => (
          <div key={a.title} className="rounded-lg bg-mist p-3">
            <svg viewBox="0 0 40 40" className="mb-2 h-8 w-8" aria-hidden>
              <path d="M12 6h16v8a8 8 0 0 1-16 0z" fill="var(--green)" />
              <path d="M12 9H6a6 6 0 0 0 6 7M28 9h6a6 6 0 0 1-6 7" fill="none" stroke="var(--ink)" strokeWidth="2" />
              <path d="M20 22v6M14 34h12l-2-6h-8z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="2" />
            </svg>
            <div className="text-[13px] leading-tight">{a.title}</div>
            <div className="mono mt-1 text-[9px] text-text">
              {a.by} · {a.year}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Code({ lines }: { lines: ReactNode[] }) {
  return (
    <ol className="mono py-3 text-[11.5px] normal-case leading-[1.7] tracking-normal">
      {lines.map((l, i) => (
        <li key={i} className="grid grid-cols-[34px_1fr] pr-4">
          <span className="select-none pr-3 text-right text-ink/30">{i + 1}</span>
          <span>{l}</span>
        </li>
      ))}
    </ol>
  );
}

function Industries() {
  return (
    <Code
      lines={[
        <span key="h" className="text-green-deep"># Industries we serve</span>,
        "",
        "300+ projects across 15+ industries,",
        "21+ businesses integrated and 500+",
        "third-party integrations.",
        "",
        "---",
        ...industries.map((x) => `- ${x}`),
      ]}
    />
  );
}

function Why() {
  return (
    <Code
      lines={pillars.flatMap((p, i) => [
        <span key={p.title} className="text-green-deep"># {p.title}</span>,
        p.body,
        ...(i < pillars.length - 1 ? ["", "---", ""] : []),
      ])}
    />
  );
}

function Stack() {
  return (
    <Code
      lines={[
        "{",
        <span key="a">
          &nbsp;&nbsp;<span className="text-green-deep">&quot;stacks&quot;</span>: <span>15</span>,
        </span>,
        <span key="b">
          &nbsp;&nbsp;<span className="text-green-deep">&quot;engineers&quot;</span>: &quot;100+&quot;,
        </span>,
        <span key="c">
          &nbsp;&nbsp;<span className="text-green-deep">&quot;technologies&quot;</span>: [
        </span>,
        ...technologies.map((t, i) => (
          <span key={t}>
            &nbsp;&nbsp;&nbsp;&nbsp;&quot;{t}&quot;{i < technologies.length - 1 ? "," : ""}
          </span>
        )),
        "  ]",
        "}",
      ]}
    />
  );
}

const CONTENT: Record<WinId, () => ReactNode> = {
  testimonials: Testimonials,
  awards: Awards,
  industries: Industries,
  why: Why,
  stack: Stack,
};

function Icon({ kind }: { kind: string }) {
  if (kind === "dir")
    return (
      <svg viewBox="0 0 48 40" className="h-10 w-12" aria-hidden>
        <path d="M2 6a3 3 0 0 1 3-3h12l4 5h22a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="var(--green)" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 48" className="h-12 w-10" aria-hidden>
      <path d="M4 2h22l10 10v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="var(--ink)" strokeOpacity=".2" />
      <path d="M26 2v10h10" fill="none" stroke="var(--ink)" strokeOpacity=".2" />
      <text x="20" y="36" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--green-deep)">
        {kind.toUpperCase()}
      </text>
    </svg>
  );
}

function Clock() {
  const [d, setD] = useState<Date | null>(null);
  useEffect(() => {
    const first = setTimeout(() => setD(new Date()), 0);
    const id = setInterval(() => setD(new Date()), 15000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  if (!d) return null;
  return (
    <span className="flex gap-3">
      <span>{d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
      <span>{d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
    </span>
  );
}

export default function Desktop() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Record<WinId, boolean>>({
    testimonials: true,
    awards: true,
    industries: true,
    why: true,
    stack: true,
  });

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-win-inner]"), {
        y: 60,
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Studio desktop"
      className="relative bg-mist text-ink lg:overflow-hidden [background-image:radial-gradient(rgba(11,13,10,0.08)_1px,transparent_1px)] [background-size:22px_22px]"
    >
      {/* Menu bar */}
      <div className="gutter mono relative z-[2] flex h-9 items-center justify-between border-b border-ink/10 bg-paper/80 text-[11px] backdrop-blur">
        <span className="flex items-center gap-4">
          <LogoMark className="h-4 w-4" />
          <span className="font-medium">Cyngro</span>
          <span className="hidden text-text sm:inline">File</span>
          <span className="hidden text-text sm:inline">Edit</span>
          <span className="hidden text-text sm:inline">View</span>
        </span>
        <Clock />
      </div>

      <div className="gutter relative flex flex-col gap-0 py-10 lg:block lg:h-[100svh] lg:py-0">
        <div className="relative lg:absolute lg:inset-y-6 lg:left-[var(--gutter)] lg:right-[140px]">
          {WINDOWS.map((w) => {
            const C = CONTENT[w.id];
            return (
                <Win
                  key={w.id}
                  id={w.id}
                  title={w.title}
                  pos={w.pos}
                  open={open[w.id]}
                  onClose={() => setOpen((o) => ({ ...o, [w.id]: false }))}
                >
                  <C />
                </Win>
            );
          })}
        </div>

        {/* Desktop icons */}
        <ul className="hidden flex-col items-center gap-6 lg:absolute lg:right-[var(--gutter)] lg:top-8 lg:flex">
          {WINDOWS.map((w) => (
            <li key={w.id}>
              <button
                onClick={() => setOpen((o) => ({ ...o, [w.id]: !o[w.id] }))}
                className="flex w-24 flex-col items-center gap-1 rounded-md p-2 text-center hover:bg-ink/5"
                aria-pressed={open[w.id]}
              >
                <Icon kind={w.icon} />
                <span className="mono text-[9px] normal-case">{w.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
