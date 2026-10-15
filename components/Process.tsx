"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { process } from "@/lib/data";

/* Rolling-polygon process section.
   Port of neutomni's #pw-canvas script: a regular polygon rolls along a road of
   catenary arches (the only road a square wheel rolls smoothly on). As it
   travels it gains sides (4 → 12) and finally becomes a circle, while the road
   flattens. Cards rise underneath; the drawing is clipped to the cards. */

const N_MIN = 4;
const N_MAX = 12;
const PHASE2 = 0.3;
const SMOOTHING = 0.2;
const STOP_EPSILON = 0.0005;
const SCROLL_OFFSET = 0.12;
const CARD_START = [64, 50, 38, 27, 18]; // initial card heights (%)

const easeInOut = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const idealCache: Record<number, Float64Array> = {};
function idealVerts(n: number, r: number) {
  let base = idealCache[n];
  if (!base) {
    base = new Float64Array(n * 2);
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + (2 * Math.PI * i) / n;
      base[i * 2] = Math.cos(a);
      base[i * 2 + 1] = Math.sin(a);
    }
    idealCache[n] = base;
  }
  const v = new Float64Array(n * 2);
  for (let i = 0; i < n * 2; i++) v[i] = base[i] * r;
  return v;
}

function alignedIdealVerts(n: number, r: number, refx: number, refy: number) {
  const raw = idealVerts(n, r);
  const refAngle = Math.atan2(refy, refx);
  let best = 0;
  let bestDiff = Infinity;
  for (let o = 0; o < n; o++) {
    const a = Math.atan2(raw[o * 2 + 1], raw[o * 2]);
    let d = Math.abs(a - refAngle);
    if (d > Math.PI) d = 2 * Math.PI - d;
    if (d < bestDiff) {
      bestDiff = d;
      best = o;
    }
  }
  const out = new Float64Array(n * 2);
  for (let i = 0; i < n; i++) {
    const s = ((i + best) % n) * 2;
    out[i * 2] = raw[s];
    out[i * 2 + 1] = raw[s + 1];
  }
  return out;
}

// Polygon with a fractional number of sides: a new vertex grows out of edge 0-1
function continuousVerts(nf: number, r: number) {
  const nLo = Math.floor(nf);
  const frac = nf - nLo;
  if (frac < 1e-9) return idealVerts(nLo, r);
  const nHi = nLo + 1;
  const base = idealVerts(nLo, r);
  const start = new Float64Array(nHi * 2);
  start[0] = base[0];
  start[1] = base[1];
  start[2] = (base[0] + base[2]) / 2;
  start[3] = (base[1] + base[3]) / 2;
  for (let i = 2; i < nHi; i++) {
    start[i * 2] = base[(i - 1) * 2];
    start[i * 2 + 1] = base[(i - 1) * 2 + 1];
  }
  const target = alignedIdealVerts(nHi, r, base[0], base[1]);
  const out = new Float64Array(nHi * 2);
  for (let i = 0; i < nHi * 2; i++) out[i] = lerp(start[i], target[i], frac);
  return out;
}

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const reduced = prefersReducedMotion();
        const q = gsap.utils.selector(root);
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const cards = q<HTMLElement>("[data-card]");
        const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#0b0d0a";

        let W = 0,
          H = 0,
          R = 0,
          xLeft = 0,
          xRight = 0,
          tEntry = 0;
        let progress = 0,
          target = 0;
        let rafId: number | null = null;

        function resize() {
          const dpr = window.devicePixelRatio || 1;
          W = stage.current!.clientWidth;
          H = stage.current!.clientHeight;
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
          canvas.style.width = W + "px";
          canvas.style.height = H + "px";
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          R = Math.min(W, window.innerHeight) * 0.085;
          xLeft = -R;
          xRight = W - R;
          tEntry = (2 * R) / (xRight - xLeft);
          render(progress);
        }

        function render(p: number) {
          const t = Math.min(1, Math.max(0, p));
          const span = xRight - xLeft;
          const wheelX = lerp(xLeft, xRight, t);
          const tMorph = easeInOut(Math.min(1, Math.max(0, (t - tEntry) / (1 - tEntry))));
          const tPoly = Math.min(tMorph / PHASE2, 1);
          const circT = easeInOut(Math.max(0, (tMorph - PHASE2) / (1 - PHASE2)));

          const nf = N_MIN + tPoly * (N_MAX - N_MIN);
          const nLo = Math.floor(nf);
          const nHi = Math.min(N_MAX, nLo + 1);
          const frac = nf - nLo;
          const s = lerp(2 * R * Math.sin(Math.PI / nLo), 2 * R * Math.sin(Math.PI / nHi), frac); // side length
          const a = lerp(R * Math.cos(Math.PI / nLo), R * Math.cos(Math.PI / nHi), frac); // apothem

          const roadPeakY = H * 0.3 + a;
          const axleY = roadPeakY - (a + (R - a) * circT);

          ctx.clearRect(0, 0, W, H);
          ctx.save();

          // clip to the (rising) cards
          ctx.beginPath();
          const sr = stage.current!.getBoundingClientRect();
          for (const c of cards) {
            const r = c.getBoundingClientRect();
            ctx.rect(r.left - sr.left, r.top - sr.top, r.width, r.height);
          }
          ctx.clip();

          ctx.strokeStyle = ink;
          ctx.fillStyle = ink;

          // road of catenary arches, flattening as the wheel becomes a circle
          const firstPeakX = xLeft + Math.ceil((-xLeft - s) / s) * s;
          const numArches = Math.ceil((W + s * 2) / s) + 2;
          const steps = Math.max(48, Math.round(s));
          ctx.beginPath();
          for (let ai = 0; ai < numArches; ai++) {
            const peakX = firstPeakX + ai * s;
            const archLeft = peakX - s / 2;
            for (let si = 0; si <= steps; si++) {
              const lx = archLeft + (si / steps) * s;
              const cat = roadPeakY + a * Math.cosh((lx - peakX) / a) - a;
              const y = cat * (1 - circT) + roadPeakY * circT;
              if (si === 0) ctx.moveTo(lx, y);
              else ctx.lineTo(lx, y);
            }
          }
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // rolling shape
          const rotation = ((t * span) / s) * ((2 * Math.PI) / nf) - Math.PI / nf;
          const verts = continuousVerts(nf, R);
          const vCount = verts.length / 2;
          ctx.save();
          ctx.translate(wheelX, axleY);
          ctx.rotate(rotation);
          ctx.beginPath();
          if (circT < 0.999) {
            const STEPS = 240;
            const per = vCount / STEPS;
            for (let i = 0; i <= STEPS; i++) {
              const vi = i * per;
              const vi0 = Math.floor(vi) % vCount;
              const vi1 = (vi0 + 1) % vCount;
              const vf = vi - Math.floor(vi);
              const px = lerp(verts[vi0 * 2], verts[vi1 * 2], vf);
              const py = lerp(verts[vi0 * 2 + 1], verts[vi1 * 2 + 1], vf);
              const pr = Math.sqrt(px * px + py * py);
              const k = lerp(pr, R, circT) / pr;
              if (i === 0) ctx.moveTo(px * k, py * k);
              else ctx.lineTo(px * k, py * k);
            }
            ctx.closePath();
          } else {
            ctx.arc(0, 0, R, 0, Math.PI * 2);
          }
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // dashed axle guide
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 10]);
          ctx.beginPath();
          ctx.moveTo(0, axleY);
          ctx.lineTo(W, axleY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        function animate() {
          progress = lerp(progress, target, SMOOTHING);
          if (Math.abs(target - progress) < STOP_EPSILON) progress = target;
          render(progress);
          rafId = Math.abs(target - progress) >= STOP_EPSILON ? requestAnimationFrame(animate) : null;
        }

        // Cards rise one after another (scrubbed)
        cards.forEach((c, i) => gsap.set(c, { height: CARD_START[i] + "%" }));
        const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });
        cards.forEach((c, i) => tl.to(c, { height: "100%", duration: 0.5 }, i * 0.09));
        tl.to({}, { duration: 0.3 });

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          animation: tl,
          scrub: reduced ? true : 0.6,
          onUpdate(self) {
            target = Math.max(0, (self.progress - SCROLL_OFFSET) / (1 - SCROLL_OFFSET));
            if (reduced) {
              progress = target;
              render(progress);
            } else if (!rafId) rafId = requestAnimationFrame(animate);
          },
          onRefresh: resize,
        });

        resize();
        window.addEventListener("resize", resize);
        return () => {
          window.removeEventListener("resize", resize);
          if (rafId) cancelAnimationFrame(rafId);
          st.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="relative bg-paper text-ink md:h-[340vh]">
      <div className="gutter flex flex-col py-[var(--gutter)] md:sticky md:top-0 md:h-svh">
        <div className="grid grid-cols-12 items-start gap-4 pb-6 pt-16 md:pt-[var(--gutter)]">
          <div className="mono col-span-3 hidden justify-between text-[11px] text-green-deep md:flex">
            <span>A</span>
            <span>B</span>
          </div>
          <p className="col-span-8 text-[14px] leading-[1.3] md:col-span-3 md:col-start-7">
            The road can get <span className="it text-[1.2em] text-green-deep">bumpy.</span> We keep you{" "}
            <span className="it text-[1.2em] text-green-deep">rolling</span> regardless.
          </p>
          <div className="col-span-4 flex justify-end md:col-span-3">
            <span className="pill it text-[18px]">Our Process</span>
          </div>
        </div>

        <div ref={stage} className="relative grid flex-1 grid-cols-1 gap-2 md:grid-cols-5 md:items-end">
          {process.map((p) => (
            <div key={p.n} className="flex h-full items-end">
              <article
                data-card
                className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden bg-green p-4 text-ink md:min-h-0"
              >
                <span className="mono text-[11px]">{p.n}</span>
                <div>
                  <h3 className="text-[clamp(22px,1.7vw,28px)] leading-[1.02]">
                    {p.title[0]}
                    <br />
                    <span className="it">{p.title[1]}</span>
                  </h3>
                  <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.3]">{p.body}</p>
                </div>
              </article>
            </div>
          ))}
          <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" />
        </div>
      </div>
    </section>
  );
}
