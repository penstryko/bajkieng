// CRT-screen glasses (bible §3.1, §7.1): two rounded squares 112×96 + 22 px bridge = 246 px, wider
// than the head and the perm. Thick black frames; each lens is a tiny CRT (#1F2B2F) with scanlines,
// phosphor content (#8EF0C9, alarm #FFC857), feGaussianBlur glow and deterministic static (lensSwap).
// Owner: cast builder. Pure function of props (no frame reads, randomness only via random(seed)).
import React, { useId } from "react";
import { random } from "remotion";
import type { GlassesProps } from "../../contract";
import { LENS_ICONS, PATIENT_SIZE_MAX, type LensIcon } from "../../enums";
import type { PatientSpec } from "../../schema";
import { DOCTOR_COLORS as C, FONTS, NO_IDLE, POS } from "../../engine";
import { patientNoLabel } from "../../series";
import { Patient } from "../patients/Patient";

export const INK = "#161616";

/** Frame geometry (outer edges = bible 637–883 × 690–786 at rest). */
export const GLASSES_GEOM = {
  lensW: POS.doctor.glasses.lens.w, // 112
  lensH: POS.doctor.glasses.lens.h, // 96
  bridge: POS.doctor.glasses.bridge, // 22
  frame: 10, // frame thickness (inside the 112×96 outer square)
  outerRx: 22,
  screenRx: 12,
} as const;

export interface LensBox {
  /** 0 = left lens (viewer's left), 1 = right lens */
  side: 0 | 1;
  /** outer frame rect */
  ox: number;
  oy: number;
  /** inner CRT screen rect */
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Outer + screen rects of both lenses for a bridge centre (cx, cy). */
export const lensBoxes = (cx: number, cy: number): [LensBox, LensBox] => {
  const { lensW, lensH, bridge, frame } = GLASSES_GEOM;
  const mk = (side: 0 | 1): LensBox => {
    const ox = side === 0 ? cx - bridge / 2 - lensW : cx + bridge / 2;
    const oy = cy - lensH / 2;
    return { side, ox, oy, x: ox + frame, y: oy + frame, w: lensW - 2 * frame, h: lensH - 2 * frame };
  };
  return [mk(0), mk(1)];
};

/** Icons drawn in the amber "alarm" phosphor. */
export const ALARM_LENSES: readonly LensIcon[] = ["siren", "flame", "error"];

// ───────────────────────────── pixel art (CRT bitmaps) ─────────────────────────────
// '#' = lit phosphor, '+' = dim phosphor, anything else = dark. ≤ 16 cols × 13 rows → 5 px cells.
const BITMAPS: Partial<Record<LensIcon, string[]>> = {
  burger: [
    "....########....",
    "..############..",
    ".###.####.#####.",
    ".##############.",
    "................",
    "##.##.##.##.##.#",
    ".##############.",
    ".##############.",
    "................",
    ".##############.",
    "..############..",
  ],
  skull: [
    "....########....",
    "..############..",
    ".##############.",
    ".##############.",
    ".##...####...##.",
    ".##...####...##.",
    ".###.######.###.",
    "..#####..#####..",
    "...####..####...",
    "....########....",
    "....#.#..#.#....",
    "....########....",
  ],
  siren: [
    "#......##......#",
    ".#.....##.....#.",
    "................",
    ".....######.....",
    "....##.#####....",
    "##..#..#####..##",
    "....#..#####....",
    "....#.######....",
    "....########....",
    "..############..",
    "..############..",
  ],
  eyeroll: [
    "....######....",
    "..##++++++##..",
    ".#++++++++++#.",
    "##############",
    "#...######...#",
    "#....####....#",
    "#............#",
    "#............#",
    ".#..........#.",
    "..##......##..",
    "....######....",
  ],
  stars: [
    ".......#........",
    ".......#.....#..",
    "......###...###.",
    ".....#####...#..",
    "...#########....",
    ".....#####......",
    "......###.......",
    ".......#....#...",
    ".#.....#...###..",
    "###.........#...",
    ".#..............",
  ],
  toilet: [
    "#####...........",
    "#...#...........",
    "#.#.#...........",
    "#...#...........",
    "#####...........",
    "################",
    "################",
    ".#############..",
    "..###########...",
    "...#########....",
    ".....#####......",
    ".....#####......",
    "....#######.....",
  ],
  pizza: [
    "..############..",
    ".##############.",
    ".#++++++++++++#.",
    ".#++##++++++++#.",
    "..#+##+++++++#..",
    "..#++++++##++#..",
    "...#+++++##+#...",
    "...#++++++++#...",
    "....#+##+++#....",
    "....#+##+++#....",
    ".....#++++#.....",
    "......#++#......",
    ".......##.......",
  ],
  kitten: [
    "..##........##..",
    "..###......###..",
    "..############..",
    "..############..",
    "..##..####..##..",
    "..##..####..##..",
    "##.####..####.##",
    "..############..",
    "##.###.##.###.##",
    "...##########...",
    ".....######.....",
  ],
  beach: [
    "...........###..",
    "..........#####.",
    "..###.....#####.",
    ".#####.....###..",
    "#..##.##........",
    "...#.#..#.......",
    "....#...........",
    "....#...........",
    ".....#..........",
    ".....#..........",
    "..#######.......",
    "##..##..##..##..",
    "..##..##..##..##",
  ],
  flame: [
    "......#.......",
    "......##......",
    ".....###......",
    ".....####..#..",
    "....#####.##..",
    "...#########..",
    "..##########..",
    "..####..####..",
    ".####....####.",
    ".###..##..###.",
    ".###.####.###.",
    "..###.##.###..",
    "...########...",
  ],
  dots: ["##...##...##", "##...##...##"],
};

const PixelArt: React.FC<{ rows: string[]; box: LensBox; fill: string; maxCell?: number; dy?: number }> = ({ rows, box, fill, maxCell = 5, dy = 0 }) => {
  const cols = Math.max(...rows.map((r) => r.length));
  const cell = Math.min(maxCell, Math.floor(Math.min((box.w - 8) / cols, (box.h - 8) / rows.length)));
  const ox = Math.round(box.x + (box.w - cols * cell) / 2);
  const oy = Math.round(box.y + (box.h - rows.length * cell) / 2 + dy);
  const rects: React.ReactNode[] = [];
  rows.forEach((row, r) => {
    let i = 0;
    while (i < row.length) {
      const ch = row[i];
      if (ch === "#" || ch === "+") {
        let j = i;
        while (j < row.length && row[j] === ch) j++;
        rects.push(
          <rect key={`${r}-${i}`} x={ox + i * cell} y={oy + r * cell} width={(j - i) * cell} height={cell} fill={fill} opacity={ch === "+" ? 0.45 : 1} />,
        );
        i = j;
      } else i++;
    }
  });
  return <g>{rects}</g>;
};

const CrtText: React.FC<{ text: string; x: number; y: number; size: number; fill: string; anchor?: "start" | "middle" | "end" }> = ({
  text, x, y, size, fill, anchor = "middle",
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONTS.crt} fontSize={size} fill={fill}>
    {text}
  </text>
);

/** Fallback patient silhouette if no spec is given (generic blob with two eyes). */
const GenericFileFigure: React.FC<{ cx: number; by: number; fill: string }> = ({ cx, by, fill }) => (
  <g>
    <rect x={cx - 20} y={by - 30} width={40} height={30} rx={6} fill={fill} />
    <rect x={cx - 11} y={by - 24} width={6} height={6} fill={C.lensOff} />
    <rect x={cx + 5} y={by - 24} width={6} height={6} fill={C.lensOff} />
  </g>
);

/** Monochrome patient silhouette (set builder's <Patient silhouette>) fitted into a w×h box. */
export const PatientIcon: React.FC<{ spec?: PatientSpec; cx: number; by: number; w: number; h: number; fill: string }> = ({ spec, cx, by, w, h, fill }) => {
  if (!spec) return <GenericFileFigure cx={cx} by={by} fill={fill} />;
  const max = PATIENT_SIZE_MAX[spec.size] ?? PATIENT_SIZE_MAX.L;
  const s = Math.min(w / max.w, h / max.h);
  return (
    <Patient
      spec={spec}
      x={cx}
      y={by}
      scale={s}
      sx={1}
      sy={1}
      rotate={0}
      brows="none"
      eyes={spec.eyes}
      mouth="X"
      variant="base"
      blink={0}
      idle={NO_IDLE}
      motionLines={false}
      tears={0}
      swallow={0}
      silhouette={fill}
      maxSize={max}
    />
  );
};

export interface LensArtCtx {
  box: LensBox;
  color: string;
  patient?: PatientSpec;
  patientNo?: number;
}

/** Draws the content of ONE lens screen for a lens icon (scene coordinates, unclipped). */
export function lensArt(lens: LensIcon, ctx: LensArtCtx): React.ReactNode {
  const { box, color } = ctx;
  const mx = box.x + box.w / 2;
  const my = box.y + box.h / 2;
  const bmp = BITMAPS[lens];
  switch (lens) {
    case "patient_file_icon": {
      if (box.side === 0) {
        // file folder with the patient's silhouette
        const fx = box.x + 8;
        const fy = box.y + 12;
        const fw = box.w - 16;
        const fh = box.h - 20;
        return (
          <g>
            <path
              d={`M${fx} ${fy + 8} V${fy} H${fx + 26} l6 8 H${fx + fw} V${fy + fh} H${fx} Z`}
              fill="none"
              stroke={color}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <line x1={fx} y1={fy + 13} x2={fx + fw} y2={fy + 13} stroke={color} strokeWidth={2} opacity={0.6} />
            <PatientIcon spec={ctx.patient} cx={fx + fw / 2} by={fy + fh - 5} w={fw - 18} h={fh - 22} fill={color} />
          </g>
        );
      }
      const label = ctx.patientNo !== undefined ? patientNoLabel(ctx.patientNo) : "#???";
      return (
        <g>
          <CrtText text={label} x={mx} y={box.y + 38} size={40} fill={color} />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={box.x + 12} y={box.y + 48 + k * 9} width={[64, 48, 56][k]} height={4} fill={color} opacity={0.75} />
          ))}
        </g>
      );
    }
    case "zzz":
      return (
        <g>
          <CrtText text="Z" x={box.x + 24} y={box.y + 72} size={60} fill={color} />
          <CrtText text="Z" x={box.x + 52} y={box.y + 48} size={40} fill={color} />
          <CrtText text="z" x={box.x + 74} y={box.y + 30} size={30} fill={color} />
        </g>
      );
    case "question":
      return <CrtText text="?" x={mx} y={box.y + 70} size={92} fill={color} />;
    case "dollars":
      return <CrtText text="$" x={mx} y={box.y + 70} size={92} fill={color} />;
    case "interrobang":
      return <CrtText text={box.side === 0 ? "?" : "!"} x={mx} y={box.y + 70} size={92} fill={color} />;
    case "error":
      return box.side === 0 ? (
        <g>
          <path d={`M${mx} ${box.y + 10} L${mx + 32} ${box.y + 66} H${mx - 32} Z`} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
          <rect x={mx - 3} y={box.y + 28} width={6} height={22} fill={color} />
          <rect x={mx - 3} y={box.y + 55} width={6} height={6} fill={color} />
        </g>
      ) : (
        <g>
          <CrtText text="ERR" x={mx} y={box.y + 52} size={44} fill={color} />
          <rect x={box.x + 10} y={box.y + 60} width={box.w - 20} height={4} fill={color} opacity={0.6} />
        </g>
      );
    case "flatline":
    case "heart_rate": {
      const grid = (
        <g opacity={0.18}>
          {[1, 2, 3, 4, 5].map((k) => (
            <rect key={`v${k}`} x={box.x + (k * box.w) / 6} y={box.y} width={1} height={box.h} fill={color} />
          ))}
          {[1, 2, 3].map((k) => (
            <rect key={`h${k}`} x={box.x} y={box.y + (k * box.h) / 4} width={box.w} height={1} fill={color} />
          ))}
        </g>
      );
      const x0 = box.x - 2;
      const x1 = box.x + box.w + 2;
      const d =
        lens === "flatline"
          ? box.side === 0
            ? `M${x0} ${my} H${box.x + 18} l5 -16 l7 30 l6 -22 l4 8 H${x1}`
            : `M${x0} ${my} H${x1}`
          : `M${x0} ${my} H${box.x + 10} l4 -6 l4 6 h6 l5 -26 l7 44 l5 -24 h10 l4 -6 l4 6 h6 l5 -26 l7 44 l5 -24 H${x1}`;
      return (
        <g>
          {grid}
          <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="miter" />
        </g>
      );
    }
    case "paper_jam": {
      // printer with a sheet crumpled into an accordion, stuck in the output slot
      const px = box.x + 10;
      const pw = box.w - 20;
      const py = box.y + 44;
      return (
        <g fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
          <path d={`M${px + 12} ${py} L${px + 4} ${py - 12} L${px + 30} ${py - 22} L${px + 18} ${py - 32} L${px + 46} ${py - 38} L${px + 40} ${py - 28} L${px + 62} ${py - 20} L${px + 54} ${py - 8} L${px + 62} ${py}`} />
          <rect x={px} y={py} width={pw} height={box.h - 52} rx={4} />
          <path d={`M${px + 8} ${py + 9} H${px + pw - 8}`} />
          <rect x={px + pw - 16} y={py + 16} width={6} height={6} fill={color} stroke="none" />
        </g>
      );
    }
    case "spinner":
      return (
        <g>
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k / 8) * Math.PI * 2 - Math.PI / 2;
            return (
              <rect
                key={k}
                x={Math.round(mx + 24 * Math.cos(a) - 5)}
                y={Math.round(my + 24 * Math.sin(a) - 5)}
                width={10}
                height={10}
                fill={color}
                opacity={1 - k * 0.11}
              />
            );
          })}
        </g>
      );
    case "off":
      return <circle cx={mx} cy={my} r={2.5} fill={color} opacity={0.35} />;
    case "static":
      return null; // drawn by the noise layer
    default:
      return bmp ? <PixelArt rows={bmp} box={box} fill={color} maxCell={lens === "dots" ? 7 : 5} /> : null;
  }
}

// ───────────────────────────── static (lensSwap) ─────────────────────────────
const StaticNoise: React.FC<{ box: LensBox; amount: number; seed: number | string }> = ({ box, amount, seed }) => {
  const rects: React.ReactNode[] = [];
  for (let k = 0; k < 64; k++) {
    const r = (key: string) => random(`lens-noise-${seed}-${box.side}-${k}-${key}`);
    const w = 2 + Math.floor(r("w") * 14);
    rects.push(
      <rect
        key={k}
        x={box.x + Math.floor(r("x") * (box.w - w))}
        y={box.y + Math.floor(r("y") * (box.h / 2)) * 2}
        width={w}
        height={2}
        fill="#DDEEE6"
        opacity={amount * (0.35 + 0.65 * r("o"))}
      />,
    );
  }
  const band = random(`lens-noise-${seed}-${box.side}-band`);
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="#9AB3A8" opacity={0.18 * amount} />
      <rect x={box.x} y={box.y + band * (box.h - 10)} width={box.w} height={8} fill="#DDEEE6" opacity={0.35 * amount} />
      {rects}
    </g>
  );
};

// ───────────────────────────── component ─────────────────────────────
export interface GlassesFrameProps extends GlassesProps {
  /** optional custom screen content (e.g. a doodle) drawn instead of the lens icon; gets each lens box */
  content?: (box: LensBox, color: string) => React.ReactNode;
}

/**
 * Glasses with an optional content slot (`content`) so anything (doodles, props) can be shown on the
 * CRT screens with the same scanlines/glow. `Glasses` (the contract component) = this without a slot.
 */
export const GlassesFrame: React.FC<GlassesFrameProps> = ({
  cx, cy, slideY, lens, lensNoise, noiseSeed, patient, patientNo, glow = 1, content,
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const boxes = lensBoxes(cx, cy + slideY);
  const { lensW, lensH, outerRx, screenRx, bridge } = GLASSES_GEOM;
  const color = ALARM_LENSES.includes(lens) ? C.phosphorAlarm : C.phosphor;
  const noise = lens === "static" ? 1 : Math.max(0, Math.min(1, lensNoise));
  const iconOpacity = 1 - 0.75 * Math.min(1, lensNoise);
  const lit = lens !== "off";
  const glowFilter = `${uid}-glow`;
  const by = cy + slideY;
  return (
    <g>
      <defs>
        <filter id={glowFilter} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={3} />
        </filter>
        {boxes.map((b) => (
          <clipPath key={b.side} id={`${uid}-scr${b.side}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={screenRx} />
          </clipPath>
        ))}
      </defs>
      {/* bridge (behind the frames' inner edges) */}
      <rect x={cx - bridge / 2 - 2} y={by - 22} width={bridge + 4} height={11} fill={C.frames} />
      <rect x={cx - bridge / 2 - 2} y={by - 22} width={bridge + 4} height={3} fill="#3B4245" />
      {boxes.map((b) => {
        const art = content ? content(b, color) : lensArt(lens, { box: b, color, patient, patientNo });
        return (
          <g key={b.side}>
            {/* frame (outer square = bible lens rect) */}
            <rect x={b.ox} y={b.oy} width={lensW} height={lensH} rx={outerRx} fill={C.frames} />
            <path
              d={`M${b.ox + 6} ${b.oy + outerRx + 2} Q${b.ox + 6} ${b.oy + 6} ${b.ox + outerRx + 2} ${b.oy + 6} H${b.ox + lensW - outerRx}`}
              fill="none"
              stroke="#3B4245"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* CRT screen */}
            <g clipPath={`url(#${uid}-scr${b.side})`}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={C.lensOff} />
              {lit && lens !== "static" ? <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={color} opacity={0.07} /> : null}
              {art ? (
                <g opacity={iconOpacity}>
                  {glow > 0 ? (
                    <g filter={`url(#${glowFilter})`} opacity={0.75 * glow}>
                      {art}
                    </g>
                  ) : null}
                  {art}
                </g>
              ) : null}
              {noise > 0 ? <StaticNoise box={b} amount={noise} seed={lens === "static" && lensNoise === 0 ? `held-${noiseSeed}` : noiseSeed} /> : null}
              {/* scanlines */}
              {Array.from({ length: Math.ceil(b.h / 3) }, (_, k) => (
                <rect key={k} x={b.x} y={b.y + 1 + k * 3} width={b.w} height={1} fill="#000" opacity={0.3} />
              ))}
              {/* tube curvature: darker rim + glass glare */}
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={screenRx} fill="none" stroke="#0B1214" strokeWidth={6} opacity={0.55} />
              <path d={`M${b.x + 8} ${b.y + 5} h18 l-14 26 h-8 z`} fill="#FFFFFF" opacity={0.09} />
              <path d={`M${b.x + 30} ${b.y + 5} h6 l-14 26 h-6 z`} fill="#FFFFFF" opacity={0.06} />
            </g>
          </g>
        );
      })}
    </g>
  );
};

export const Glasses: React.FC<GlassesProps> = (p) => <GlassesFrame {...p} />;

/** All lens icons (for model sheets / QA). */
export const ALL_LENSES: readonly LensIcon[] = LENS_ICONS;
