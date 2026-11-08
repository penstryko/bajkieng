// Caption band (z14, SCREEN space): y 1235–1320, x 80–920, ≤ 6 words (bible §5.2, §6.2, lint 6).
// Style = cheap label-maker tape: black tape, slight tilt, Anton caps. "PATIENT #001: OFFICE PRINTER"
// renders the prefix (up to the first ": ") in phosphor amber and the name in off-white.
// Pure function of props. Owned by the set builder.
import React from "react";
import type { CaptionProps } from "../../contract";
import { FONTS, SAFE } from "../../engine";
import { CAP_HEIGHT, fitSize, textWidth } from "./text";

export const CAPTION_STYLE = {
  tape: "#151515",
  edge: "#2c2c2c",
  prefix: "#FFC857",
  text: "#F2ECDD",
  maxFont: 64,
  tilt: -1.2,
  tapeH: 66,
  pad: 28,
} as const;

/** Split "PATIENT #001: OFFICE PRINTER" → ["PATIENT #001: ", "OFFICE PRINTER"]; other texts → ["", text]. */
export const splitCaption = (text: string): [string, string] => {
  const i = text.indexOf(": ");
  return i > 0 && i < 20 ? [text.slice(0, i + 2), text.slice(i + 2)] : ["", text];
};

/** The tape itself, centred at (cx, cy); reused by the notepad advice label. */
export const LabelTape: React.FC<{ text: string; cx: number; cy: number; maxW: number; maxFont?: number; tilt?: number }> = ({
  text, cx, cy, maxW, maxFont = CAPTION_STYLE.maxFont, tilt = CAPTION_STYLE.tilt,
}) => {
  const S = CAPTION_STYLE;
  const [pre, rest] = splitCaption(text.toUpperCase());
  const size = fitSize(pre + rest, maxW - 2 * S.pad, maxFont, "anton", 1);
  const tw = textWidth(pre + rest, size, "anton", 1);
  const w = Math.max(tw + 2 * S.pad, 300);
  const h = S.tapeH;
  const x0 = cx - w / 2, y0 = cy - h / 2;
  const notch = `M${x0} ${y0} H${x0 + w} l-10 ${h / 4} l10 ${h / 4} l-10 ${h / 4} l10 ${h / 4} H${x0} l10 ${-h / 4} l-10 ${-h / 4} l10 ${-h / 4} Z`;
  const base = cy + (CAP_HEIGHT.anton * size) / 2;
  const tx = cx - tw / 2;
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <path d={notch} fill="#000" opacity={0.35} transform="translate(6 7)" />
      <path d={notch} fill={S.tape} stroke={S.edge} strokeWidth={3} />
      <path d={`M${x0 + 14} ${y0 + 6} H${x0 + w - 14}`} stroke="#ffffff" strokeWidth={3} opacity={0.08} />
      <text x={tx} y={base} fontFamily={FONTS.caption} fontSize={size} letterSpacing={1}>
        {pre ? <tspan fill={S.prefix}>{pre}</tspan> : null}
        <tspan fill={S.text}>{rest}</tspan>
      </text>
    </g>
  );
};

export const Caption: React.FC<CaptionProps> = ({ text, scale, opacity }) => {
  const [x0, y0, x1, y1] = SAFE.CAPTION_BAND;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  if (scale <= 0 || opacity <= 0) return null;
  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      <LabelTape text={text} cx={cx} cy={cy} maxW={x1 - x0} />
    </g>
  );
};
