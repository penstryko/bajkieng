// Notepad doodles (bible §6.4 advice drawings A01–A30 + gag notes): primitive red-marker drawings,
// NO words. Each doodle = ordered strokes (polylines in FIELD coordinates 0..760 × 0..900), drawn on
// one after another (engine drawOn progress) and smoothed with Catmull-Rom. Pure TS (no React) so the
// SVG archive in assets/notepad/doodles/ can be exported from the same source (exportDoodles.ts).
// Keys must match DOODLE_KEYS in registry.ts. Owned by the set builder.
import { random } from "remotion";

export type Pt = [number, number];
export interface Doodle {
  strokes: Pt[][];
  /** indices of strokes drawn as smooth curves (Catmull-Rom); all others keep sharp corners */
  smooth?: number[];
  /** marker width in field px */
  width?: number;
}

const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 18): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

const picket = (x: number, base: number, top: number, hw: number): Pt[] => [
  [x - hw, base], [x - hw, top + 52], [x, top], [x + hw, top + 52], [x + hw, base],
];

export const DOODLES: Record<string, Doodle> = {
  /** A01 "set boundaries": a little picket fence. */
  A01_fence: {
    strokes: [
      // ground
      [[60, 690], [180, 684], [300, 694], [420, 686], [540, 692], [700, 686]],
      ...[150, 265, 380, 495, 610].map((x, i) => picket(x, 676, 300 + (i % 2) * 14, 38)),
      [[96, 420], [670, 422]],
      [[96, 590], [670, 588]],
      // grass tufts
      [[112, 690], [104, 656], [124, 690], [132, 650], [142, 690]],
      [[628, 688], [622, 658], [638, 688], [648, 652], [656, 688]],
    ],
    smooth: [0],
  },
  /** S01E02 advice "change your image": a calendar page wearing cool sunglasses, with sparkles. */
  calendar_sunglasses: {
    strokes: [
      [[200, 250], [560, 250], [560, 760], [200, 760], [200, 250]],
      [[200, 360], [560, 360]],
      [[270, 230], [270, 280]], [[380, 230], [380, 280]], [[490, 230], [490, 280]],
      ...[0, 1].map((k) => arc(310 + k * 140, 470, 62, 42, 0, 360, 16)),
      [[372, 462], [388, 452]],
      [[248, 456], [210, 430]], [[512, 456], [552, 430]],
      [[300, 600], [350, 640], [410, 642], [460, 600]],
      [[620, 260], [620, 330]], [[585, 295], [655, 295]],
      [[120, 520], [120, 580]], [[90, 550], [150, 550]],
    ],
    smooth: [8],
  },
  /** S01E01 gag note: the doctor's real opinion of the patient: a printer with devil horns and a tail. */
  printer_with_horns: {
    strokes: [
      [[170, 440], [590, 440], [590, 660], [170, 660], [170, 440]],
      [[250, 440], [250, 330], [510, 330], [510, 440]],
      [[196, 440], [168, 370], [150, 282], [200, 340], [240, 400], [262, 440]],
      [[564, 440], [592, 370], [610, 282], [560, 340], [520, 400], [498, 440]],
      [[240, 486], [330, 522]],
      [[520, 486], [430, 522]],
      [[300, 540], [304, 558]],
      [[460, 540], [456, 558]],
      [[250, 600], [290, 620], [330, 600], [370, 620], [410, 600], [450, 620], [490, 600], [510, 610]],
      [[590, 610], [650, 640], [680, 710], [650, 780], [690, 816]],
      [[668, 792], [714, 828], [662, 846], [668, 792]],
    ],
    smooth: [2, 3, 9],
  },
  /** Gag note: "$" in a circle (the doctor thinks about the bill). */
  dollar_circle: {
    strokes: [
      arc(380, 470, 230, 230, -90, 270, 36),
      [[460, 380], [420, 350], [340, 350], [300, 400], [340, 455], [430, 490], [470, 545], [430, 595], [340, 595], [292, 560]],
      [[380, 300], [380, 640]],
    ],
    smooth: [0, 1],
  },
};

/** Insert midpoints so long straight segments wobble like a hand-drawn line. */
export function densify(pts: Pt[], step = 70): Pt[] {
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  return out;
}

/** Final drawable strokes of a doodle: densify → hand wobble + boil → smooth the flagged strokes. */
export function doodleStrokes(key: string, boilSeed: number): Pt[][] {
  const d = DOODLES[key];
  if (!d) return [];
  const dense = d.strokes.map((s, i) => (d.smooth?.includes(i) ? s : densify(s)));
  return wobble(key, dense, boilSeed).map((s, i) => (d.smooth?.includes(i) ? smooth(s, 6) : s));
}

export const DOODLE_IDS = Object.keys(DOODLES);

/** Catmull-Rom resample of a polyline (dense points along a smooth curve). */
export function smooth(pts: Pt[], perSeg = 8): Pt[] {
  if (pts.length < 3) return pts;
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < perSeg; k++) {
      const u = k / perSeg;
      const cr = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
      out.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Hand-made wobble (fixed per doodle) + line boil (changes with boilSeed). */
export function wobble(key: string, strokes: Pt[][], boilSeed: number, amp = 4, boil = 1.6): Pt[][] {
  return strokes.map((s, si) =>
    s.map(([x, y], pi) => [
      x + amp * (random(`doodle:${key}:${si}:${pi}:x`) * 2 - 1) + boil * (random(`boil:${boilSeed}:${si}:${pi}:x`) * 2 - 1),
      y + amp * (random(`doodle:${key}:${si}:${pi}:y`) * 2 - 1) + boil * (random(`boil:${boilSeed}:${si}:${pi}:y`) * 2 - 1),
    ]),
  );
}

const segLen = (pts: Pt[]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** Prefix of a polyline up to fraction k of its length; returns the points and the tip. */
export function partial(pts: Pt[], k: number): { pts: Pt[]; tip: Pt } {
  if (k >= 1) return { pts, tip: pts[pts.length - 1] };
  if (k <= 0) return { pts: [pts[0]], tip: pts[0] };
  const total = segLen(pts);
  let d = k * total;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= l) {
      const u = l === 0 ? 0 : d / l;
      const tip: Pt = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u];
      out.push(tip);
      return { pts: out, tip };
    }
    d -= l;
    out.push(pts[i]);
  }
  return { pts, tip: pts[pts.length - 1] };
}

/** Per-stroke progress from the overall drawOn progress, weighted by stroke length (sequential). */
export function strokeProgress(strokes: Pt[][], total: number): number[] {
  const lens = strokes.map(segLen);
  const sum = lens.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  return lens.map((l) => {
    const start = acc / sum, end = (acc + l) / sum;
    acc += l;
    return total >= end ? 1 : total <= start ? 0 : (total - start) / (end - start);
  });
}

export const polyD = (pts: Pt[]): string => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
