// Chirp (bible §3.3): flat white smoke-detector disc r 46 at (170, 300), seen slightly from below
// (face ellipse + the near side band above it), concentric vent slots, one LED "eye" r 7.
// No face: emotion = LED level, tilt (chirp pose 10°) and tremble. Dusty and neglected (dead battery).
// Owner: cast builder. Pure function of props.
import React, { useId } from "react";
import type { ChirpProps } from "../../contract";
import { CHIRP_COLORS as C, POS } from "../../engine";

const INK = "#161616";
const [CX, CY] = POS.chirp.c; // 170, 300
const R = POS.chirp.r; // 46
const RY = 19; // foreshortened face ellipse
const BAND = 14; // visible side band height
const FACE_Y = CY + 6;
const LED: [number, number] = [CX + 25, FACE_Y + 5];

export const Chirp: React.FC<ChirpProps> = ({ led, ledLevel, tilt, jitter }) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const level = Math.max(0, Math.min(1, ledLevel));
  const top = FACE_Y - BAND;
  const marks = (led === "chirp" || led === "alarm") && level > 0.5;
  return (
    <g transform={`translate(${jitter[0]} ${jitter[1]}) rotate(${tilt} ${CX} ${top - RY})`}>
      <defs>
        <filter id={`${uid}-led`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>
      {/* cobweb strand to the ceiling (neglect) */}
      <path d={`M${CX - R + 4} ${top - 4} q-18 -10 -30 -34 M${CX - R + 14} ${top - 10} q-10 -16 -12 -30`} fill="none" stroke="#8C8578" strokeWidth={1.5} opacity={0.55} />
      {/* near side band (between the ceiling ring and the face) */}
      <path
        d={`M${CX - R} ${FACE_Y} A${R} ${RY} 0 0 1 ${CX + R} ${FACE_Y} V${top} A${R} ${RY} 0 0 0 ${CX - R} ${top} Z`}
        fill={C.rim}
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d={`M${CX - R + 6} ${top - 2} A${R - 6} ${RY - 3} 0 0 1 ${CX + R - 6} ${top - 2}`} fill="none" stroke={C.vents} strokeWidth={2} opacity={0.7} />
      {/* face */}
      <ellipse cx={CX} cy={FACE_Y} rx={R} ry={RY} fill={C.body} stroke={INK} strokeWidth={3} />
      <ellipse cx={CX} cy={FACE_Y} rx={R - 6} ry={RY - 3} fill="none" stroke={C.rim} strokeWidth={2.5} />
      {/* vent slots */}
      <ellipse cx={CX} cy={FACE_Y} rx={31} ry={12.5} fill="none" stroke={C.vents} strokeWidth={3.5} strokeDasharray="9 5" />
      <ellipse cx={CX} cy={FACE_Y} rx={19} ry={7.5} fill="none" stroke={C.vents} strokeWidth={3} strokeDasharray="6 4" />
      <ellipse cx={CX} cy={FACE_Y} rx={7} ry={3} fill={C.rim} stroke={C.vents} strokeWidth={1.5} />
      {/* yellowed dust smudge */}
      <ellipse cx={CX - 22} cy={FACE_Y + 6} rx={10} ry={4} fill={C.vents} opacity={0.35} />
      {/* LED eye */}
      {level > 0 ? <circle cx={LED[0]} cy={LED[1]} r={20} fill={C.ledGlow} opacity={0.55 * level} filter={`url(#${uid}-led)`} /> : null}
      {level > 0 ? <circle cx={LED[0]} cy={LED[1]} r={14} fill={C.ledGlow} opacity={0.4 * level} /> : null}
      <circle cx={LED[0]} cy={LED[1]} r={POS.chirp.ledR + 2} fill={C.rim} stroke={INK} strokeWidth={2} />
      <circle cx={LED[0]} cy={LED[1]} r={POS.chirp.ledR} fill={C.ledOff} />
      {level > 0 ? <circle cx={LED[0]} cy={LED[1]} r={POS.chirp.ledR} fill={C.ledOn} opacity={level} /> : null}
      <circle cx={LED[0] - 2.2} cy={LED[1] - 2.4} r={1.8} fill="#FFFFFF" opacity={0.55 + 0.45 * level} />
      {/* chirp marks */}
      {marks ? (
        <g stroke={led === "alarm" ? C.ledOn : C.body} strokeWidth={4} strokeLinecap="round" opacity={level}>
          <path d={`M${CX + R + 10} ${FACE_Y - 2} l14 -6 M${CX + R + 12} ${FACE_Y + 10} l16 2 M${CX + R + 6} ${FACE_Y + 22} l12 10`} />
          {led === "alarm" ? <path d={`M${CX - R - 10} ${FACE_Y - 2} l-14 -6 M${CX - R - 12} ${FACE_Y + 10} l-16 2 M${CX - R - 6} ${FACE_Y + 22} l-12 10`} /> : null}
        </g>
      ) : null}
    </g>
  );
};
