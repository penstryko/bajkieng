// NOTEPAD camera card (bible §5.4 C), SCREEN space, replaces the scene: clipboard 900×1300 centred
// (540, 900), drawing field 760×900 (x 160–920, y 450–1350). One primitive red-marker doodle, no words
// (rule 4). The marker hand follows the tip of the stroke being drawn. Pure function of props.
// Owned by the set builder. Doodle keys: DOODLE_KEYS in registry.ts (data in doodles.ts).
import React from "react";
import type { NotepadCardProps } from "../../contract";
import { DOCTOR_COLORS as D, POS } from "../../engine";
import { DOODLES, doodleStrokes, partial, polyD, smooth, strokeProgress, type Pt } from "./doodles";
import { LabelTape } from "./Caption";

const MARKER = "#C8262B";
const QMARK: Pt[][] = [smooth([[220, 320], [380, 200], [560, 320], [380, 520], [380, 640]], 6), [[380, 760], [380, 772]]];
const INK = "#121212";

/** The doctor's hand holding a red marker; marker tip at (0,0), hand and cardigan cuff up to the right. */
const MarkerHand: React.FC<{ x: number; y: number; lift: number }> = ({ x, y, lift }) => (
  <g transform={`translate(${x} ${y - lift}) rotate(32)`}>
    {/* sleeve + cuff (petrol cardigan) running off the card */}
    <path d="M-44 -560 L44 -560 L40 -196 L-40 -196 Z" fill={D.cardigan} stroke={INK} strokeWidth={6} />
    <rect x={-46} y={-212} width={92} height={38} rx={10} fill={D.cardiganShade} stroke={INK} strokeWidth={6} />
    {/* hand */}
    <path d="M-34 -178 Q-44 -120 -18 -84 Q0 -70 22 -86 Q44 -120 34 -178 Z" fill={D.skin} stroke={INK} strokeWidth={6} />
    <path d="M-22 -112 q-18 10 -10 30 q10 10 22 -2" fill={D.skin} stroke={INK} strokeWidth={5} />
    {/* marker */}
    <rect x={-10} y={-120} width={20} height={92} rx={6} fill={MARKER} stroke={INK} strokeWidth={5} />
    <path d="M-8 -30 L0 0 L8 -30 Z" fill="#efe7d6" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-3 -10 L0 0 L3 -10 Z" fill={MARKER} />
  </g>
);

export const NotepadCard: React.FC<NotepadCardProps> = ({ doodle, drawProgress, boilSeed, adviceLabel, flip }) => {
  const { c, w, h, field } = POS.notepadCard;
  const x0 = c[0] - w / 2, y0 = c[1] - h / 2;
  const fx = c[0] - field.w / 2, fy = c[1] - field.h / 2;
  const def = DOODLES[doodle];
  // unknown key → a big "?" so a missing doodle is obvious in QA
  const strokes: Pt[][] = def ? doodleStrokes(doodle, boilSeed) : QMARK;
  const prog = strokeProgress(strokes, Math.max(0, Math.min(1, drawProgress)));
  let tip: Pt | null = null;
  const paths = strokes.map((s, i) => {
    if (prog[i] <= 0) return null;
    const p = partial(s, prog[i]);
    if (prog[i] < 1) tip = p.tip;
    return <path key={i} d={polyD(p.pts)} />;
  });
  if (!tip && drawProgress < 1) tip = strokes[0]?.[0] ?? null;
  const k = Math.max(0, Math.min(1, flip));
  const lineYs = Array.from({ length: 18 }, (_, i) => y0 + 170 + i * 66);
  return (
    <g transform={`translate(0 ${(1 - k) * 1300}) rotate(${(1 - k) * 8} 540 1500)`}>
      {/* lap / cardigan background */}
      <rect x={-200} y={-200} width={1480} height={2400} fill="#15232a" />
      <path d="M-200 1600 Q540 1460 1280 1600 V2200 H-200 Z" fill="#163f45" />
      {/* clipboard */}
      <rect x={x0 + 10} y={y0 + 14} width={w} height={h} rx={34} fill="#000" opacity={0.4} />
      <rect x={x0} y={y0} width={w} height={h} rx={34} fill={D.clipboard} stroke={INK} strokeWidth={8} />
      {[0.2, 0.45, 0.8].map((q) => (
        <path key={q} d={`M${x0 + 20} ${y0 + h * q} q${w / 2} -18 ${w - 40} 6`} stroke="#6f4824" strokeWidth={4} fill="none" opacity={0.6} />
      ))}
      {/* paper */}
      <rect x={x0 + 44} y={y0 + 90} width={w - 88} height={h - 130} fill={D.paper} stroke={INK} strokeWidth={4} />
      {lineYs.map((y) => (y < y0 + h - 50 ? <path key={y} d={`M${x0 + 48} ${y} H${x0 + w - 48}`} stroke="#c3cfd6" strokeWidth={3} /> : null))}
      <path d={`M${x0 + 140} ${y0 + 92} V${y0 + h - 42}`} stroke="#dd9b9b" strokeWidth={3} />
      <path d={`M${x0 + w - 150} ${y0 + h - 160} a52 52 0 1 0 1 0`} stroke="#8a6a45" strokeWidth={8} fill="none" opacity={0.25} />
      {/* metal clip */}
      <rect x={c[0] - 170} y={y0 - 36} width={340} height={104} rx={18} fill="#9AA0A6" stroke={INK} strokeWidth={7} />
      <rect x={c[0] - 120} y={y0 + 20} width={240} height={30} rx={10} fill="#6d7378" stroke={INK} strokeWidth={4} />
      <circle cx={c[0] - 140} cy={y0 + 4} r={9} fill="#5a5f63" />
      <circle cx={c[0] + 140} cy={y0 + 4} r={9} fill="#5a5f63" />
      {/* doodle */}
      <g transform={`translate(${fx} ${fy})`} stroke={MARKER} strokeWidth={def?.width ?? 17} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {paths}
      </g>
      {tip ? <MarkerHand x={fx + (tip as Pt)[0]} y={fy + (tip as Pt)[1]} lift={0} /> : drawProgress >= 1 ? <MarkerHand x={fx + field.w + 10} y={fy + field.h + 40} lift={30} /> : null}
      {adviceLabel ? <LabelTape text={adviceLabel} cx={500} cy={1277} maxW={560} maxFont={64} tilt={1} /> : null}
    </g>
  );
};
