// "The Humans" (bible §4.7): grey, faceless, nameless silhouettes (#7B7E86 / shade #5F626A):
// rounded-rect torso, circle head, glove hands. 8 static poses + neutral accessories. The one moving
// part per pose is driven by `moveAngle` (deg, 0 = rest). Bottom-centre anchor (feet / floor line),
// standing height ≈ 330 px at scale 1. Pure function of props. Owned by the set builder.
import React from "react";
import type { HumanProps } from "../../contract";
import type { HumanAccessory, HumanPose } from "../../enums";
import { FONTS, HUMAN_COLORS as C } from "../../engine";

const INK = "#121212";
type P = [number, number];

const rot = (p: P, c: P, deg: number): P => {
  const a = (deg * Math.PI) / 180, s = Math.sin(a), co = Math.cos(a);
  const dx = p[0] - c[0], dy = p[1] - c[1];
  return [c[0] + dx * co - dy * s, c[1] + dx * s + dy * co];
};
const rotAll = (pts: P[], c: P, deg: number): P[] => pts.map((p) => rot(p, c, deg));

interface Limb {
  pts: P[];
  w: number;
  back?: boolean;
  end?: "hand" | "fist" | "foot" | "point" | "none";
}
interface Rig {
  torso: { c: P; w: number; h: number; rot: number };
  head: { c: P; r: number };
  limbs: Limb[];
  /** drawn before everything (desk, chair…) */
  under?: React.ReactNode;
  /** drawn after everything (keyboard edge, phone, Zs…) */
  over?: React.ReactNode;
  profile?: boolean;
}

const poly = (pts: P[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

const LimbG: React.FC<{ l: Limb }> = ({ l }) => {
  const col = l.back ? C.shade : C.body;
  const d = poly(l.pts);
  const tip = l.pts[l.pts.length - 1];
  const prev = l.pts[l.pts.length - 2] ?? tip;
  const ang = (Math.atan2(tip[1] - prev[1], tip[0] - prev[0]) * 180) / Math.PI;
  const endR = l.end === "foot" ? 0 : l.end === "none" ? 0 : l.w * 0.72;
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={l.w + 7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={col} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {l.end === "foot" ? (
        <g transform={`translate(${tip[0]} ${tip[1]}) rotate(${ang - 90})`}>
          <ellipse cx={8} cy={4} rx={l.w * 0.95} ry={l.w * 0.5} fill={C.shade} stroke={INK} strokeWidth={3.5} />
        </g>
      ) : null}
      {endR > 0 ? (
        <g>
          <circle cx={tip[0]} cy={tip[1]} r={endR} fill={col} stroke={INK} strokeWidth={3.5} />
          {l.end === "point" ? (
            <path d={`M${tip[0]} ${tip[1]} l${Math.cos((ang * Math.PI) / 180) * 26} ${Math.sin((ang * Math.PI) / 180) * 26}`} stroke={INK} strokeWidth={13} strokeLinecap="round" />
          ) : null}
          {l.end === "point" ? (
            <path d={`M${tip[0]} ${tip[1]} l${Math.cos((ang * Math.PI) / 180) * 26} ${Math.sin((ang * Math.PI) / 180) * 26}`} stroke={col} strokeWidth={7} strokeLinecap="round" />
          ) : null}
        </g>
      ) : null}
    </g>
  );
};

// standing frontal skeleton
const SH = -236; // shoulder y
const HIP = -112;
const HEAD: P = [0, -290];

function rigFor(pose: HumanPose, m: number): Rig {
  switch (pose) {
    case "phone": {
      const head: P = rot(HEAD, [0, SH], m * 0.5);
      return {
        torso: { c: [0, -174], w: 88, h: 144, rot: 0 },
        head: { c: head, r: 37 },
        limbs: [
          { pts: [[-18, HIP], [-22, -6]], w: 26, back: true, end: "foot" },
          { pts: [[18, HIP], [22, -6]], w: 26, end: "foot" },
          { pts: [[-44, SH + 6], [-66, -170], [-56, -110]], w: 22, back: true, end: "hand" },
          { pts: [[44, SH + 6], [82, -214], [head[0] + 40, head[1] + 6]], w: 22, end: "hand" },
        ],
        over: (
          <rect x={head[0] + 30} y={head[1] - 30} width={16} height={34} rx={4} fill="#26282d" stroke={INK} strokeWidth={3} transform={`rotate(14 ${head[0] + 38} ${head[1] - 12})`} />
        ),
      };
    }
    case "yell": {
      const a = m;
      return {
        torso: { c: [0, -176], w: 88, h: 144, rot: 0 },
        head: { c: [0, -296], r: 37 },
        limbs: [
          { pts: [[-18, HIP], [-34, -6]], w: 26, back: true, end: "foot" },
          { pts: [[18, HIP], [34, -6]], w: 26, end: "foot" },
          { pts: rotAll([[-44, SH + 4], [-88, -280], [-70, -344]], [-44, SH + 4], -a), w: 22, end: "fist" },
          { pts: rotAll([[44, SH + 4], [88, -280], [70, -344]], [44, SH + 4], a), w: 22, end: "fist" },
        ],
        over: (
          <g stroke={INK} strokeWidth={5} strokeLinecap="round">
            <path d="M-50 -330 l-16 -12 M0 -342 v-20 M50 -330 l16 -12" />
          </g>
        ),
      };
    }
    case "kick": {
      // profile facing right; kicking leg swings forward from the hip by m
      const hip: P = [0, HIP];
      return {
        profile: true,
        torso: { c: [-6, -176], w: 74, h: 144, rot: -6 },
        head: { c: [-14, -292], r: 37 },
        limbs: [
          { pts: [[-4, SH + 8], [-40, -176], [-62, -128]], w: 22, back: true, end: "hand" },
          { pts: [hip, [-6, -6]], w: 27, back: true, end: "foot" },
          { pts: rotAll([hip, [10, -54], [8, -4]], hip, -m), w: 27, end: "foot" },
          { pts: [[4, SH + 8], [44, -200], [76, -214]], w: 22, end: "fist" },
        ],
      };
    }
    case "point": {
      const sh: P = [44, SH + 6];
      return {
        torso: { c: [0, -174], w: 88, h: 144, rot: 0 },
        head: { c: [4, -290], r: 37 },
        limbs: [
          { pts: [[-18, HIP], [-24, -6]], w: 26, back: true, end: "foot" },
          { pts: [[18, HIP], [24, -6]], w: 26, end: "foot" },
          { pts: [[-44, SH + 6], [-60, -170], [-34, -132]], w: 22, back: true, end: "hand" },
          { pts: rotAll([sh, [104, -236], [160, -240]], sh, -m), w: 22, end: "point" },
        ],
      };
    }
    case "sleep": {
      // profile, slumped over a desk, head on folded arms; m = breathing bob (px-ish)
      const bob = m * 0.3;
      return {
        profile: true,
        under: (
          <g>
            <rect x={-46} y={-118} width={64} height={12} fill="#3a3c42" stroke={INK} strokeWidth={3} />
            <path d="M-10 -106 v100 M-40 -106 v100" stroke={INK} strokeWidth={6} />
          </g>
        ),
        torso: { c: [8, -170 + bob], w: 74, h: 132, rot: 48 },
        head: { c: [88, -192 + bob], r: 36 },
        limbs: [
          { pts: [[-14, -114], [44, -116], [50, -6]], w: 26, back: true, end: "foot" },
          { pts: [[54, -212 + bob], [110, -168 + bob], [140, -172 + bob]], w: 22, end: "hand" },
        ],
        over: (
          <g>
            <rect x={70} y={-160} width={130} height={14} fill="#4a4c52" stroke={INK} strokeWidth={3} />
            <path d="M84 -146 v140 M188 -146 v140" stroke={INK} strokeWidth={6} />
            <text x={120} y={-246 - bob * 2} fontFamily={FONTS.caption} fontSize={34} fill="#F2ECDD" stroke={INK} strokeWidth={2}>z</text>
            <text x={146} y={-276 - bob * 2} fontFamily={FONTS.caption} fontSize={24} fill="#F2ECDD" stroke={INK} strokeWidth={1.5}>z</text>
          </g>
        ),
      };
    }
    case "type": {
      // profile facing right at a desk; m tilts the upper body forward from the hip (head-bang onto the keyboard)
      const hip: P = [-6, -118];
      const up = (p: P): P => rot(p, hip, m);
      return {
        profile: true,
        under: (
          <g>
            {/* chair */}
            <rect x={-56} y={-122} width={72} height={12} fill="#3a3c42" stroke={INK} strokeWidth={3} />
            <path d="M-50 -110 v104 M10 -110 v104" stroke={INK} strokeWidth={6} />
            <rect x={-66} y={-220} width={12} height={100} fill="#3a3c42" stroke={INK} strokeWidth={3} />
          </g>
        ),
        torso: { c: up([-4, -186]), w: 72, h: 136, rot: m },
        head: { c: up([6, -294]), r: 36 },
        limbs: [
          { pts: [hip, [52, -112], [56, -6]], w: 26, back: true, end: "foot" },
          { pts: [up([10, -236]), up([46, -178]), [96, -150 + m * 0.15]], w: 22, end: "hand" },
        ],
        over: (
          <g>
            {/* desk, keyboard, monitor */}
            <rect x={60} y={-140} width={150} height={14} fill="#4a4c52" stroke={INK} strokeWidth={3} />
            <path d="M74 -126 v120 M196 -126 v120" stroke={INK} strokeWidth={6} />
            <rect x={70} y={-152} width={62} height={10} rx={3} fill="#2a2c31" stroke={INK} strokeWidth={3} />
            <rect x={150} y={-246} width={52} height={78} rx={4} fill="#2a2c31" stroke={INK} strokeWidth={4} />
            <rect x={158} y={-238} width={36} height={56} fill="#7fa4b8" opacity={0.6} />
            <path d="M176 -168 v28" stroke={INK} strokeWidth={6} />
          </g>
        ),
      };
    }
    case "laugh": {
      const tilt = -8 + m * 0.4;
      const c: P = [0, HIP];
      return {
        torso: { c: rot([0, -176], c, tilt), w: 90, h: 146, rot: tilt },
        head: { c: rot([-6, -294], c, tilt * 1.4), r: 37 },
        limbs: [
          { pts: [[-18, HIP], [-30, -6]], w: 26, back: true, end: "foot" },
          { pts: [[18, HIP], [30, -6]], w: 26, end: "foot" },
          { pts: rotAll([[-44, SH + 8], [-70, -170], [-16, -150]], c, tilt), w: 22, end: "hand" },
          { pts: rotAll([[44, SH + 8], [96, -210], [150, -236]], c, tilt), w: 22, end: "point" },
        ],
        over: (
          <g stroke={INK} strokeWidth={5} strokeLinecap="round">
            <path d={`M-62 -338 l-12 -10 M-46 -352 l-6 -14`} />
          </g>
        ),
      };
    }
    case "throw": {
      // profile; throwing arm swings from behind the head (m = 0) forward (m ≈ 120)
      const sh: P = [6, SH + 8];
      const arm = rotAll([sh, [-30, -300], [-60, -340]], sh, m);
      const hand = arm[2];
      return {
        profile: true,
        torso: { c: [0, -176], w: 74, h: 144, rot: 4 },
        head: { c: [8, -292], r: 37 },
        limbs: [
          { pts: [[0, HIP], [-30, -6]], w: 27, back: true, end: "foot" },
          { pts: [[0, HIP], [34, -6]], w: 27, end: "foot" },
          { pts: [[0, SH + 8], [46, -196], [70, -170]], w: 22, back: true, end: "hand" },
          { pts: arm, w: 22, end: "hand" },
        ],
        over: <circle cx={hand[0]} cy={hand[1] - 14} r={16} fill="#F4F1EA" stroke={INK} strokeWidth={3.5} />,
      };
    }
  }
}

const Accessory: React.FC<{ a: HumanAccessory; rig: Rig }> = ({ a, rig }) => {
  const { c: hc, r } = rig.head;
  const t = rig.torso;
  switch (a) {
    case "tie":
      return (
        <g transform={`rotate(${t.rot} ${t.c[0]} ${t.c[1]})`}>
          <path d={`M${t.c[0] - 8} ${t.c[1] - t.h / 2 + 4} h16 l-3 10 l8 64 l-13 16 l-13 -16 l8 -64 z`} fill="#3a3d44" stroke={INK} strokeWidth={3} />
        </g>
      );
    case "apron":
      return (
        <g transform={`rotate(${t.rot} ${t.c[0]} ${t.c[1]})`}>
          <rect x={t.c[0] - t.w / 2 + 10} y={t.c[1] - 20} width={t.w - 20} height={t.h / 2 + 34} rx={6} fill="#9a9da5" stroke={INK} strokeWidth={3} />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d={`M${hc[0] - r} ${hc[1] - 6} a${r} ${r} 0 0 1 ${2 * r} 0 z`} fill="#4d5058" stroke={INK} strokeWidth={3.5} />
          <path d={`M${hc[0] + (rig.profile ? 0 : -r)} ${hc[1] - 6} h${rig.profile ? r + 26 : 2 * r + 10}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
        </g>
      );
    case "headphones":
      return (
        <g>
          <path d={`M${hc[0] - r - 2} ${hc[1] + 4} a${r + 2} ${r + 4} 0 0 1 ${2 * r + 4} 0`} stroke={INK} strokeWidth={7} fill="none" />
          <rect x={hc[0] - r - 10} y={hc[1] - 6} width={16} height={26} rx={6} fill="#3a3d44" stroke={INK} strokeWidth={3} />
          {!rig.profile ? <rect x={hc[0] + r - 6} y={hc[1] - 6} width={16} height={26} rx={6} fill="#3a3d44" stroke={INK} strokeWidth={3} /> : null}
        </g>
      );
  }
};

export const Human: React.FC<HumanProps> = ({ pose, x, y, scale, flip, accessory, moveAngle = 0 }) => {
  const rig = rigFor(pose, moveAngle);
  const back = rig.limbs.filter((l) => l.back);
  const front = rig.limbs.filter((l) => !l.back);
  const t = rig.torso;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {rig.under}
      {back.map((l, i) => <LimbG key={`b${i}`} l={l} />)}
      <rect
        x={t.c[0] - t.w / 2}
        y={t.c[1] - t.h / 2}
        width={t.w}
        height={t.h}
        rx={t.w * 0.38}
        fill={C.body}
        stroke={INK}
        strokeWidth={4}
        transform={`rotate(${t.rot} ${t.c[0]} ${t.c[1]})`}
      />
      <circle cx={rig.head.c[0]} cy={rig.head.c[1]} r={rig.head.r} fill={C.body} stroke={INK} strokeWidth={4} />
      {/* faceless: only a soft top highlight */}
      <path d={`M${rig.head.c[0] - rig.head.r * 0.55} ${rig.head.c[1] - rig.head.r * 0.5} a${rig.head.r * 0.7} ${rig.head.r * 0.7} 0 0 1 ${rig.head.r * 0.8} -${rig.head.r * 0.3}`} stroke="#9a9da5" strokeWidth={5} fill="none" strokeLinecap="round" />
      {accessory ? <Accessory a={accessory} rig={rig} /> : null}
      {front.map((l, i) => <LimbG key={`f${i}`} l={l} />)}
      {rig.over}
    </g>
  );
};

/** Pose metadata for model sheets / vignette authors: which part `moveAngle` drives and a useful range. */
export const HUMAN_MOVES: Record<HumanPose, { part: string; range: [number, number] }> = {
  phone: { part: "head tilt", range: [-10, 10] },
  yell: { part: "both fists shake", range: [-12, 12] },
  kick: { part: "kicking leg (hip)", range: [0, 75] },
  point: { part: "pointing arm (shoulder)", range: [-15, 25] },
  sleep: { part: "breathing bob", range: [0, 10] },
  type: { part: "head-bang tilt (hip)", range: [0, 38] },
  laugh: { part: "torso shake", range: [-10, 10] },
  throw: { part: "throwing arm (shoulder)", range: [0, 140] },
};
