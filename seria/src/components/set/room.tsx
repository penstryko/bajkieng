// The one location (bible §5.1–5.2): run-down therapy office in the evening, frontal, flat colours,
// no perspective. Background (z0), decor (z2: diploma, plant shelf, patient counter), doctor's
// armchair (z3), table + tomato timer + drawer (z10) and the screen vignette (z15).
// Pure functions of props (no frame reads). Owned by the set builder.
import React from "react";
import { random } from "remotion";
import type { SetProps, TimerProps } from "../../contract";
import { DOCTOR_COLORS, FONTS, POS, SET_COLORS as C } from "../../engine";
import { mixHex, tone } from "./color";
import { fitBlock } from "../props/text";

const INK = "#121212";

/** Room geometry shared by all set layers (scene px). */
export const ROOM = {
  ceilingBottom: 330, // drop ceiling band 0–330 (Chirp hangs on it at (170, 300))
  moldingBottom: 348,
  baseboardTop: 1250,
  floorTop: 1278, // carpet from here down (bottom UI zone 1420–1920 is carpet only)
  shelf: { x0: 46, x1: 214, y: 716, h: 14 },
  counter: [928, 392, 1052, 470] as [number, number, number, number],
} as const;

// ───────────────────────────── z0 background ─────────────────────────────

export const Background: React.FC = () => {
  const { ceilingBottom: cb, moldingBottom: mb, baseboardTop: bt, floorTop: ft } = ROOM;
  const stripes: React.ReactNode[] = [];
  for (let x = -20, i = 0; x < 1080; x += 96, i++) {
    stripes.push(<rect key={`s${i}`} x={x + 26} y={mb} width={40} height={bt - mb} fill={C.wallStripe} />);
    stripes.push(<rect key={`t${i}`} x={x + 76} y={mb} width={5} height={bt - mb} fill={C.wallStripe} />);
  }
  // drop-ceiling grid (cheap office), one stained tile, one tile pushed up (dark gap)
  const gridX = [0, 180, 360, 540, 720, 900, 1080];
  const gridY = [0, 110, 220, cb];
  return (
    <g>
      {/* wall */}
      <rect x={0} y={0} width={1080} height={1920} fill={C.wall} />
      {stripes}
      {/* faded patch where a picture used to hang, with the bent nail */}
      <rect x={236} y={402} width={124} height={92} fill="#6A5F4C" opacity={0.28} />
      <path d="M296 394 l4 6 l6 -2" stroke="#1d1a16" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* water stain running down from the ceiling (zaciek) */}
      <path
        d="M888 348 C 892 400 870 430 884 470 C 896 510 878 540 892 590 C 900 620 912 650 906 690 C 918 660 930 640 926 600
           C 940 640 952 700 946 760 C 962 700 966 640 958 590 C 970 540 958 480 972 440 C 980 400 968 372 978 348 Z"
        fill={C.stain}
        opacity={0.85}
      />
      <path d="M888 348 C 892 400 870 430 884 470 C 896 510 878 540 892 590 C 900 620 912 650 906 690" stroke="#332c23" strokeWidth={3} fill="none" opacity={0.7} />
      {/* small second stain + hairline crack on the left */}
      <path d="M28 348 C 34 380 22 410 36 450 C 46 420 56 392 52 348 Z" fill={C.stain} opacity={0.7} />
      <path d="M232 620 l14 26 l-6 18 l16 30 l-4 22" stroke="#2f2922" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* peeling wallpaper corner (right, above the platform buttons) */}
      <path d="M1080 548 L1030 552 Q1040 600 1080 652 Z" fill="#6b6152" />
      <path d="M1030 552 Q1044 600 1080 652 L1080 640 Q1062 616 1058 590 Q1050 566 1030 552 Z" fill="#2a251f" opacity={0.5} />
      <path d="M1030 552 Q1010 590 1036 612 Q1050 596 1046 576 Q1040 560 1030 552 Z" fill={tone(C.wallStripe, 0.1)} stroke="#211d18" strokeWidth={2.5} />

      {/* drop ceiling */}
      <rect x={0} y={0} width={1080} height={cb} fill={C.ceiling} />
      {gridY.slice(1, -1).map((y) => (
        <rect key={`gy${y}`} x={0} y={y - 3} width={1080} height={6} fill="#2C2721" />
      ))}
      {gridX.slice(1, -1).map((x) => (
        <rect key={`gx${x}`} x={x - 3} y={0} width={6} height={cb} fill="#2C2721" />
      ))}
      <rect x={903} y={0} width={174} height={107} fill="#1b1814" />
      <path d="M903 107 L1077 107 L1077 92 L903 74 Z" fill="#332d26" />
      <ellipse cx={612} cy={168} rx={52} ry={30} fill="none" stroke="#5a4a33" strokeWidth={6} opacity={0.55} />
      <ellipse cx={606} cy={172} rx={30} ry={16} fill="#4a3f2f" opacity={0.35} />
      {/* crown molding */}
      <rect x={0} y={cb} width={1080} height={mb - cb} fill="#2E2922" />
      <rect x={0} y={cb} width={1080} height={4} fill="#4b4337" />
      <rect x={0} y={mb - 3} width={1080} height={3} fill="#211d18" />

      {/* baseboard */}
      <rect x={0} y={bt} width={1080} height={ft - bt} fill="#2E2620" />
      <rect x={0} y={bt} width={1080} height={4} fill="#463b31" />
      {/* carpet */}
      <rect x={0} y={ft} width={1080} height={1920 - ft} fill={C.carpet} />
      <rect x={0} y={ft + 18} width={1080} height={10} fill={C.carpetPattern} />
      <rect x={0} y={ft + 36} width={1080} height={4} fill={C.carpetPattern} />
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 10 }, (_, i) => {
          const cx = i * 120 + (row % 2 ? 60 : 0) + 30;
          const cy = 1400 + row * 90;
          return <path key={`d${row}-${i}`} d={`M${cx} ${cy - 22} l26 22 l-26 22 l-26 -22 z`} fill={C.carpetPattern} opacity={0.75} />;
        }),
      )}
      {/* worn path and an old coffee ring */}
      <ellipse cx={560} cy={1470} rx={260} ry={60} fill="#433030" opacity={0.6} />
      <ellipse cx={792} cy={1356} rx={34} ry={12} fill="none" stroke="#2a1b1b" strokeWidth={5} opacity={0.7} />
    </g>
  );
};

// ───────────────────────────── z2 decor ─────────────────────────────

/** Diploma in a gold frame, hung slightly crooked. Text = continuity.diplomaText (changes every episode). */
const Diploma: React.FC<{ text: string }> = ({ text }) => {
  const [x0, y0, x1, y1] = POS.diploma;
  const w = x1 - x0, h = y1 - y0;
  const inner = { x: x0 + 16, y: y0 + 16, w: w - 32, h: h - 32 };
  const fit = fitBlock(text, { w: inner.w - 14, h: inner.h - 40 }, { maxSize: 30, minSize: 12, lineHeight: 1.02, maxLines: 4 });
  const lh = fit.size * 1.02;
  const blockTop = inner.y + 24 + (inner.h - 40 - fit.lines.length * lh) / 2;
  const cx = (x0 + x1) / 2;
  return (
    <g transform={`rotate(-2.2 ${cx} ${y0 - 14})`}>
      <path d={`M${cx} ${y0 - 14} L${x0 + 30} ${y0 + 4} M${cx} ${y0 - 14} L${x1 - 30} ${y0 + 4}`} stroke="#1d1a16" strokeWidth={3} />
      <circle cx={cx} cy={y0 - 14} r={4} fill="#1d1a16" />
      <rect x={x0 + 6} y={y0 + 8} width={w} height={h} fill="#000" opacity={0.25} />
      <rect x={x0} y={y0} width={w} height={h} fill={C.diplomaFrame} stroke={INK} strokeWidth={4} />
      <rect x={x0 + 7} y={y0 + 7} width={w - 14} height={h - 14} fill="none" stroke={tone(C.diplomaFrame, -0.3)} strokeWidth={3} />
      <rect x={x0 + 3} y={y0 + 3} width={w - 6} height={4} fill={tone(C.diplomaFrame, 0.35)} />
      <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill={C.diplomaPaper} stroke={tone(C.diplomaFrame, -0.45)} strokeWidth={2} />
      {/* header flourish (no real words: the joke is the line below) */}
      <path d={`M${cx - 44} ${inner.y + 14} q11 -9 22 0 t22 0 t22 0 t22 0`} stroke="#6b5a3a" strokeWidth={3} fill="none" />
      {fit.lines.map((l, i) => (
        <text key={i} x={cx} y={blockTop + (i + 0.82) * lh} textAnchor="middle" fontFamily={FONTS.caption} fontSize={fit.size} fill="#2f2615">
          {l}
        </text>
      ))}
      {/* red seal + ribbon, bottom right; foxing spot */}
      <path d={`M${x1 - 26} ${y1 - 8} l-8 26 l10 -6 l6 10 l2 -28 z`} fill="#7e1b22" />
      <circle cx={x1 - 24} cy={y1 - 12} r={13} fill="#a3262f" stroke="#5c1218" strokeWidth={2} />
      <circle cx={inner.x + 14} cy={inner.y + inner.h - 12} r={7} fill="#c9b48a" opacity={0.6} />
    </g>
  );
};

/** Withering plant on a wall shelf: stage 0 (sad but alive) … 12 (one brown leaf left). */
const Plant: React.FC<{ stage: number; leafFall?: number }> = ({ stage, leafFall }) => {
  const s = Math.max(0, Math.min(12, stage));
  const k = s / 12;
  const { x0, x1, y, h } = ROOM.shelf;
  const leafCol = mixHex(C.leaves0, C.leaves12, k);
  const leafShade = tone(leafCol, -0.3);
  const potTop = 640, potBot = y;
  const stemBase: [number, number] = [130, potTop + 4];
  // 7 leaves at stage 0 → 1 leaf at stage 12; droop grows with the stage
  const nLeaves = Math.max(1, 7 - Math.round(k * 6));
  const LEAVES = [
    { a: -50, len: 100, size: 1.0 }, { a: -18, len: 124, size: 1.05 }, { a: 14, len: 114, size: 1.0 },
    { a: -66, len: 80, size: 0.9 }, { a: 40, len: 88, size: 0.95 }, { a: -34, len: 64, size: 0.85 }, { a: 28, len: 62, size: 0.85 },
  ];
  const droop = 12 + 78 * k;
  const fallen = Math.min(4, Math.floor(s / 3));
  return (
    <g>
      {/* shelf + brackets */}
      <rect x={x0} y={y} width={x1 - x0} height={h} fill="#2b2119" stroke={INK} strokeWidth={3} />
      <rect x={x0} y={y} width={x1 - x0} height={3} fill="#46362a" />
      {[x0 + 26, x1 - 40].map((bx) => (
        <path key={bx} d={`M${bx} ${y + h} h14 l-14 34 z`} fill="#1f1812" stroke={INK} strokeWidth={2} />
      ))}
      {/* fallen dry leaves on the shelf */}
      {Array.from({ length: fallen }, (_, i) => (
        <ellipse key={i} cx={70 + i * 36} cy={y - 4} rx={14} ry={5} fill={mixHex("#7E6036", "#5a4326", (i % 2) * 0.5)} transform={`rotate(${(i % 2 ? 12 : -9)} ${70 + i * 36} ${y - 4})`} />
      ))}
      {/* stems + leaves: stems arc up then bend over; the bend (droop) grows with the stage */}
      {LEAVES.slice(0, nLeaves).map((L, i) => {
        const side = L.a < 0 ? -1 : 1;
        const endA = ((L.a + side * droop) * Math.PI) / 180;
        const len = L.len * (1 - 0.15 * k);
        const ex = stemBase[0] + Math.sin(endA) * len;
        const ey = stemBase[1] - Math.cos(endA) * len * 0.9;
        const cx = stemBase[0] + Math.sin((L.a * Math.PI) / 180) * len * 0.55;
        const cy = stemBase[1] - len * (0.75 - 0.15 * k);
        const tangent = (Math.atan2(ey - cy, ex - cx) * 180) / Math.PI;
        const sz = L.size * (1.15 - 0.3 * k);
        const col = i === 0 && s >= 9 ? tone(leafCol, -0.15) : leafCol;
        return (
          <g key={i}>
            <path d={`M${stemBase[0]} ${stemBase[1]} Q${cx} ${cy} ${ex} ${ey}`} stroke={mixHex("#4c6b26", "#6b5230", k)} strokeWidth={5} fill="none" strokeLinecap="round" />
            <g transform={`translate(${ex} ${ey}) rotate(${tangent + side * 10 * k}) scale(${sz})`}>
              <path d="M0 0 C 10 -14 34 -16 46 0 C 34 14 10 14 0 0 Z" fill={col} stroke={INK} strokeWidth={3} />
              <path d="M2 0 L40 0" stroke={leafShade} strokeWidth={2} />
              {k > 0.3 ? <path d="M30 -6 l8 4 l-6 4" stroke="#5a4326" strokeWidth={2} fill="none" /> : null}
            </g>
          </g>
        );
      })}
      {/* pot (terracotta, chipped rim) */}
      <path d={`M88 ${potTop + 14} L172 ${potTop + 14} L162 ${potBot} L98 ${potBot} Z`} fill={C.pot} stroke={INK} strokeWidth={4} />
      <rect x={82} y={potTop} width={96} height={18} rx={3} fill={tone(C.pot, 0.1)} stroke={INK} strokeWidth={4} />
      <path d="M156 640 l8 0 l-4 7 z" fill={C.wall} />
      <path d={`M104 ${potTop + 30} l10 30`} stroke={tone(C.pot, -0.3)} strokeWidth={3} />
      {/* the falling leaf (running gag): drifts down in front of the wall, behind Chester */}
      {leafFall !== undefined && leafFall > 0 && leafFall < 1 ? (
        <g transform={`translate(${140 + 46 * Math.sin(leafFall * 9)} ${560 + leafFall * 640}) rotate(${40 * Math.sin(leafFall * 11)})`}>
          <path d="M0 0 C 10 -14 34 -16 46 0 C 34 14 10 14 0 0 Z" fill={mixHex(leafCol, "#7E6036", 0.5)} stroke={INK} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/** "NOW SERVING" deli-style ticket counter: the patient number grows every episode (§2 rule 10). */
const PatientCounter: React.FC<{ patientNo?: number }> = ({ patientNo }) => {
  const [x0, y0, x1, y1] = ROOM.counter;
  const w = x1 - x0;
  const digits = patientNo === undefined ? "---" : String(patientNo % 1000).padStart(3, "0");
  return (
    <g>
      <rect x={x0 + 5} y={y0 + 6} width={w} height={y1 - y0} rx={6} fill="#000" opacity={0.3} />
      <rect x={x0} y={y0} width={w} height={y1 - y0} rx={6} fill="#211c18" stroke={INK} strokeWidth={4} />
      <text x={(x0 + x1) / 2} y={y0 + 20} textAnchor="middle" fontFamily={FONTS.crt} fontSize={18} fill="#b9ad97">
        NOW SERVING
      </text>
      <rect x={x0 + 10} y={y0 + 26} width={w - 20} height={y1 - y0 - 34} rx={3} fill="#140707" />
      <text x={(x0 + x1) / 2} y={y1 - 12} textAnchor="middle" fontFamily={FONTS.crt} fontSize={46} fill="#5a1414">
        888
      </text>
      <text x={(x0 + x1) / 2} y={y1 - 12} textAnchor="middle" fontFamily={FONTS.crt} fontSize={46} fill="#FF2B2B">
        {digits}
      </text>
      {/* take-a-number dispenser below, one ticket hanging out */}
      <path d={`M${x0 + 34} ${y1 + 18} h56 a10 10 0 0 1 10 10 v26 a10 10 0 0 1 -10 10 h-56 a10 10 0 0 1 -10 -10 v-26 a10 10 0 0 1 10 -10 z`} fill="#b3262f" stroke={INK} strokeWidth={4} />
      <path d={`M${x0 + 48} ${y1 + 64} h28 v22 l-4 -3 l-5 3 l-5 -3 l-5 3 l-5 -3 l-4 3 z`} fill="#efe6d2" stroke={INK} strokeWidth={2} />
      <path d={`M${x0 + 62} ${y1 + 8} v10`} stroke="#1d1a16" strokeWidth={3} />
    </g>
  );
};

export const Decor: React.FC<Pick<SetProps, "diplomaText" | "plantStage" | "leafFall" | "patientNo"> & { jolt?: [number, number] }> = ({
  diplomaText, plantStage, leafFall, patientNo, jolt,
}) => {
  // wall decor jolts against the wall (landlord's knocks); the diploma also tilts a little
  const j = jolt && (jolt[0] !== 0 || jolt[1] !== 0) ? jolt : null;
  return (
    <g>
      <g transform={j ? `translate(${j[0]} ${j[1]}) rotate(${(j[0] * 0.6).toFixed(3)} 820 380)` : undefined}>
        <Diploma text={diplomaText} />
      </g>
      <Plant stage={plantStage} leafFall={leafFall} />
      <g transform={j ? `translate(${(-j[0] * 0.8).toFixed(3)} ${j[1]})` : undefined}>
        <PatientCounter patientNo={patientNo} />
      </g>
    </g>
  );
};

// ───────────────────────────── z3 doctor's armchair ─────────────────────────────

const CH = { base: DOCTOR_COLORS.chair, shade: "#29180F", hi: "#4E3122", crack: "#5f3f2b" };

export const Chair: React.FC<{ state: SetProps["chairState"] }> = ({ state }) => {
  if (state === "collapsed") {
    // the chair gave up (E10/E15): cushion on the floor, back tipped, legs splayed, one spring out
    return (
      <g>
        <path d="M640 1160 Q765 1120 890 1160 L900 1262 L630 1262 Z" fill={CH.base} stroke={INK} strokeWidth={6} transform="rotate(-4 765 1210)" />
        <rect x={622} y={1218} width={292} height={52} rx={18} fill={CH.shade} stroke={INK} strokeWidth={6} />
        <path d="M650 1270 l-22 12 M884 1270 l26 10 M700 1272 l-8 10" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M872 1200 c 10 -10 20 0 10 10 c -10 10 0 20 10 10 c 10 -10 20 0 10 10" stroke="#9AA0A6" strokeWidth={5} fill="none" />
        <path d="M680 1226 q20 -16 40 0" stroke={CH.crack} strokeWidth={3} fill="none" />
      </g>
    );
  }
  const tufts: React.ReactNode[] = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 6; c++) {
      const x = 668 + c * 40 + (r % 2 ? 20 : 0);
      const y = 880 + r * 56;
      if (x > 888) continue;
      tufts.push(<circle key={`${r}-${c}`} cx={x} cy={y} r={5} fill={CH.shade} />);
    }
  return (
    <g>
      {/* back panel with rounded top */}
      <path d="M640 1160 L640 900 Q640 820 720 820 L810 820 Q890 820 890 900 L890 1160 Z" fill={CH.base} stroke={INK} strokeWidth={6} />
      {tufts}
      <path d="M660 860 Q700 836 760 834" stroke={CH.hi} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* wings */}
      <path d="M640 880 Q606 890 610 960 L614 1080 L648 1080 L648 900 Z" fill={CH.shade} stroke={INK} strokeWidth={6} />
      <path d="M890 880 Q924 890 920 960 L916 1080 L882 1080 L882 900 Z" fill={CH.shade} stroke={INK} strokeWidth={6} />
      {/* leather cracks */}
      <path d="M902 930 l-6 14 l8 10 M898 990 l6 12" stroke={CH.crack} strokeWidth={3} fill="none" />
      {/* seat cushion front */}
      <rect x={644} y={1148} width={242} height={66} rx={16} fill={CH.base} stroke={INK} strokeWidth={6} />
      <path d="M660 1162 H860" stroke={CH.hi} strokeWidth={4} strokeLinecap="round" />
      {/* rolled arms */}
      <path d="M606 1050 Q606 1028 636 1028 Q666 1028 668 1050 L668 1214 L606 1214 Z" fill={CH.base} stroke={INK} strokeWidth={6} />
      <path d="M862 1050 Q864 1028 894 1028 Q924 1028 924 1050 L924 1214 L862 1214 Z" fill={CH.base} stroke={INK} strokeWidth={6} />
      <ellipse cx={637} cy={1052} rx={20} ry={14} fill={CH.shade} />
      <ellipse cx={893} cy={1052} rx={20} ry={14} fill={CH.shade} />
      {/* split seam on the right arm, stuffing peeking out */}
      <path d="M906 1120 q8 10 0 22 q-10 -10 0 -22 z" fill="#E8E0CC" stroke={INK} strokeWidth={3} />
      {/* skirt + legs */}
      <rect x={612} y={1208} width={306} height={50} rx={10} fill={CH.shade} stroke={INK} strokeWidth={6} />
      <path d="M632 1258 l6 22 h12 l4 -22 Z M878 1258 l4 22 h12 l6 -22 Z" fill="#1c120c" stroke={INK} strokeWidth={4} />
    </g>
  );
};

// ───────────────────────────── z10 table, drawer, mug, tomato timer ─────────────────────────────

const TIMER_C: [number, number] = [585, 1174];

/** Kitchen tomato timer (generic, never "Pomodoro"): white face with the remaining-time wedge + hand. */
export const TomatoTimer: React.FC<{ timer: TimerProps; cx?: number; cy?: number; scale?: number }> = ({ timer, cx = TIMER_C[0], cy = TIMER_C[1], scale = 1 }) => {
  if (!timer.visible) return null;
  const dial = Math.max(0, Math.min(1, timer.dial));
  const sweep = dial * 330;
  const fr = 25; // face radius
  const fy = cy + 3;
  const a = (deg: number): [number, number] => [cx + fr * Math.sin((deg * Math.PI) / 180), fy - fr * Math.cos((deg * Math.PI) / 180)];
  const [ex, ey] = a(sweep);
  const wedge = sweep <= 0.01 ? null : sweep >= 359.9
    ? <circle cx={cx} cy={fy} r={fr} fill={C.timerTomato} opacity={0.85} />
    : <path d={`M${cx} ${fy} L${cx} ${fy - fr} A${fr} ${fr} 0 ${sweep > 180 ? 1 : 0} 1 ${ex} ${ey} Z`} fill={C.timerTomato} opacity={0.85} />;
  const wob = timer.ringing > 0 ? 7 * timer.ringing * Math.sin(timer.ringing * 38) : 0;
  // DING (ringing 1 → 0 over 30 frames): frames since DING drive a hop with squash, ring bursts and a 2-frame flash
  const tD = timer.ringing > 0 ? Math.round((1 - timer.ringing) * 30) : -1;
  const hop = tD >= 0 && tD < 10 ? -28 * Math.sin((Math.PI * tD) / 10) : 0;
  const sq = tD === 0 ? [1.18, 0.8] : tD === 1 ? [0.9, 1.12] : tD === 10 || tD === 11 ? [1.12, 0.88] : [1, 1];
  const burst = tD >= 0 && tD < 22 ? 1 - tD / 22 : 0;
  const rings = (side: -1 | 1) =>
    [0, 1, 2].map((i) => {
      const r = 58 + i * 18 + (tD % 6) * 2;
      return <path key={i} d={`M${cx + side * r} ${cy - 22 - i * 9} q${side * (12 + i * 5)} ${22 + i * 9} 0 ${44 + i * 18}`} />;
    });
  return (
    <g transform={`translate(${timer.jitter[0]} ${timer.jitter[1] + hop}) translate(${cx} ${cy + 40}) scale(${scale * sq[0]} ${scale * sq[1]}) rotate(${wob}) translate(${-cx} ${-(cy + 40)})`}>
      {tD >= 0 && tD < 2 ? <circle cx={cx} cy={cy} r={92 - 16 * tD} fill="#FFF6D8" opacity={0.85 - 0.3 * tD} /> : null}
      {burst > 0 ? (
        <g strokeLinecap="round" fill="none" opacity={Math.min(1, burst * 1.6)}>
          <g stroke={INK} strokeWidth={11}>{rings(-1)}{rings(1)}</g>
          <g stroke="#FFF1C4" strokeWidth={6}>{rings(-1)}{rings(1)}</g>
          <g stroke={INK} strokeWidth={5}>
            {[-60, -30, 0, 30, 60].map((a) => {
              const c = Math.sin((a * Math.PI) / 180), k = Math.cos((a * Math.PI) / 180);
              return <path key={a} d={`M${cx + 56 * c} ${cy - 44 * k - 6} l${16 * c} ${-16 * k}`} />;
            })}
          </g>
        </g>
      ) : null}
      <ellipse cx={cx} cy={cy + 41 - hop} rx={38} ry={5} fill="#000" opacity={0.35} />
      <ellipse cx={cx} cy={cy} rx={45} ry={39} fill={C.timerTomato} stroke={INK} strokeWidth={5} />
      <path d={`M${cx - 30} ${cy + 26} Q${cx} ${cy + 40} ${cx + 30} ${cy + 26}`} stroke={tone(C.timerTomato, -0.35)} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={cx - 22} cy={cy - 22} rx={10} ry={6} fill="#fff" opacity={0.35} transform={`rotate(-30 ${cx - 22} ${cy - 22})`} />
      {/* face */}
      <circle cx={cx} cy={fy} r={fr + 4} fill={C.timerDial} stroke={INK} strokeWidth={4} />
      {wedge}
      {Array.from({ length: 12 }, (_, i) => {
        const [x1, y1] = a(i * 30);
        const r2 = fr - 6;
        const x2 = cx + r2 * Math.sin((i * 30 * Math.PI) / 180), y2 = fy - r2 * Math.cos((i * 30 * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={2} />;
      })}
      <line x1={cx} y1={fy} x2={ex} y2={ey} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={fy} r={4} fill={INK} />
      {/* fixed pointer + leafy crown */}
      <path d={`M${cx - 5} ${fy - fr - 10} h10 l-5 8 z`} fill={INK} />
      <path
        d={`M${cx} ${cy - 36} l-20 -6 l12 10 l-16 6 l18 0 l6 8 l6 -8 l18 0 l-16 -6 l12 -10 z`}
        fill={C.timerLeaf}
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d={`M${cx} ${cy - 40} q2 -10 8 -12`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const Table: React.FC<{ timer: TimerProps }> = ({ timer }) => {
  const [tx0, ty0, tx1, ty1] = POS.table;
  const w = tx1 - tx0;
  return (
    <g>
      {/* legs */}
      <path d={`M${tx0 + 12} 1268 l4 ${ty1 - 1268} h14 l4 ${-(ty1 - 1268)} Z M${tx1 - 34} 1268 l4 ${ty1 - 1268} h14 l4 ${-(ty1 - 1268)} Z`} fill="#1c140e" stroke={INK} strokeWidth={4} />
      {/* apron with the drawer of spare timers/glasses (slightly ajar: a spare tomato peeks out) */}
      <rect x={tx0 + 6} y={ty0 + 14} width={w - 12} height={58} fill={C.table} stroke={INK} strokeWidth={5} />
      <rect x={tx0 + 44} y={ty0 + 24} width={w - 88} height={40} rx={3} fill="#33251a" stroke={INK} strokeWidth={4} />
      <rect x={tx0 + 48} y={ty0 + 22} width={w - 96} height={6} fill="#0d0907" />
      <path d={`M${tx0 + 70} ${ty0 + 25} q10 -9 20 0`} fill={C.timerTomato} stroke={INK} strokeWidth={2} />
      <circle cx={(tx0 + tx1) / 2} cy={ty0 + 45} r={7} fill={C.diplomaFrame} stroke={INK} strokeWidth={3} />
      {/* top slab */}
      <rect x={tx0} y={ty0} width={w} height={18} rx={4} fill="#3a2a1e" stroke={INK} strokeWidth={5} />
      <rect x={tx0 + 8} y={ty0 + 3} width={w - 16} height={3} fill="#54402e" />
      {/* generic chipped coffee mug, no logo */}
      <g>
        <path d="M448 1172 q-18 2 -18 14 q0 12 18 12" stroke={INK} strokeWidth={10} fill="none" />
        <path d="M448 1172 q-18 2 -18 14 q0 12 18 12" stroke="#D9D2C3" strokeWidth={4} fill="none" />
        <path d="M446 1158 h50 l-4 42 h-42 z" fill="#D9D2C3" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <ellipse cx={471} cy={1158} rx={25} ry={5} fill="#3b2416" stroke={INK} strokeWidth={3} />
        <path d="M486 1158 l6 0 l-2 6 z" fill={C.table} />
        <path d="M456 1166 q2 14 -2 22" stroke="#8a6a45" strokeWidth={3} fill="none" opacity={0.8} />
      </g>
      <TomatoTimer timer={timer} />
    </g>
  );
};

// ───────────────────────────── z15 vignette (screen space) ─────────────────────────────

export const Vignette: React.FC<{ opacity: number }> = ({ opacity }) => (
  <g>
    <defs>
      <radialGradient id="set-vignette-grad" cx="50%" cy="46%" r="72%" fx="50%" fy="46%">
        <stop offset="58%" stopColor={C.vignette} stopOpacity={0} />
        <stop offset="100%" stopColor={C.vignette} stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1080} height={1920} fill="url(#set-vignette-grad)" opacity={opacity} />
  </g>
);

/** Deterministic pseudo-random in [0,1) for static set dressing. */
export const rnd = (key: string): number => random(`set:${key}`);
