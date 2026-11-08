// PLACEHOLDER — owned by the set builder. Keep NotepadCardProps; doodles are keyed by DOODLE_KEYS.
// NOTEPAD camera = flat card in SCREEN space: clipboard 900×1300 centred (540, 900), field 760×900 (bible §5.4 C).
import React from "react";
import type { NotepadCardProps } from "../../contract";
import { DOCTOR_COLORS as C, FONTS, POS, jitterPoint } from "../../engine";

const MARKER = "#C8262B";

/** Doodles as stroke lists in FIELD coordinates (0..760 × 0..900). Drawn with pathLength=1 + dashoffset. */
const DOODLES: Record<string, string[]> = {
  A01_fence: [
    "M80 700 H680", "M80 520 H680",
    ...[120, 240, 360, 480, 600].map((x) => `M${x} 760 V420 l30 -40 l30 40 V760`),
  ],
  printer_with_horns: [
    "M180 420 h400 v260 h-400 z", "M230 680 v80 h300 v-80", "M260 420 l-60 -140 l120 110", "M500 420 l60 -140 l-120 110",
    "M290 520 h40", "M430 520 h40", "M300 610 q80 -40 160 0",
  ],
};

export const NotepadCard: React.FC<NotepadCardProps> = ({ doodle, strokes, boilSeed, adviceLabel, flip }) => {
  const { c, w, h, field } = POS.notepadCard;
  const x0 = c[0] - w / 2, y0 = c[1] - h / 2;
  const fx = c[0] - field.w / 2, fy = c[1] - field.h / 2 + 40;
  const paths = DOODLES[doodle] ?? ["M200 300 q200 -200 360 0 t-180 300 v120", "M380 860 v20"];
  return (
    <g transform={`translate(0 ${(1 - flip) * 1920})`}>
      <rect x={0} y={0} width={1080} height={1920} fill="#2a2420" />
      <rect x={x0} y={y0} width={w} height={h} rx={30} fill={C.clipboard} />
      <rect x={x0 + 50} y={y0 + 110} width={w - 100} height={h - 160} fill={C.paper} />
      <rect x={c[0] - 140} y={y0 - 10} width={280} height={70} rx={12} fill="#5a5a5a" />
      <g transform={`translate(${fx} ${fy})`} stroke={MARKER} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {paths.map((d, i) => {
          const k = strokes.length ? strokes[Math.min(strokes.length - 1, Math.floor((i / paths.length) * strokes.length))] : 1;
          const [jx, jy] = jitterPoint(boilSeed, i, 1.5);
          return <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} transform={`translate(${jx} ${jy})`} />;
        })}
      </g>
      {adviceLabel ? (
        <text x={540} y={1300} textAnchor="middle" fontFamily={FONTS.caption} fontSize={64} fill="#fff" stroke="#000" strokeWidth={8} paintOrder="stroke">
          {adviceLabel}
        </text>
      ) : null}
    </g>
  );
};
