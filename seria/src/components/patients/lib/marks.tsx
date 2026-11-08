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

export const Accessory: React.FC<{ a: PatientAccessory; m: PatientModel; pal: Pal; slot: number; silhouette?: string }> = ({ a, m, pal, slot, silhouette }) => {
  const kind = accessoryKind(a);
  const { body, face } = m;
  const w = body.x1 - body.x0, bh = body.y1 - body.y0;
  const ink = silhouette ?? pal.ink;
  const fill = (c: string) => silhouette ?? c;
  if (silhouette && !["antenna", "cable_plug", "padlock"].includes(kind)) return null;
  switch (kind) {
    case "display": {
      if (m.spec.functionMarker === "paper_tray_tongue") return null; // drawn in the printer's control panel
      return <Lcd x={face.x1 - w * 0.17} y={face.y0 + bh * 0.06} h={Math.max(18, w * 0.09)} text={displayText(a)} color={pal.accent} ink={ink} maxW={w * 0.5} />;
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
    case "out_of_order_sign":
      return (
        <g transform={`rotate(-7 ${face.x0 + w * 0.22} ${face.y1 - bh * 0.18})`}>
          <rect x={face.x0 + w * 0.04} y={face.y1 - bh * 0.3} width={w * 0.36} height={bh * 0.2} fill={PAPER} stroke={pal.ink} strokeWidth={3} />
          <text x={face.x0 + w * 0.22} y={face.y1 - bh * 0.21} textAnchor="middle" fontFamily={FONTS.caption} fontSize={w * 0.06} fill="#C8262B">OUT OF</text>
          <text x={face.x0 + w * 0.22} y={face.y1 - bh * 0.13} textAnchor="middle" fontFamily={FONTS.caption} fontSize={w * 0.06} fill="#C8262B">ORDER</text>
          <rect x={face.x0 + w * 0.02} y={face.y1 - bh * 0.32} width={w * 0.07} height={10} fill="#A8A8A0" opacity={0.9} />
        </g>
      );
    case "urgent_sticky": {
      const sx = slot === 0 ? face.x1 - w * 0.12 : face.x0 + w * 0.12;
      const sy = face.y0 + bh * (slot === 0 ? 0.42 : 0.5);
      const s = w * 0.2;
      return (
        <g transform={`rotate(${slot === 0 ? 9 : -9} ${sx} ${sy})`}>
          <rect x={sx - s / 2} y={sy - s / 2} width={s} height={s} fill="#F0E14A" stroke={pal.ink} strokeWidth={3} />
          <text x={sx} y={sy + s * 0.1} textAnchor="middle" fontFamily={FONTS.caption} fontSize={s * 0.26} fill="#C8262B">URGENT</text>
        </g>
      );
    }
    case "caution_tape": {
      const y = body.y1 - bh * 0.3;
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

/** Paper fan standing in the printer's input tray (behind the body). */
const paperFan = (m: PatientModel, ink: string, sil?: string) => {
  const w = m.w, top = -m.h, bodyTop = m.body.y0;
  const sw = w * 0.5, sh = bodyTop - top + 56;
  const bx = -w * 0.04, by = bodyTop + 52;
  return (
    <g>
      <path d={rr(-w * 0.3, top + sh * 0.4, w * 0.26, bodyTop + 8, 6)} fill={sil ?? "#3b3b3b"} stroke={ink} strokeWidth={4} transform={`rotate(-4 0 ${bodyTop})`} />
      {[-17, -6, 6].map((a, i) => (
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
const PRINTER_TOP_INSET = 0.44;

/** Some markers replace the shape's silhouette parts (e.g. the printer's stepped top unit). null = use the shape. */
export function markerParts(m: PatientModel): Part[] | null {
  const { body } = m;
  const w = body.x1 - body.x0, bh = body.y1 - body.y0;
  switch (m.spec.functionMarker) {
    case "paper_tray_tongue": {
      const panelH = bh * 0.15;
      return [
        { d: rr(-w * PRINTER_TOP_INSET, body.y0, w * PRINTER_TOP_INSET, body.y0 + panelH + 16, 12) },
        { d: rr(body.x0, body.y0 + panelH, body.x1, 0, Math.min(16, w * 0.05)) },
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

export function markerArt(m: PatientModel, pal: Pal, mouth: MouthShape, opts: { silhouette?: string } = {}): MarkerArt {
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
            <circle cx={body.x0 + w * 0.36} cy={body.y0 + panelH * 0.55} r={w * 0.018} fill={pal.accent} stroke={ink} strokeWidth={2} />
            {disp ? <Lcd x={body.x1 - w * 0.23} y={body.y0 + panelH * 0.55} h={panelH * 0.62} text={displayText(disp)} color={pal.accent} ink={ink} maxW={w * 0.32} /> : null}
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
