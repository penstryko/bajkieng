// Window outside layers for style-v2 episodes (window-local px: 300 × 280, mullion at x 145–155).
//   city_party     — S01E02: the street goes wild because "it's Friday": dancing humans on car roofs, flying ties,
//                    confetti, fireworks over the skyline.
//   monday_morning — S01E02: dawn, 6:00 alarm clocks ringing in every window of the tower, hungover humans below.
// Everything time-varying comes from t (frames since the layer started). Pure functions, deterministic.
import React from "react";
import { FONTS } from "../../engine";
import { Human } from "../humans/Human";
import { rnd } from "./room";

const INK = "#121212";
const W = 300, H = 280;

const Firework: React.FC<{ x: number; y: number; t: number; color: string }> = ({ x, y, t, color }) => {
  const k = (t % 40) / 40;
  if (k > 0.75) return null;
  const r = 6 + 34 * k;
  return (
    <g stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={1 - k}>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <path key={i} d={`M${x + Math.cos(a) * r * 0.55} ${y + Math.sin(a) * r * 0.55} L${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`} />;
      })}
    </g>
  );
};

export const CityParty: React.FC<{ t: number }> = ({ t }) => {
  const confetti = Array.from({ length: 46 }, (_, i) => {
    const x = rnd(`cf-x${i}`) * W, sp = 1.2 + rnd(`cf-s${i}`) * 1.6;
    const y = ((rnd(`cf-y${i}`) * H + t * sp) % (H + 20)) - 10;
    const c = ["#FFD23F", "#E4572E", "#3D7DD8", "#9BE564", "#F2ECDD"][i % 5];
    return <rect key={i} x={x} y={y} width={5} height={3} fill={c} transform={`rotate(${(t * 9 + i * 40) % 360} ${x} ${y})`} />;
  });
  const ties = Array.from({ length: 5 }, (_, i) => {
    const p = ((t + i * 13) % 48) / 48;
    const x = 40 + i * 52 + Math.sin(p * 6) * 10, y = 230 - 170 * Math.sin(p * Math.PI);
    return <path key={i} d={`M${x} ${y} l5 -3 l5 3 l-3 4 l4 20 l-6 6 l-6 -6 l4 -20 Z`} fill={i % 2 ? "#C8322B" : "#3D7DD8"} stroke={INK} strokeWidth={1.5}
      transform={`rotate(${t * 12 + i * 70} ${x + 5} ${y + 12})`} />;
  });
  const bounce = (i: number) => Math.abs(Math.sin((t + i * 7) / 5)) * 8;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#2a1b3d" opacity={0.35} />
      <Firework x={70} y={60} t={t} color="#FFD23F" />
      <Firework x={220} y={44} t={t + 17} color="#E4572E" />
      <Firework x={160} y={90} t={t + 29} color="#9BE564" />
      {/* string lights */}
      <path d="M0 120 Q75 150 150 122 Q225 150 300 120" stroke="#333" strokeWidth={2} fill="none" />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={12 + i * 25} cy={128 + Math.sin(i) * 6} r={4} fill={["#FFD23F", "#E4572E", "#9BE564"][i % 3]} opacity={(t + i * 3) % 12 < 8 ? 1 : 0.4} />)}
      {/* street + two cars */}
      <rect x={0} y={232} width={W} height={48} fill="#22252b" />
      <path d="M0 256 h300" stroke="#e8d27a" strokeWidth={3} strokeDasharray="18 14" />
      {[[30, 0], [180, 1]].map(([x, i]) => (
        <g key={i}>
          <rect x={x} y={214} width={92} height={30} rx={8} fill={i ? "#3D7DD8" : "#E4572E"} stroke={INK} strokeWidth={3} />
          <path d={`M${x + 18} 214 l10 -16 h40 l10 16`} fill="#9fb4c8" stroke={INK} strokeWidth={3} />
          <circle cx={x + 20} cy={246} r={9} fill="#111" /><circle cx={x + 72} cy={246} r={9} fill="#111" />
        </g>
      ))}
      <Human pose="laugh" x={74} y={200 - bounce(0)} scale={0.24} moveAngle={30 + bounce(0) * 3} accessory="tie" />
      <Human pose="throw" x={226} y={200 - bounce(2)} scale={0.24} flip moveAngle={(t * 9) % 80} />
      {[12, 140, 160, 290].map((x, i) => <Human key={x} pose={i % 2 ? "laugh" : "point"} x={x} y={282 - bounce(i + 3)} scale={0.2} flip={i > 1} moveAngle={20 + bounce(i) * 4} />)}
      {ties}
      {confetti}
    </g>
  );
};

export const MondayMorning: React.FC<{ t: number }> = ({ t }) => {
  const sun = Math.min(1, t / 40);
  const clocks: React.ReactNode[] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const x = 58 + c * 46, y = 58 + r * 46, i = r * 3 + c;
      const sh = Math.sin(t * 2.4 + i) * 5;
      clocks.push(
        <g key={i}>
          <rect x={x - 19} y={y - 19} width={38} height={38} fill="#f6d9a8" stroke={INK} strokeWidth={2} />
          <g transform={`translate(${x} ${y + 4}) rotate(${sh})`}>
            <circle r={11} fill="#f2b33d" stroke={INK} strokeWidth={2} />
            <circle cx={-8} cy={-10} r={4} fill="#f2b33d" stroke={INK} strokeWidth={1.5} />
            <circle cx={8} cy={-10} r={4} fill="#f2b33d" stroke={INK} strokeWidth={1.5} />
            <text y={4} textAnchor="middle" fontFamily={FONTS.crt} fontSize={11} fill="#111">6:00</text>
          </g>
        </g>,
      );
    }
  const slump = (i: number) => 10 + Math.sin((t + i * 11) / 9) * 6;
  return (
    <g>
      <defs>
        <linearGradient id="set-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6a46b" />
          <stop offset="1" stopColor="#ffd9a0" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#set-dawn)" />
      <circle cx={250} cy={150 - 70 * sun} r={30} fill="#ffe27a" stroke="#f0a03c" strokeWidth={3} />
      {/* tower facade with the ringing alarm clocks */}
      <rect x={28} y={26} width={166} height={210} fill="#9aa3ad" stroke={INK} strokeWidth={3} />
      {clocks}
      {/* street with the hungover crowd */}
      <rect x={0} y={236} width={W} height={44} fill="#5b5f66" />
      {[20, 62, 104, 196, 238, 280].map((x, i) => (
        <Human key={x} pose={i % 3 === 0 ? "sleep" : i % 3 === 1 ? "yell" : "point"} x={x} y={286} scale={0.22} flip={i > 2} moveAngle={slump(i)} />
      ))}
    </g>
  );
};
