// Parts library: the 20 body shapes (bible §4.3). Each shape = a list of primitive parts in the local
// frame (x ∈ [−w/2, w/2], y ∈ [−h, 0]) + internal detail lines + a top highlight. Patient.tsx draws an
// outline pass (6 px #121212 outside every part, so compound shapes get one clean union outline), then
// the fills, then details. Owned by the set builder.
import React from "react";
import type { PatientShape } from "../../../enums";

export interface Part {
  d: string;
  /** "base" | "shade" | "accent" | hex; default "base" */
  fill?: string;
  /** stroked part (cable, handle): stroke width in px, no fill */
  stroke?: number;
}
export interface ShapeArt {
  parts: Part[];
  details?: React.ReactNode;
  highlight?: string;
}
export interface Pal {
  base: string;
  shade: string;
  accent: string;
  ink: string;
}

export const rr = (x0: number, y0: number, x1: number, y1: number, r: number): string => {
  const rx = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
  return `M${x0 + rx} ${y0} H${x1 - rx} Q${x1} ${y0} ${x1} ${y0 + rx} V${y1 - rx} Q${x1} ${y1} ${x1 - rx} ${y1} H${x0 + rx} Q${x0} ${y1} ${x0} ${y1 - rx} V${y0 + rx} Q${x0} ${y0} ${x0 + rx} ${y0} Z`;
};
const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;

/** Shape art for body width w and body height h (body box = [−w/2, −h] … [w/2, 0]). */
export function shapeArt(shape: PatientShape, w: number, h: number, p: Pal): ShapeArt {
  const hw = w / 2;
  const line = (d: string, sw = 4, col = p.ink, op = 1) => <path d={d} stroke={col} strokeWidth={sw} fill="none" strokeLinecap="round" opacity={op} />;
  switch (shape) {
    case "rect_vertical":
      return {
        parts: [{ d: rr(-hw, -h, hw, 0, w * 0.08) }],
        details: line(`M${-hw + 10} ${-h * 0.34} H${hw - 10}`, 4, p.shade),
        highlight: `M${-hw + w * 0.12} ${-h + 12} H${hw - w * 0.3}`,
      };
    case "rect_horizontal":
      return { parts: [{ d: rr(-hw, -h, hw, 0, Math.min(h * 0.1, w * 0.06)) }], highlight: `M${-hw + 16} ${-h + 10} H${hw - w * 0.3}` };
    case "rounded_slab":
      return {
        parts: [{ d: rr(-hw, -h, hw, 0, w * 0.18) }],
        details: (
          <g>
            <path d={rr(-hw + w * 0.08, -h + h * 0.08, hw - w * 0.08, -h * 0.12, w * 0.08)} fill={p.shade} opacity={0.55} />
            {line(`M${-w * 0.1} ${-h + h * 0.045} H${w * 0.1}`, 5)}
          </g>
        ),
        highlight: `M${-hw + w * 0.2} ${-h + 10} H${hw - w * 0.35}`,
      };
    case "cylinder": {
      const e = h * 0.07;
      return {
        parts: [{ d: `M${-hw} ${-h + e} A${hw} ${e} 0 0 1 ${hw} ${-h + e} V${-e} A${hw} ${e} 0 0 1 ${-hw} ${-e} Z` }],
        details: (
          <g>
            <path d={ellipse(0, -h + e, hw, e)} fill={p.shade} stroke={p.ink} strokeWidth={4} />
            {line(`M${-hw} ${-h * 0.18} A${hw} ${e} 0 0 0 ${hw} ${-h * 0.18}`, 4, p.shade)}
          </g>
        ),
        highlight: `M${-hw + w * 0.16} ${-h + e * 2.6} V${-h * 0.4}`,
      };
    }
    case "disc": {
      const r = Math.min(hw, h / 2);
      return {
        parts: [{ d: circle(0, -h / 2, r) }],
        details: (
          <g>
            <path d={circle(0, -h / 2, r * 0.84)} fill="none" stroke={p.shade} strokeWidth={6} />
            <path d={`M${-r * 0.8} ${-h / 2 + r * 0.6} A${r} ${r} 0 0 0 ${r * 0.8} ${-h / 2 + r * 0.6}`} stroke={p.shade} strokeWidth={8} fill="none" />
          </g>
        ),
        highlight: `M${-r * 0.55} ${-h / 2 - r * 0.62} A${r * 0.85} ${r * 0.85} 0 0 1 ${r * 0.1} ${-h / 2 - r * 0.84}`,
      };
    }
    case "sphere": {
      const r = Math.min(hw, h / 2);
      return {
        parts: [{ d: circle(0, -h / 2, r) }],
        details: <path d={`M${r * 0.2} ${-h / 2 + r * 0.95} A${r} ${r} 0 0 0 ${r * 0.95} ${-h / 2 + r * 0.2} A${r * 1.25} ${r * 1.25} 0 0 1 ${r * 0.2} ${-h / 2 + r * 0.95} Z`} fill={p.shade} />,
        highlight: `M${-r * 0.6} ${-h / 2 - r * 0.5} A${r * 0.8} ${r * 0.8} 0 0 1 ${-r * 0.05} ${-h / 2 - r * 0.8}`,
      };
    }
    case "wedge": {
      const c = h * 0.1;
      return {
        parts: [{ d: `M${-hw} ${-h + c} Q0 ${-h - c * 0.7} ${hw} ${-h + c} L${w * 0.04} ${-4} Q0 0 ${-w * 0.04} ${-4} Z` }],
        details: (
          <g>
            <path d={`M${-hw} ${-h + c} Q0 ${-h - c * 0.7} ${hw} ${-h + c} L${hw * 0.86} ${-h + c * 2.3} Q0 ${-h + c * 0.7} ${-hw * 0.86} ${-h + c * 2.3} Z`} fill={p.shade} stroke={p.ink} strokeWidth={4} />
            <circle cx={-w * 0.12} cy={-h * 0.36} r={w * 0.06} fill={p.accent} stroke={p.ink} strokeWidth={3} />
            <circle cx={w * 0.08} cy={-h * 0.26} r={w * 0.05} fill={p.accent} stroke={p.ink} strokeWidth={3} />
          </g>
        ),
      };
    }
    case "cone":
      return {
        parts: [
          { d: `M${-w * 0.34} ${-h * 0.1} L${-w * 0.07} ${-h + 6} Q0 ${-h - 6} ${w * 0.07} ${-h + 6} L${w * 0.34} ${-h * 0.1} Z` },
          { d: rr(-hw, -h * 0.11, hw, 0, 6), fill: "shade" },
        ],
        details: (
          <g>
            <path d={`M${-w * 0.25} ${-h * 0.36} L${w * 0.25} ${-h * 0.36} L${w * 0.21} ${-h * 0.48} L${-w * 0.21} ${-h * 0.48} Z`} fill="#F4F1EA" stroke={p.ink} strokeWidth={3} />
          </g>
        ),
      };
    case "sheet": {
      const c = w * 0.18;
      return {
        parts: [{ d: `M${-hw} ${-h} H${hw - c} L${hw} ${-h + c} V0 H${-hw} Z` }],
        details: (
          <g>
            <path d={`M${hw - c} ${-h} V${-h + c} H${hw} Z`} fill={p.shade} stroke={p.ink} strokeWidth={4} strokeLinejoin="round" />
            {[0.7, 0.78, 0.86].map((k) => line(`M${-hw + w * 0.14} ${-h * (1 - k)} H${hw - w * (0.14 + 0.1 * k)}`, 5, p.shade))}
          </g>
        ),
      };
    }
    case "sticky_note": {
      const c = w * 0.16;
      return {
        parts: [{ d: `M${-hw} ${-h} H${hw} V${-c} Q${hw - c * 0.25} ${-c * 0.25} ${hw - c} 0 H${-hw} Z` }],
        details: (
          <g>
            <path d={`M${-hw} ${-h} H${hw} V${-h + h * 0.12} H${-hw} Z`} fill={p.shade} opacity={0.5} />
            <path d={`M${hw} ${-c} Q${hw - c * 0.25} ${-c * 0.25} ${hw - c} 0 Q${hw - c * 0.4} ${-c * 0.7} ${hw} ${-c} Z`} fill={p.shade} stroke={p.ink} strokeWidth={3} />
          </g>
        ),
      };
    }
    case "speech_bubble": {
      const bt = -h * 0.2;
      return {
        parts: [
          { d: rr(-hw, -h, hw, bt, Math.min(w, h) * 0.22) },
          { d: `M${-w * 0.2} ${bt - 4} L${-w * 0.16} 0 L${w * 0.08} ${bt - 4} Z` },
        ],
      };
    }
    case "cloud": {
      const bumps: [number, number, number][] = [
        [-0.3, -0.42, 0.24], [-0.06, -0.62, 0.3], [0.24, -0.5, 0.26], [0.36, -0.3, 0.16], [-0.38, -0.24, 0.14],
      ];
      return {
        parts: [
          { d: rr(-hw + w * 0.04, -h * 0.42, hw - w * 0.04, 0, h * 0.21) },
          ...bumps.map(([x, y, r]) => ({ d: circle(x * w, y * h, r * w) })),
        ],
      };
    }
    case "bag":
      return {
        parts: [
          { d: `M${-hw * 0.82} ${-h * 0.62} L${hw * 0.82} ${-h * 0.62} L${hw} ${-h * 0.08} Q${hw} 0 ${hw - 12} 0 L${-hw + 12} 0 Q${-hw} 0 ${-hw} ${-h * 0.08} Z` },
          { d: `M${-w * 0.3} ${-h * 0.62} Q${-w * 0.3} ${-h} ${-w * 0.08} ${-h + 4} Q${-w * 0.02} ${-h * 0.8} ${-w * 0.1} ${-h * 0.62}`, stroke: w * 0.07 },
          { d: `M${w * 0.3} ${-h * 0.62} Q${w * 0.3} ${-h} ${w * 0.08} ${-h + 4} Q${w * 0.02} ${-h * 0.8} ${w * 0.1} ${-h * 0.62}`, stroke: w * 0.07 },
        ],
        details: line(`M${-hw * 0.5} ${-h * 0.5} q${w * 0.1} ${h * 0.2} 0 ${h * 0.4}`, 4, p.shade),
      };
    case "bottle":
      return {
        parts: [
          { d: `M${-hw} ${-h * 0.58} Q${-hw} ${-h * 0.72} ${-w * 0.2} ${-h * 0.76} V${-h * 0.86} H${w * 0.2} V${-h * 0.76} Q${hw} ${-h * 0.72} ${hw} ${-h * 0.58} V${-w * 0.12} Q${hw} 0 ${hw - w * 0.12} 0 H${-hw + w * 0.12} Q${-hw} 0 ${-hw} ${-w * 0.12} Z` },
          { d: rr(-w * 0.26, -h, w * 0.26, -h * 0.84, 6), fill: "accent" },
        ],
        details: <path d={rr(-hw + 6, -h * 0.5, hw - 6, -h * 0.14, 6)} fill={p.shade} opacity={0.6} />,
      };
    case "lidded_box":
      return {
        parts: [{ d: rr(-hw * 0.94, -h * 0.82, hw * 0.94, 0, 6) }, { d: rr(-hw, -h, hw, -h * 0.76, 6), fill: "shade" }],
      };
    case "arcs": {
      const R = h, th = Math.asin(Math.min(0.99, w / (2 * h)));
      const sx = R * Math.sin(th), sy = -R * Math.cos(th);
      return {
        parts: [{ d: `M0 0 L${-sx} ${sy} A${R} ${R} 0 0 1 ${sx} ${sy} Z` }],
        details: (
          <g fill="none" stroke={p.shade} strokeWidth={h * 0.07}>
            {[0.42, 0.68].map((k) => (
              <path key={k} d={`M${-sx * k} ${sy * k} A${R * k} ${R * k} 0 0 1 ${sx * k} ${sy * k}`} />
            ))}
            <circle cx={0} cy={-h * 0.1} r={h * 0.06} fill={p.shade} stroke="none" />
          </g>
        ),
      };
    }
    case "cable_plug":
      return {
        parts: [
          { d: rr(-w * 0.36, -h * 0.8, w * 0.36, -h * 0.2, w * 0.12) },
          { d: rr(-w * 0.2, -h, -w * 0.08, -h * 0.79, 3), fill: "#C0C4C8" },
          { d: rr(w * 0.08, -h, w * 0.2, -h * 0.79, 3), fill: "#C0C4C8" },
          { d: `M0 ${-h * 0.2} Q0 ${-h * 0.04} ${w * 0.24} ${-h * 0.03} T${hw - 4} ${-6}`, stroke: w * 0.1, fill: "shade" },
        ],
      };
    case "house":
      return {
        parts: [
          { d: `M${-hw * 0.84} 0 V${-h * 0.56} H${hw * 0.84} V0 Z` },
          { d: `M${-hw} ${-h * 0.52} L0 ${-h} L${hw} ${-h * 0.52} Z`, fill: "shade" },
          { d: rr(w * 0.22, -h * 0.94, w * 0.34, -h * 0.66, 2), fill: "shade" },
        ],
      };
    case "triangle_tree":
      return {
        parts: [
          { d: rr(-w * 0.08, -h * 0.14, w * 0.08, 0, 3), fill: "#5a3a22" },
          { d: `M${-hw} ${-h * 0.12} L0 ${-h * 0.58} L${hw} ${-h * 0.12} Z` },
          { d: `M${-w * 0.4} ${-h * 0.4} L0 ${-h * 0.82} L${w * 0.4} ${-h * 0.4} Z` },
          { d: `M${-w * 0.29} ${-h * 0.66} L0 ${-h} L${w * 0.29} ${-h * 0.66} Z` },
        ],
      };
    case "ribbed_sphere":
      return {
        parts: [
          { d: ellipse(0, -h * 0.45, hw, h * 0.45) },
          { d: `M${-w * 0.04} ${-h * 0.86} q-2 ${-h * 0.1} ${w * 0.08} ${-h * 0.14} l4 8 q-8 4 -6 ${h * 0.08} Z`, fill: "#5a6b2a" },
        ],
        details: (
          <g fill="none" stroke={p.shade} strokeWidth={5}>
            {[-0.5, -0.2, 0.2, 0.5].map((k) => (
              <path key={k} d={`M${k * w * 0.5} ${-h * 0.88} Q${k * w * 1.05} ${-h * 0.45} ${k * w * 0.5} ${-h * 0.02}`} />
            ))}
          </g>
        ),
        highlight: `M${-w * 0.3} ${-h * 0.78} Q${-w * 0.2} ${-h * 0.86} ${-w * 0.05} ${-h * 0.86}`,
      };
  }
}
