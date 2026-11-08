// The doctor (bible §3.1): one tall 180 px "ruler" (head = torso width), tall grey perm of small curls
// (x 655–865, y 525–660), CRT-screen glasses wider than the head, petrol button cardigan over a
// white-collar shirt, lanyard badge "DR." (centre 760, 955), thin tube arms with glove-like hands,
// clipboard (z11) + click pen. Expression = swapped SVG parts (brows / mouth / glasses slide / lens).
// Owner: cast builder. Pure function of props: no frame reads, no randomness except random(seed).
import React, { useId } from "react";
import { random } from "remotion";
import type { DoctorProps } from "../../contract";
import type { Brows, DoctorMouth } from "../../enums";
import { DOCTOR_COLORS as C, FONTS, POS } from "../../engine";
import { SERIES } from "../../series";
import { Glasses, INK } from "./Glasses";

const [NX, NY] = POS.doctor.neckPivot; // 760, 860
const FACE = { x0: 670, x1: 850, y0: 598, y1: 862 };
const MOUTH_Y = 840;
const EYE_Y = 703; // tiny dot eyes, hidden behind the frames until glassesY > ~12
const EYE_X = [728, 792] as const;
const MOUTH_FILL = "#3A1F1C";
const SWEAT = "#BFE3F0";
const STEAM = "#D9D4CC";

// ───────────────────────────── placement (§5.5) ─────────────────────────────
/** Body offset for a placement at progress t (0 = in the chair, 1 = settled). */
export function placementOffset(placement: DoctorProps["placement"], t: number): { x: number; y: number } {
  const k = Math.max(0, Math.min(1, t));
  if (placement === "sunk_in_couch") return { x: -350 * k, y: 150 * k - 140 * Math.sin(Math.PI * k) }; // hop onto the couch
  if (placement === "drop_out") return { x: 0, y: 470 * k }; // perm tip peeks over the clipboard at t = 1
  return { x: 0, y: 0 };
}
/** Offset of the hands layer (clipboard travels with her into the couch; stays put in drop_out). */
function handsOffset(placement: DoctorProps["placement"], t: number): { x: number; y: number } {
  const k = Math.max(0, Math.min(1, t));
  if (placement === "sunk_in_couch") return { x: -350 * k, y: 60 * k - 140 * Math.sin(Math.PI * k) };
  return { x: 0, y: 0 };
}

// ───────────────────────────── perm ─────────────────────────────
interface Curl {
  x: number;
  y: number;
  r: number;
}
const PERM_CURLS: Curl[] = (() => {
  const out: Curl[] = [];
  const rows = [542, 562, 582, 602, 622, 642];
  rows.forEach((y, ri) => {
    const off = ri % 2 ? 11 : 0;
    for (let x = 672 + off; x <= 850; x += 22) {
      let r = 14 + Math.round(4 * random(`perm-${ri}-${x}`));
      r = Math.min(r, x - 655, 865 - x); // stay inside x 655–865
      if (ri === 0) r = Math.min(r, y - 525); // top at y ≥ 525 (under the diploma)
      if (ri === rows.length - 1) r = Math.min(r, 660 - y + 2);
      out.push({ x, y, r: Math.max(r, 11) });
    }
  });
  // side curls hugging the temples (15 px wider than the face on each side)
  [
    [668, 664, 13],
    [852, 664, 13],
  ].forEach(([x, y, r]) => out.push({ x, y, r }));
  return out;
})();

/** point on a circle at angle a (degrees, clockwise from +x, SVG y-down) */
const pt = (x: number, y: number, r: number, a: number) => `${(x + r * Math.cos((a * Math.PI) / 180)).toFixed(2)} ${(y + r * Math.sin((a * Math.PI) / 180)).toFixed(2)}`;

const Perm: React.FC<{ uid: string }> = ({ uid }) => (
  <g>
    <defs>
      <clipPath id={`${uid}-perm`}>
        {PERM_CURLS.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={c.r} />
        ))}
      </clipPath>
    </defs>
    {/* ink outline of the scalloped silhouette */}
    {PERM_CURLS.map((c, i) => (
      <circle key={`o${i}`} cx={c.x} cy={c.y} r={c.r + 4} fill={INK} />
    ))}
    {/* shade, then the lit mass shifted up-left → shade survives only on the lower-right rim */}
    <g clipPath={`url(#${uid}-perm)`}>
      <rect x={640} y={510} width={240} height={180} fill={C.hairShade} />
      {PERM_CURLS.map((c, i) => (
        <circle key={`l${i}`} cx={c.x - 4} cy={c.y - 6} r={c.r} fill={C.hair} />
      ))}
      {/* curl definition: a shadow crescent on the lower-right of most curls */}
      {PERM_CURLS.map((c, i) =>
        random(`perm-tex-${i}`) < 0.72 ? (
          <path
            key={`t${i}`}
            d={`M${pt(c.x - 2, c.y - 2, c.r - 5, -15 + 30 * random(`perm-a-${i}`))} A${c.r - 5} ${c.r - 5} 0 0 1 ${pt(c.x - 2, c.y - 2, c.r - 5, 95 + 25 * random(`perm-b-${i}`))}`}
            fill="none"
            stroke={C.hairShade}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ) : null,
      )}
      {/* a few light glints on top */}
      {PERM_CURLS.filter((_, i) => i % 5 === 1).map((c, i) => (
        <path key={`g${i}`} d={`M${pt(c.x - 3, c.y - 4, c.r - 7, 200)} A${c.r - 7} ${c.r - 7} 0 0 1 ${pt(c.x - 3, c.y - 4, c.r - 7, 255)}`} fill="none" stroke="#D3CFC9" strokeWidth={2.5} strokeLinecap="round" />
      ))}
    </g>
  </g>
);

// ───────────────────────────── brows ─────────────────────────────
interface BrowShape {
  /** [dy, angle] per brow (left, right); angle > 0 = inner end down for the left brow */
  l: [number, number];
  r: [number, number];
  arch?: number;
  w?: number;
}
const BROWS_ART: Record<Brows, BrowShape> = {
  neutral: { l: [0, 0], r: [0, 0] },
  low_flat: { l: [6, 0], r: [6, 0], w: 8 },
  one_up: { l: [0, 0], r: [-13, -6], arch: 3 },
  skeptic: { l: [4, 10], r: [-13, -8], arch: 3 },
  v: { l: [2, 16], r: [2, 16] },
  high: { l: [-14, 0], r: [-14, 0], arch: 2 },
  arched: { l: [-12, 0], r: [-12, 0], arch: 7 },
  slant_down: { l: [-2, -15], r: [-2, -15] },
  v_strong: { l: [5, 26], r: [5, 26], w: 13 },
};
const BROW_C = { l: 716, r: 804, y: 675 };

const Brow: React.FC<{ side: "l" | "r"; shape: BrowShape }> = ({ side, shape }) => {
  const [dy, ang] = shape[side];
  const cx = BROW_C[side];
  const cy = BROW_C.y + dy;
  const w = 50;
  const h = shape.w ?? 11;
  const a = shape.arch ?? 0;
  // inner end = towards the nose; mirror the angle for the right brow
  const rot = side === "l" ? ang : -ang;
  return (
    <path
      transform={`rotate(${rot} ${cx} ${cy})`}
      d={`M${cx - w / 2} ${cy + h / 2} Q${cx} ${cy - h / 2 - a * 2} ${cx + w / 2} ${cy + h / 2} L${cx + w / 2 - 3} ${cy - h / 2 + 1} Q${cx} ${cy - h - a * 2} ${cx - w / 2 + 3} ${cy - h / 2 + 1} Z`}
      fill={C.hairShade}
      stroke={INK}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  );
};

// ───────────────────────────── mouths ─────────────────────────────
/** Doctor mouth art. Keys = DOCTOR_MOUTHS plus the closed-mouth hum pair "hum" ("Mm-") and "hum_up" ("-hm"). */
export type DoctorMouthArt = DoctorMouth | "hum" | "hum_up";
export const DOCTOR_MOUTH_ART_KEYS: readonly DoctorMouthArt[] = [
  "flat", "flat_down", "o_small", "crooked", "tight", "O", "half_smile", "smile", "wavy", "down", "teeth", "hum", "hum_up",
];

const line = (d: string, w = 4.5) => <path d={d} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
const Y = MOUTH_Y;
const HumMarks: React.FC<{ up?: boolean }> = ({ up }) => (
  <g stroke={INK} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.85}>
    {/* puffed cheeks + resonance ticks beside the closed mouth */}
    <path d={`M736 ${Y - 9} q-6 9 0 18`} stroke={C.skinShade} strokeWidth={3} />
    <path d={`M784 ${Y - 9} q6 9 0 18`} stroke={C.skinShade} strokeWidth={3} />
    <path d={`M${up ? 812 : 810} ${Y - (up ? 14 : 8)} q6 6 0 12`} />
    <path d={`M${up ? 820 : 818} ${Y - (up ? 18 : 12)} q9 10 0 20`} />
  </g>
);
const MOUTHS: Record<DoctorMouthArt, React.ReactNode> = {
  flat: line(`M742 ${Y} H778`),
  flat_down: line(`M741 ${Y + 4} Q760 ${Y - 4} 779 ${Y + 4}`),
  o_small: <ellipse cx={760} cy={Y} rx={6.5} ry={7.5} fill={MOUTH_FILL} stroke={INK} strokeWidth={3.5} />,
  crooked: line(`M741 ${Y + 5} Q751 ${Y - 1} 761 ${Y + 1} T780 ${Y - 6}`),
  tight: (
    <g>
      {line(`M745 ${Y} H775`, 6)}
      {line(`M745 ${Y - 6} V${Y + 6}`, 2.5)}
      {line(`M775 ${Y - 6} V${Y + 6}`, 2.5)}
      <g stroke={C.skinShade} strokeWidth={2.5} strokeLinecap="round">
        <path d={`M754 ${Y - 9} v-5 M760 ${Y - 9} v-6 M766 ${Y - 9} v-5`} />
      </g>
    </g>
  ),
  O: (
    <g>
      <ellipse cx={760} cy={Y + 2} rx={12} ry={16} fill={MOUTH_FILL} stroke={INK} strokeWidth={4} />
      <path d={`M752 ${Y + 12} q8 -6 16 0`} fill="#7A3B33" />
    </g>
  ),
  half_smile: line(`M742 ${Y + 1} H760 Q772 ${Y + 1} 780 ${Y - 8}`),
  smile: (
    <g>
      {line(`M739 ${Y - 4} Q760 ${Y + 12} 781 ${Y - 4}`)}
      {line(`M736 ${Y - 8} l4 5`, 2.5)}
      {line(`M784 ${Y - 8} l-4 5`, 2.5)}
    </g>
  ),
  wavy: line(`M739 ${Y} q5.25 -6 10.5 0 t10.5 0 t10.5 0 t10.5 0`),
  down: line(`M741 ${Y + 7} Q760 ${Y - 9} 779 ${Y + 7}`),
  teeth: (
    <g>
      <rect x={735} y={Y - 11} width={50} height={22} rx={4} fill="#F2ECDD" stroke={INK} strokeWidth={4} />
      <path d={`M735 ${Y} H785 M747.5 ${Y - 11} V${Y + 11} M760 ${Y - 11} V${Y + 11} M772.5 ${Y - 11} V${Y + 11}`} stroke={INK} strokeWidth={2} />
    </g>
  ),
  hum: (
    <g>
      {line(`M745 ${Y + 1} Q760 ${Y - 3} 775 ${Y + 1}`, 5.5)}
      <HumMarks />
    </g>
  ),
  hum_up: (
    <g>
      {line(`M745 ${Y + 2} Q760 ${Y} 776 ${Y - 5}`, 5.5)}
      <HumMarks up />
    </g>
  ),
};

// ───────────────────────────── face parts ─────────────────────────────
const DotEyes: React.FC<{ blink: number }> = ({ blink }) => {
  const b = Math.max(0, Math.min(1, blink));
  return (
    <g>
      {EYE_X.map((x, i) => (
        <g key={i}>
          {/* bags + crow's feet (tired, adult-coded) */}
          <path d={`M${x - 9} ${EYE_Y + 8} q9 6 18 0`} fill="none" stroke={C.skinShade} strokeWidth={2.5} strokeLinecap="round" />
          <path d={`M${x - 7} ${EYE_Y + 13} q7 4 14 0`} fill="none" stroke={C.skinShade} strokeWidth={2} strokeLinecap="round" />
          <path
            d={i === 0 ? `M${x - 13} ${EYE_Y - 2} l-5 -3 M${x - 13} ${EYE_Y + 2} l-6 1` : `M${x + 13} ${EYE_Y - 2} l5 -3 M${x + 13} ${EYE_Y + 2} l6 1`}
            stroke={C.skinShade}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {b < 0.9 ? <circle cx={x} cy={EYE_Y} r={4.5} fill={INK} /> : null}
          {/* heavy upper lid (covers ~40 % of the dot, all of it when blinking) */}
          <rect x={x - 8} y={EYE_Y - 9} width={16} height={4 + 9.5 * b + 3.5} fill={C.skin} />
          <path d={`M${x - 8} ${EYE_Y - 1.5 + 9 * b * 0.6} H${x + 8}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};

const Face: React.FC<{ mouth: DoctorMouthArt; blink: number }> = ({ mouth, blink }) => (
  <g>
    {/* head block (same width as the torso) */}
    <path
      d={`M${FACE.x0} ${FACE.y0} H${FACE.x1} V${FACE.y1 - 18} Q${FACE.x1} ${FACE.y1} ${FACE.x1 - 18} ${FACE.y1} H${FACE.x0 + 18} Q${FACE.x0} ${FACE.y1} ${FACE.x0} ${FACE.y1 - 18} Z`}
      fill={C.skin}
      stroke={INK}
      strokeWidth={4}
    />
    {/* cel shade: right side + under the perm + under the jaw */}
    <path d={`M828 640 H848 V846 Q848 858 836 858 H828 Z`} fill={C.skinShade} />
    <path d={`M672 652 H848 V672 Q760 662 672 672 Z`} fill={C.skinShade} />
    <DotEyes blink={blink} />
    {/* nose: small triangle under the bridge */}
    <path d="M760 748 L772 805 Q760 810 748 805 Z" fill={C.skinShade} />
    <path d="M751 805 q4 3 8 1 M769 805 q-4 3 -8 1" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
    {/* nasolabial folds + marionette lines */}
    <g fill="none" stroke={C.skinShade} strokeWidth={3} strokeLinecap="round">
      <path d="M744 808 Q733 822 736 840" />
      <path d="M776 808 Q787 822 784 840" />
      <path d="M738 850 l-3 8" />
      <path d="M782 850 l3 8" />
    </g>
    {MOUTHS[mouth] ?? MOUTHS.flat}
  </g>
);

// ───────────────────────────── torso ─────────────────────────────
const Torso: React.FC = () => (
  <g>
    {/* shirt in the V */}
    <path d="M714 856 H806 L760 978 Z" fill={C.collar} stroke={INK} strokeWidth={3} />
    {/* cardigan (the lower half of the ruler) */}
    <path d="M670 856 H714 L760 978 L806 856 H850 V1210 H670 Z" fill={C.cardigan} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    {/* cel shade right side + rib band along the V */}
    <rect x={826} y={858} width={22} height={350} fill={C.cardiganShade} />
    <path d="M714 858 L760 978 L806 858" fill="none" stroke={C.cardiganShade} strokeWidth={9} strokeLinejoin="round" />
    <path d="M714 858 L760 978 L806 858" fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" opacity={0.5} />
    {/* shoulder seams + pilling */}
    <path d="M684 862 q-2 18 -12 26 M836 862 q2 18 12 26" fill="none" stroke={C.cardiganShade} strokeWidth={3} strokeLinecap="round" />
    {[
      [694, 925],
      [701, 962],
      [688, 990],
      [818, 940],
      [812, 975],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={2.2} fill={C.cardiganShade} />
    ))}
    {/* big buttons */}
    {[988, 1066].map((y) => (
      <g key={y}>
        <circle cx={760} cy={y} r={11} fill={C.clipboard} stroke={INK} strokeWidth={3} />
        <circle cx={756} cy={y - 1} r={1.8} fill={INK} />
        <circle cx={764} cy={y - 1} r={1.8} fill={INK} />
      </g>
    ))}
    {/* lanyard (comes from under the collar) */}
    <path d="M736 868 L755 934 M784 868 L765 934" stroke={C.lanyard} strokeWidth={5} strokeLinecap="round" />
    {/* collar points */}
    <path d="M714 854 L760 872 L731 902 Z" fill={C.collar} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M806 854 L760 872 L789 902 Z" fill={C.collar} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    {/* badge "DR." */}
    <rect x={753} y={927} width={14} height={12} rx={2} fill="#9AA0A6" stroke={INK} strokeWidth={2} />
    <rect x={730} y={935} width={60} height={40} rx={4} fill={C.badge} stroke={INK} strokeWidth={3} />
    <rect x={730} y={935} width={60} height={8} rx={2} fill={C.lanyard} />
    <text x={760} y={968} textAnchor="middle" fontFamily={FONTS.caption} fontSize={22} letterSpacing={1} fill={INK}>
      {SERIES.doctorBadge}
    </text>
  </g>
);

// ───────────────────────────── extras ─────────────────────────────
const Extras: React.FC<{ extras: DoctorProps["extras"] }> = ({ extras }) => (
  <g>
    {extras.includes("sweat") ? (
      <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
        <path d="M878 612 q16 24 0 38 q-16 -14 0 -38 Z" fill={SWEAT} />
        <path d="M873 621 q-3 8 -1 14" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M898 660 q9 14 0 22 q-9 -8 0 -22 Z" fill={SWEAT} />
      </g>
    ) : null}
    {extras.includes("steam") ? (
      <g fill={STEAM} stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <path d="M686 516 q-14 -6 -8 -20 q-2 -16 14 -16 q8 -12 22 -4 q16 -2 14 14 q10 12 -4 22 q-6 10 -20 6 q-10 6 -18 -2 Z" />
        <path d="M806 512 q-12 -8 -4 -20 q0 -14 14 -12 q10 -10 22 0 q14 2 10 16 q6 12 -8 18 q-8 8 -20 2 q-10 4 -14 -4 Z" />
        <path d="M748 486 q-10 -8 -2 -18 q2 -12 14 -8 q10 -8 18 2 q10 4 4 14 q2 12 -12 12 q-10 6 -22 -2 Z" />
      </g>
    ) : null}
    {extras.includes("sigh") ? (
      <g>
        <path
          d={`M700 ${MOUTH_Y + 6} q-8 -12 4 -16 q4 -10 16 -4 q12 -2 10 10 q6 10 -6 14 q-6 8 -16 2 q-10 2 -8 -6 Z`}
          fill={STEAM}
          stroke={INK}
          strokeWidth={2.5}
          opacity={0.9}
        />
        <path d={`M734 ${MOUTH_Y - 2} h-8 M734 ${MOUTH_Y + 6} h-6`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ) : null}
  </g>
);

// ───────────────────────────── hands layer (z11) ─────────────────────────────
const CB = POS.doctor.clipboard; // [650, 1010, 830, 1210]

const Clipboard: React.FC = () => (
  <g>
    <rect x={CB[0]} y={CB[1]} width={CB[2] - CB[0]} height={CB[3] - CB[1]} rx={9} fill={C.clipboard} stroke={INK} strokeWidth={4} />
    <rect x={CB[0] + 4} y={CB[1] + 4} width={CB[2] - CB[0] - 8} height={5} rx={2} fill="#A87444" />
    <rect x={CB[0] + 13} y={CB[1] + 24} width={CB[2] - CB[0] - 26} height={CB[3] - CB[1] - 36} fill={C.paper} stroke={INK} strokeWidth={2} />
    {/* faint ruled lines + illegible notes */}
    {Array.from({ length: 8 }, (_, k) => (
      <rect key={k} x={CB[0] + 22} y={CB[1] + 52 + k * 17} width={CB[2] - CB[0] - 44} height={1.5} fill="#CFC6B2" />
    ))}
    <path d="M674 1058 q6 -6 10 0 t10 0 t10 0 t10 0 M674 1092 q6 -6 10 0 t10 0 t10 0 M700 1126 q6 -6 10 0 t10 0 t10 0 t10 0" fill="none" stroke={C.hairShade} strokeWidth={2} />
    {/* clip */}
    <path d="M728 1024 L732 1002 H788 L792 1024 Z" fill="#9AA0A6" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <rect x={738} y={1007} width={44} height={4} rx={2} fill="#C9CDD1" />
    <circle cx={760} cy={1017} r={3} fill={INK} />
  </g>
);

/** Thin tube arm (sleeve) with an ink outline. */
const Tube: React.FC<{ d: string; w?: number }> = ({ d, w = 22 }) => (
  <g>
    <path d={d} fill="none" stroke={INK} strokeWidth={w + 7} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={C.cardigan} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const Pen: React.FC<{ press: number }> = ({ press }) => (
  // local coords: tip at (0, 0), pen points up along −y (length 128)
  <g>
    <rect x={-3} y={-140 + 5 * press} width={6} height={16} rx={2} fill="#9AA0A6" stroke={INK} strokeWidth={2} />
    <path d="M-6 -126 H6 V-12 L0 2 L-6 -12 Z" fill={C.pen} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-1.5} y={-120} width={3} height={90} fill="#5C7FD6" opacity={0.7} />
    <path d="M6 -122 h5 v42 h-5" fill="none" stroke="#9AA0A6" strokeWidth={3} />
    <path d="M-6 -12 L0 2 L6 -12 Z" fill="#C9CDD1" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
  </g>
);

const Hands: React.FC<{ pen: DoctorProps["pen"]; penPhase: number }> = ({ pen, penPhase }) => {
  const ph = Math.max(0, Math.min(1, penPhase));
  let dx = 0;
  let dy = 0;
  let press = 0;
  if (pen === "raised") dy = -20;
  else if (pen === "writing") {
    dx = 7 * Math.sin(ph * Math.PI * 6);
    dy = 3 * Math.sin(ph * Math.PI * 4) + 2 * ph;
  } else {
    dy = -14;
    press = Math.sin(ph * Math.PI);
  }
  const hx = 804 + dx; // right fist centre
  const hy = 1086 + dy;
  return (
    <g>
      <Clipboard />
      {/* left arm: shoulder → clipboard edge, glove hand gripping the board */}
      <Tube d="M682 880 Q668 990 662 1118" />
      <rect x={650} y={1104} width={26} height={12} rx={5} fill={C.collar} stroke={INK} strokeWidth={2.5} transform="rotate(4 663 1110)" />
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <path d="M643 1122 q-6 22 6 34 q12 6 24 -4 l6 -16 q-2 -14 -16 -16 Z" fill={C.skin} />
        <path d="M660 1132 q10 -2 16 6 M658 1144 q10 -2 16 4" fill="none" strokeWidth={2} />
      </g>
      {/* right arm: shoulder → elbow → pen hand */}
      <Tube d={`M838 880 Q886 950 880 1010 Q872 ${hy - 20} ${hx + 18} ${hy - 4}`} />
      <g transform={`translate(${hx - 24} ${hy + 42}) rotate(24)`}>
        <Pen press={press} />
      </g>
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <path d={`M${hx - 16} ${hy - 8} q-4 -12 8 -14 l16 -2 q14 0 14 14 l-2 14 q-4 10 -18 8 l-12 -4 q-8 -4 -6 -16 Z`} fill={C.skin} />
        <path d={`M${hx - 10} ${hy - 6} h18 M${hx - 10} ${hy + 3} h16`} fill="none" strokeWidth={2} />
        <rect x={hx + 6} y={hy - 22} width={14} height={11} rx={4} fill={C.collar} strokeWidth={2.5} transform={`rotate(-30 ${hx + 13} ${hy - 16})`} />
      </g>
      {pen === "click" && press > 0.3 ? (
        <g stroke={INK} strokeWidth={3} strokeLinecap="round" transform={`translate(${hx - 24} ${hy + 42}) rotate(24)`}>
          <path d="M-14 -150 l-8 -8 M0 -154 v-12 M14 -150 l8 -8" />
        </g>
      ) : null}
    </g>
  );
};

/** drop_out pose: both arms thrown up (rubber-hose), pen still in the right hand. */
const RaisedArms: React.FC = () => (
  <g>
    <Tube d="M682 884 Q640 760 646 566" />
    <Tube d="M838 884 Q890 740 862 520" />
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
      {/* left open glove */}
      <path d="M630 566 q-10 -18 2 -30 l2 -18 q4 -8 10 0 l2 12 l2 -16 q5 -8 10 0 l1 16 l4 -10 q6 -6 9 2 l-3 22 q4 18 -12 26 q-16 6 -27 -4 Z" fill={C.skin} />
      <rect x={634} y={562} width={26} height={12} rx={5} fill={C.collar} strokeWidth={2.5} />
    </g>
    <g transform="translate(866 570) rotate(-8)">
      <Pen press={0} />
    </g>
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
      <path d="M846 520 q-4 -14 8 -18 l16 -2 q14 0 14 14 l-2 14 q-4 10 -18 8 l-12 -4 q-8 -4 -6 -12 Z" fill={C.skin} />
      <path d="M852 514 h18 M852 523 h16" fill="none" strokeWidth={2} />
      <rect x={850} y={530} width={26} height={12} rx={5} fill={C.collar} strokeWidth={2.5} />
    </g>
  </g>
);

// ───────────────────────────── component ─────────────────────────────
export const Doctor: React.FC<DoctorProps> = (p) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const off = placementOffset(p.placement, p.placementT);

  if (p.layer === "hands") {
    if (p.placement === "drop_out") {
      // the clipboard stays; arms fly up and fall with her behind it (pen hand peeks out at t = 1)
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-dropout-hands`}>
              <rect x={0} y={0} width={1080} height={POS.doctor.dropOutClipY} />
            </clipPath>
          </defs>
          <Clipboard />
          <g clipPath={`url(#${uid}-dropout-hands)`}>
            <g transform={`translate(${off.x} ${off.y + p.bob})`}>
              <RaisedArms />
            </g>
          </g>
        </g>
      );
    }
    const ho = handsOffset(p.placement, p.placementT);
    return (
      <g transform={ho.x || ho.y ? `translate(${ho.x} ${ho.y})` : undefined}>
        <Hands pen={p.pen} penPhase={p.penPhase} />
      </g>
    );
  }

  const headT = `rotate(${p.headTilt} ${NX} ${NY}) translate(${NX} ${NY}) scale(${p.lean}) translate(${-NX} ${-NY})`;
  const breathT = p.breath ? `translate(0 ${NY}) scale(1 ${1 + p.breath}) translate(0 ${-NY})` : undefined;
  const body = (
    <g transform={`translate(${off.x} ${off.y + p.bob})`}>
      <g transform={breathT}>
        <Torso />
      </g>
      <g transform={headT}>
        <Face mouth={p.mouth} blink={p.blink} />
        <Perm uid={uid} />
        <Brow side="l" shape={BROWS_ART[p.brows] ?? BROWS_ART.neutral} />
        <Brow side="r" shape={BROWS_ART[p.brows] ?? BROWS_ART.neutral} />
        <Glasses
          cx={POS.doctor.glasses.center[0]}
          cy={POS.doctor.glasses.center[1] - p.glassesJump}
          slideY={p.glassesY}
          lens={p.lens}
          lensNoise={p.lensNoise}
          noiseSeed={p.noiseSeed}
          patient={p.patient}
          patientNo={p.patientNo}
        />
        <Extras extras={p.extras} />
      </g>
    </g>
  );

  if (p.placement === "drop_out") {
    return (
      <g>
        <defs>
          <clipPath id={`${uid}-dropout`}>
            <rect x={0} y={0} width={1080} height={POS.doctor.dropOutClipY} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${uid}-dropout)`}>{body}</g>
      </g>
    );
  }
  return body;
};
