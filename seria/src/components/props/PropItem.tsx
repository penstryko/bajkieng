// z13 flying / popping props from episode.json props[] (keys = PROP_KEYS in registry.ts).
// S01E01 twist (T03, the doctor "catches" the problem): the doctor spits jammed printer paper —
// `paper_strip` comes out of a tight mouth slot at its anchor (put the anchor at the doctor's mouth, ≈ (760, 832))
// and grows with `t` like paper being fed out; `paper_jam` = accordion wad that unfolds in flight; `spit_burst`
// = 3-frame "ptui" at the lips; `paper_sheet` = one printed sheet; `paper_ball` = crumpled ball.
// Reset ritual props (RITUAL_PROP_KEYS, GLASSES shot only): `cloth` = rag in the doctor's hand wiping the lenses,
// `lens_glint` = 3-frame glint after the wipe. Pure function of props. Owned by the set builder.
import React from "react";
import type { PropItemProps } from "../../contract";

const INK = "#121212";
const PAPER = "#F4F1EA";
const PRINT = "#9a948a";

/** Accordion strip fed DOWN out of the doctor's mouth: a narrow dark slot (her "tight" mouth) at (0, 0), the strip
 *  coming out of it (length grows with t ≈ 9 px per frame, max 230), lips drawn over its top edge, toner specks. */
const PaperStrip: React.FC<{ t: number }> = ({ t }) => {
  const L = Math.min(230, 24 + 9 * t);
  const fold = 22;
  const n = Math.max(1, Math.ceil(L / fold));
  const top = 2;
  const left: string[] = [], right: string[] = [];
  for (let i = 0; i <= n; i++) {
    const y = top + Math.min(L, i * fold);
    const sway = 4 * Math.sin(t * 0.45 + i * 0.9) * (i / n);
    const wk = i % 2 === 0 ? 22 : 18;
    left.push(`${(-wk + sway).toFixed(1)} ${y.toFixed(1)}`);
    right.unshift(`${(wk + sway).toFixed(1)} ${y.toFixed(1)}`);
  }
  const d = `M${left.join(" L")} L${right.join(" L")} Z`;
  return (
    <g>
      {/* mouth slot the strip comes out of */}
      <rect x={-30} y={-7} width={60} height={14} rx={7} fill="#2a1414" stroke={INK} strokeWidth={4} />
      <path d={d} fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {Array.from({ length: n }, (_, i) => {
        const y = top + Math.min(L, i * fold + fold / 2);
        const sway = 4 * Math.sin(t * 0.45 + i * 0.9) * (i / n);
        return (
          <g key={i}>
            <path d={`M${-14 + sway} ${y - 4} H${11 + sway - (i % 3) * 4}`} stroke={PRINT} strokeWidth={3} strokeLinecap="round" />
            {i > 0 ? <path d={`M${-20 + sway} ${top + i * fold} H${20 + sway}`} stroke="#c9c2b4" strokeWidth={2} /> : null}
            {/* toner specks (the printer's problem, now hers) */}
            <circle cx={-9 + 13 * ((i * 7) % 3) / 2 + sway} cy={y + 5} r={2.2} fill="#2b2b2b" opacity={0.7} />
            {i % 2 ? <circle cx={8 - 6 * ((i * 5) % 3) / 2 + sway} cy={y - 8} r={1.6} fill="#2b2b2b" opacity={0.6} /> : null}
          </g>
        );
      })}
      {/* lips over the strip's top edge (skin tone, pressed tight around the paper) */}
      <path d="M-34 -3 Q-26 -12 -12 -9 Q0 -12 12 -9 Q26 -12 34 -3 Q20 -4 0 -3 Q-20 -4 -34 -3 Z" fill="#C99D7C" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-30 6 Q-18 4 -24 10 Q0 14 24 10 Q18 4 30 6 Q24 15 0 17 Q-24 15 -30 6 Z" fill="#C99D7C" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
    </g>
  );
};

/** Jammed accordion paper spat out by the doctor: folded tight (a wad) at t = 0, unfolding sideways in flight
 *  (scaleX 0.3 → 1.2 over 12 frames), then lying still where it landed. */
const PaperJam: React.FC<{ t: number }> = ({ t }) => {
  const k = Math.min(1, t / 12);
  const sx = 0.3 + 0.9 * k * (2 - k); // ease-out unfold
  const sy = 1 - 0.18 * k; // flattens a little as it opens
  const wob = t < 13 ? 6 * Math.sin(t * 1.1) : 0;
  const panels = 6;
  const pw = 18;
  const x0 = -(panels * pw) / 2;
  const pts: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= panels; i++) {
    const x = x0 + i * pw;
    pts.push(`${x} ${i % 2 ? -34 : -44}`);
    bot.unshift(`${x} ${i % 2 ? 44 : 34}`);
  }
  return (
    <g transform={`rotate(${wob}) scale(${sx} ${sy})`}>
      <path d={`M${pts.join(" L")} L${bot.join(" L")} Z`} fill={PAPER} stroke={INK} strokeWidth={4 / Math.max(0.5, sx)} strokeLinejoin="round" />
      {Array.from({ length: panels }, (_, i) => {
        const x = x0 + i * pw;
        return (
          <g key={i}>
            {i > 0 ? <path d={`M${x} ${i % 2 ? -34 : -44} L${x} ${i % 2 ? 44 : 34}`} stroke={i % 2 ? "#c9c2b4" : "#a59d8f"} strokeWidth={3 / Math.max(0.5, sx)} /> : null}
            <path d={`M${x + 4} -12 H${x + pw - 4} M${x + 4} 2 H${x + pw - 6} M${x + 4} 16 H${x + pw - 4}`} stroke={PRINT} strokeWidth={3} />
            {i % 2 === 0 ? <circle cx={x + pw / 2} cy={26} r={3} fill="#2b2b2b" opacity={0.65} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** "Ptui!" burst at the lips for the 2–3 frames of the spit (t = 0, 1, 2): spray lines + droplets aimed left. */
const SpitBurst: React.FC<{ t: number }> = ({ t }) => {
  if (t > 2) return null;
  const s = [0.75, 1.05, 1.15][t] ?? 1;
  const o = [1, 1, 0.55][t] ?? 0;
  return (
    <g transform={`scale(${s})`} opacity={o}>
      {[200, 225, 160, 250, 135, 185].map((a, i) => {
        const r0 = 22 + (i % 2) * 6, r1 = 58 + (i % 3) * 12;
        const c = Math.cos((a * Math.PI) / 180), sn = Math.sin((a * Math.PI) / 180);
        return (
          <g key={a} strokeLinecap="round">
            <path d={`M${r0 * c} ${r0 * sn} L${r1 * c} ${r1 * sn}`} stroke={INK} strokeWidth={9} />
            <path d={`M${r0 * c} ${r0 * sn} L${r1 * c} ${r1 * sn}`} stroke="#FFFFFF" strokeWidth={4} />
          </g>
        );
      })}
      {[[-48, -20, 6], [-62, 8, 5], [-40, 26, 4], [-70, -6, 3.5], [30, -18, 3.5]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#DDEBF2" stroke={INK} strokeWidth={2.5} />
      ))}
    </g>
  );
};

/** Reset ritual (GLASSES shot): grey rag in the doctor's left hand; anchor = rag centre. The integrator passes the same
 *  point to the doctor as `wipeHand`, so her left arm reaches up to it. */
const Cloth: React.FC<{ t: number }> = ({ t }) => {
  const scrub = 4 * Math.sin(t * 1.7);
  return (
    <g>
      {/* shirt cuff at the wrist (the doctor's left arm tube ends here: DoctorProps.wipeHand) */}
      <rect x={-40} y={34} width={30} height={14} rx={6} fill="#E8E2D4" stroke={INK} strokeWidth={3} transform="rotate(-24 -25 41)" />
      <g transform={`rotate(${scrub})`}>
        {/* the rag: crumpled grey cloth with folds and a frayed edge */}
        <path d="M-62 -30 Q-40 -50 -8 -42 Q20 -54 52 -36 Q70 -14 60 12 Q66 36 40 46 Q8 56 -22 46 Q-56 50 -66 22 Q-78 -4 -62 -30 Z" fill="#9AA0A6" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-44 -24 Q-14 -6 -30 22 M4 -36 Q20 -6 8 30 M30 -24 Q48 0 40 30" fill="none" stroke="#6f757b" strokeWidth={3.5} strokeLinecap="round" />
        <path d="M-66 22 l-8 8 M-60 34 l-6 10 M-46 44 l-2 10" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      </g>
      {/* glove hand gripping the rag (fingers over its lower edge) */}
      <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
        <path d="M-40 26 q-6 -18 10 -22 l24 -4 q16 0 16 14 l-2 16 q-6 12 -22 10 l-16 -4 q-10 -2 -10 -10 Z" fill="#E3BE9E" />
        <path d="M-30 14 h22 M-30 24 h20" fill="none" strokeWidth={2.5} />
      </g>
    </g>
  );
};

/** Lens glint after the wipe: a 4-point star on each lens for 2–3 frames (anchor = glasses centre 760, 738). */
const LensGlint: React.FC<{ t: number }> = ({ t }) => {
  const s = [0.6, 1, 0.55][Math.min(2, t)] ?? 0;
  if (t > 2) return null;
  const star = (x: number, y: number, r: number) => (
    <g transform={`translate(${x} ${y}) scale(${s * r})`}>
      <path d="M0 -22 Q3 -3 22 0 Q3 3 0 22 Q-3 3 -22 0 Q-3 -3 0 -22 Z" fill="#FFFFFF" stroke="#0e1416" strokeWidth={1.5} />
    </g>
  );
  return (
    <g>
      {star(-90, -24, 1)}
      {star(46, -22, 0.8)}
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

export const PropItem: React.FC<PropItemProps> = ({ id, x, y, scale, rotate, opacity, t, motionLines, heading = 0 }) => {
  if (scale <= 0 || opacity <= 0) return null;
  return (
    <g opacity={opacity}>
      {motionLines ? (
        // speed lines trail behind the direction of travel (independent of the prop's own spin)
        <g transform={`translate(${x} ${y}) rotate(${heading.toFixed(2)}) scale(${scale})`} strokeLinecap="round">
          <path d="M-56 -30 h-46 M-60 0 h-64 M-56 30 h-46" stroke={INK} strokeWidth={11} opacity={0.6} />
          <path d="M-56 -30 h-46 M-60 0 h-64 M-56 30 h-46" stroke="#F2ECDD" strokeWidth={6} />
        </g>
      ) : null}
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {id === "paper_strip" ? <PaperStrip t={t} /> : id === "paper_jam" ? <PaperJam t={t} /> : id === "paper_sheet" ? <PaperSheet t={t} /> : id === "paper_ball" ? <PaperBall /> : id === "spit_burst" ? <SpitBurst t={t} /> : id === "cloth" ? <Cloth t={t} /> : id === "lens_glint" ? <LensGlint t={t} /> : (
        <g>
          <rect x={-30} y={-30} width={60} height={60} rx={8} fill="#5C6B73" stroke={INK} strokeWidth={4} />
          <path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#F2ECDD" strokeWidth={5} />
        </g>
      )}
    </g>
    </g>
  );
};
