// Patient = generated puppet (bible §4): makePatient(spec, maxSize) + the parts library (lib/*).
// No limbs (R7); the function marker carries recognition (R2); eyes 22–30 % of the body width in the
// upper third of the face (R4); ≥ 1 wear + ≥ 1 adult-coding element (R8). (x, y) = bottom-centre anchor.
// Pure function of props. Owned by the set builder.
import React from "react";
import type { PatientProps, PatientShadowProps } from "../../contract";
import { PATIENT_OUTLINE } from "../../enums";
import { effectiveSpec, makePatient, type PatientModel } from "./generator";
import { shapeArt, type Pal } from "./lib/shapes";
import { Brows, EyePair, Mouth, Stubble } from "./lib/face";
import { Accessory, Wear, markerArt, markerParts } from "./lib/marks";

export { makePatient, slotScenePoint, effectiveSpec } from "./generator";
export type { PatientModel } from "./generator";

const INK = PATIENT_OUTLINE.color;
const OUT = PATIENT_OUTLINE.width; // visible outline width, drawn outside the parts

export const PatientShadow: React.FC<PatientShadowProps> = ({ cx, cy, rx, ry, scale, opacity }) => (
  <ellipse cx={cx} cy={cy} rx={rx * scale} ry={ry * scale} fill="#000" opacity={opacity} />
);

/** Body = union of the shape parts: outline pass, then fills (+ marker back parts behind it). */
const BodyParts: React.FC<{ m: PatientModel; pal: Pal; fillOverride?: string }> = ({ m, pal, fillOverride }) => {
  const bodyH = m.body.y1 - m.body.y0;
  const parts = markerParts(m) ?? shapeArt(m.spec.shape, m.w, bodyH, pal).parts;
  const col = (f?: string) => fillOverride ?? (f === "shade" ? pal.shade : f === "accent" ? pal.accent : f && f.startsWith("#") ? f : pal.base);
  const outline = fillOverride ?? INK;
  return (
    <g>
      {parts.map((p, i) =>
        p.stroke ? (
          <path key={`o${i}`} d={p.d} stroke={outline} strokeWidth={p.stroke + 2 * OUT} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path key={`o${i}`} d={p.d} fill={outline} stroke={outline} strokeWidth={2 * OUT} strokeLinejoin="round" />
        ),
      )}
      {parts.map((p, i) =>
        p.stroke ? (
          <path key={`f${i}`} d={p.d} stroke={col(p.fill)} strokeWidth={p.stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path key={`f${i}`} d={p.d} fill={col(p.fill)} />
        ),
      )}
    </g>
  );
};

/** Draws the puppet in its local frame (anchor at 0,0). Exported for model sheets and the icon test. */
export const PatientPuppet: React.FC<{
  m: PatientModel;
  mouth: PatientProps["mouth"];
  eyes: PatientProps["eyes"];
  brows: PatientProps["brows"];
  blink: number;
  tears: number;
  silhouette?: string;
  uid: string;
}> = ({ m, mouth, eyes, brows, blink, tears, silhouette, uid }) => {
  const spec = m.spec;
  const pal: Pal = { base: spec.palette.base, shade: spec.palette.shade, accent: spec.palette.accent, ink: INK };
  const bodyH = m.body.y1 - m.body.y0;
  const art = shapeArt(spec.shape, m.w, bodyH, pal);
  const mk = markerArt(m, pal, mouth, { silhouette });
  if (silhouette) {
    return (
      <g>
        {mk.back}
        <BodyParts m={m} pal={pal} fillOverride={silhouette} />
        {spec.accessories.slice(0, 2).map((a, i) => <Accessory key={i} a={a} m={m} pal={pal} slot={i} silhouette={silhouette} />)}
        {mk.mouth}
      </g>
    );
  }
  const clipId = `${uid}-body`;
  const tonerTears = spec.wear.includes("toner_smudge") || spec.adultCoding.includes("toner_stubble");
  const e = m.eyes;
  const mouthStyle = spec.mouth.style ?? "thin";
  return (
    <g>
      {mk.back}
      <BodyParts m={m} pal={pal} />
      <clipPath id={clipId}>
        {(markerParts(m) ?? art.parts).filter((p) => !p.stroke).map((p, i) => <path key={i} d={p.d} />)}
      </clipPath>
      {art.details}
      {art.highlight && !markerParts(m) ? <path d={art.highlight} stroke="#ffffff" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.4} /> : null}
      {mk.front}
      <g clipPath={`url(#${clipId})`}>
        {m.wear.map((w, i) => <Wear key={i} kind={w.kind} x={w.x} y={w.y} s={w.s} rot={w.rot} pal={pal} />)}
      </g>
      {spec.accessories.slice(0, 2).map((a, i) => <Accessory key={i} a={a} m={m} pal={pal} slot={i} />)}
      {spec.adultCoding.map((k) => {
        const mw = (m.marker?.ownsSlot ? m.slot.w : m.mouth.w) / 2 + 10;
        const mh = m.marker?.ownsSlot ? m.w * 0.06 : m.mouth.w * 0.2;
        const hole: [number, number, number, number] = [m.mouth.cx - mw, m.mouth.cy - mh, m.mouth.cx + mw, m.mouth.cy + mh];
        return <Stubble key={k} kind={k} area={[hole[0] - 4, hole[1] + mh * 0.6, hole[2] + 4, hole[3] + m.w * 0.11]} hole={hole} seed={spec.seed} />;
      })}
      {spec.mouth.type === "none" ? null : spec.mouth.type === "slot" && mk.mouth ? (
        mk.mouth
      ) : spec.mouth.type === "slot" ? (
        // generic function opening when the marker has no slot of its own
        <rect x={m.mouth.cx - m.mouth.w / 2} y={m.mouth.cy - (mouth === "D" ? 18 : mouth === "X" ? 4 : 10)} width={m.mouth.w} height={mouth === "D" ? 36 : mouth === "X" ? 8 : 20} rx={6} fill="#161616" stroke={INK} strokeWidth={4} />
      ) : (
        <Mouth shape={mouth} style={mouthStyle} cx={m.mouth.cx} cy={m.mouth.cy} w={m.mouth.w} pal={pal} />
      )}
      <EyePair kind={eyes} cx={e.cx} cy={e.cy} ew={e.ew} eh={e.eh} gap={e.gap} blink={blink} adult={spec.adultCoding} pal={pal} uid={uid} />
      <Brows kind={brows} cx={e.cx} y={m.browY} gap={e.gap} ew={e.ew} ink={INK} />
      {tears > 0
        ? [-1, 1].map((s) => {
            const x = e.cx + (s * e.gap) / 2 + s * e.ew * 0.18;
            const y0 = e.cy + e.eh * 0.42;
            const len = (bodyH * 0.18 + 30) * tears;
            const col = tonerTears ? "#3a3a3a" : "#7fc4f0";
            return (
              <g key={s} opacity={Math.min(1, tears * 1.4)}>
                <path d={`M${x - 5} ${y0} Q${x + s * 4} ${y0 + len * 0.5} ${x - 3} ${y0 + len} L${x + 5} ${y0 + len} Q${x + s * 8} ${y0 + len * 0.5} ${x + 5} ${y0} Z`} fill={col} opacity={0.85} />
                <path d={`M${x} ${y0 + len - 2} q-11 16 0 24 q11 -8 0 -24 z`} fill={col} stroke={INK} strokeWidth={2.5} />
              </g>
            );
          })
        : null}
    </g>
  );
};

export const Patient: React.FC<PatientProps> = (p) => {
  const spec = effectiveSpec(p.spec, p.variant);
  const m = makePatient(spec, p.maxSize);
  // squash/stretch, clamped so the outline never leaves maxSize horizontally (lint 16: Chester's face x < 250)
  const drawnW = m.w + 2 * OUT;
  const sxMax = m.maxW / drawnW;
  const sx = Math.min(p.sx, sxMax);
  const sy = p.sy * (1 - p.swallow);
  const k = p.scale * p.idle.scale;
  const uid = `pt${spec.seed}-${Math.round(p.x)}-${Math.round(p.y)}`;
  const top = -m.h - OUT;
  return (
    <g
      transform={`translate(${p.x + p.idle.dx} ${p.y + p.idle.dy}) rotate(${p.rotate + p.idle.rot}) scale(${k * sx} ${k * sy})`}
      opacity={p.idle.opacity}
    >
      {p.motionLines ? (
        <g strokeLinecap="round">
          {[-0.28, 0, 0.28].map((f, i) => {
            const x = f * m.w;
            const y0 = top - 10 - (i === 1 ? 8 : 0), y1 = y0 - (i === 1 ? 70 : 50);
            return (
              <g key={i}>
                <path d={`M${x} ${y0} V${y1}`} stroke={p.silhouette ?? INK} strokeWidth={12} />
                <path d={`M${x} ${y0} V${y1}`} stroke={p.silhouette ?? "#F2ECDD"} strokeWidth={6} />
              </g>
            );
          })}
        </g>
      ) : null}
      <PatientPuppet m={m} mouth={p.mouth} eyes={p.eyes} brows={p.brows} blink={p.blink} tears={p.tears} silhouette={p.silhouette} uid={uid} />
    </g>
  );
};
