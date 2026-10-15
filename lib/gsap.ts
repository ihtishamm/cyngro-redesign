"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, useGSAP);
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
}

// Shared Lenis instance (set by <SmoothScroll />)
let lenisRef: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenisRef = l;
};
export const getLenis = () => lenisRef;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The intro finishes before scroll-driven reveals should fire.
export const INTRO_EVENT = "cyngro:intro-done";
let introDone = false;
export const markIntroDone = () => {
  introDone = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
};
export const isIntroDone = () => introDone;

// Fixed-nav visibility/theme, driven by the pinned hero reel.
type NavState = { visible: boolean; dark: boolean };
let navState: NavState = { visible: false, dark: false };
const navSubs = new Set<(s: NavState) => void>();
export const setNavState = (s: Partial<NavState>) => {
  const next = { ...navState, ...s };
  if (next.visible === navState.visible && next.dark === navState.dark) return;
  navState = next;
  navSubs.forEach((f) => f(navState));
};
export const subscribeNav = (f: (s: NavState) => void) => {
  navSubs.add(f);
  f(navState);
  return () => {
    navSubs.delete(f);
  };
};

export { gsap, ScrollTrigger, SplitText, MorphSVGPlugin, useGSAP };
