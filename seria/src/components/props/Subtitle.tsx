// Burned-in dialogue subtitle (style v2, SCREEN space). Band y 1330–1418: below the caption band
// (1235–1320) and above the platform UI (1420+). Up to 2 lines, white Anton with a thick black outline;
// the doctor's lines are tinted phosphor amber so the viewer always knows who speaks. Pure function of props.
import React from "react";
import { FONTS } from "../../engine";
import { fitSize, textWidth } from "./text";

export interface SubtitleProps {
  text: string;
  who: "doctor" | "patient" | "boss";
  /** 0..1 pop-in/out factor */
  k: number;
}

const MAX_W = 900;
const split2 = (t: string): string[] => {
  if (textWidth(t, 60, "anton", 1) <= MAX_W) return [t];
  const w = t.split(" ");
  let best = 1, diff = Infinity;
  for (let i = 1; i < w.length; i++) {
    const d = Math.abs(w.slice(0, i).join(" ").length - w.slice(i).join(" ").length);
    if (d < diff) { diff = d; best = i; }
  }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
};

export const Subtitle: React.FC<SubtitleProps> = ({ text, who, k }) => {
  const lines = split2(text);
  const size = Math.min(...lines.map((l) => fitSize(l, MAX_W, lines.length > 1 ? 50 : 62, "anton", 1)));
  const lh = size * 1.08;
  const y0 = 1374 - ((lines.length - 1) * lh) / 2 + size * 0.36;
  const fill = who === "doctor" ? "#FFC857" : who === "boss" ? "#FF8A5B" : "#FFFFFF";
  return (
    <g opacity={k} transform={`translate(540 1374) scale(${0.92 + 0.08 * k}) translate(-540 -1374)`}>
      {lines.map((l, i) => (
        <text key={i} x={540} y={y0 + i * lh} textAnchor="middle" fontFamily={FONTS.caption} fontSize={size}
          fill={fill} stroke="#111" strokeWidth={size * 0.16} paintOrder="stroke" strokeLinejoin="round" letterSpacing={0.5}>
          {l}
        </text>
      ))}
    </g>
  );
};
