// PLACEHOLDER — owned by the set builder. Keep PropItemProps; props are keyed by PROP_KEYS.
import React from "react";
import type { PropItemProps } from "../../contract";

export const PropItem: React.FC<PropItemProps> = ({ id, x, y, scale, rotate, opacity, t, motionLines }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
    {motionLines ? <path d="M-60 -40 h-40 M-60 0 h-60 M-60 40 h-40" stroke="#eee" strokeWidth={5} /> : null}
    {id === "paper_strip" ? (
      <path d={`M-40 -60 h80 v${120 + 6 * Math.sin(t * 0.5)} h-80 z`} fill="#F4F1EA" stroke="#121212" strokeWidth={4} />
    ) : (
      <rect x={-30} y={-30} width={60} height={60} fill="#f0f" />
    )}
  </g>
);
