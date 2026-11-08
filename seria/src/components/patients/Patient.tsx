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

/** Seat level in the puppet's local frame: the solo anchor is y 1150, the seat top ≈ 1086 (the front edge, z9, covers y ≥ 1100). */
const SEAT_Y = -64;

/** Liquid tears: 18 px streams with a specular stripe from both eyes, 2–3 drops falling to the seat (driven by t). */
const Tears: React.FC<{ m: PatientModel; tears: number; t: number; toner: boolean }> = ({ m, tears, t, toner }) => {
  const e = m.eyes;
  const bodyH = m.body.y1 - m.body.y0;
  const col = toner ? "#2e2e2e" : "#5fb0e8";
  const hi = toner ? "#a8a8a8" : "#e6f6ff";
  return (
    <g opacity={Math.min(1, tears * 1.4)}>
      {[-1, 1].map((s) => {
        const x = e.cx + (s * e.gap) / 2 + s * e.ew * 0.2;
        const y0 = e.cy + e.eh * 0.38;
        const len = (bodyH * 0.22 + 34) * tears;
        const hw = 9; // half width → 18 px stream
        const bend = s * 6;
        const stream = `M${x - hw} ${y0} Q${x - hw + bend} ${y0 + len * 0.5} ${x - hw + 2} ${y0 + len} Q${x} ${y0 + len + 14} ${x + hw - 2} ${y0 + len} Q${x + hw + bend} ${y0 + len * 0.5} ${x + hw} ${y0} Z`;
        // drops: fall from the stream end to the seat, accelerating, 3 per side, staggered
        const yEnd = y0 + len + 6;
        const drops = [0, 1, 2].map((i) => {
          const period = 12;
          const ph = ((t + i * 4 + (s > 0 ? 2 : 0)) % period) / period;
          const y = yEnd + (SEAT_Y - yEnd) * ph * ph;
          const dx = s * (4 + 10 * ph);
          return t > 2 && y < SEAT_Y - 4 ? (
            <path key={i} d={`M${x + dx} ${y - 14} q-9 14 0 20 q9 -6 0 -20 z`} fill={col} stroke={INK} strokeWidth={2.5} />
          ) : null;
        });
        return (
          <g key={s}>
            <path d={stream} fill={col} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <path d={`M${x - 3} ${y0 + 6} Q${x - 3 + bend * 0.6} ${y0 + len * 0.5} ${x - 2} ${y0 + len - 4}`} stroke={hi} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.9} />
            <path d={`M${x} ${y0 + len - 2} q-12 18 0 26 q12 -8 0 -26 z`} fill={col} stroke={INK} strokeWidth={3} />
            <circle cx={x - 3} cy={y0 + len + 14} r={2.5} fill={hi} />
            {drops}
          </g>
        );
      })}
    </g>
  );
};

/** Dark puddle on the seat, growing while the patient cries (drawn behind the body, visible at its sides). */
const Puddle: React.FC<{ m: PatientModel; tears: number; t: number; toner: boolean }> = ({ m, tears, t, toner }) => {
  const grow = Math.min(1, tears * Math.min(1, t / 40 + 0.25));
  const rx = (m.w / 2 + 46) * grow;
  if (rx < 4) return null;
  return (
    <g>
      <ellipse cx={0} cy={SEAT_Y + 8} rx={rx} ry={12 * grow + 3} fill={toner ? "#1e1e1e" : "#3d7fb0"} stroke={INK} strokeWidth={3} opacity={0.92} />
      <ellipse cx={-rx * 0.55} cy={SEAT_Y + 5} rx={rx * 0.16} ry={3} fill="#ffffff" opacity={0.35} />
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
  tearsT?: number;
  panel?: PatientProps["panel"];
  silhouette?: string;
  uid: string;
}> = ({ m, mouth, eyes, brows, blink, tears, tearsT = 0, panel, silhouette, uid }) => {
  const spec = m.spec;
  const pal: Pal = { base: spec.palette.base, shade: spec.palette.shade, accent: spec.palette.accent, ink: INK };
  const bodyH = m.body.y1 - m.body.y0;
  const art = shapeArt(spec.shape, m.w, bodyH, pal);
  const mk = markerArt(m, pal, mouth, { silhouette, panel });
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
      {tears > 0 ? <Puddle m={m} tears={tears} t={tearsT} toner={tonerTears} /> : null}
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
      {tears > 0 ? <Tears m={m} tears={tears} t={tearsT} toner={tonerTears} /> : null}
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
      <PatientPuppet m={m} mouth={p.mouth} eyes={p.eyes} brows={p.brows} blink={p.blink} tears={p.tears} tearsT={p.tearsT} panel={p.panel} silhouette={p.silhouette} uid={uid} />
    </g>
  );
};
