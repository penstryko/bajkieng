// PLACEHOLDER — owned by the set builder. Keep BubbleProps; vignettes are keyed by VIGNETTE_KEYS.
import React from "react";
import type { BubbleProps } from "../../contract";
import { FONTS } from "../../engine";
import { Human } from "../humans/Human";

const Vignette: React.FC<{ id: string; t: number; moving: string[]; box: [number, number, number, number] }> = ({ id, t, moving, box }) => {
  const cx = (box[0] + box[2]) / 2, by = box[3] - 60;
  if (id === "office_kick") {
    const kick = moving.includes("human_leg") ? 25 * Math.max(0, Math.sin(t * 0.35)) : 0;
    return (
      <g>
        <Human pose="kick" x={cx - 60} y={by} scale={0.9} moveAngle={kick} />
        <rect x={cx + 20} y={by - 70} width={110} height={70} fill="#E9E4D8" stroke="#121212" strokeWidth={4} />
      </g>
    );
  }
  return <text x={cx} y={(box[1] + box[3]) / 2} textAnchor="middle" fontFamily={FONTS.crt} fontSize={30} fill="#333">{id}</text>;
};

export const Bubble: React.FC<BubbleProps> = ({ kind, box, tail, inflate, dots, vignette, moving = [], t, grawlix, text }) => {
  const [x0, y0, x1, y1] = box;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const fill = kind === "memory" ? "#EDE6D6" : "#FFFFFF";
  const dotPts = [0.25, 0.5, 0.75].map((k) => [tail[0] + (cx - tail[0]) * k * 0.6, tail[1] + (y1 - tail[1]) * k * 0.6]);
  return (
    <g>
      {kind !== "speech"
        ? dotPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={(10 + i * 6) * dots[2 - i]} fill={fill} stroke="#121212" strokeWidth={4} />)
        : null}
      <g transform={`translate(${cx} ${cy}) scale(${inflate}) translate(${-cx} ${-cy})`}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={kind === "speech" ? 40 : 120} fill={fill} stroke="#121212" strokeWidth={6} />
        {kind === "speech" ? <path d={`M${cx - 30} ${y1 - 3} L${tail[0]} ${tail[1]} L${cx + 30} ${y1 - 3}`} fill={fill} stroke="#121212" strokeWidth={6} /> : null}
        {vignette ? <Vignette id={vignette} t={t} moving={moving} box={box} /> : null}
        {grawlix
          ? grawlix.map((g, i) => (
              <text
                key={i}
                x={x0 + 50 + (i + 0.5) * ((x1 - x0 - 100) / grawlix.length) + g.dx}
                y={cy + 30 + g.dy}
                textAnchor="middle"
                fontFamily={FONTS.caption}
                fontSize={96 * g.scale}
                fill="#C8262B"
                transform={`rotate(${g.rot} ${x0 + 50 + (i + 0.5) * ((x1 - x0 - 100) / grawlix.length)} ${cy})`}
              >
                {g.char}
              </text>
            ))
          : null}
        {text ? <text x={cx} y={cy + 40} textAnchor="middle" fontFamily={FONTS.caption} fontSize={120} fill="#121212">{text}</text> : null}
      </g>
    </g>
  );
};
