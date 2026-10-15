"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, prefersReducedMotion } from "@/lib/gsap";

// Mirrors neutomni's setup: Lenis driven by the GSAP ticker, lerp 0.07 on
// desktop / 0.3 on mobile, ScrollTrigger updated on every Lenis scroll.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const lenis = new Lenis({ lerp: isMobile ? 0.3 : 0.07 });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchor links go through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    // Web fonts change line heights; re-measure every trigger once they land
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
