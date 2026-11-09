// Window outside layers for style-v2 episodes (window-local px: 300 × 280, mullion at x 145–155).
//   city_party     — S01E02: the street goes wild because "it's Friday": dancing humans on car roofs, flying ties,
//                    confetti, fireworks over the skyline.
//   monday_morning — S01E02: dawn, 6:00 alarm clocks ringing in every window of the tower, hungover humans below.
// Everything time-varying comes from t (frames since the layer started). Pure functions, deterministic.
import React from "react";
import { FONTS, clamp, popIn, progress } from "../../engine";
import { Human } from "../humans/Human";
import { rnd } from "./room";
import { MiniPrinter } from "../props/vignettes";

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

// ───────────────────────────── office_swap (S01E01, style v2) ─────────────────────────────
// The old printer has come back to the office: a box is opened, a shiny NEW printer pops out, the queue sign counts
// down to 0, everybody cheers and the boss throws the old printer out. t = frames since the layer started (1500).
//   t   0–58  : humans bang their heads, queue sign still 99 999, the NEW box waits on the table
//   t  58–72  : lid flaps open, the new printer springs out, "NEW!" burst
//   t  72–152 : the sign counts 99 999 → 0, sheets fly out of the new printer, humans start laughing (t ≥ 105)
//   t 152–200 : confetti, everybody cheers
//   t 190–198 : the boss winds up and KICKS the old printer (callback to the memory: "they KICK me");
//               the old printer (actor, z = 1) is launched at t = 198 (frame 1698)
export const OFFICE_SWAP = { OPEN: 58, COUNT0: 72, COUNT1: 152, CHEER: 152, THROW: 190, LAUNCH: 198 } as const;
const fmt = (n: number) => (String(n).length > 3 ? `${String(n).slice(0, -3)} ${String(n).slice(-3)}` : String(n));

const Sparkle: React.FC<{ x: number; y: number; r: number; rot?: number }> = ({ x, y, r, rot = 0 }) => (
  <path d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`}
    fill="#FFF6B8" stroke="#E0A030" strokeWidth={1.2} transform={`rotate(${rot} ${x} ${y})`} />
);

export const OfficeSwap: React.FC<{ t: number }> = ({ t }) => {
  const O = OFFICE_SWAP;
  const n = t < O.COUNT0 ? 99999 : Math.round(99999 * (1 - progress(t, O.COUNT0, O.COUNT1 - O.COUNT0, "inOut")));
  const open = progress(t, O.OPEN, 8, "out");
  const rise = popIn(t, O.OPEN + 2, { settle: 10 });
  const burst = popIn(t, O.OPEN + 12, { settle: 8 });
  const cheering = t >= 105;
  const bang = (i: number) => (t < 105 ? 38 * Math.abs(Math.sin((t + i * 7) / 5)) : 0);
  const laugh = (i: number) => 10 * Math.sin((t + i * 5) / 2.4);
  const kicking = t >= O.THROW && t < O.LAUNCH + 22;
  const kickA = t < O.LAUNCH ? 75 * ((t - O.THROW) / (O.LAUNCH - O.THROW)) : Math.max(0, 75 * (1 - (t - O.LAUNCH) / 12));
  const bossPose = kicking ? "kick" : t >= 62 && t < 105 ? "point" : t >= 105 ? "laugh" : "type";
  const bossAngle = kicking ? kickA : t >= 62 && t < 105 ? 18 : t >= 105 ? laugh(1) : bang(1);
  const hit = clamp(1 - Math.abs(t - (O.LAUNCH + 2)) / 6, 0, 1);
  const sheets = Array.from({ length: 14 }, (_, i) => {
    const t0 = O.COUNT0 + 4 + i * 5;
    const a = t - t0;
    if (a < 0 || a > 34) return null;
    const x = 214 - a * 3.6 - (i % 3) * 4, y = 176 - 26 * Math.sin((a / 34) * Math.PI) + a * 1.1;
    return <rect key={i} x={x} y={y} width={14} height={10} fill="#F4F1EA" stroke={INK} strokeWidth={1.2} transform={`rotate(${-20 + a * 9 + i * 15} ${x + 7} ${y + 5})`} />;
  });
  const confetti = t < O.CHEER ? null : Array.from({ length: 40 }, (_, i) => {
    const a = t - O.CHEER - Math.floor(rnd(`sw-c0${i}`) * 20);
    if (a < 0) return null;
    const x = rnd(`sw-cx${i}`) * 300, y = -8 + a * (1.4 + rnd(`sw-cs${i}`) * 1.4);
    if (y > 250) return null;
    return <rect key={i} x={x + Math.sin(a / 6 + i) * 6} y={y} width={5} height={3} fill={["#FFD23F", "#E4572E", "#3D7DD8", "#9BE564", "#F2ECDD"][i % 5]} transform={`rotate(${(a * 11 + i * 40) % 360} ${x} ${y})`} />;
  });
  const done = n === 0;
  return (
    <g>
      {/* room */}
      <rect x={0} y={0} width={300} height={240} fill="#CDD5CF" />
      <rect x={0} y={0} width={300} height={14} fill="#AAB4AD" />
      <rect x={0} y={226} width={300} height={14} fill="#9AA59D" />
      <rect x={0} y={240} width={300} height={40} fill="#5D6270" />
      <path d="M0 262 H300" stroke="#4a4e5a" strokeWidth={2} />
      {/* queue sign (same design as the tower's) */}
      <g>
        <rect x={10} y={28} width={130} height={88} rx={22} fill="#F4F1EA" stroke={INK} strokeWidth={4} />
        <g transform="translate(41 50)" stroke={INK} strokeWidth={2.2} strokeLinejoin="round">
          <rect x={-12} y={-15} width={22} height={11} fill="#F4F1EA" />
          <rect x={-18} y={-6} width={34} height={17} rx={3} fill="#E9E4D8" />
          <rect x={-10} y={5} width={18} height={9} fill="#F4F1EA" />
        </g>
        <g transform="translate(85 50)" stroke={INK} strokeWidth={2} strokeLinejoin="round">
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-14 + i * 2} y={8 - i * 6} width={30} height={5} fill="#F4F1EA" />)}
        </g>
        <text x={75} y={104} textAnchor="middle" fontFamily={FONTS.crt} fontSize={48} fill={done ? "#2E9E4F" : "#C8262B"}>{fmt(n)}</text>
      </g>
      {/* humans (left: the boss and a typist, right: a typist behind the table) */}
      <Human pose={t < 105 ? "type" : "laugh"} x={22} y={270} scale={0.24} moveAngle={t < 105 ? bang(0) : laugh(0)} />
      <Human pose={bossPose} x={52} y={272} scale={0.3} accessory="tie" moveAngle={bossAngle} />
      <Human pose={t < 105 ? "type" : "laugh"} x={266} y={270} scale={0.24} flip moveAngle={t < 105 ? bang(2) : laugh(2)} />
      {/* table, box and the NEW printer */}
      <rect x={176} y={198} width={112} height={10} fill="#8B6B4A" stroke={INK} strokeWidth={3} />
      <rect x={184} y={208} width={8} height={32} fill="#6f5439" stroke={INK} strokeWidth={2.5} />
      <rect x={272} y={208} width={8} height={32} fill="#6f5439" stroke={INK} strokeWidth={2.5} />
      <g>
        <rect x={198} y={150} width={70} height={48} fill="#7a5a3a" stroke={INK} strokeWidth={3} />
        {t >= O.OPEN ? (
          <g transform={`translate(233 ${198 - 118 * (1 - rise) + 0}) scale(${0.34 + 0.12 * rise})`} opacity={clamp(rise * 3, 0, 1)}>
            <MiniPrinter x={0} y={0} />
          </g>
        ) : null}
        <path d="M198 198 V152 H268 V198 Z" fill="#B58A5B" stroke={INK} strokeWidth={3} opacity={t >= O.OPEN ? 0 : 1} />
        <rect x={198} y={166} width={70} height={32} fill="#B58A5B" stroke={INK} strokeWidth={3} />
        <path d="M214 166 v32 M252 166 v32" stroke="#8e6a43" strokeWidth={2} />
        {/* lid flaps */}
        <path d={`M198 150 L${198 - 22 * open} ${150 - 20 * open} L${198 - 22 * open + 26} ${150 - 22 * open} L226 150 Z`} fill="#C99A68" stroke={INK} strokeWidth={2.5} />
        <path d={`M268 150 L${268 + 22 * open} ${150 - 20 * open} L${268 + 22 * open - 26} ${150 - 22 * open} L240 150 Z`} fill="#C99A68" stroke={INK} strokeWidth={2.5} />
      </g>
      {t >= O.OPEN + 8 ? (
        <g>
          <Sparkle x={206} y={128} r={9 * rise} rot={t * 4} />
          <Sparkle x={262} y={120} r={11 * rise} rot={-t * 3} />
          <Sparkle x={236} y={96} r={8 * rise} rot={t * 5} />
          <g transform={`translate(236 78) scale(${burst})`}>
            <path d="M0 -34 L9 -18 L28 -26 L22 -8 L38 0 L22 8 L28 26 L9 18 L0 34 L-9 18 L-28 26 L-22 8 L-38 0 L-22 -8 L-28 -26 L-9 -18 Z" fill="#FFD23F" stroke={INK} strokeWidth={3.5} />
            <text x={0} y={9} textAnchor="middle" fontFamily={FONTS.caption} fontSize={24} fill="#C8262B">NEW!</text>
          </g>
        </g>
      ) : null}
      {sheets}
      {hit > 0 ? (
        <g transform={`translate(98 226) scale(${hit * 1.1})`}>
          <path d="M0 -26 L7 -11 L22 -17 L14 -3 L28 4 L12 7 L16 22 L2 12 L-8 26 L-10 10 L-26 8 L-14 -2 L-22 -16 L-6 -10 Z" fill="#FFF6B8" stroke={INK} strokeWidth={3} />
        </g>
      ) : null}
      {cheering ? <g opacity={0.0} /> : null}
      {confetti}
    </g>
  );
};
