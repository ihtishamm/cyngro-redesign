// Regular-polygon / circle path builders used by the morphing shapes.

export function polygonPath(
  n: number,
  r: number,
  cx: number,
  cy: number,
  rotationDeg = -90,
): string {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((rotationDeg + (360 / n) * i) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

export function circlePath(r: number, cx: number, cy: number): string {
  return `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
}

// Deterministic pseudo-random barcode as a CSS gradient
export function barcodeGradient(seed: string, color = "currentColor"): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
  const stops: string[] = [];
  let x = 0;
  while (x < 100) {
    const bar = 0.4 + rand() * 1.6;
    const gap = 0.3 + rand() * 1.4;
    stops.push(`${color} ${x.toFixed(2)}% ${(x + bar).toFixed(2)}%`);
    stops.push(`transparent ${(x + bar).toFixed(2)}% ${(x + bar + gap).toFixed(2)}%`);
    x += bar + gap;
  }
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}
