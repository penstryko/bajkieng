// z13 particles (engine particlesAt → states). Cartoon only: paper, confetti, feathers, coins, sparks,
// smoke, dust — never body parts (bible §10). Pure function of props. Owned by the set builder.
import React from "react";
import type { ParticlesProps } from "../../contract";

const INK = "#121212";
const COLORS: Record<string, string[]> = {
  paper: ["#F4F1EA", "#E9E4D8", "#F4F1EA"],
  confetti: ["#E4572E", "#F2B33D", "#3D7DD8", "#8E5CC9", "#7FB069", "#D94A64"],
  feathers: ["#E8E0CC", "#F4F1EA"],
  coins: ["#D9B13B", "#C99A2E"],
  sparks: ["#FFC857", "#FFE29A"],
  smoke: ["#6b6b6b", "#7d7a74", "#5c5a56"],
  dust: ["#8a7f6e", "#9a9080"],
};

export const Particles: React.FC<ParticlesProps> = ({ type, particles }) => (
  <g>
    {particles.map((p, i) => {
      if (p.opacity <= 0) return null;
      const cols = COLORS[type] ?? ["#ccc"];
      const col = cols[Math.floor(p.variant * cols.length) % cols.length];
      const flip = Math.cos((p.rot * Math.PI) / 90); // tumbling: flat shapes flip through edge-on
      let el: React.ReactNode;
      switch (type) {
        case "paper":
          el = (
            <g transform={`scale(${0.2 + 0.8 * Math.abs(flip)} 1)`}>
              <path d="M-17 -23 H11 L17 -17 V23 H-17 Z" fill={flip >= 0 ? col : "#ddd6c8"} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
              {flip >= 0 ? <path d="M-11 -11 H11 M-11 -2 H8 M-11 7 H11 M-11 16 H4" stroke="#9a948a" strokeWidth={2.5} /> : null}
            </g>
          );
          break;
        case "confetti":
          el = <rect x={-14} y={-8} width={28} height={16} fill={col} stroke={INK} strokeWidth={2.5} transform={`scale(${0.25 + 0.75 * Math.abs(flip)} 1)`} />;
          break;
        case "feathers":
          el = (
            <g>
              <path d="M0 -26 C16 -14 14 14 0 26 C-14 14 -16 -14 0 -26 Z" fill={col} stroke={INK} strokeWidth={2.5} />
              <path d="M0 -24 V30" stroke="#b9b09a" strokeWidth={2} />
            </g>
          );
          break;
        case "coins":
          el = (
            <g transform={`scale(${0.2 + 0.8 * Math.abs(flip)} 1)`}>
              <circle r={14} fill={col} stroke={INK} strokeWidth={3} />
              <circle r={8} fill="none" stroke="#a87d1e" strokeWidth={2} />
            </g>
          );
          break;
        case "sparks":
          el = <path d="M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z" fill={col} stroke={INK} strokeWidth={2} />;
          break;
        case "smoke":
          el = (
            <g opacity={0.8}>
              <circle cx={-8} cy={2} r={14} fill={col} />
              <circle cx={8} cy={-4} r={16} fill={col} />
              <circle cx={2} cy={8} r={12} fill={col} />
            </g>
          );
          break;
        default:
          el = (
            <g opacity={0.7}>
              <circle cx={-5} cy={0} r={9} fill={col} />
              <circle cx={6} cy={-3} r={11} fill={col} />
            </g>
          );
      }
      return (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${p.scale})`} opacity={p.opacity}>
          {el}
        </g>
      );
    })}
  </g>
);
