// Chester (bible §3.2): bottle-green worn-leather Chesterfield, frontal, x 40–620. Diamond tufting
// WITHOUT buttons: every tuft is a puckered leather dimple, and two of them — (115, 905) and (200, 905)
// at the left end of the backrest — open like quilted leather lids into eyes (whites r 28 + pupils).
// The mouth is a leather fold at y ≈ 985 (x 105–205) that opens into a dark hole up to 90 px.
// Layers: "back" (z6) = backrest, face, seat top plane; "front" (z9) = seat front edge, valance,
// rolled left armrest, tape patch, spring. couchSag/breath scale both about the floor line y 1380.
// Owner: cast builder. Pure function of props.
import React, { useId } from "react";
import type { ChesterProps } from "../../contract";
import type { ChesterEyes, ChesterMouth } from "../../enums";
import type { XY } from "../../schema";
import { CHESTER_COLORS as C, POS, couchSagTransform } from "../../engine";

const [[EL_X, EYE_Y], [ER_X]] = POS.chester.eyes; // (115, 905), (200, 905)
const EYE_R = POS.chester.eyeR; // 28
const MOUTH = POS.chester.mouth; // y 985, x 105–205, maxOpen 90
const MOUTH_CX = (MOUTH.x0 + MOUTH.x1) / 2;
const FLOOR = POS.chester.floorY;
const WOOD = "#2C1F16";
const COIN = "#B8962E";
const REMOTE = "#2B2B2B";

// ───────────────────────────── expression tables ─────────────────────────────
interface EyeState {
  /** openness 0 closed … 1 wide */
  o: number;
  /** upper-lid tilt in degrees; > 0 lowers the INNER corner (towards the face centre) */
  tilt: number;
  /** pupil offset px */
  p: XY;
  /** pupil radius */
  pr: number;
}
const E = (o: number, tilt: number, p: XY, pr = 10): EyeState => ({ o, tilt, p, pr });
/** [left eye, right eye] per CHESTER_EYES value (bible §3.2 "Zakres min"). */
const EYES: Record<ChesterEyes, [EyeState, EyeState]> = {
  half: [E(0.48, 0, [0, 6]), E(0.48, 0, [0, 6])],
  wide_up: [E(1, -6, [0, -15], 8), E(1, -6, [0, -15], 8)],
  squint: [E(0.14, 14, [0, 3]), E(0.14, 14, [0, 3])],
  droop: [E(0.42, -16, [0, 9]), E(0.42, -16, [0, 9])],
  closed: [E(0, 0, [0, 0]), E(0, 0, [0, 0])],
  one_open: [E(0, 0, [0, 0]), E(0.9, 4, [14, 5], 10)],
  one_squint: [E(0.12, 14, [6, 3]), E(0.5, -4, [8, 5])],
  side_half: [E(0.38, 4, [14, 6]), E(0.38, 4, [14, 6])],
  wide_shake: [E(1, -10, [0, -3], 7.5), E(1, -10, [0, -3], 7.5)],
};
/** leather "brow" fold above each eye: [dy, angle (inner end down > 0)] */
const BROW_FOLD: Record<ChesterEyes, [number, number]> = {
  half: [2, 0],
  wide_up: [-6, -10],
  squint: [6, 16],
  droop: [0, -18],
  closed: [3, 0],
  one_open: [2, 0],
  one_squint: [4, 14],
  side_half: [5, 6],
  wide_shake: [-6, -16],
};

// ───────────────────────────── eye (leather-lid tuft) ─────────────────────────────
const LeatherEye: React.FC<{ cx: number; cy: number; st: EyeState; blink: number; extra: XY; side: 0 | 1; uid: string }> = ({
  cx, cy, st, blink, extra, side, uid,
}) => {
  const o = Math.max(0, Math.min(1, st.o * (1 - Math.max(0, Math.min(1, blink)))));
  const r = EYE_R;
  const span = 2 * r;
  const meet = cy + 6; // where the lids meet when closed (slightly low → reads as a closed eye)
  const yU = cy - r - 3 + (meet - (cy - r - 3)) * (1 - o); // upper-lid edge
  const yL = cy + r + 3 - (cy + r + 3 - meet) * (1 - o); // lower-lid edge
  // inner corner = towards the face centre: right side of the left eye, left side of the right eye
  const rot = side === 0 ? -st.tilt : st.tilt;
  const clip = `${uid}-eye${side}`;
  const pupil: XY = [cx + st.p[0] + extra[0], cy + st.p[1] + extra[1]];
  const sag = 7 + 6 * (1 - o); // lid edge curvature
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* puckered socket (the tuft depression) */}
      <ellipse cx={cx} cy={cy + 1} rx={r + 7} ry={r + 5} fill={C.shade} />
      <g clipPath={`url(#${clip})`}>
        <rect x={cx - r} y={cy - r} width={span} height={span} fill={C.eyeWhite} />
        <circle cx={pupil[0]} cy={pupil[1]} r={st.pr} fill={C.pupil} />
        <circle cx={pupil[0] - st.pr * 0.35} cy={pupil[1] - st.pr * 0.4} r={st.pr * 0.28} fill={C.eyeWhite} />
        {/* lower lid */}
        <path d={`M${cx - r - 4} ${cy + r + 4} V${yL} Q${cx} ${yL + sag * 0.5} ${cx + r + 4} ${yL} V${cy + r + 4} Z`} fill={C.leather} />
        {/* upper lid (tilted) */}
        <g transform={`rotate(${rot} ${cx} ${yU})`}>
          <path d={`M${cx - r - 8} ${cy - r - 10} H${cx + r + 8} V${yU} Q${cx} ${yU + sag} ${cx - r - 8} ${yU} Z`} fill={C.leather} />
          <path d={`M${cx - r - 8} ${yU} Q${cx} ${yU + sag} ${cx + r + 8} ${yU}`} fill="none" stroke={C.seams} strokeWidth={4.5} />
          {o > 0.15 ? (
            <path d={`M${cx - r + 4} ${yU - 7} Q${cx} ${yU + sag - 8} ${cx + r - 4} ${yU - 7}`} fill="none" stroke={C.shade} strokeWidth={3} />
          ) : null}
          <path d={`M${cx - r + 6} ${yU - 3 - (o > 0.15 ? 9 : 2)} Q${cx - 6} ${yU - 10 - (o > 0.15 ? 9 : 0)} ${cx + 4} ${yU - 6 - (o > 0.15 ? 9 : 0)}`} fill="none" stroke={C.gloss} strokeWidth={3} strokeLinecap="round" />
        </g>
        <path d={`M${cx - r - 4} ${yL} Q${cx} ${yL + sag * 0.5} ${cx + r + 4} ${yL}`} fill="none" stroke={C.seams} strokeWidth={3} />
      </g>
      {/* rim of the socket + tuft creases radiating out (diamond tufting) */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.seams} strokeWidth={4} />
      <g stroke={C.seams} strokeWidth={3} strokeLinecap="round" opacity={0.9}>
        <path d={`M${cx - r * 0.72} ${cy - r * 0.72} l-11 -11 M${cx + r * 0.72} ${cy - r * 0.72} l11 -11`} />
        <path d={`M${cx - r * 0.75} ${cy + r * 0.72} l-9 9 M${cx + r * 0.75} ${cy + r * 0.72} l9 9`} />
      </g>
    </g>
  );
};

const BrowFold: React.FC<{ cx: number; side: 0 | 1; fold: [number, number] }> = ({ cx, side, fold }) => {
  const [dy, ang] = fold;
  const y = EYE_Y - EYE_R - 15 + dy;
  const rot = side === 0 ? ang : -ang;
  return (
    <g transform={`rotate(${rot} ${cx} ${y})`}>
      <path d={`M${cx - 26} ${y + 4} Q${cx} ${y - 6} ${cx + 26} ${y + 4}`} fill="none" stroke={C.seams} strokeWidth={4.5} strokeLinecap="round" />
      <path d={`M${cx - 20} ${y - 2} Q${cx} ${y - 10} ${cx + 20} ${y - 2}`} fill="none" stroke={C.gloss} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};

// ───────────────────────────── mouth (leather fold) ─────────────────────────────
const MY = MOUTH.y;
const FOLDS: Partial<Record<ChesterMouth, string>> = {
  flat: `M${MOUTH.x0} ${MY} Q${MOUTH_CX} ${MY + 3} ${MOUTH.x1} ${MY}`,
  tight: `M${MOUTH.x0 + 6} ${MY} H${MOUTH.x1 - 6}`,
  wavy: `M${MOUTH.x0} ${MY} q12.5 -9 25 0 t25 0 t25 0 t25 0`,
  arc_down: `M${MOUTH.x0 + 4} ${MY + 9} Q${MOUTH_CX} ${MY - 14} ${MOUTH.x1 - 4} ${MY + 9}`,
  crooked: `M${MOUTH.x0} ${MY + 6} Q${MOUTH.x0 + 40} ${MY - 4} ${MOUTH_CX + 10} ${MY + 2} T${MOUTH.x1} ${MY - 10}`,
  smirk: `M${MOUTH.x0 + 4} ${MY + 2} Q${MOUTH_CX + 10} ${MY + 10} ${MOUTH.x1 + 2} ${MY - 12}`,
};

const MouthHole: React.FC<{ open: number }> = ({ open }) => {
  const h = Math.max(6, MOUTH.maxOpen * open);
  const w = (MOUTH.x1 - MOUTH.x0) + 14 * open;
  const top = MY - 0.6 * h;
  const bot = MY + 0.4 * h;
  const cy = (top + bot) / 2;
  return (
    <g>
      {/* leather lips (puffy rim) */}
      <ellipse cx={MOUTH_CX} cy={cy} rx={w / 2 + 8} ry={h / 2 + 7} fill={C.gloss} stroke={C.seams} strokeWidth={4} />
      <ellipse cx={MOUTH_CX} cy={cy} rx={w / 2} ry={h / 2} fill={C.mouthInside} stroke={C.seams} strokeWidth={3} />
      {h > 40 ? (
        // the couch's "contents": a lost coin and a remote (signature prop)
        <g opacity={Math.min(1, (h - 40) / 20)}>
          <rect x={MOUTH_CX - 6} y={bot - 22} width={40} height={14} rx={4} fill={REMOTE} transform={`rotate(-14 ${MOUTH_CX + 14} ${bot - 15})`} />
          <circle cx={MOUTH_CX + 2} cy={bot - 18} r={1.8} fill="#6B6B6B" transform={`rotate(-14 ${MOUTH_CX + 14} ${bot - 15})`} />
          <ellipse cx={MOUTH_CX - 24} cy={bot - 12} rx={9} ry={5} fill={COIN} />
        </g>
      ) : null}
      {/* corner creases */}
      <path d={`M${MOUTH_CX - w / 2 - 10} ${cy - 4} l-8 -4 M${MOUTH_CX + w / 2 + 10} ${cy - 4} l8 -4`} stroke={C.seams} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

const MouthFold: React.FC<{ mouth: ChesterMouth }> = ({ mouth }) => (
  <g>
    {/* soft puff above the fold (upper lip of leather) */}
    <path d={`M${MOUTH.x0 + 4} ${MY - 6} Q${MOUTH_CX} ${MY - 20} ${MOUTH.x1 - 4} ${MY - 6}`} fill="none" stroke={C.gloss} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    <path d={FOLDS[mouth] ?? FOLDS.flat} fill="none" stroke={C.seams} strokeWidth={mouth === "tight" ? 7 : 5.5} strokeLinecap="round" />
    {mouth === "tight" ? (
      <g stroke={C.seams} strokeWidth={3} strokeLinecap="round">
        <path d={`M${MOUTH.x0 + 6} ${MY - 9} v18 M${MOUTH.x1 - 6} ${MY - 9} v18`} />
        <path d={`M${MOUTH_CX - 22} ${MY - 5} v-7 M${MOUTH_CX} ${MY - 5} v-8 M${MOUTH_CX + 22} ${MY - 5} v-7 M${MOUTH_CX - 11} ${MY + 5} v7 M${MOUTH_CX + 11} ${MY + 5} v7`} />
      </g>
    ) : null}
    {/* lower crease */}
    <path d={`M${MOUTH.x0 + 18} ${MY + 13} Q${MOUTH_CX} ${MY + 19} ${MOUTH.x1 - 18} ${MY + 13}`} fill="none" stroke={C.shade} strokeWidth={3} strokeLinecap="round" />
  </g>
);

// ───────────────────────────── tufting ─────────────────────────────
const ROW_A = 905;
const ROW_B = 985;
const PITCH = 85;
const A_X = [285, 370, 455, 540]; // row A tufts right of the face (115/200 are the eyes)
const B_X = [242.5, 327.5, 412.5, 497.5, 582.5]; // row B (157.5 is the mouth)

const Tuft: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M${x - 14} ${y - 14} L${x + 14} ${y + 14} M${x + 14} ${y - 14} L${x - 14} ${y + 14}`} stroke={C.seams} strokeWidth={3} strokeLinecap="round" opacity={0.75} />
    <ellipse cx={x} cy={y} rx={6.5} ry={5} fill={C.seams} />
    <path d={`M${x - 5} ${y - 7} q5 -3 10 0`} fill="none" stroke={C.gloss} strokeWidth={2} strokeLinecap="round" />
  </g>
);

const Backrest: React.FC = () => {
  // diamond crease lattice right of the face
  const creases: string[] = [];
  A_X.forEach((x) => {
    creases.push(`M${x} ${ROW_A} L${x - PITCH / 2} ${ROW_B}`, `M${x} ${ROW_A} L${x + PITCH / 2} ${ROW_B}`);
    creases.push(`M${x} ${ROW_A} L${x - PITCH / 2 + 8} ${ROW_A - 52}`, `M${x} ${ROW_A} L${x + PITCH / 2 - 8} ${ROW_A - 52}`);
  });
  B_X.forEach((x) => {
    creases.push(`M${x} ${ROW_B} L${x - PITCH / 2 + 6} ${ROW_B + 58}`, `M${x} ${ROW_B} L${Math.min(612, x + PITCH / 2 - 6)} ${ROW_B + 58}`);
  });
  // puffs between the creases (flat highlights, light from the upper left)
  const puffs: XY[] = [
    ...B_X.map((x): XY => [x, ROW_A - 4]),
    ...A_X.map((x): XY => [x, ROW_B - 2]),
    [157.5, ROW_A - 6],
  ];
  return (
    <g>
      {/* backrest body */}
      <rect x={40} y={840} width={580} height={262} rx={44} fill={C.leather} stroke={C.seams} strokeWidth={5} />
      {/* rolled top edge */}
      <path d="M62 846 Q330 832 598 846" fill="none" stroke={C.gloss} strokeWidth={8} strokeLinecap="round" />
      <path d="M52 872 Q330 862 608 872" fill="none" stroke={C.shade} strokeWidth={4} strokeLinecap="round" />
      {/* right end roll */}
      <path d="M592 870 Q614 960 596 1046" fill="none" stroke={C.shade} strokeWidth={4} strokeLinecap="round" />
      {puffs.map(([x, y], i) => (
        <ellipse key={i} cx={x - 9} cy={y - 10} rx={19} ry={9} transform={`rotate(-18 ${x - 9} ${y - 10})`} fill={C.gloss} opacity={0.85} />
      ))}
      <path d={creases.join(" ")} stroke={C.seams} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      {A_X.map((x) => (
        <Tuft key={`a${x}`} x={x} y={ROW_A} />
      ))}
      {B_X.map((x) => (
        <Tuft key={`b${x}`} x={x} y={ROW_B} />
      ))}
      {/* wear: scuffs, cracked top roll, old stain */}
      <g fill="none" stroke={C.gloss} strokeWidth={2} strokeLinecap="round" opacity={0.9}>
        <path d="M402 852 l14 4 l10 -3 l12 5 M420 856 l-2 7" />
        <path d="M520 1018 q14 -6 26 2 M530 1030 q10 -3 18 2" />
        <path d="M300 950 l16 -10" />
      </g>
      <ellipse cx={560} cy={940} rx={24} ry={14} fill="none" stroke={C.shade} strokeWidth={4} opacity={0.9} />
      {/* seat top plane (the shadow z7 lies on it: y 1060–1096) */}
      <path d="M48 1050 H612 V1098 H48 Z" fill={C.leather} />
      <path d="M48 1050 H612" stroke={C.seams} strokeWidth={6} />
      <path d="M70 1062 Q330 1056 590 1062" fill="none" stroke={C.gloss} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
      <ellipse cx={410} cy={1080} rx={150} ry={12} fill={C.shade} opacity={0.55} />
    </g>
  );
};

// ───────────────────────────── front layer parts ─────────────────────────────
const Armrest: React.FC = () => (
  <g>
    <rect x={40} y={1046} width={130} height={294} rx={34} fill={C.leather} stroke={C.seams} strokeWidth={5} />
    <rect x={146} y={1100} width={20} height={234} rx={10} fill={C.shade} />
    {/* pleats under the scroll */}
    <path d="M70 1128 Q66 1230 72 1330 M105 1130 V1332 M140 1128 Q144 1230 138 1330" fill="none" stroke={C.shade} strokeWidth={3} strokeLinecap="round" />
    {/* tufts on the arm front */}
    <Tuft x={105} y={1200} />
    <Tuft x={105} y={1272} />
    {/* rolled scroll */}
    <circle cx={105} cy={1068} r={58} fill={C.leather} stroke={C.seams} strokeWidth={5} />
    <path d="M105 1068 m-8 0 a8 8 0 1 1 16 0 a16 16 0 1 1 -32 0 a26 26 0 1 1 52 0 a38 38 0 1 1 -76 2" fill="none" stroke={C.seams} strokeWidth={3.5} strokeLinecap="round" />
    <path d="M62 1050 Q76 1020 108 1016" fill="none" stroke={C.gloss} strokeWidth={6} strokeLinecap="round" />
  </g>
);

const SeatFront: React.FC = () => (
  <g>
    {/* valance / front base */}
    <rect x={40} y={1180} width={580} height={200} rx={16} fill={C.leather} stroke={C.seams} strokeWidth={5} />
    <rect x={44} y={1186} width={572} height={18} fill={C.shade} />
    <g stroke={C.shade} strokeWidth={3} strokeLinecap="round">
      {[220, 300, 380, 460, 540].map((x) => (
        <path key={x} d={`M${x} 1214 q4 60 -2 150`} fill="none" />
      ))}
    </g>
    <path d="M48 1366 H612" stroke={C.seams} strokeWidth={4} />
    {/* split seam with stuffing poking out (adult wear) */}
    <path d="M488 1262 q14 -8 30 2" fill="none" stroke={C.seams} strokeWidth={4} strokeLinecap="round" />
    <path d="M492 1262 q6 -10 12 -4 q6 -8 12 2 q-12 6 -24 2 Z" fill={C.stuffing} stroke={C.seams} strokeWidth={2} />
    {/* seat front edge (cushion face with piping) */}
    <rect x={40} y={1098} width={580} height={92} rx={18} fill={C.leather} stroke={C.seams} strokeWidth={5} />
    <path d="M60 1106 Q330 1098 600 1106" fill="none" stroke={C.gloss} strokeWidth={6} strokeLinecap="round" />
    <path d="M58 1182 Q330 1192 602 1182" fill="none" stroke={C.shade} strokeWidth={4} strokeLinecap="round" />
    <path d="M250 1128 q6 22 0 44 M420 1124 q-5 24 2 48 M560 1126 q5 22 -1 44" fill="none" stroke={C.shade} strokeWidth={3} strokeLinecap="round" />
    {/* duct-tape patch */}
    <g transform="rotate(-6 346 1140)">
      <path d="M300 1120 l4 4 l-4 4 l4 4 l-4 4 l4 4 l-4 4 l4 4 l-4 4 V1158 H392 l-4 -4 l4 -4 l-4 -4 l4 -4 l-4 -4 l4 -4 l-4 -4 l4 -4 l-4 -4 V1120 Z" fill={C.tape} stroke={C.seams} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M310 1130 H382 M310 1146 H376" stroke="#BDBDB5" strokeWidth={2} />
    </g>
    {/* bun feet */}
    <ellipse cx={92} cy={1386} rx={24} ry={10} fill={WOOD} stroke={C.seams} strokeWidth={3} />
    <ellipse cx={588} cy={1386} rx={24} ry={10} fill={WOOD} stroke={C.seams} strokeWidth={3} />
  </g>
);

const Spring: React.FC<{ out: number; wobble: number }> = ({ out, wobble }) => {
  const k = Math.max(0, Math.min(1.2, out));
  const h = 96 * k;
  const coils = 6;
  const pts: string[] = [];
  for (let i = 0; i <= coils * 2; i++) {
    const y = 1102 - (h * i) / (coils * 2);
    pts.push(`${i === 0 ? "M" : "L"}${500 + (i % 2 ? 15 : -15)} ${y}`);
  }
  return (
    <g transform={`rotate(${wobble} 500 1102)`}>
      <path d={pts.join(" ")} fill="none" stroke={C.seams} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
      <path d={pts.join(" ")} fill="none" stroke={C.spring} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M478 1104 q4 -12 14 -8 q6 -10 16 -2 q12 -4 12 8 q-20 8 -42 2 Z" fill={C.stuffing} stroke={C.seams} strokeWidth={2.5} />
    </g>
  );
};

// ───────────────────────────── component ─────────────────────────────
export const Chester: React.FC<ChesterProps> = (p) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sag = couchSagTransform(p.sag);
  const breath = p.breath ? `translate(0 ${FLOOR}) scale(1 ${1 + p.breath}) translate(0 ${-FLOOR})` : "";
  const t = `${sag} ${breath}`.trim() || undefined;

  if (p.layer === "front") {
    return (
      <g transform={t}>
        <SeatFront />
        <Armrest />
        {p.spring > 0 ? <Spring out={p.spring} wobble={p.springWobble} /> : null}
      </g>
    );
  }

  const [le, re] = EYES[p.eyes] ?? EYES.half;
  const fold = BROW_FOLD[p.eyes] ?? BROW_FOLD.half;
  const extraL: XY = [p.pupil[0] + p.eyeShake[0], p.pupil[1] + p.eyeShake[1]];
  const extraR: XY = [p.pupil[0] - p.eyeShake[0] * 0.6, p.pupil[1] + p.eyeShake[1] * 0.8];
  const open = Math.max(p.mouthOpen, p.mouth === "open" ? 0.4 : p.mouth === "slightly_open" ? 0.14 : 0);
  return (
    <g transform={t}>
      <Backrest />
      {/* face (x 60–250, y 860–1010) */}
      <BrowFold cx={EL_X} side={0} fold={fold} />
      <BrowFold cx={ER_X} side={1} fold={fold} />
      <LeatherEye cx={EL_X} cy={EYE_Y} st={le} blink={p.blink} extra={extraL} side={0} uid={uid} />
      <LeatherEye cx={ER_X} cy={EYE_Y} st={re} blink={p.blink} extra={extraR} side={1} uid={uid} />
      {p.eyes === "wide_shake" ? (
        <g stroke={C.seams} strokeWidth={3} strokeLinecap="round">
          <path d={`M${EL_X - 46} ${EYE_Y - 10} l-8 -4 M${EL_X - 46} ${EYE_Y + 6} l-9 2 M${ER_X + 46} ${EYE_Y - 10} l8 -4 M${ER_X + 46} ${EYE_Y + 6} l9 2`} />
        </g>
      ) : null}
      {open > 0.02 ? <MouthHole open={open} /> : <MouthFold mouth={p.mouth} />}
    </g>
  );
};
