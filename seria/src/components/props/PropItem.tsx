// z13 flying / popping props from episode.json props[] (keys = PROP_KEYS in registry.ts).
// S01E01 twist (T03, the doctor "catches" the problem): the doctor spits jammed printer paper —
// `paper_strip` hangs from its anchor (put the anchor at the doctor's mouth, ≈ (760, 832)) and grows
// with `t` like paper being fed out; `paper_jam` = accordion wad; `paper_sheet` = one printed sheet;
// `paper_ball` = crumpled ball. Pure function of props. Owned by the set builder.
import React from "react";
import type { PropItemProps } from "../../contract";

const INK = "#121212";
const PAPER = "#F4F1EA";
const PRINT = "#9a948a";

/** Accordion strip hanging DOWN from (0, 0); length grows with t (≈ 9 px per frame, max 230). */
const PaperStrip: React.FC<{ t: number }> = ({ t }) => {
  const L = Math.min(230, 24 + 9 * t);
  const fold = 22;
  const n = Math.max(1, Math.ceil(L / fold));
  const left: string[] = [], right: string[] = [];
  for (let i = 0; i <= n; i++) {
    const y = Math.min(L, i * fold);
    const sway = 5 * Math.sin(t * 0.45 + i * 0.9) * (i / n);
    const wk = i % 2 === 0 ? 34 : 27;
    left.push(`${(-wk + sway).toFixed(1)} ${y.toFixed(1)}`);
    right.unshift(`${(wk + sway).toFixed(1)} ${y.toFixed(1)}`);
  }
  const d = `M${left.join(" L")} L${right.join(" L")} Z`;
  return (
    <g>
      <path d={d} fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {Array.from({ length: n }, (_, i) => {
        const y = Math.min(L, i * fold + fold / 2);
        const sway = 5 * Math.sin(t * 0.45 + i * 0.9) * (i / n);
        return (
          <g key={i}>
            <path d={`M${-24 + sway} ${y - 4} H${18 + sway - (i % 3) * 6}`} stroke={PRINT} strokeWidth={3} strokeLinecap="round" />
            {i > 0 ? <path d={`M${-30 + sway} ${i * fold} H${30 + sway}`} stroke="#c9c2b4" strokeWidth={2} /> : null}
          </g>
        );
      })}
      <path d={`M-14 ${L * 0.5} q10 -6 22 2`} stroke="#1a1a1a" strokeWidth={7} strokeLinecap="round" opacity={0.5} fill="none" />
    </g>
  );
};

const PaperJam: React.FC<{ t: number }> = ({ t }) => {
  const wob = 3 * Math.sin(t * 0.6);
  return (
    <g transform={`rotate(${wob})`}>
      <path d="M-50 -30 L-30 -42 L-10 -28 L10 -44 L30 -30 L50 -40 L46 30 L26 42 L6 30 L-14 44 L-34 30 L-52 40 Z" fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-30 -42 L-34 30 M-10 -28 L-14 44 M10 -44 L6 30 M30 -30 L26 42" stroke="#c9c2b4" strokeWidth={3} />
      <path d="M-40 -6 H36 M-40 10 H20" stroke={PRINT} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

const PaperSheet: React.FC<{ t: number }> = ({ t }) => {
  const flip = Math.cos(t * 0.35);
  return (
    <g transform={`scale(${0.25 + 0.75 * Math.abs(flip)} 1)`}>
      <path d="M-34 -46 H22 L34 -34 V46 H-34 Z" fill={flip >= 0 ? PAPER : "#e3ddd0"} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {flip >= 0 ? <path d="M-24 -26 H20 M-24 -12 H24 M-24 2 H14 M-24 16 H24 M-24 30 H8" stroke={PRINT} strokeWidth={3} strokeLinecap="round" /> : null}
    </g>
  );
};

const PaperBall: React.FC = () => (
  <g>
    <path d="M-26 -10 L-14 -28 L6 -26 L24 -14 L28 6 L16 26 L-6 28 L-24 16 Z" fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-14 -28 L-4 -6 L24 -14 M-4 -6 L-6 28 M-4 -6 L-24 16" stroke="#b9b2a4" strokeWidth={3} fill="none" />
  </g>
);

export const PropItem: React.FC<PropItemProps> = ({ id, x, y, scale, rotate, opacity, t, motionLines }) => {
  if (scale <= 0 || opacity <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      {motionLines ? (
        <g stroke="#F2ECDD" strokeWidth={6} strokeLinecap="round" opacity={0.85}>
          <path d="M-56 -30 h-46 M-60 0 h-64 M-56 30 h-46" />
        </g>
      ) : null}
      {id === "paper_strip" ? <PaperStrip t={t} /> : id === "paper_jam" ? <PaperJam t={t} /> : id === "paper_sheet" ? <PaperSheet t={t} /> : id === "paper_ball" ? <PaperBall /> : (
        <g>
          <rect x={-30} y={-30} width={60} height={60} rx={8} fill="#5C6B73" stroke={INK} strokeWidth={4} />
          <path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#F2ECDD" strokeWidth={5} />
        </g>
      )}
    </g>
  );
};
