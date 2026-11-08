// PLACEHOLDER — owned by the set builder. Keep ParticlesProps (states come from engine particlesAt).
import React from "react";
import type { ParticlesProps } from "../../contract";

const COLORS: Record<string, string[]> = {
  paper: ["#F4F1EA", "#E9E4D8"], confetti: ["#E4572E", "#F2B33D", "#3D7DD8", "#8E5CC9"], feathers: ["#E8E0CC"],
  coins: ["#D9B13B"], sparks: ["#FFC857"], smoke: ["#6b6b6b"], dust: ["#8a7f6e"],
};

export const Particles: React.FC<ParticlesProps> = ({ type, particles }) => (
  <g>
    {particles.map((p, i) => {
      const col = COLORS[type][Math.floor(p.variant * COLORS[type].length)];
      return (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${p.scale})`} opacity={p.opacity}>
          {type === "coins" ? <circle r={12} fill={col} stroke="#121212" strokeWidth={3} /> : type === "smoke" || type === "dust" ? <circle r={18} fill={col} /> : <rect x={-14} y={-10} width={28} height={20} fill={col} stroke="#121212" strokeWidth={2} />}
        </g>
      );
    })}
  </g>
);
