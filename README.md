# Cyngro — redesign

A Next.js 16 rebuild of [cyngro.com](https://cyngro.com) with the motion language of
[neutomni.com](https://neutomni.com). Brand colours, copy, services, process,
awards, stats and client work all come from cyngro.com.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Stack

- **Next.js 16** (App Router, Turbopack) + **Tailwind CSS v4**
- **GSAP 3.15** — ScrollTrigger, SplitText, MorphSVGPlugin (via `@gsap/react`)
- **Lenis** smooth scroll, driven by the GSAP ticker (same wiring neutomni uses)
- Fonts: Outfit (Cyngro's brand font), Instrument Serif italic (editorial accent),
  JetBrains Mono (labels)

## Sections → the neutomni effect each one reproduces

| Component | Effect |
| --- | --- |
| `HeroReel` | Green preloader with a 000→100 counter wipes away; kinetic headline (chars rise from line masks), cursor glow, magnetic CTA, rotating subhead word. On scroll the reel window inside the headline expands to the full viewport (clip-path + counter-scaled content), the headline lines fly apart, then every project slides through full-bleed |
| `Manifesto` | Equation strip, SplitText blur-line reveals, count-up stats |
| `Process` | Canvas polygon rolling on catenary arches, 4→12 sides→circle, clipped to rising cards (port of neutomni's `#pw-canvas`) |
| `Work` | Pinned case wrapper, corner clip-path reveals, image zoom 1.1→1 / 1→1.2, list dimming, Lenis label snapping |
| `Services` | Radial bloom floods the stage, heading blurs back, ticket cards fly in with 3D tilt |
| `Desktop` | Draggable OS windows (testimonials, awards, industries, why-us, stack) with desktop icons |
| `Contact` | Morphing shape follows the cursor along a dashed track, leaving fading outline trails |
| `Footer` | Giant wordmark whose "O" morphs through polygons on a loop |

Content lives in `lib/data.ts`. Project visuals are coded UI mockups
(`components/Mockups.tsx`) because cyngro.com publishes no case-study imagery —
swap them for real screenshots when available. All motion respects
`prefers-reduced-motion`.
