"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, getLenis, subscribeNav } from "@/lib/gsap";
import { contact, navLinks } from "@/lib/data";
import { Logo } from "./ui";

// Compact bar that drops in once the hero's own nav has scrolled away, and
// flips to light text over dark sections (neutomni's updateNavColorFromSections).
export default function Nav() {
  const bar = useRef<HTMLDivElement>(null);
  const [sectionDark, setSectionDark] = useState(false);
  const [heroDark, setHeroDark] = useState(false);
  const [open, setOpen] = useState(false);
  const dark = sectionDark || heroDark;

  useGSAP(() => {
    const el = bar.current!;
    gsap.set(el, { yPercent: -120 });
    let shown = false;
    const unsub = subscribeNav(({ visible, dark }) => {
      setHeroDark(dark);
      if (visible === shown) return;
      shown = visible;
      gsap.to(el, visible ? { yPercent: 0, duration: 0.5, ease: "power3.out" } : { yPercent: -120, duration: 0.4, ease: "power2.in" });
    });
    document.querySelectorAll<HTMLElement>('[data-theme="dark"]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => setSectionDark(self.isActive),
      });
    });
    return unsub;
  });

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <div
        ref={bar}
        className={`gutter fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between transition-colors duration-300 ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 backdrop-blur-md transition-colors duration-300 ${dark ? "bg-ink/60" : "bg-paper/75"}`}
        />
        <a href="#top" aria-label="Cyngro home" className="text-[15px]">
          <Logo dark={dark} />
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-6 text-[14px] md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-opacity hover:opacity-60">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="rounded-full bg-green px-4 py-1.5 text-ink transition-transform hover:scale-105">
            Schedule a call
          </a>
        </nav>
        <button
          className="mono text-[11px] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`gutter fixed inset-0 z-[60] flex flex-col bg-green pb-8 pt-4 text-ink transition-[clip-path] duration-500 ease-[var(--ease-out)] md:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button className="mono text-[11px]" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-16 flex flex-col gap-2">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[44px] leading-[1.05] tracking-[-0.03em]">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={`mailto:${contact.email}`} className="it mt-auto text-[24px]">
          {contact.email}
        </a>
      </div>
    </>
  );
}
