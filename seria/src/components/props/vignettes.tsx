// Memory-bubble vignettes (bible §4.7, §6.1 "Stawka"): flat, static scenes of grey faceless humans
// abusing the patient, with 1–2 moving elements (keys in `moving`). Drawn in a 500×360 design box and
// fitted into the bubble interior. Registry keys: VIGNETTE_KEYS in registry.ts. Owned by the set builder.
import React from "react";
import { FONTS } from "../../engine";
import { Human } from "../humans/Human";

const INK = "#121212";
const W = 500, H = 360; // design box (= POS.bubble size)
const FLOOR = 318;

/** A simplified office printer for memories (same palette as the S01E01 patient, no face: it is a memory). */
export const MiniPrinter: React.FC<{ x: number; y: number; s?: number; rot?: number; jam?: number }> = ({ x, y, s = 1, rot = 0, jam = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-50} y={-128} width={100} height={60} fill="#F4F1EA" stroke={INK} strokeWidth={4} transform="rotate(-4 0 -100)" />
    <rect x={-70} y={-96} width={140} height={96} rx={10} fill="#E9E4D8" stroke={INK} strokeWidth={5} />
    <rect x={-66} y={-92} width={132} height={16} rx={6} fill="#d3ccbd" />
    <rect x={30} y={-90} width={30} height={11} rx={2} fill="#14201a" />
    <rect x={-46} y={-52} width={92} height={10} rx={4} fill="#161616" />
    {jam > 0 ? (
      <path d={`M-30 -44 l10 ${14 + 30 * jam} l12 -10 l10 ${16 + 20 * jam} l14 -14 l8 ${10 + 24 * jam} l10 -6`} stroke={INK} strokeWidth={3} fill="#F4F1EA" />
    ) : (
      <rect x={-30} y={-44} width={60} height={10} fill="#F4F1EA" stroke={INK} strokeWidth={3} />
    )}
    <rect x={-56} y={-26} width={112} height={18} rx={4} fill="#d3ccbd" stroke={INK} strokeWidth={3} />
    <path d="M-40 -90 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" fill="none" stroke="#6B4423" strokeWidth={3} opacity={0.6} />
  </g>
);

const Floor: React.FC = () => (
  <g>
    <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="#cbbfa5" />
    <path d={`M0 ${FLOOR} H${W}`} stroke={INK} strokeWidth={4} />
  </g>
);

const Impact: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) =>
  k <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.6 * k})`} opacity={Math.min(1, k * 1.5)}>
      <path d="M0 -30 l8 18 l20 -6 l-10 18 l18 12 l-22 2 l2 22 l-16 -14 l-16 14 l2 -22 l-22 -2 l18 -12 l-10 -18 l20 6 Z" fill="#F0E14A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );

/** Office desk/stand under the printer. */
const Stand: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 90} y={FLOOR - 120} width={180} height={14} fill="#8b8f97" stroke={INK} strokeWidth={4} />
    <path d={`M${x - 76} ${FLOOR - 106} V${FLOOR} M${x + 76} ${FLOOR - 106} V${FLOOR}`} stroke={INK} strokeWidth={8} />
  </g>
);

const VIGNETTES: Record<string, React.FC<{ t: number; moving: string[] }>> = {
  /** S01E01: a grey office worker kicks the printer on a low cabinet (moving: human_leg, printer_shake). */
  office_kick: ({ t, moving }) => {
    const period = 22;
    const ph = (t % period) / period;
    const swing = Math.pow(Math.max(0, Math.sin(ph * Math.PI * 2)), 1.3);
    const kick = moving.includes("human_leg") ? 10 + 78 * swing : 80;
    const hit = moving.includes("human_leg") ? Math.max(0, (swing - 0.8) / 0.2) : 0.8;
    const shake = moving.includes("printer_shake") ? hit * 7 : 0;
    return (
      <g>
        <Floor />
        {/* low cabinet */}
        <rect x={262} y={FLOOR - 64} width={170} height={64} fill="#8b8f97" stroke={INK} strokeWidth={4} />
        <path d={`M276 ${FLOOR - 40} h140`} stroke={INK} strokeWidth={3} />
        <MiniPrinter x={350 + shake} y={FLOOR - 64} rot={shake * 0.9} />
        <Impact x={274} y={FLOOR - 110} k={hit} />
        <Human pose="kick" x={168} y={FLOOR} scale={0.84} moveAngle={kick} accessory="tie" />
      </g>
    );
  },
  /** A human yells at the jammed printer (moving: human_arm). */
  office_yell: ({ t, moving }) => {
    const shake = moving.includes("human_arm") ? 12 * Math.sin(t * 0.9) : 0;
    return (
      <g>
        <Floor />
        <Stand x={350} />
        <MiniPrinter x={350} y={FLOOR - 120} jam={1} />
        <Human pose="yell" x={140} y={FLOOR} scale={0.8} moveAngle={shake} />
        <g fontFamily={FONTS.caption} fontSize={44} fill="#C8262B" stroke={INK} strokeWidth={2}>
          <text x={210} y={80}>#$%!</text>
        </g>
      </g>
    );
  },
  /** A human yanks jammed paper out of the printer (moving: paper). */
  paper_jam_yank: ({ t, moving }) => {
    const pull = moving.includes("paper") ? 0.5 + 0.5 * Math.sin(t * 0.5) : 0.6;
    const hx = 150 + 20 * pull;
    return (
      <g>
        <Floor />
        <Stand x={360} />
        <MiniPrinter x={360} y={FLOOR - 120} rot={-3 * pull} />
        <path d={`M${330} ${FLOOR - 166} L${hx + 70} ${FLOOR - 196 + 10 * pull}`} stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d={`M${330} ${FLOOR - 166} L${hx + 70} ${FLOOR - 196 + 10 * pull}`} stroke="#F4F1EA" strokeWidth={15} strokeLinecap="round" strokeDasharray="14 6" />
        <Human pose="point" x={hx} y={FLOOR} scale={0.8} moveAngle={-8 + 10 * pull} />
      </g>
    );
  },
};

export const VIGNETTE_IDS = Object.keys(VIGNETTES);

/** Draw vignette `id` fitted into the rect (x0, y0, x1, y1). Unknown ids draw a neutral placeholder card. */
export const Vignette: React.FC<{ id: string; t: number; moving: string[]; rect: [number, number, number, number] }> = ({ id, t, moving, rect }) => {
  const [x0, y0, x1, y1] = rect;
  const s = Math.min((x1 - x0) / W, (y1 - y0) / H);
  const ox = x0 + ((x1 - x0) - W * s) / 2, oy = y0 + ((y1 - y0) - H * s) / 2;
  const V = VIGNETTES[id];
  return (
    <g transform={`translate(${ox} ${oy}) scale(${s})`}>
      {V ? <V t={t} moving={moving} /> : <rect x={0} y={0} width={W} height={H} fill="#d8cdb6" />}
    </g>
  );
};
