// Parts library: wear marks (§4.2 `wear`, ≥ 1 required: adult history coding), accessories (≤ 2,
// forbidden: bows, party hats, plasters, bandages, stethoscopes) and function markers (the single most
// important recognition element, R2). Owned by the set builder.
import React from "react";
import type { MouthShape, PatientAccessory } from "../../../enums";
import { FONTS } from "../../../engine";
import type { PatientModel } from "../generator";
import { rr, type Pal, type Part } from "./shapes";
import { tone, mixHex } from "../../set/color";

const PAPER = "#F4F1EA";

// ───────────────────────────── wear ─────────────────────────────

export const Wear: React.FC<{ kind: string; x: number; y: number; s: number; rot: number; pal: Pal }> = ({ kind, x, y, s, rot, pal }) => {
  const ink = pal.ink;
  const g = (el: React.ReactNode) => <g transform={`translate(${x} ${y}) rotate(${rot})`}>{el}</g>;
  switch (kind) {
    case "scratches":
      return g(
        <g stroke={tone(pal.base, 0.55)} strokeWidth={3} strokeLinecap="round">
          {[-0.4, 0, 0.4].map((k) => <path key={k} d={`M${-s} ${k * s} l${2 * s} ${-0.5 * s}`} />)}
          <path d={`M${-s} ${0.2 * s} l${2 * s} ${-0.5 * s}`} stroke={tone(pal.base, -0.35)} strokeWidth={1.5} />
        </g>,
      );
    case "tape_patch":
      return g(
        <g>
          <path d={`M${-s * 0.9} ${-s * 0.5} l${s * 0.5} ${s * 0.35} l${s * 0.2} ${-s * 0.2} l${s * 0.5} ${s * 0.6}`} stroke={ink} strokeWidth={3} fill="none" />
          {[35, -35].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d={`M${-s * 1.05} ${-s * 0.24} H${s * 1.05} l-4 6 l4 6 l-4 6 l4 ${s * 0.48 - 18} H${-s * 1.05} l4 -6 l-4 -6 l4 -6 Z`} fill="#A8A8A0" stroke={ink} strokeWidth={3} strokeLinejoin="round" />
              <path d={`M${-s * 0.9} ${-s * 0.1} H${s * 0.9}`} stroke="#c4c4bc" strokeWidth={2} />
            </g>
          ))}
        </g>,
      );
    case "stickers":
      return g(
        <g>
          <path d={`M${-s * 0.7} ${-s * 0.5} H${s * 0.7} V${s * 0.2} L${s * 0.4} ${s * 0.5} H${-s * 0.7} Z`} fill="#d9c65a" stroke={ink} strokeWidth={3} opacity={0.9} />
          <path d={`M${s * 0.7} ${s * 0.2} L${s * 0.4} ${s * 0.5} L${s * 0.36} ${s * 0.18} Z`} fill={tone("#d9c65a", 0.4)} stroke={ink} strokeWidth={2} />
          <circle cx={-s * 0.15} cy={-s * 0.12} r={s * 0.2} fill="none" stroke="#8a7a2a" strokeWidth={3} />
        </g>,
      );
    case "crack":
      return g(<path d={`M${-s} ${-s * 0.6} l${s * 0.4} ${s * 0.3} l-${s * 0.1} ${s * 0.3} l${s * 0.5} ${s * 0.2} l${s * 0.2} ${s * 0.5} M${-s * 0.2} ${0} l${s * 0.3} -${s * 0.3}`} stroke={ink} strokeWidth={3.5} fill="none" strokeLinejoin="round" />);
    case "rust":
      return g(
        <g>
          {[[0, 0, 0.5], [0.5, 0.2, 0.3], [-0.4, 0.3, 0.28], [0.15, -0.45, 0.22], [-0.2, -0.2, 0.18]].map(([dx, dy, r], i) => (
            <circle key={i} cx={dx * s} cy={dy * s} r={r * s} fill={i % 2 ? "#8a4a17" : "#B5651D"} opacity={0.85} />
          ))}
        </g>,
      );
    case "coffee_stain":
      return g(
        <g>
          <path d={`M${s * 0.75} ${0} A${s * 0.75} ${s * 0.75} 0 1 1 ${s * 0.4} ${-s * 0.63}`} stroke="#6B4423" strokeWidth={s * 0.16} fill="none" opacity={0.7} strokeLinecap="round" />
          <circle cx={0} cy={0} r={s * 0.62} fill="#8a6a45" opacity={0.18} />
          <path d={`M${s * 0.2} ${s * 0.75} q${s * 0.06} ${s * 0.4} ${-s * 0.02} ${s * 0.7}`} stroke="#6B4423" strokeWidth={s * 0.12} fill="none" opacity={0.65} strokeLinecap="round" />
        </g>,
      );
    case "burn":
      return g(
        <g>
          <path d={`M${-s} 0 l${s * 0.3} -${s * 0.5} l${s * 0.3} ${s * 0.2} l${s * 0.3} -${s * 0.6} l${s * 0.3} ${s * 0.5} l${s * 0.5} -${s * 0.1} l-${s * 0.2} ${s * 0.6} l${s * 0.3} ${s * 0.4} l-${s * 1.4} ${s * 0.2} Z`} fill="#5a3b22" opacity={0.8} />
          <ellipse cx={0} cy={0} rx={s * 0.45} ry={s * 0.3} fill="#2a1d14" opacity={0.9} />
        </g>,
      );
    case "price_tag":
      return g(
        <g>
          <path d={`M${-s * 0.9} ${-s * 0.45} H${s * 0.6} L${s * 0.95} 0 L${s * 0.6} ${s * 0.45} H${-s * 0.9} Z`} fill={PAPER} stroke={ink} strokeWidth={3} />
          <circle cx={s * 0.55} cy={0} r={s * 0.1} fill={pal.base} stroke={ink} strokeWidth={2} />
          <text x={-s * 0.2} y={s * 0.2} textAnchor="middle" fontFamily={FONTS.crt} fontSize={s * 0.62} fill="#C8262B">-70%</text>
        </g>,
      );
    case "dust":
      return g(
        <g fill="#8d877c" opacity={0.6}>
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={((i * 37) % 23 - 11) * s * 0.09} cy={((i * 53) % 17 - 8) * s * 0.06} r={s * (0.06 + ((i * 7) % 5) * 0.02)} />)}
        </g>,
      );
    case "dent":
      return g(
        <g>
          <path d={`M${-s * 0.7} 0 Q0 ${s * 0.7} ${s * 0.7} 0 Q0 ${s * 0.3} ${-s * 0.7} 0 Z`} fill={pal.shade} />
          <path d={`M${-s * 0.6} ${-s * 0.1} Q0 ${-s * 0.5} ${s * 0.6} ${-s * 0.1}`} stroke="#fff" strokeWidth={3} opacity={0.4} fill="none" />
        </g>,
      );
    case "toner_smudge":
      return g(
        <g stroke="#1a1a1a" strokeLinecap="round" fill="none">
          <path d={`M${-s} ${-s * 0.15} q${s * 0.6} ${-s * 0.35} ${s * 1.7} ${s * 0.05}`} strokeWidth={s * 0.3} opacity={0.42} />
          <path d={`M${-s * 0.7} ${s * 0.25} q${s * 0.6} ${-s * 0.25} ${s * 1.3} ${s * 0.12}`} strokeWidth={s * 0.18} opacity={0.32} />
        </g>,
      );
    default:
      return null;
  }
};

// ───────────────────────────── accessories ─────────────────────────────

export const accessoryKind = (a: PatientAccessory): string => (a.startsWith("display:") ? "display" : a);
export const displayText = (a: PatientAccessory): string => (a.startsWith("display:") ? a.slice(8) : "");

/** LCD display box with text (VT323), used by the `display:<TEXT>` accessory and the printer panel. */
export const Lcd: React.FC<{ x: number; y: number; h: number; text: string; color: string; ink: string; maxW?: number }> = ({ x, y, h, text, color, ink, maxW }) => {
  const fs = h * 0.86;
  let tw = text.length * 0.4 * fs;
  let size = fs;
  if (maxW && tw + h * 0.6 > maxW) {
    size = (maxW - h * 0.6) / (text.length * 0.4);
    tw = text.length * 0.4 * size;
  }
  const w = tw + h * 0.6;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} fill="#14201a" stroke={ink} strokeWidth={3.5} />
      <text x={x} y={y + size * 0.3} textAnchor="middle" fontFamily={FONTS.crt} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

// Accessory placement: flat accessories (display, sticky note, sign) are placed by a small search over
// candidate spots in the face/body box that avoids the eyes + brows, the mouth/slot and the other
// accessory (R2/R4: eyes and the function marker must stay readable). Deterministic in the model.
type ARect = { cx: number; cy: number; w: number; h: number };
type Box4 = [number, number, number, number];
const PLACED_KINDS = ["display", "urgent_sticky", "out_of_order_sign"];

const overlap = (a: Box4, b: Box4): number =>
  Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
const outside = (r: Box4, box: Box4): number => (r[2] - r[0]) * (r[3] - r[1]) - overlap(r, box);

/** Natural size of a flat accessory (before the fit search scales it down). */
const accessorySize = (a: PatientAccessory, m: PatientModel): [number, number] => {
  const w = m.body.x1 - m.body.x0, bh = m.body.y1 - m.body.y0;
  const kind = accessoryKind(a);
  if (kind === "display") {
    const h = Math.max(18, w * 0.09);
    return [Math.min(displayText(a).length * 0.4 * 0.86 * h + 0.6 * h, w * 0.5), h];
  }
  if (kind === "urgent_sticky") {
    const sz = Math.min(w, bh) * 0.24;
    return [sz * 1.15, sz * 1.15]; // rotated ±9°
  }
  if (kind === "out_of_order_sign") {
    const rw = w * 0.34;
    return [rw * 1.04, rw * 0.62];
  }
  return [0, 0];
};

/** Bottom band of a seated patient hidden by Chester's seat front (y 1100–1150 at anchor 1150, scale 1). */
const HIDDEN_BOTTOM = 50;

/**
 * Rects for the first two accessories (null = not a flat placed accessory, or drawn by the marker).
 * Candidates: straddling the body's top edge (band reserved by makePatient), then the face box, then the
 * body box. Penalties: eyes + brows ×3, mouth/slot ×2, the other accessory ×2, the seat-hidden bottom band ×3,
 * outside the face ×0.5, outside the body (except the top straddle) ×4; shrinking to 84 % costs extra.
 */
export function accessoryLayout(m: PatientModel): (ARect | null)[] {
  const { body, face, eyes: e } = m;
  const w = body.x1 - body.x0, bh = body.y1 - body.y0;
  const bodyBox: Box4 = [body.x0, body.y0, body.x1, body.y1];
  const faceBox: Box4 = [face.x0, face.y0, face.x1, face.y1];
  const hidden: Box4 = [body.x0 - 20, -HIDDEN_BOTTOM, body.x1 + 20, 10];
  const eyeBox: Box4 = [e.cx - e.gap / 2 - e.ew / 2 - 6, m.browY - 14, e.cx + e.gap / 2 + e.ew / 2 + 6, e.cy + e.eh * 0.65 + 8];
  const mo = m.spec.mouth.type === "none" ? null : m.marker?.ownsSlot ? m.slot : m.mouth;
  const mh = Math.max(16, (mo?.w ?? 0) * 0.3);
  const mouthBox: Box4 | null = mo ? [mo.cx - mo.w / 2 - 6, m.mouth.cy - mh, mo.cx + mo.w / 2 + 6, m.mouth.cy + mh] : null;
  const placed: Box4[] = m.spec.accessories.includes("antenna") ? [[w * 0.18 - 12, body.y0 - bh * 0.16 - 12, w * 0.26 + 12, body.y0 + 6]] : [];
  const fr: [number, number][] = [[1, 0], [1, 1], [0, 1], [0, 0], [1, 0.5], [0, 0.5], [0.5, 1], [0.5, 0]];
  // round / pointed tops: off-centre top spots follow the curve (drop) so items do not float in the air
  const roundTop = ["disc", "sphere", "cloud", "ribbed_sphere", "cone", "triangle_tree", "house", "arcs", "speech_bubble", "bottle", "cable_plug", "bag"].includes(m.spec.shape);
  const topFx = [0.5, 0.8, 0.2];
  // how far a round top edge drops below the body box at horizontal offset dx (circle approximation)
  const drop = (dx: number) => (roundTop ? w / 2 - Math.sqrt(Math.max(0, (w / 2) ** 2 - dx * dx)) : 0);
  return m.spec.accessories.slice(0, 2).map((a, slot) => {
    const kind = accessoryKind(a);
    if (!PLACED_KINDS.includes(kind)) return null;
    if (kind === "display" && m.spec.functionMarker === "paper_tray_tongue") return null; // in the printer panel
    const [nw, nh] = accessorySize(a, m);
    const mirror = (fx: number) => (slot === 0 ? fx : 1 - fx);
    let best = null as { r: ARect; pen: number } | null;
    for (const k of [1, 0.84]) {
      const rw = nw * k, rh = nh * k;
      const shrink = (1 - k) * 1.2 * nw * nh;
      const cands: { cx: number; cy: number; top: boolean }[] = [];
      // a display is mounted ON the top edge; notes and signs are stuck across it
      const topCy = kind === "display" ? body.y0 - rh / 2 - 1 : body.y0 - rh * 0.1;
      for (const fx of topFx) {
        const cx = body.x0 + 4 + rw / 2 + mirror(fx) * (w - 8 - rw);
        cands.push({ cx, cy: topCy + drop(Math.max(0, Math.abs(cx) - rw * 0.3)), top: true });
      }
      for (const region of [faceBox, bodyBox])
        for (const [fx, fy] of fr)
          cands.push({ cx: region[0] + 4 + rw / 2 + mirror(fx) * (region[2] - region[0] - 8 - rw), cy: region[1] + 4 + rh / 2 + fy * (region[3] - region[1] - 8 - rh), top: false });
      for (const c of cands) {
        const r: Box4 = [c.cx - rw / 2, c.cy - rh / 2, c.cx + rw / 2, c.cy + rh / 2];
        const above = Math.max(0, -m.h - r[1]) * rw; // sticking out above the reserved band
        const pen =
          3 * overlap(r, eyeBox) + (mouthBox ? 2 * overlap(r, mouthBox) : 0) + placed.reduce((acc, q) => acc + 2 * overlap(r, q), 0) +
          3 * overlap(r, hidden) + (c.top ? 4 * above : 0.5 * outside(r, faceBox) + 4 * outside(r, bodyBox)) + shrink;
        if (!best || pen < best.pen - 1e-6) best = { r: { cx: c.cx, cy: c.cy, w: rw, h: rh }, pen };
      }
      if (best && best.pen <= 0.04 * nw * nh + shrink) break;
    }
    const r = best!.r;
    placed.push([r.cx - r.w / 2, r.cy - r.h / 2, r.cx + r.w / 2, r.cy + r.h / 2]);
    return r;
  });
}

export const Accessory: React.FC<{ a: PatientAccessory; m: PatientModel; pal: Pal; slot: number; silhouette?: string }> = ({ a, m, pal, slot, silhouette }) => {
  const kind = accessoryKind(a);
  const { body, face } = m;
  const w = body.x1 - body.x0, bh = body.y1 - body.y0;
  const ink = silhouette ?? pal.ink;
  const fill = (c: string) => silhouette ?? c;
  if (silhouette && !["antenna", "cable_plug", "padlock"].includes(kind)) return null;
  switch (kind) {
    case "display": {
      const r = accessoryLayout(m)[slot];
      if (!r) return null; // the printer draws its display in the control panel
      return <Lcd x={r.cx} y={r.cy} h={r.h} text={displayText(a)} color={pal.accent} ink={ink} maxW={r.w} />;
    }
    case "antenna":
      return (
        <g>
          <path d={`M${w * 0.18} ${body.y0 + 4} L${w * 0.26} ${body.y0 - bh * 0.16}`} stroke={ink} strokeWidth={5} />
          <circle cx={w * 0.26} cy={body.y0 - bh * 0.16} r={7} fill={fill(pal.accent)} stroke={ink} strokeWidth={3} />
        </g>
      );
    case "cable_plug":
      return (
        <g>
          <path d={`M${body.x1 - 4} ${-bh * 0.3} q${w * 0.06} ${bh * 0.05} ${w * 0.04} ${bh * 0.2} q-${w * 0.02} ${bh * 0.1} -${w * 0.16} ${bh * 0.1}`} stroke={ink} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d={`M${body.x1 - 4} ${-bh * 0.3} q${w * 0.06} ${bh * 0.05} ${w * 0.04} ${bh * 0.2} q-${w * 0.02} ${bh * 0.1} -${w * 0.16} ${bh * 0.1}`} stroke={fill("#2b2b2b")} strokeWidth={5} fill="none" strokeLinecap="round" />
          <rect x={body.x1 - w * 0.2} y={-12} width={22} height={12} rx={2} fill={fill("#3a3a3a")} stroke={ink} strokeWidth={2.5} />
        </g>
      );
    case "out_of_order_sign": {
      const r = accessoryLayout(m)[slot];
      if (!r) return null;
      const rw = r.w / 1.04, rh = rw * 0.5, fs = rw * 0.18;
      return (
        <g transform={`rotate(-7 ${r.cx} ${r.cy})`}>
          <rect x={r.cx - rw / 2} y={r.cy - rh / 2} width={rw} height={rh} fill={PAPER} stroke={pal.ink} strokeWidth={3} />
          <text x={r.cx} y={r.cy - rh * 0.04} textAnchor="middle" fontFamily={FONTS.caption} fontSize={fs} fill="#C8262B">OUT OF</text>
          <text x={r.cx} y={r.cy + rh * 0.34} textAnchor="middle" fontFamily={FONTS.caption} fontSize={fs} fill="#C8262B">ORDER</text>
          <rect x={r.cx - rw / 2 - 6} y={r.cy - rh / 2 - 5} width={rw * 0.2} height={10} fill="#A8A8A0" opacity={0.9} transform={`rotate(-20 ${r.cx - rw / 2} ${r.cy - rh / 2})`} />
        </g>
      );
    }
    case "urgent_sticky": {
      const r = accessoryLayout(m)[slot];
      if (!r) return null;
      const sz = r.w / 1.15;
      return (
        <g transform={`rotate(${slot === 0 ? 9 : -9} ${r.cx} ${r.cy})`}>
          <rect x={r.cx - sz / 2} y={r.cy - sz / 2} width={sz} height={sz} fill="#F0E14A" stroke={pal.ink} strokeWidth={3} />
          <path d={`M${r.cx + sz / 2} ${r.cy + sz / 2 - sz * 0.22} L${r.cx + sz / 2 - sz * 0.22} ${r.cy + sz / 2}`} stroke={pal.ink} strokeWidth={2} opacity={0.5} />
          <text x={r.cx} y={r.cy + sz * 0.1} textAnchor="middle" fontFamily={FONTS.caption} fontSize={sz * 0.26} fill="#C8262B">URGENT</text>
        </g>
      );
    }
    case "caution_tape": {
      const y = body.y1 - bh * 0.2; // low on the body, under the mouth line
      return (
        <g>
          <clipPath id={`pt-caution-${m.spec.seed}`}>
            <path d={`M${body.x0 - 10} ${y} L${body.x1 + 10} ${y - bh * 0.18} l0 ${bh * 0.12} L${body.x0 - 10} ${y + bh * 0.12} Z`} />
          </clipPath>
          <path d={`M${body.x0 - 10} ${y} L${body.x1 + 10} ${y - bh * 0.18} l0 ${bh * 0.12} L${body.x0 - 10} ${y + bh * 0.12} Z`} fill="#F0E14A" stroke={pal.ink} strokeWidth={3} />
          <g clipPath={`url(#pt-caution-${m.spec.seed})`}>
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d={`M${body.x0 - 20 + i * w * 0.1} ${y + bh * 0.2} l${w * 0.05} ${-bh * 0.45} l${w * 0.04} 0 l${-w * 0.05} ${bh * 0.45} Z`} fill="#121212" />
            ))}
          </g>
        </g>
      );
    }
    case "padlock": {
      const x = body.x1 - w * 0.06, y = body.y0 + bh * 0.62;
      return (
        <g>
          <path d={`M${x - 10} ${y} v-14 a10 10 0 0 1 20 0 v14`} stroke={silhouette ?? "#9AA0A6"} strokeWidth={6} fill="none" />
          <rect x={x - 16} y={y - 2} width={32} height={28} rx={4} fill={fill("#B8962E")} stroke={ink} strokeWidth={3} />
          {!silhouette ? <circle cx={x} cy={y + 10} r={4} fill={pal.ink} /> : null}
        </g>
      );
    }
    default:
      return null;
  }
};

// ───────────────────────────── function markers ─────────────────────────────

/**
 * Paper feed at the back of the printer: a slightly fanned stack of rigid, square-cornered sheets in a
 * dark rear support (R1: rigid sheets + wide body + lid seam = printer, not a tissue box). Behind the body.
 */
const paperFan = (m: PatientModel, ink: string, sil?: string) => {
  const w = m.w, top = -m.h, bodyTop = m.body.y0;
  const sw = w * 0.48, sh = bodyTop - top + 56;
  const bx = -w * 0.02, by = bodyTop + 52;
  return (
    <g>
      <path d={rr(-w * 0.3, top + sh * 0.4, w * 0.26, bodyTop + 8, 6)} fill={sil ?? "#3b3b3b"} stroke={ink} strokeWidth={4} transform={`rotate(-4 0 ${bodyTop})`} />
      {[-19, -5, 9].map((a, i) => (
        <g key={a} transform={`rotate(${a} ${bx} ${by})`}>
          <rect x={bx - sw / 2} y={by - sh} width={sw} height={sh} fill={sil ?? (i === 2 ? PAPER : mixHex(PAPER, "#bdb6a6", 0.35 - i * 0.15))} stroke={ink} strokeWidth={4} />
          {!sil && i === 2 ? <path d={`M${bx + sw / 2 - 26} ${by - sh} l26 18`} stroke={ink} strokeWidth={2} opacity={0.4} /> : null}
        </g>
      ))}
    </g>
  );
};

/** Slot opening height and paper-tongue length by mouth shape (RMS: X/B/D; Rhubarb mapped). */
const slotOpen = (shape: MouthShape): number => ({ X: 0, A: 0, F: 0.25, B: 0.45, G: 0.45, C: 0.7, E: 0.7, H: 0.8, D: 1 })[shape];

/** Half-width of the printer's scanner/top unit as a fraction of the body width (stepped silhouette, R1). */
const PRINTER_TOP_INSET = 0.5;

/** Some markers replace the shape's silhouette parts (e.g. the printer's stepped top unit). null = use the shape. */
export function markerParts(m: PatientModel): Part[] | null {
  const { body } = m;
  const w = body.x1 - body.x0, bh = body.y1 - body.y0;
  switch (m.spec.functionMarker) {
    case "paper_tray_tongue": {
      const panelH = bh * 0.15;
      // full-width lid + body, both with rounded corners at the seam: the union keeps a small V notch on
      // each side (a two-part machine, not a plain box) that survives the 160 px silhouette (R1)
      const r = Math.min(16, w * 0.055);
      return [
        { d: rr(-w * PRINTER_TOP_INSET, body.y0, w * PRINTER_TOP_INSET, body.y0 + panelH + 2, 12) },
        { d: rr(body.x0, body.y0 + panelH - 2, body.x1, 0, r) },
      ];
    }
    default:
      return null;
  }
}

export interface MarkerArt {
  back?: React.ReactNode;
  front?: React.ReactNode;
  mouth?: React.ReactNode;
}

/** Fence glyph (advice A01 "set boundaries") drawn on the printer's display instead of its text. */
const FenceLcd: React.FC<{ x: number; y: number; h: number; w: number; color: string; ink: string }> = ({ x, y, h, w, color, ink }) => (
  <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} fill="#14201a" stroke={ink} strokeWidth={3.5} />
    <g stroke={color} strokeWidth={Math.max(2, h * 0.11)} strokeLinecap="round" fill="none">
      {[-0.3, -0.1, 0.1, 0.3].map((k) => (
        <path key={k} d={`M${x + k * w} ${y + h * 0.3} V${y - h * 0.18} l${-h * 0.08} ${-h * 0.1} M${x + k * w} ${y - h * 0.28} l${h * 0.08} ${h * 0.1}`} />
      ))}
      <path d={`M${x - w * 0.38} ${y - h * 0.05} H${x + w * 0.38} M${x - w * 0.38} ${y + h * 0.17} H${x + w * 0.38}`} />
    </g>
  </g>
);

export function markerArt(m: PatientModel, pal: Pal, mouth: MouthShape, opts: { silhouette?: string; panel?: { led: number; glyph?: "fence" } } = {}): MarkerArt {
  const panel = opts.panel;
  const sil = opts.silhouette;
  const ink = sil ?? pal.ink;
  const { body, face, slot } = m;
  const w = body.x1 - body.x0, bh = body.y1 - body.y0;
  switch (m.spec.functionMarker) {
    case "paper_tray_tongue": {
      const panelH = bh * 0.15;
      const disp = m.spec.accessories.find((a) => a.startsWith("display:"));
      const o = slotOpen(mouth);
      const sh = w * (0.035 + 0.13 * o);
      const tongueW = w * 0.44;
      const tongueL = w * (0.05 + 0.27 * o);
      const ty = slot.cy + sh / 2 - 2;
      let td = `M${-tongueW / 2} ${ty} H${tongueW / 2} V${ty + tongueL}`;
      for (let i = 0; i < 4; i++) {
        const x0 = tongueW / 2 - (i * tongueW) / 4;
        td += ` Q${x0 - tongueW / 8} ${ty + tongueL + (i % 2 ? -6 : 6)} ${x0 - tongueW / 4} ${ty + tongueL}`;
      }
      td += " Z";
      const tongue = (
        <g>
          <path
            d={td}
            fill={sil ?? PAPER}
            stroke={ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {!sil ? (
            <g stroke="#9a948a" strokeWidth={3} strokeLinecap="round">
              {[0.3, 0.55, 0.8].map((k) => (tongueL * k > 10 ? <path key={k} d={`M${-tongueW / 2 + 12} ${ty + tongueL * k} H${tongueW / 2 - 16 - 20 * k}`} /> : null))}
            </g>
          ) : null}
        </g>
      );
      return {
        back: paperFan(m, sil ?? pal.ink, sil),
        front: sil ? null : (
          <g>
            {/* control panel lid */}
            <path d={rr(-w * PRINTER_TOP_INSET + 3, body.y0 + 3, w * PRINTER_TOP_INSET - 3, body.y0 + panelH, 10)} fill={mixHex(pal.base, pal.shade, 0.45)} />
            <path d={`M${-w * PRINTER_TOP_INSET} ${body.y0 + panelH} H${w * PRINTER_TOP_INSET}`} stroke={ink} strokeWidth={4} />
            <path d={`M${-w * PRINTER_TOP_INSET + 18} ${body.y0 + 9} H${w * 0.08}`} stroke="#ffffff" strokeWidth={7} strokeLinecap="round" opacity={0.45} />
            <path d={`M${body.x0 + 14} ${body.y0 + panelH + 26} V${-bh * 0.3}`} stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.25} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={body.x0 + w * (0.12 + i * 0.075)} cy={body.y0 + panelH * 0.55} r={w * 0.022} fill={pal.shade} stroke={ink} strokeWidth={2.5} />
            ))}
            {panel && panel.led > 0 ? (
              <circle cx={body.x0 + w * 0.36} cy={body.y0 + panelH * 0.55} r={w * 0.045} fill="#FFB020" opacity={0.45 * panel.led} />
            ) : null}
            <circle cx={body.x0 + w * 0.36} cy={body.y0 + panelH * 0.55} r={w * 0.018} fill={panel && panel.led > 0.5 ? "#FFC23A" : pal.accent} stroke={ink} strokeWidth={2} />
            {disp && panel?.glyph === "fence" ? (
              <FenceLcd x={body.x1 - w * 0.23} y={body.y0 + panelH * 0.55} h={panelH * 0.62} w={w * 0.24} color="#FFC23A" ink={ink} />
            ) : disp ? (
              <Lcd x={body.x1 - w * 0.23} y={body.y0 + panelH * 0.55} h={panelH * 0.62} text={displayText(disp)} color={pal.accent} ink={ink} maxW={w * 0.32} />
            ) : null}
            {/* paper drawer */}
            <path d={rr(body.x0 + w * 0.07, -bh * 0.2, body.x1 - w * 0.07, -bh * 0.04, 6)} fill={mixHex(pal.base, pal.shade, 0.3)} stroke={ink} strokeWidth={3.5} />
            <path d={rr(-w * 0.12, -bh * 0.145, w * 0.12, -bh * 0.095, 6)} fill="#2a2a2a" />
            <path d={`M${body.x0 + w * 0.07} ${-bh * 0.2} H${body.x0 + w * 0.2}`} stroke={pal.accent} strokeWidth={5} />
          </g>
        ),
        mouth: (
          <g>
            {!sil ? <path d={rr(-slot.w / 2 - 8, slot.cy - sh / 2 - 8, slot.w / 2 + 8, slot.cy + sh / 2 + 8, 10)} fill={pal.shade} stroke={ink} strokeWidth={4} /> : null}
            {!sil ? <path d={rr(-slot.w / 2, slot.cy - sh / 2, slot.w / 2, slot.cy + sh / 2, Math.min(8, sh / 2))} fill="#161616" /> : null}
            {tongue}
          </g>
        ),
      };
    }
    case "toaster_slots":
      return {
        front: sil ? null : (
          <g>
            {[-0.2, 0.2].map((k) => <path key={k} d={rr(k * w - w * 0.14, body.y0 + 6, k * w + w * 0.14, body.y0 + 18, 5)} fill="#1a1a1a" />)}
            <path d={rr(body.x1 - 6, body.y0 + bh * 0.3, body.x1 + 10, body.y0 + bh * 0.38, 3)} fill={pal.shade} stroke={ink} strokeWidth={3} />
          </g>
        ),
      };
    case "cracked_screen_badge":
      return {
        front: sil ? null : (
          <g>
            <path d={`M${face.x0 + 6} ${face.y0 + bh * 0.1} l${w * 0.18} ${bh * 0.06} l${w * 0.06} ${bh * 0.1} m${-w * 0.06} ${-bh * 0.1} l${w * 0.14} ${-bh * 0.04}`} stroke="#fff" strokeWidth={3} opacity={0.7} fill="none" />
            <circle cx={face.x1 - 4} cy={face.y0 + 4} r={w * 0.11} fill="#C8262B" stroke={ink} strokeWidth={4} />
            <text x={face.x1 - 4} y={face.y0 + 4 + w * 0.045} textAnchor="middle" fontFamily={FONTS.caption} fontSize={w * 0.11} fill="#fff">99+</text>
          </g>
        ),
      };
    case "calendar_mon":
      if (m.spec.header) return {};
      return {
        front: sil ? null : (
          <g>
            <path d={rr(body.x0 + 3, body.y0 + 3, body.x1 - 3, body.y0 + bh * 0.24, 10)} fill={pal.accent} />
            <text x={0} y={body.y0 + bh * 0.2} textAnchor="middle" fontFamily={FONTS.caption} fontSize={bh * 0.16} fill={PAPER}>MON</text>
            {[-0.25, 0.25].map((k) => <circle key={k} cx={k * w} cy={body.y0 + 2} r={w * 0.035} fill="#2a2a2a" stroke={ink} strokeWidth={3} />)}
          </g>
        ),
      };
    default:
      return {};
  }
}
