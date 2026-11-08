// PLACEHOLDER — owned by the set builder. Replace with the patient generator (makePatient(spec, seed),
// bible §4), keep the PatientProps / PatientShadowProps interfaces.
import React from "react";
import type { PatientProps, PatientShadowProps } from "../../contract";
import { PATIENT_OUTLINE } from "../../enums";

export const PatientShadow: React.FC<PatientShadowProps> = ({ cx, cy, rx, ry, scale, opacity }) => (
  <ellipse cx={cx} cy={cy} rx={rx * scale} ry={ry * scale} fill="#000" opacity={opacity} />
);

export const Patient: React.FC<PatientProps> = (p) => {
  const { spec, maxSize } = p;
  const w = maxSize.w * 0.95;
  const h = spec.shape === "rect_horizontal" ? maxSize.h * 0.7 : maxSize.h * 0.95;
  const fill = p.silhouette ?? spec.palette.base;
  const ink = p.silhouette ?? PATIENT_OUTLINE.color;
  const eyeR = (w * 0.26) / 2; // eyes 22–30 % of the body width (R4)
  const eyeY = -h + h * 0.3;
  const sy = p.sy * (1 - p.swallow);
  const mouthH = p.mouth === "D" ? 40 : p.mouth === "X" ? 0 : 18;
  return (
    <g
      transform={`translate(${p.x + p.idle.dx} ${p.y + p.idle.dy}) rotate(${p.rotate + p.idle.rot}) scale(${p.scale * p.sx * p.idle.scale} ${p.scale * sy * p.idle.scale})`}
      opacity={p.idle.opacity}
    >
      {p.motionLines ? (
        <g stroke={ink} strokeWidth={6} strokeLinecap="round" opacity={0.8}>
          <line x1={-60} y1={-h - 30} x2={-60} y2={-h - 90} />
          <line x1={0} y1={-h - 40} x2={0} y2={-h - 110} />
          <line x1={60} y1={-h - 30} x2={60} y2={-h - 90} />
        </g>
      ) : null}
      <rect x={-w / 2} y={-h} width={w} height={h} rx={22} fill={fill} stroke={ink} strokeWidth={PATIENT_OUTLINE.width} />
      {!p.silhouette ? (
        <g>
          <rect x={-w / 2 + 12} y={-h + 10} width={w - 24} height={10} rx={5} fill="#fff" opacity={0.35} />
          <rect x={-w / 2 + 30} y={-h - 26} width={w - 60} height={30} fill={spec.palette.shade} stroke={ink} strokeWidth={4} />
          {[-1, 1].map((s) => (
            <g key={s}>
              <circle cx={s * w * 0.2} cy={eyeY} r={eyeR} fill="#fff" stroke={ink} strokeWidth={4} />
              <circle cx={s * w * 0.2} cy={eyeY + 4} r={eyeR * 0.35} fill={ink} />
              <rect x={s * w * 0.2 - eyeR - 2} y={eyeY - eyeR - 2} width={2 * eyeR + 4} height={(2 * eyeR + 4) * Math.max(0.35, p.blink)} fill={spec.palette.shade} />
            </g>
          ))}
          {p.brows !== "none" ? (
            <g stroke={ink} strokeWidth={8} strokeLinecap="round">
              <line x1={-w * 0.2 - eyeR} y1={eyeY - eyeR - 14} x2={-w * 0.2 + eyeR} y2={eyeY - eyeR - (p.brows === "angry_v" ? 4 : 14)} />
              <line x1={w * 0.2 - eyeR} y1={eyeY - eyeR - (p.brows === "angry_v" ? 4 : 14)} x2={w * 0.2 + eyeR} y2={eyeY - eyeR - 14} />
            </g>
          ) : null}
          <rect x={-w * 0.32} y={-h * 0.38 - mouthH / 2} width={w * 0.64} height={Math.max(8, mouthH)} rx={4} fill="#1a1a1a" />
          {p.tears > 0 ? <path d={`M${w * 0.2} ${eyeY + eyeR} q6 20 0 34 q-6 -14 0 -34`} fill="#9fd3ff" opacity={p.tears} /> : null}
        </g>
      ) : null}
    </g>
  );
};
