// z12 bubbles (bible §9.4 bubbleInflate, grawlix): memory (vignette of humans, box x 140–640, y 330–690),
// thought (cloud) and speech (grawlix burst or the one clear word). Memory/thought bubbles get the
// classic tail of three dots that pop one by one towards the speaker; speech bubbles get a wedge tail
// that grows with the same dot timing. Pure function of props. Owned by the set builder.
import React from "react";
import type { BubbleProps } from "../../contract";
import type { XY } from "../../schema";
import { FONTS } from "../../engine";
import { Vignette } from "./vignettes";
import { CAP_HEIGHT, fitSize } from "./text";

const INK = "#121212";
const FILL = { memory: "#EDE6D6", thought: "#F4F1EA", speech: "#FFFFFF" } as const;
const GRAWLIX_COLORS = ["#C8262B", INK, "#C8262B", "#1F5E66", INK];

/** Scalloped cloud outline around a rect: rounded rect + bumps (union outline pass in the caller). */
const cloudParts = (x0: number, y0: number, x1: number, y1: number): string[] => {
  const w = x1 - x0, h = y1 - y0;
  const r = Math.min(w, h) * 0.13;
  const parts = [`M${x0 + r} ${y0} H${x1 - r} Q${x1} ${y0} ${x1} ${y0 + r} V${y1 - r} Q${x1} ${y1} ${x1 - r} ${y1} H${x0 + r} Q${x0} ${y1} ${x0} ${y1 - r} V${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} Z`];
  const bump = (cx: number, cy: number, br: number) => `M${cx - br} ${cy} a${br} ${br} 0 1 0 ${2 * br} 0 a${br} ${br} 0 1 0 ${-2 * br} 0 Z`;
  const nx = Math.max(3, Math.round(w / 90)), ny = Math.max(2, Math.round(h / 90));
  for (let i = 0; i <= nx; i++) {
    const cx = x0 + r + ((w - 2 * r) * i) / nx;
    parts.push(bump(cx, y0 + 6, r * (0.95 + 0.25 * ((i * 7) % 3) / 2)));
    parts.push(bump(cx, y1 - 6, r * (0.95 + 0.25 * ((i * 5) % 3) / 2)));
  }
  for (let j = 1; j < ny; j++) {
    const cy = y0 + (h * j) / ny;
    parts.push(bump(x0 + 6, cy, r));
    parts.push(bump(x1 - 6, cy, r));
  }
  return parts;
};

/** Spiky burst polygon for cursing (grawlix). */
const burst = (x0: number, y0: number, x1: number, y1: number): string => {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
  const n = 18;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const k = i % 2 === 0 ? 1.06 + 0.06 * ((i * 7) % 3) : 0.8;
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
};

/** Point on the body's bottom edge closest to the tail (x clamped into the body). */
const anchorOnBody = (box: [number, number, number, number], tail: XY): XY => {
  const [x0, y0, x1, y1] = box;
  const x = Math.max(x0 + 60, Math.min(x1 - 60, tail[0]));
  if (tail[1] >= y1) return [x, y1];
  if (tail[1] <= y0) return [x, y0];
  return [tail[0] < x0 ? x0 : x1, Math.max(y0 + 40, Math.min(y1 - 40, tail[1]))];
};

export const Bubble: React.FC<BubbleProps> = ({ kind, box, tail, inflate, dots, vignette, moving = [], t, grawlix, text }) => {
  const [x0, y0, x1, y1] = box;
  const fill = FILL[kind];
  const [ax, ay] = anchorOnBody(box, tail);
  const tx = tail[0], ty = tail[1];
  const uid = `bubble-${kind}-${Math.round(x0)}-${Math.round(y0)}`;
  const isCurse = kind === "speech" && grawlix && grawlix.length > 0;
  const bodyParts = kind === "speech" ? (isCurse ? [burst(x0, y0, x1, y1)] : [`M${x0 + 44} ${y0} H${x1 - 44} Q${x1} ${y0} ${x1} ${y0 + 44} V${y1 - 44} Q${x1} ${y1} ${x1 - 44} ${y1} H${x0 + 44} Q${x0} ${y1} ${x0} ${y1 - 44} V${y0 + 44} Q${x0} ${y0} ${x0 + 44} ${y0} Z`]) : cloudParts(x0, y0, x1, y1);
  // speech wedge grows with the dot timing
  const grow = Math.max(dots[0], dots[1], dots[2]);
  const wedgeTip: XY = [ax + (tx - ax) * grow, ay + (ty - ay) * grow];
  const wedge = `M${ax - 34} ${ay - 10} L${wedgeTip[0]} ${wedgeTip[1]} L${ax + 30} ${ay - 10} Z`;
  const inner: [number, number, number, number] = [x0 + 30, y0 + 30, x1 - 30, y1 - 30];
  const gl = grawlix ?? [];
  const gw = (x1 - x0 - 90) / Math.max(1, gl.length);
  const gSize = Math.min((y1 - y0) * 0.5, gw / 0.62);
  return (
    <g>
      {kind !== "speech"
        ? [0, 1, 2].map((i) => {
            const k = 0.2 + i * 0.26;
            const r = (9 + i * 6) * dots[i];
            if (r <= 0.2) return null;
            const cx = tx + (ax - tx) * k, cy = ty + (ay - ty) * k;
            return <circle key={i} cx={cx} cy={cy} r={r} fill={fill} stroke={INK} strokeWidth={5} />;
          })
        : null}
      {inflate > 0 ? (
        <g transform={`translate(${ax} ${ay}) scale(${inflate}) translate(${-ax} ${-ay})`}>
          {kind === "speech" ? <path d={wedge} fill={INK} stroke={INK} strokeWidth={12} strokeLinejoin="round" /> : null}
          {bodyParts.map((d, i) => <path key={`o${i}`} d={d} fill={INK} stroke={INK} strokeWidth={12} strokeLinejoin="round" />)}
          {kind === "speech" ? <path d={wedge} fill={fill} /> : null}
          {bodyParts.map((d, i) => <path key={`f${i}`} d={d} fill={fill} />)}
          {vignette ? (
            <g>
              <clipPath id={`${uid}-clip`}>
                <rect x={inner[0]} y={inner[1]} width={inner[2] - inner[0]} height={inner[3] - inner[1]} rx={28} />
              </clipPath>
              <rect x={inner[0]} y={inner[1]} width={inner[2] - inner[0]} height={inner[3] - inner[1]} rx={28} fill="#E2D7BF" />
              <g clipPath={`url(#${uid}-clip)`}>
                <Vignette id={vignette} t={t} moving={moving} rect={inner} />
              </g>
              <rect x={inner[0]} y={inner[1]} width={inner[2] - inner[0]} height={inner[3] - inner[1]} rx={28} fill="none" stroke={INK} strokeWidth={4} />
              {/* memory tint: slightly sepia, so it never reads as "now" */}
              <rect x={inner[0]} y={inner[1]} width={inner[2] - inner[0]} height={inner[3] - inner[1]} rx={28} fill="#8a6a3a" opacity={0.1} />
            </g>
          ) : null}
          {gl.map((g, i) => {
            const cx = x0 + 45 + (i + 0.5) * gw;
            const cy = (y0 + y1) / 2;
            return (
              <g key={i} transform={`translate(${cx + g.dx} ${cy + g.dy}) rotate(${g.rot}) scale(${g.scale})`}>
                <text x={0} y={(CAP_HEIGHT.anton * gSize) / 2} textAnchor="middle" fontFamily={FONTS.caption} fontSize={gSize} fill={GRAWLIX_COLORS[i % GRAWLIX_COLORS.length]} stroke={INK} strokeWidth={2}>
                  {g.char}
                </text>
              </g>
            );
          })}
          {text ? (() => {
            const size = fitSize(text, x1 - x0 - 70, (y1 - y0) * 0.62);
            return (
              <text x={(x0 + x1) / 2} y={(y0 + y1) / 2 + (CAP_HEIGHT.anton * size) / 2} textAnchor="middle" fontFamily={FONTS.caption} fontSize={size} fill={INK}>
                {text}
              </text>
            );
          })() : null}
        </g>
      ) : null}
    </g>
  );
};
