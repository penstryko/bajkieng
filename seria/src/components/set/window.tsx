// z1 window behind the doctor (bible §5.1–5.2): x 390–690, y 360–640. Outside layers:
//   calm               — evening city, lit windows, the rival kiosk Nod-O-Matic 99¢ with its neon (S0: ON)
//   office_print_queue — S01E01 consequence: office tower across the street (fades in over 9 frames), grey humans
//                        banging their heads on keyboards, growing wordless queue sign (printer icon + 99 999)
// windowSlot (patient exiting with z = 1) is drawn above the outside layer, below blinds/glass/frame.
// Everything time-varying comes from windowT (frames since the layer started; 0 in S0).
import React from "react";
import type { SetProps } from "../../contract";
import { FONTS, POS, SET_COLORS as C } from "../../engine";
import { Human } from "../humans/Human";
import { rnd } from "./room";
import { tone } from "./color";

const INK = "#121212";
const [WX0, WY0, WX1, WY1] = POS.window;
const WW = WX1 - WX0, WH = WY1 - WY0;

/** Far skyline in window-local px (x, width, top y). */
const SKYLINE: [number, number, number][] = [
  [-4, 48, 128], [40, 34, 172], [68, 54, 92], [118, 42, 150], [154, 58, 58], [206, 40, 138], [240, 30, 104], [266, 42, 164],
];

const Skyline: React.FC = () => (
  <g>
    {SKYLINE.map(([x, w, top], i) => {
      const fill = i % 3 === 0 ? "#18202f" : i % 3 === 1 ? C.city : "#202a40";
      const wins: React.ReactNode[] = [];
      for (let yy = top + 12; yy < WH - 20; yy += 16)
        for (let xx = x + 6; xx < x + w - 8; xx += 11)
          if (rnd(`win${i}:${xx}:${yy}`) < 0.3) wins.push(<rect key={`${xx}-${yy}`} x={xx} y={yy} width={5} height={8} fill={C.cityLights} opacity={0.55 + 0.45 * rnd(`wo${i}:${xx}:${yy}`)} />);
      return (
        <g key={i}>
          <rect x={x} y={top} width={w} height={WH - top} fill={fill} />
          {i === 4 ? <path d={`M${x + w / 2} ${top} v-26`} stroke={fill} strokeWidth={4} /> : null}
          {wins}
        </g>
      );
    })}
  </g>
);

const Sky: React.FC = () => (
  <g>
    <rect x={0} y={0} width={WW} height={WH} fill={C.sky} />
    <rect x={0} y={150} width={WW} height={WH - 150} fill="#324468" />
    <rect x={0} y={205} width={WW} height={WH - 205} fill="#3a4d74" />
    {[[22, 30], [64, 14], [128, 40], [200, 22], [262, 52], [236, 8]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.8} fill="#a9b6d4" opacity={0.7} />
    ))}
  </g>
);

/** Rival kiosk across the street (bible §3.4): nodding robot head + neon "99¢". Window-local coords. */
const Kiosk: React.FC<{ neonOn: boolean; t: number }> = ({ neonOn, t }) => {
  // one quick nod every 2 s, at rest for t mod 60 ∈ [0, 19] ∪ [32, 59] (so S0 / windowT 0 is the rest pose)
  const ph = t % 60;
  const nod = ph >= 20 && ph < 32 ? 14 * Math.sin(((ph - 20) / 12) * Math.PI * 2) : 0;
  const neon = neonOn ? C.neon : "#1d4f5a";
  const x0 = 166, x1 = 264;
  return (
    <g>
      <defs>
        <filter id="set-neon-glow" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={3.2} />
        </filter>
      </defs>
      {/* street */}
      <rect x={0} y={WH - 14} width={WW} height={14} fill="#121722" />
      <rect x={0} y={WH - 14} width={WW} height={2} fill="#2a3346" />
      {/* booth */}
      <rect x={x0} y={196} width={x1 - x0} height={WH - 14 - 196} fill="#232a3a" />
      <rect x={x0 - 6} y={188} width={x1 - x0 + 12} height={10} fill="#2e3648" />
      <rect x={x0 + 12} y={208} width={x1 - x0 - 24} height={44} fill="#0f141e" />
      {/* nodding robot head (pivot at the neck) */}
      <g transform={`rotate(${nod} ${(x0 + x1) / 2} 248)`}>
        <rect x={(x0 + x1) / 2 - 3} y={238} width={6} height={12} fill="#6c7487" />
        <rect x={(x0 + x1) / 2 - 18} y={214} width={36} height={26} rx={4} fill="#8A93A6" />
        <circle cx={(x0 + x1) / 2 - 8} cy={226} r={4} fill={neon} />
        <circle cx={(x0 + x1) / 2 + 8} cy={226} r={4} fill={neon} />
        <path d={`M${(x0 + x1) / 2} 214 v-6`} stroke="#8A93A6" strokeWidth={2} />
      </g>
      {/* neon sign on the roof */}
      <g>
        {neonOn ? (
          <g filter="url(#set-neon-glow)" opacity={0.9}>
            <text x={(x0 + x1) / 2} y={180} textAnchor="middle" fontFamily={FONTS.caption} fontSize={46} fill={C.neon}>99¢</text>
            <text x={(x0 + x1) / 2} y={133} textAnchor="middle" fontFamily={FONTS.crt} fontSize={17} fill={C.neon}>NOD-O-MATIC</text>
          </g>
        ) : null}
        <text x={(x0 + x1) / 2} y={180} textAnchor="middle" fontFamily={FONTS.caption} fontSize={46} fill="none" stroke={neon} strokeWidth={2.6}>99¢</text>
        <text x={(x0 + x1) / 2} y={133} textAnchor="middle" fontFamily={FONTS.crt} fontSize={17} fill={neonOn ? "#c8f7ff" : "#1d4f5a"}>NOD-O-MATIC</text>
        <path d={`M${x0 + 4} 188 V140 M${x1 - 4} 188 V140`} stroke="#2e3648" strokeWidth={3} />
      </g>
    </g>
  );
};

/** frames over which the office tower fades in when the layer starts */
const FACADE_IN = 9;
/** frames for the queue to pile up to 99 999 (20 s: in S01E01 the layer starts at 900, maxed by ≈ 1500, before the "NO.") */
export const QUEUE_RAMP = 600;
/** accelerating pile-up (k^2.2): ~140 after 1 s, ~22 000 at half time, 99 999 at QUEUE_RAMP, then holds */
const queueCount = (t: number): number => {
  const k = Math.max(0, Math.min(1, t / QUEUE_RAMP));
  return Math.round(99999 * Math.pow(k, 2.2));
};
const fmtThousands = (n: number): string => {
  const s = String(n);
  return s.length > 3 ? `${s.slice(0, -3)} ${s.slice(-3)}` : s;
};

/** S01E01 window consequence: office tower, head-banging humans, growing PRINT QUEUE bubble. Window-local. */
const OfficePrintQueue: React.FC<{ t: number }> = ({ t }) => {
  // tower left of the mullion (local x 145–155), bubble above it, inside the glass
  const tx0 = 6, tx1 = 142, ty0 = 134;
  const cols = 2, cw = 56, ch = 48, gx = 8, gy = 8;
  const ix0 = tx0 + (tx1 - tx0 - (cols * cw + (cols - 1) * gx)) / 2;
  const iy0 = ty0 + 12;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < cols; c++) {
      const x = ix0 + c * (cw + gx), y = iy0 + r * (ch + gy);
      const i = r * cols + c;
      const dark = i === 3;
      const period = 14 + (i % 3) * 4;
      const ph = (t + i * 5) % period;
      const half = period / 2;
      const bang = t <= 0 ? 0 : ph < half ? 44 * Math.sin((ph / half) * Math.PI) * (ph < half / 2 ? 0.6 : 1) : 0;
      const hit = t > 0 && ph >= half - 3 && ph < half + 1;
      cells.push(
        <g key={i}>
          <rect x={x} y={y} width={cw} height={ch} fill={dark ? "#141a26" : "#D8E6C8"} />
          {!dark ? (
            <g>
              <clipPath id={`set-office-cell-${i}`}>
                <rect x={x} y={y} width={cw} height={ch} />
              </clipPath>
              <g clipPath={`url(#set-office-cell-${i})`}>
                <Human pose="type" x={x + (i % 2 ? cw - 22 : 22)} y={y + ch + 12} scale={0.17} flip={i % 2 === 1} moveAngle={bang} />
              </g>
              {hit ? (
                <g stroke={INK} strokeWidth={2.2} strokeLinecap="round">
                  {(() => {
                    const hx = x + (i % 2 ? cw - 22 - 14 : 22 + 14);
                    return <path d={`M${hx - 7} ${y + 12} l-4 -6 M${hx} ${y + 9} v-7 M${hx + 7} ${y + 12} l4 -6`} />;
                  })()}
                </g>
              ) : null}
            </g>
          ) : null}
        </g>,
      );
    }
  // the bubble grows together with the count (ease-out, so it is legible early) and holds at full size
  const g = Math.max(0, Math.min(1, t / QUEUE_RAMP));
  const s = 0.35 + 0.65 * (1 - Math.pow(1 - g, 2));
  const n = queueCount(t);
  const bx = 75, by = 124; // tail target: tower roof
  const bw = 130, bh = 88, bcy = 72; // body centre y at full size (x 10–140: clear of the glass edge)
  // continuity: the tower fades in over the first FACADE_IN frames (no one-frame pop of a new building mid-shot)
  const enter = Math.max(0, Math.min(1, t / FACADE_IN));
  return (
    <g opacity={enter}>
      <rect x={tx0} y={ty0} width={tx1 - tx0} height={WH - ty0} fill="#222b3d" stroke={INK} strokeWidth={3} />
      <rect x={tx0 + 10} y={ty0 - 10} width={tx1 - tx0 - 20} height={12} fill="#1a2132" stroke={INK} strokeWidth={2} />
      {cells}
      {t > 0
        ? [0, 1].map((i) => <circle key={i} cx={bx - 2 * i} cy={by - 4 - 8 * i} r={2.6 + i * 1.4} fill="#F4F1EA" stroke={INK} strokeWidth={1.8} />)
        : null}
      <g transform={`translate(${bx} ${bcy + bh / 2}) scale(${s}) translate(${-bx} ${-(bcy + bh / 2)})`}>
        <rect x={bx - bw / 2} y={bcy - bh / 2} width={bw} height={bh} rx={22} fill="#F4F1EA" stroke={INK} strokeWidth={4} />
        {/* wordless sign (bible §9.6: no text in the window except the rival's neon): printer icon + paper stack + number */}
        <g transform={`translate(${bx - 34} ${bcy - 22})`} stroke={INK} strokeWidth={2.2} strokeLinejoin="round">
          <rect x={-12} y={-15} width={22} height={11} fill="#F4F1EA" />
          <rect x={-18} y={-6} width={34} height={17} rx={3} fill="#E9E4D8" />
          <rect x={-10} y={5} width={18} height={9} fill="#F4F1EA" />
          <path d="M-8 9 h14" strokeWidth={1.5} />
        </g>
        <g transform={`translate(${bx + 10} ${bcy - 22})`} stroke={INK} strokeWidth={2} strokeLinejoin="round">
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-14 + i * 2} y={8 - i * 6} width={30} height={5} fill="#F4F1EA" />)}
          <path d="M26 -14 l6 -6 l6 6 M32 -20 v18" stroke="#C8262B" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
        <text x={bx} y={bcy + 32} textAnchor="middle" fontFamily={FONTS.crt} fontSize={48} fill="#C8262B">{fmtThousands(n)}</text>
      </g>
    </g>
  );
};

const Blinds: React.FC<{ k: number }> = ({ k }) => {
  const top = 6;
  const reach = top + (WH - top) * Math.max(0, Math.min(1, k));
  const slats: React.ReactNode[] = [];
  for (let y = top; y < reach - 8; y += 14) slats.push(<rect key={y} x={0} y={y} width={WW} height={11} fill={C.blinds} stroke={tone(C.blinds, -0.35)} strokeWidth={1.5} />);
  return (
    <g>
      {slats}
      {/* bundle (raised) + bottom rail */}
      <rect x={0} y={0} width={WW} height={top + 16} fill={tone(C.blinds, -0.1)} stroke={INK} strokeWidth={2} />
      {[4, 9, 14].map((y) => <rect key={y} x={2} y={y} width={WW - 4} height={2} fill={tone(C.blinds, -0.4)} />)}
      <rect x={0} y={Math.max(top + 14, reach - 6)} width={WW} height={8} fill={tone(C.blinds, -0.25)} stroke={INK} strokeWidth={2} />
      <path d={`M${WW - 22} ${top + 16} V${Math.max(top + 46, reach + 30)}`} stroke="#d8d0bf" strokeWidth={2} />
      <circle cx={WW - 22} cy={Math.max(top + 46, reach + 30)} r={3.5} fill="#d8d0bf" />
    </g>
  );
};

export const WindowLayer: React.FC<Pick<SetProps, "windowLayer" | "windowT" | "windowSlot" | "neonOn" | "blinds">> = ({
  windowLayer, windowT, windowSlot, neonOn, blinds,
}) => (
  <g>
    <clipPath id="set-window-clip">
      <rect x={WX0} y={WY0} width={WW} height={WH} />
    </clipPath>
    <g clipPath="url(#set-window-clip)">
      <g transform={`translate(${WX0} ${WY0})`}>
        <Sky />
        <Skyline />
        <Kiosk neonOn={neonOn} t={windowLayer === "calm" ? windowT : windowT + 7} />
        {windowLayer === "office_print_queue" ? <OfficePrintQueue t={windowT} /> : null}
      </g>
      {windowSlot}
      <g transform={`translate(${WX0} ${WY0})`}>
        {/* glass: two faint reflections + grime */}
        <path d={`M30 0 L70 0 L0 90 L0 38 Z M110 0 L124 0 L20 ${WH} L6 ${WH} Z`} fill="#ffffff" opacity={0.05} />
        {[[40, 230], [52, 236], [244, 40], [120, 262]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.2} fill="#0b0e14" opacity={0.5} />
        ))}
        <Blinds k={blinds} />
      </g>
    </g>
    {/* frame, mullion, sill */}
    <rect x={WX0} y={WY0} width={WW} height={WH} fill="none" stroke={C.windowFrame} strokeWidth={16} />
    <rect x={WX0} y={WY0} width={WW} height={WH} fill="none" stroke={INK} strokeWidth={3} />
    <rect x={WX0 + WW / 2 - 5} y={WY0} width={10} height={WH} fill={C.windowFrame} />
    <rect x={WX0 - 16} y={WY1 + 2} width={WW + 32} height={16} fill="#2E2922" stroke={INK} strokeWidth={3} />
    <rect x={WX0 - 16} y={WY1 + 2} width={WW + 32} height={3} fill="#4b4337" />
    <rect x={WX0 - 8} y={WY1 + 18} width={WW + 16} height={6} fill="#000" opacity={0.25} />
  </g>
);

