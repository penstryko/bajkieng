// Parts library: 20 eye pairs, 7 brows, mouths (Rhubarb A–H + X in 3 styles; RMS uses X/B/D) and
// the adult-coding overlays (eye bags, heavy lids, tired gaze, stubble). Bible §4.2–4.5, R4, R8.
// Owned by the set builder.
import React from "react";
import { random } from "remotion";
import type { AdultCoding, MouthShape, MouthStyle, PatientBrows, PatientEyes } from "../../../enums";
import type { Pal } from "./shapes";

const SCLERA = "#F4F1EA";

interface EyeType {
  lid: number;
  slant?: number; // deg, + = inner corner lower (angry), − = outer corner lower (sad)
  look?: [number, number]; // pupil offset as a fraction of the eye width/height
  pupil?: number; // pupil radius as a fraction of the eye width
  size?: [number, number]; // sclera multipliers (w, h)
  style?: "sclera" | "dots" | "led" | "pixel" | "spiral" | "star" | "heart";
  bags?: boolean;
}
const EYES: Record<PatientEyes, EyeType> = {
  round_bulging: { lid: 0, pupil: 0.13, size: [1, 1.12] },
  tired_bags: { lid: 0.46, pupil: 0.17, look: [0, 0.14], bags: true },
  bloodshot: { lid: 0.3, pupil: 0.13 },
  slanted_angry: { lid: 0.3, slant: 22, pupil: 0.16, look: [0, 0.05] },
  droopy_sad: { lid: 0.3, slant: -20, pupil: 0.18, look: [0, 0.14] },
  dots: { lid: 0, style: "dots" },
  spirals: { lid: 0, style: "spiral" },
  teary: { lid: 0.14, pupil: 0.27, look: [0, 0.06] },
  mismatched: { lid: 0.18, pupil: 0.16 },
  cyclops: { lid: 0.2, pupil: 0.18, size: [1.15, 1.05] },
  led: { lid: 0, style: "led" },
  pixel: { lid: 0, style: "pixel" },
  half_lidded: { lid: 0.52, pupil: 0.17, look: [0, 0.08] },
  terrified_pinpoint: { lid: 0, pupil: 0.065, size: [1.04, 1.18] },
  cross_eyed: { lid: 0.1, pupil: 0.16 },
  stars: { lid: 0, style: "star" },
  hearts: { lid: 0, style: "heart" },
  bushy_small: { lid: 0.2, pupil: 0.2, size: [0.62, 0.66] },
  nervous_blink: { lid: 0.08, pupil: 0.15 },
  monocle: { lid: 0.22, pupil: 0.16 },
};

export interface EyePairProps {
  kind: PatientEyes;
  cx: number;
  cy: number;
  ew: number;
  eh: number;
  gap: number;
  blink: number;
  adult: AdultCoding[];
  pal: Pal;
  uid: string;
}

const starPath = (cx: number, cy: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
};
const heartPath = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy + r * 0.85} C${cx - r * 1.4} ${cy - r * 0.1} ${cx - r * 0.7} ${cy - r * 1.1} ${cx} ${cy - r * 0.45} C${cx + r * 0.7} ${cy - r * 1.1} ${cx + r * 1.4} ${cy - r * 0.1} ${cx} ${cy + r * 0.85} Z`;

const OneEye: React.FC<{
  t: EyeType; kind: PatientEyes; cx: number; cy: number; ew: number; eh: number; side: -1 | 1; lid: number; look: [number, number]; pal: Pal; id: string; bags: boolean;
}> = ({ t, kind, cx, cy, ew, eh, side, lid, look, pal, id, bags }) => {
  const rx = (ew / 2) * (t.size?.[0] ?? 1), ry = (eh / 2) * (t.size?.[1] ?? 1);
  const ink = pal.ink;
  const slant = (t.slant ?? 0) * -side; // inner corner = towards the centre
  const lidY = cy - ry + 2 * ry * Math.min(1, lid);
  const bagsEl = bags ? (
    <g>
      <path d={`M${cx - rx * 0.86} ${cy + ry * 0.5} Q${cx} ${cy + ry * 1.75} ${cx + rx * 0.86} ${cy + ry * 0.5} Q${cx} ${cy + ry * 1.2} ${cx - rx * 0.86} ${cy + ry * 0.5} Z`} fill={pal.shade} />
      <path d={`M${cx - rx * 0.7} ${cy + ry * 1.0} Q${cx} ${cy + ry * 1.62} ${cx + rx * 0.7} ${cy + ry * 1.0}`} stroke={ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    </g>
  ) : null;
  if (t.style === "dots") {
    const k = 1 - Math.min(1, lid);
    return (
      <g>
        {bagsEl}
        <ellipse cx={cx} cy={cy} rx={rx * 0.42} ry={Math.max(2, ry * 0.5 * k)} fill={ink} />
        {k > 0.4 ? <circle cx={cx - rx * 0.12} cy={cy - ry * 0.18} r={rx * 0.1} fill="#fff" /> : null}
      </g>
    );
  }
  if (t.style === "led" || t.style === "pixel") {
    const k = 1 - Math.min(1, lid);
    return (
      <g>
        {bagsEl}
        <rect x={cx - rx} y={cy - ry} width={2 * rx} height={2 * ry} rx={6} fill="#141a16" stroke={ink} strokeWidth={5} />
        {t.style === "led" ? (
          <rect x={cx - rx * 0.62} y={cy - ry * 0.5 * k} width={rx * 1.24} height={Math.max(3, ry * k)} rx={4} fill={pal.accent} />
        ) : (
          [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => (i + j) % 2 === 0 && (j > 0 || k > 0.5) ? (
            <rect key={`${i}${j}`} x={cx - rx * 0.66 + i * rx * 0.46} y={cy - ry * 0.66 + j * ry * 0.46} width={rx * 0.4} height={ry * 0.4} fill="#8EF0C9" />
          ) : null))
        )}
      </g>
    );
  }
  if (t.style === "star" || t.style === "heart") {
    return (
      <g>
        <path d={t.style === "star" ? starPath(cx, cy, rx * 1.05) : heartPath(cx, cy, rx * 0.95)} fill={t.style === "star" ? "#F0E14A" : "#D94A64"} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={cx - rx * 0.25} cy={cy - ry * 0.25} r={rx * 0.12} fill="#fff" opacity={0.8} />
      </g>
    );
  }
  const pr = ew * (t.pupil ?? 0.16);
  const px = cx + look[0] * rx, py = cy + look[1] * ry;
  return (
    <g>
      {bagsEl}
      <clipPath id={id}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={SCLERA} />
      <g clipPath={`url(#${id})`}>
        {kind === "bloodshot"
          ? [[-1, -0.2], [-1, 0.35], [1, 0.1], [1, -0.4]].map(([sx, sy], i) => (
              <path key={i} d={`M${cx + sx * rx} ${cy + sy * ry} q${-sx * rx * 0.25} ${ry * 0.12} ${-sx * rx * 0.45} ${-ry * 0.05} m${sx * rx * 0.2} ${ry * 0.02} l${-sx * rx * 0.1} ${ry * 0.18}`} stroke="#C8262B" strokeWidth={2.5} fill="none" />
            ))
          : null}
        {t.style === "spiral" ? (
          <path d={`M${cx} ${cy} m0 -2 a2 2 0 1 1 -3 3 a6 6 0 1 1 9 -6 a11 11 0 1 1 -16 12 a16 16 0 1 1 24 -17`} transform={`translate(${cx} ${cy}) scale(${rx / 20}) translate(${-cx} ${-cy})`} stroke={ink} strokeWidth={3.5 * (20 / rx)} fill="none" />
        ) : (
          <g>
            <circle cx={px} cy={py} r={pr} fill={ink} />
            <circle cx={px - pr * 0.35} cy={py - pr * 0.4} r={Math.max(2, pr * 0.32)} fill="#fff" />
          </g>
        )}
        {kind === "teary" ? <path d={`M${cx - rx} ${cy + ry * 0.45} Q${cx} ${cy + ry * 0.75} ${cx + rx} ${cy + ry * 0.45} V${cy + ry} H${cx - rx} Z`} fill="#7fc4f0" opacity={0.75} /> : null}
        {lid > 0.001 ? (
          <g transform={`rotate(${slant} ${cx} ${cy})`}>
            <rect x={cx - rx * 1.6} y={cy - ry * 2} width={rx * 3.2} height={lidY - (cy - ry * 2)} fill={pal.shade} />
            <path d={`M${cx - rx * 1.6} ${lidY} H${cx + rx * 1.6}`} stroke={ink} strokeWidth={5} />
          </g>
        ) : null}
        {lid <= 0.001 && slant !== 0 ? (
          <g transform={`rotate(${slant} ${cx} ${cy})`}>
            <rect x={cx - rx * 1.6} y={cy - ry * 2} width={rx * 3.2} height={ry * 1.25} fill={pal.shade} />
          </g>
        ) : null}
      </g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={ink} strokeWidth={5} />
      {kind === "monocle" && side === 1 ? (
        <g>
          <circle cx={cx} cy={cy} r={Math.max(rx, ry) + 7} fill="none" stroke="#B8962E" strokeWidth={6} />
          <path d={`M${cx + rx + 4} ${cy + ry * 0.6} q${rx * 0.4} ${ry * 1.4} ${rx * 0.1} ${ry * 2.6}`} stroke="#B8962E" strokeWidth={3} fill="none" />
        </g>
      ) : null}
      {kind === "nervous_blink" && side === -1 ? (
        <g stroke={ink} strokeWidth={3} strokeLinecap="round">
          <path d={`M${cx - rx - 6} ${cy - ry - 4} l-8 -6 M${cx - rx - 10} ${cy - 2} h-10`} />
        </g>
      ) : null}
    </g>
  );
};

export const EyePair: React.FC<EyePairProps> = ({ kind, cx, cy, ew, eh, gap, blink, adult, pal, uid }) => {
  const t = EYES[kind] ?? EYES.half_lidded;
  const heavy = adult.includes("heavy_lids") ? 0.18 : 0;
  const tired = adult.includes("tired_gaze");
  const bags = !!t.bags || adult.includes("eye_bags");
  const baseLid = Math.min(0.62, t.lid + heavy + (tired ? 0.08 : 0));
  const lookY = (t.look?.[1] ?? 0) + (tired ? 0.12 : 0);
  const sides: (-1 | 1)[] = kind === "cyclops" ? [1] : [-1, 1];
  return (
    <g>
      {sides.map((side) => {
        const ex = kind === "cyclops" ? cx : cx + (side * gap) / 2;
        const sz = kind === "mismatched" && side === 1 ? 0.68 : 1;
        let lid = baseLid;
        if (kind === "nervous_blink") lid = side === -1 ? Math.max(lid, 0.42) : lid;
        lid = Math.max(lid, blink);
        const lookX = kind === "cross_eyed" ? -side * 0.32 : t.look?.[0] ?? 0;
        return (
          <OneEye
            key={side}
            t={t}
            kind={kind}
            cx={ex}
            cy={cy + (sz < 1 ? eh * 0.06 : 0)}
            ew={ew * sz}
            eh={eh * sz}
            side={side}
            lid={lid}
            look={[lookX, lookY]}
            pal={pal}
            id={`${uid}-eye${side}`}
            bags={bags}
          />
        );
      })}
      {kind === "bushy_small"
        ? [-1, 1].map((side) => {
            const ex = cx + (side * gap) / 2;
            return (
              <path
                key={side}
                d={`M${ex - ew * 0.55} ${cy - eh * 0.32} l${ew * 0.12} ${-eh * 0.34} l${ew * 0.1} ${eh * 0.14} l${ew * 0.14} ${-eh * 0.22} l${ew * 0.1} ${eh * 0.16} l${ew * 0.16} ${-eh * 0.2} l${ew * 0.08} ${eh * 0.18} l${ew * 0.16} ${-eh * 0.08} l-${ew * 0.06} ${eh * 0.42} Z`}
                fill={pal.ink}
              />
            );
          })
        : null}
    </g>
  );
};

// ───────────────────────────── brows ─────────────────────────────

export const Brows: React.FC<{ kind: PatientBrows; cx: number; y: number; gap: number; ew: number; ink: string }> = ({ kind, cx, y, gap, ew, ink }) => {
  if (kind === "none") return null;
  const bw = ew * 0.95;
  const th = Math.max(7, ew * 0.16);
  const bar = (side: -1 | 1, angle: number, dy = 0, arch = 0) => {
    const ex = cx + (side * gap) / 2;
    // angle > 0 lowers the inner end
    const inner = side === -1 ? 1 : -1;
    const x0 = ex - bw / 2, x1 = ex + bw / 2;
    const tilt = Math.tan((angle * Math.PI) / 180) * (bw / 2);
    const yIn = y + dy + tilt, yOut = y + dy - tilt;
    const yl = inner === 1 ? yOut : yIn;
    const yr = inner === 1 ? yIn : yOut;
    return <path key={side} d={`M${x0} ${yl} Q${ex} ${(yl + yr) / 2 - arch} ${x1} ${yr}`} stroke={ink} strokeWidth={th} strokeLinecap="round" fill="none" />;
  };
  switch (kind) {
    case "flat_heavy":
      return <g>{[bar(-1, 7, 2), bar(1, 7, 2)]}</g>;
    case "angry_v":
      return <g>{[bar(-1, 24, 4), bar(1, 24, 4)]}</g>;
    case "worried":
      return <g>{[bar(-1, -20, -4, 4), bar(1, -20, -4, 4)]}</g>;
    case "raised":
      return <g>{[bar(-1, 0, -14, 12), bar(1, 0, -14, 12)]}</g>;
    case "furrowed":
      return (
        <g>
          {[bar(-1, 16, 2), bar(1, 16, 2)]}
          <path d={`M${cx - 6} ${y - th} v${th * 1.6} M${cx + 6} ${y - th} v${th * 1.6}`} stroke={ink} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case "unibrow":
      return <path d={`M${cx - gap / 2 - bw / 2} ${y + 2} Q${cx - gap / 4} ${y - 8} ${cx} ${y + 4} Q${cx + gap / 4} ${y - 8} ${cx + gap / 2 + bw / 2} ${y + 2}`} stroke={ink} strokeWidth={th * 1.1} strokeLinecap="round" fill="none" />;
  }
};

// ───────────────────────────── mouths (Rhubarb A–H + X; RMS → X/B/D) ─────────────────────────────

export const Mouth: React.FC<{ shape: MouthShape; style: MouthStyle; cx: number; cy: number; w: number; pal: Pal }> = ({ shape, style, cx, cy, w, pal }) => {
  const ink = pal.ink;
  const inside = "#2a0f12";
  const lip = style === "fleshy" ? pal.shade : null;
  const teeth = style === "teeth" || style === "fleshy";
  const hw = w / 2;
  const open = (h: number, wk = 1, tongue = false, upperTeeth = teeth, lowerTeeth = false) => {
    const x0 = cx - hw * wk, x1 = cx + hw * wk;
    const d = `M${x0} ${cy} Q${cx} ${cy - h * 0.55} ${x1} ${cy} Q${cx} ${cy + h * 1.15} ${x0} ${cy} Z`;
    return (
      <g>
        <clipPath id={`m-${Math.round(cx)}-${Math.round(cy)}-${shape}`}>
          <path d={d} />
        </clipPath>
        <path d={d} fill={inside} />
        <g clipPath={`url(#m-${Math.round(cx)}-${Math.round(cy)}-${shape})`}>
          {upperTeeth ? <rect x={x0} y={cy - h} width={x1 - x0} height={h * 0.62} fill="#F4F1EA" /> : null}
          {lowerTeeth ? <rect x={x0} y={cy + h * 0.32} width={x1 - x0} height={h} fill="#F4F1EA" /> : null}
          {tongue ? <ellipse cx={cx + hw * 0.1} cy={cy + h * 0.62} rx={hw * 0.55 * wk} ry={h * 0.35} fill="#b8475a" /> : null}
        </g>
        <path d={d} fill="none" stroke={lip ?? ink} strokeWidth={lip ? 9 : 5} strokeLinejoin="round" />
        {lip ? <path d={d} fill="none" stroke={ink} strokeWidth={2.5} /> : null}
      </g>
    );
  };
  switch (shape) {
    case "X":
      return <path d={`M${cx - hw * 0.8} ${cy} Q${cx} ${cy + w * 0.05} ${cx + hw * 0.8} ${cy + w * 0.04}`} stroke={lip ?? ink} strokeWidth={lip ? 10 : 6} strokeLinecap="round" fill="none" />;
    case "A":
      return <path d={`M${cx - hw * 0.7} ${cy} H${cx + hw * 0.7}`} stroke={lip ?? ink} strokeWidth={lip ? 13 : 8} strokeLinecap="round" />;
    case "B":
      return open(w * 0.16, 0.85, false, true, true);
    case "C":
      return open(w * 0.3, 0.9, false);
    case "D":
      return open(w * 0.5, 1, true);
    case "E":
      return open(w * 0.36, 0.62, false, false);
    case "F":
      return (
        <g>
          <ellipse cx={cx} cy={cy + w * 0.04} rx={w * 0.14} ry={w * 0.12} fill={inside} stroke={lip ?? ink} strokeWidth={lip ? 9 : 5} />
        </g>
      );
    case "G":
      return open(w * 0.22, 0.8, false, true, false);
    case "H":
      return open(w * 0.36, 0.85, true, teeth);
  }
};

// ───────────────────────────── stubble (adult coding) ─────────────────────────────

/** "Stubble" of rust / dust / toner: stipple in the band `area` (local px) outside the `hole` rect (the mouth). */
export const Stubble: React.FC<{ kind: AdultCoding; area: [number, number, number, number]; hole: [number, number, number, number]; seed: number }> = ({ kind, area, hole, seed }) => {
  if (kind !== "rust_stubble" && kind !== "dust_stubble" && kind !== "toner_stubble") return null;
  const col = kind === "rust_stubble" ? "#8a4a17" : kind === "dust_stubble" ? "#8d877c" : "#2b2b2b";
  const [x0, y0, x1, y1] = area;
  const dots: React.ReactNode[] = [];
  for (let i = 0, n = 0; i < 400 && n < 60; i++) {
    const x = x0 + (x1 - x0) * random(`stubble:${seed}:${kind}:${i}:x`);
    const y = y0 + (y1 - y0) * random(`stubble:${seed}:${kind}:${i}:y`);
    if (x > hole[0] && x < hole[2] && y > hole[1] && y < hole[3]) continue;
    // denser near the mouth: reject far points with a probability
    const dy = Math.min(Math.abs(y - hole[1]), Math.abs(y - hole[3])) / Math.max(1, y1 - y0);
    if (random(`stubble:${seed}:${kind}:${i}:k`) < dy * 1.6) continue;
    n++;
    dots.push(<circle key={i} cx={x} cy={y} r={1.6 + 1.3 * random(`stubble:${seed}:${kind}:${i}:r`)} fill={col} opacity={0.8} />);
  }
  return <g>{dots}</g>;
};
