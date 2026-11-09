// Memory-bubble vignettes (bible §4.7, §6.1 "Stawka"): flat, static scenes of grey faceless humans
// abusing the patient, with 1–2 moving elements (keys in `moving`). Drawn in a 500×360 design box and
// fitted into the bubble interior. Registry keys: VIGNETTE_KEYS in registry.ts. Owned by the set builder.
import React from "react";
import { FONTS } from "../../engine";
import { Human } from "../humans/Human";

const INK = "#121212";
const W = 500, H = 360; // design box (= POS.bubble size)
const FLOOR = 318;

/** A simplified office printer for memories (same palette as the S01E01 patient, no face: it is a memory). */
export const MiniPrinter: React.FC<{ x: number; y: number; s?: number; rot?: number; jam?: number }> = ({ x, y, s = 1, rot = 0, jam = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-50} y={-128} width={100} height={60} fill="#F4F1EA" stroke={INK} strokeWidth={4} transform="rotate(-4 0 -100)" />
    <rect x={-70} y={-96} width={140} height={96} rx={10} fill="#E9E4D8" stroke={INK} strokeWidth={5} />
    <rect x={-66} y={-92} width={132} height={16} rx={6} fill="#d3ccbd" />
    <rect x={30} y={-90} width={30} height={11} rx={2} fill="#14201a" />
    <rect x={-46} y={-52} width={92} height={10} rx={4} fill="#161616" />
    {jam > 0 ? (
      <path d={`M-30 -44 l10 ${14 + 30 * jam} l12 -10 l10 ${16 + 20 * jam} l14 -14 l8 ${10 + 24 * jam} l10 -6`} stroke={INK} strokeWidth={3} fill="#F4F1EA" />
    ) : (
      <rect x={-30} y={-44} width={60} height={10} fill="#F4F1EA" stroke={INK} strokeWidth={3} />
    )}
    <rect x={-56} y={-26} width={112} height={18} rx={4} fill="#d3ccbd" stroke={INK} strokeWidth={3} />
    <path d="M-40 -90 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" fill="none" stroke="#6B4423" strokeWidth={3} opacity={0.6} />
  </g>
);

const Floor: React.FC = () => (
  <g>
    <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="#cbbfa5" />
    <path d={`M0 ${FLOOR} H${W}`} stroke={INK} strokeWidth={4} />
  </g>
);

const Impact: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) =>
  k <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.6 * k})`} opacity={Math.min(1, k * 1.5)}>
      <path d="M0 -30 l8 18 l20 -6 l-10 18 l18 12 l-22 2 l2 22 l-16 -14 l-16 14 l2 -22 l-22 -2 l18 -12 l-10 -18 l20 6 Z" fill="#F0E14A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );

/** Office desk/stand under the printer. */
const Stand: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 90} y={FLOOR - 120} width={180} height={14} fill="#8b8f97" stroke={INK} strokeWidth={4} />
    <path d={`M${x - 76} ${FLOOR - 106} V${FLOOR} M${x + 76} ${FLOOR - 106} V${FLOOR}`} stroke={INK} strokeWidth={8} />
  </g>
);

const VIGNETTES: Record<string, React.FC<{ t: number; moving: string[] }>> = {
  /** S01E02: 6:00, a grey man in bed smashes his ringing alarm clock and points at the wall calendar "MONDAY"
   *  (moving: human_arm, alarm_shake). 20-frame cycle. */
  monday_hate: ({ t, moving }) => {
    const ph = t % 20;
    const arm = moving.includes("human_arm") ? (ph < 10 ? 70 * (ph / 10) : 70 - 70 * ((ph - 10) / 10)) : 40;
    const ring = moving.includes("alarm_shake") ? Math.sin(t * 2.2) * 6 : 0;
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} fill="#bcc4cf" />
        <rect x={300} y={40} width={150} height={190} fill="#f4efe4" stroke={INK} strokeWidth={5} />
        <rect x={300} y={40} width={150} height={52} fill="#C8322B" stroke={INK} strokeWidth={5} />
        <text x={375} y={80} textAnchor="middle" fontFamily={FONTS.caption} fontSize={34} fill="#FFF6E8">MONDAY</text>
        <text x={375} y={196} textAnchor="middle" fontFamily={FONTS.caption} fontSize={90} fill="#222">1</text>
        <rect x={20} y={250} width={260} height={70} rx={10} fill="#7d8796" stroke={INK} strokeWidth={4} />
        <rect x={30} y={226} width={70} height={34} rx={12} fill="#eef0f3" stroke={INK} strokeWidth={4} />
        <Human pose="point" x={150} y={FLOOR} scale={0.62} moveAngle={arm} />
        <g transform={`translate(400 ${FLOOR - 40}) rotate(${ring})`}>
          <circle cx={0} cy={0} r={36} fill="#f2b33d" stroke={INK} strokeWidth={5} />
          <circle cx={-26} cy={-34} r={11} fill="#f2b33d" stroke={INK} strokeWidth={4} />
          <circle cx={26} cy={-34} r={11} fill="#f2b33d" stroke={INK} strokeWidth={4} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONTS.crt} fontSize={30} fill="#111">6:00</text>
        </g>
        {ring ? <path d="M444 236 l18 -10 M450 258 l22 0 M444 280 l18 10" stroke={INK} strokeWidth={4} strokeLinecap="round" /> : null}
      </g>
    );
  },
  /** S01E01: a grey office worker kicks the printer on a low cabinet (moving: human_leg, printer_shake).
   *  24-frame cycle: wind-up, fast swing, 4-frame hold ON CONTACT (big impact star, printer jolts and keeps a dent). */
  office_kick: ({ t, moving }) => {
    const P = 24;
    const ph = t % P;
    const legOn = moving.includes("human_leg");
    // 0–8 wind back (10 → 0), 9–11 swing (→ 86), 12–15 contact hold, 16–23 return (86 → 10)
    const kick = !legOn ? 80 : ph < 9 ? 10 - 10 * (ph / 8) : ph < 12 ? 86 * Math.pow((ph - 8) / 3, 1.6) : ph < 16 ? 86 : 86 - 76 * ((ph - 15) / 8);
    const contact = legOn ? ph >= 12 && ph < 16 : true;
    const hit = contact ? (legOn ? [1, 1, 0.85, 0.6][ph - 12] ?? 0 : 0.8) : 0;
    const jolt = moving.includes("printer_shake") && legOn ? (ph >= 12 && ph < 18 ? [10, 9, 7, 5, 3, 1][ph - 12] : 0) : 0;
    const dented = legOn ? t >= 12 : true;
    const px = 336 + jolt;
    return (
      <g>
        <Floor />
        {/* low cabinet */}
        <rect x={248} y={FLOOR - 64} width={170} height={64} fill="#8b8f97" stroke={INK} strokeWidth={4} />
        <path d={`M262 ${FLOOR - 40} h140`} stroke={INK} strokeWidth={3} />
        <MiniPrinter x={px} y={FLOOR - 64} rot={jolt * 1.1} />
        {dented ? (
          <g transform={`translate(${px} ${FLOOR - 64}) rotate(${jolt * 1.1})`}>
            <path d="M-70 -70 q16 10 0 26" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <path d="M-64 -66 q8 8 0 18" fill="none" stroke="#9e978a" strokeWidth={3} strokeLinecap="round" />
          </g>
        ) : null}
        <Human pose="kick" x={168} y={FLOOR} scale={0.84} moveAngle={kick} accessory="tie" />
        <Impact x={262} y={FLOOR - 116} k={hit * 1.5} />
        {hit > 0 ? (
          <g stroke={INK} strokeWidth={5} strokeLinecap="round">
            <path d={`M${300} ${FLOOR - 172} l14 -22 M${318} ${FLOOR - 150} l26 -10 M${304} ${FLOOR - 78} l22 14`} />
          </g>
        ) : null}
      </g>
    );
  },
  /** A human yells at the jammed printer (moving: human_arm). */
  office_yell: ({ t, moving }) => {
    const shake = moving.includes("human_arm") ? 12 * Math.sin(t * 0.9) : 0;
    return (
      <g>
        <Floor />
        <Stand x={350} />
        <MiniPrinter x={350} y={FLOOR - 120} jam={1} />
        <Human pose="yell" x={140} y={FLOOR} scale={0.8} moveAngle={shake} />
        <g fontFamily={FONTS.caption} fontSize={44} fill="#C8262B" stroke={INK} strokeWidth={2}>
          <text x={210} y={80}>#$%!</text>
        </g>
      </g>
    );
  },
  /** The real wound: 3 a.m., night office, a human yanks the jammed paper out of the printer (moving: paper,
   *  printer_jolt). 30-frame cycle: slow pull with rising tension, then a SNAP (paper tears, printer jolts 15°,
   *  impact lines), recoil. Wordless wall clock at 3:00, moon in the window, desk-lamp cone, two humans waiting
   *  with mugs. */
  paper_jam_yank: ({ t, moving }) => {
    const P = 30;
    const ph = t % P;
    const pullOn = moving.includes("paper");
    // tension 0 → 1 over 0–21 (ease-in), snap at 22, recoil 22–29
    const tension = !pullOn ? 0.6 : ph < 22 ? Math.pow(ph / 21, 2.2) : 0;
    const snapT = pullOn && ph >= 22 ? ph - 22 : -1; // 0..7 after the snap
    const jolt = moving.includes("printer_jolt") && snapT >= 0 ? -15 * Math.exp(-snapT / 2.2) * Math.cos(snapT * 0.9) : 0;
    const lean = snapT >= 0 ? -14 * Math.exp(-snapT / 3) : 6 * tension; // stumbles back after the snap
    const hx = 150 - 10 * tension - (snapT >= 0 ? 26 * Math.exp(-snapT / 4) : 0);
    const handX = hx + 70, handY = FLOOR - 196 + 6 * tension;
    const slotX = 330, slotY = FLOOR - 166;
    const strain = tension * 5;
    return (
      <g>
        {/* night office */}
        <rect x={0} y={0} width={W} height={FLOOR} fill="#4a5470" />
        <rect x={22} y={26} width={96} height={78} fill="#0e1430" stroke={INK} strokeWidth={4} />
        <circle cx={84} cy={52} r={15} fill="#F2ECCF" />
        <circle cx={92} cy={46} r={13} fill="#0e1430" />
        <path d={`M70 26 V104 M22 64 H118`} stroke={INK} strokeWidth={3} />
        {/* wordless wall clock at 3:00 */}
        <g transform="translate(250 64)">
          <circle r={34} fill="#F4F1EA" stroke={INK} strokeWidth={5} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <path key={i} d={`M${27 * Math.sin(a)} ${-27 * Math.cos(a)} L${(i % 3 ? 23 : 19) * Math.sin(a)} ${-(i % 3 ? 23 : 19) * Math.cos(a)}`} stroke={INK} strokeWidth={i % 3 ? 2 : 4} />;
          })}
          <path d="M0 0 V-24 M0 0 H17" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <circle r={3.5} fill={INK} />
        </g>
        {/* two humans waiting with mugs (static, in the dark) */}
        {/* a queue behind him: two humans waiting with mugs (static, in the dark) */}
        <g opacity={0.8}>
          {[[40, 0.52], [84, 0.5]].map(([x, k], i) => (
            <g key={i}>
              <Human pose="phone" x={x} y={FLOOR} scale={k} />
              <rect x={x + 40 * k - 9} y={FLOOR - 296 * k} width={19} height={21} rx={3} fill="#E9E4D8" stroke={INK} strokeWidth={3} />
              <path d={`M${x + 40 * k + 10} ${FLOOR - 290 * k} q8 2 0 12`} fill="none" stroke={INK} strokeWidth={3} />
            </g>
          ))}
        </g>
        <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="#5b5a63" />
        <path d={`M0 ${FLOOR} H${W}`} stroke={INK} strokeWidth={4} />
        {/* desk lamp cone over the printer */}
        <path d={`M300 20 L250 ${FLOOR - 110} L470 ${FLOOR - 110} L340 20 Z`} fill="#FFE9A8" opacity={0.28} />
        <path d="M296 8 h48 l-8 16 h-32 Z" fill="#2c2f38" stroke={INK} strokeWidth={3} />
        <Stand x={360} />
        <MiniPrinter x={360} y={FLOOR - 120} rot={jolt + (snapT < 0 ? -3 * tension : 0)} />
        {/* the paper: stretched while pulling (thinner, strain lines), torn after the snap */}
        {snapT < 0 ? (
          <g>
            <path d={`M${slotX} ${slotY} L${handX} ${handY}`} stroke={INK} strokeWidth={22 - strain} strokeLinecap="round" />
            <path d={`M${slotX} ${slotY} L${handX} ${handY}`} stroke="#F4F1EA" strokeWidth={15 - strain} strokeLinecap="round" strokeDasharray="14 6" />
            {tension > 0.55 ? (
              <g stroke={INK} strokeWidth={2.5} strokeLinecap="round">
                <path d={`M${(slotX + handX) / 2 - 6} ${(slotY + handY) / 2 - 18} l-4 -8 M${(slotX + handX) / 2 + 8} ${(slotY + handY) / 2 - 16} l4 -9`} />
              </g>
            ) : null}
          </g>
        ) : (
          <g>
            {/* stub left in the printer + torn piece in the hand */}
            <path d={`M${slotX} ${slotY} l-24 -6 l4 6 l-6 4 Z`} fill="#F4F1EA" stroke={INK} strokeWidth={3} />
            <path d={`M${handX + 10} ${handY} l46 -12 l-6 8 l8 6 l-6 6 l6 6 Z`} fill="#F4F1EA" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            {snapT < 5 ? (
              <g stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={1 - snapT / 5}>
                <path d={`M${slotX - 4} ${slotY - 28} l-6 -18 M${slotX + 14} ${slotY - 26} l8 -18 M${slotX + 26} ${slotY - 6} l18 -4 M${slotX - 22} ${slotY + 4} l-16 6`} />
              </g>
            ) : null}
          </g>
        )}
        <g transform={`rotate(${lean} ${hx} ${FLOOR})`}>
          <Human pose="point" x={hx} y={FLOOR} scale={0.8} moveAngle={-8 + 10 * tension} />
        </g>
        {/* 3 a.m. night wash over everything except the lamp-lit printer */}
        <rect x={0} y={0} width={W} height={H} fill="#0b1640" opacity={0.28} />
        <path d={`M300 20 L250 ${FLOOR - 110} L470 ${FLOOR - 110} L340 20 Z`} fill="#FFE9A8" opacity={0.12} />
      </g>
    );
  },
};

export const VIGNETTE_IDS = Object.keys(VIGNETTES);

/** Draw vignette `id` fitted into the rect (x0, y0, x1, y1). Unknown ids draw a neutral placeholder card. */
export const Vignette: React.FC<{ id: string; t: number; moving: string[]; rect: [number, number, number, number] }> = ({ id, t, moving, rect }) => {
  const [x0, y0, x1, y1] = rect;
  const s = Math.min((x1 - x0) / W, (y1 - y0) / H);
  const ox = x0 + ((x1 - x0) - W * s) / 2, oy = y0 + ((y1 - y0) - H * s) / 2;
  const V = VIGNETTES[id];
  return (
    <g transform={`translate(${ox} ${oy}) scale(${s})`}>
      {V ? <V t={t} moving={moving} /> : <rect x={0} y={0} width={W} height={H} fill="#d8cdb6" />}
    </g>
  );
};
