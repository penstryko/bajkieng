// Owned by the SET builder. Model sheets for the set, the patient generator, props and humans, plus the
// patient icon test (R1). Root.tsx never changes. Model sheets may read the frame HERE to step through
// pages; the components themselves stay pure.
//
//   ModelSheetSet      9 pages (frames): 0 S0 composite · 1 seated curse + office window · 2 memory bubble ·
//                      3 empty room variants · 4 twist (doctor spits jammed paper) · 5–7 notepad · 8 window growth
//   ModelSheetPatient  6 pages: 0 printer expressions · 1 shapes · 2 eyes · 3 mouths · 4 wear/accessories/markers · 5 icon test
//   ModelSheetProps    3 pages: 0 bubbles + caption · 1 humans · 2 props + particles
//   PatientIcon        160×160 black silhouette of episodes/<episodeId>/patient.json → qa/icon.png
import React from "react";
import { AbsoluteFill, Composition, Folder, staticFile, useCurrentFrame } from "remotion";
import { Set } from "../components/set/Set";
import { Patient, PatientPuppet, PatientShadow, makePatient } from "../components/patients/Patient";
import { Caption } from "../components/props/Caption";
import { Bubble } from "../components/props/Bubble";
import { NotepadCard } from "../components/props/Notepad";
import { PropItem } from "../components/props/PropItem";
import { Particles } from "../components/props/Particles";
import { Human, HUMAN_MOVES } from "../components/humans/Human";
import { Doctor } from "../components/cast/Doctor";
import { Chester } from "../components/cast/Chester";
import { Chirp } from "../components/cast/Chirp";
import {
  FONTS, NO_IDLE, POS, SET_COLORS, bubbleInflate, grawlix, particlesAt, landing, ritual,
} from "../engine";
import {
  HUMAN_ACCESSORIES, HUMAN_POSES, MOUTH_SHAPES, MOUTH_STYLES, PATIENT_ACCESSORY_KINDS, PATIENT_EYES, PATIENT_PALETTE,
  PATIENT_SHAPES, PATIENT_WEAR, type MouthShape, type PatientEyes,
} from "../enums";
import type { ChesterProps, DoctorProps, PatientProps, SetProps } from "../contract";
import type { PatientSpec } from "../schema";
import patientJson from "../../episodes/S01E01/patient.json";

const printer = patientJson as unknown as PatientSpec;
const INK = "#121212";
const L: { w: number; h: number } = { w: 330, h: 380 };

type SetBase = Omit<SetProps, "layer"> & { patientNo?: number };
const setBase: SetBase = {
  windowLayer: "calm", windowT: 0, neonOn: true, blinds: 0, plantStage: 0, diplomaText: "Doctor of Nodding",
  chairState: "intact", timer: { dial: 1, angle: -330, visible: true, ringing: 0, jitter: [0, 0] }, vignetteOpacity: 0.35,
  patientNo: 1,
};
const doctorBase: Omit<DoctorProps, "layer"> = {
  brows: "neutral", mouth: "flat", lens: "patient_file_icon", lensNoise: 0, noiseSeed: 0, glassesY: 0, glassesJump: 0, headTilt: 0,
  lean: 1, pen: "raised", penPhase: 0, blink: 0, bob: 0, breath: 0, placement: "chair", placementT: 1, extras: [], patient: printer, patientNo: 1,
};
const chesterBase: Omit<ChesterProps, "layer"> = {
  eyes: "wide_up", mouth: "tight", mouthOpen: 0, sag: 0.02, blink: 0, pupil: [0, 0], eyeShake: [0, 0], spring: 0, springWobble: 0, breath: 0,
};
const patientBase = (spec: PatientSpec, over: Partial<PatientProps> = {}): PatientProps => ({
  spec, x: 410, y: 1150, scale: 1, sx: 1, sy: 1, rotate: 0, brows: spec.brows, eyes: spec.eyes, mouth: "X", variant: "base", blink: 0,
  idle: NO_IDLE, motionLines: false, tears: 0, swallow: 0, maxSize: L, ...over,
});

/** Full WIDE layer stack in bible §5.2 order (same order as Episode.tsx). */
const Wide: React.FC<{
  set?: Partial<SetBase>; doctor?: Partial<Omit<DoctorProps, "layer">>; chester?: Partial<Omit<ChesterProps, "layer">>;
  patient?: PatientProps | null; shadow?: { scale: number; opacity: number } | null; cast?: boolean;
  overlay?: React.ReactNode; caption?: string | null; windowSlot?: React.ReactNode;
}> = ({ set = {}, doctor = {}, chester = {}, patient, shadow = { scale: 1, opacity: 0.6 }, cast = true, overlay, caption = null, windowSlot }) => {
  const s = { ...setBase, ...set };
  const d = { ...doctorBase, ...doctor };
  const c = { ...chesterBase, ...chester };
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: "block" }}>
      <Set layer="background" {...s} />
      <Set layer="window" {...s} windowSlot={windowSlot} />
      <Set layer="decor" {...s} />
      {cast ? <Chirp led="off" ledLevel={0} tilt={0} jitter={[0, 0]} /> : null}
      <Set layer="chair" {...s} />
      {cast ? <Doctor layer="body" {...d} /> : null}
      {cast ? <Chester layer="back" {...c} /> : null}
      {shadow && patient ? <PatientShadow cx={410} cy={POS.shadow.c[1]} rx={POS.shadow.rx} ry={POS.shadow.ry} scale={shadow.scale} opacity={shadow.opacity} /> : null}
      {patient ? <Patient {...patient} /> : null}
      {cast ? <Chester layer="front" {...c} /> : null}
      <Set layer="table" {...s} />
      {cast ? <Doctor layer="hands" {...d} /> : null}
      {overlay}
      {caption ? <Caption text={caption} scale={1} opacity={1} /> : null}
      <Set layer="vignette" {...s} />
    </svg>
  );
};

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number; color?: string; anchor?: "start" | "middle" }> = ({ x, y, children, size = 30, color = "#F2ECDD", anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONTS.crt} fontSize={size} fill={color}>
    {children}
  </text>
);

// ───────────────────────────── ModelSheetSet ─────────────────────────────

const ModelSheetSet: React.FC = () => {
  const page = useCurrentFrame();
  switch (page) {
    case 0: // S0 composite (matches state0Scene: hover top 230, motion lines, shadow 1/0.6, caption)
      return (
        <AbsoluteFill>
          <Wide patient={patientBase(printer, { y: 230 + L.h, motionLines: true })} caption="PATIENT #001: OFFICE PRINTER" />
        </AbsoluteFill>
      );
    case 1: {
      const g = grawlix(30, 0, "#$%&!", 1001);
      return (
        <AbsoluteFill>
          <Wide
            set={{ windowLayer: "office_print_queue", windowT: 150 }}
            chester={{ eyes: "squint", mouth: "wavy", sag: 0.04 }}
            doctor={{ brows: "one_up", lens: "burger" }}
            patient={patientBase(printer, { mouth: "D", brows: "angry_v" })}
            shadow={null}
            overlay={<Bubble kind="speech" box={[150, 420, 560, 680]} tail={[400, 830]} inflate={1} dots={[1, 1, 1]} t={30} grawlix={g} />}
          />
        </AbsoluteFill>
      );
    }
    case 2: {
      const b = bubbleInflate(40, 0, 89);
      return (
        <AbsoluteFill>
          <Wide
            patient={patientBase(printer, { mouth: "B", brows: "worried" })}
            shadow={null}
            chester={{ eyes: "half", mouth: "flat", sag: 0.04 }}
            overlay={<Bubble kind="memory" box={POS.bubble} tail={[410, 770]} inflate={b.inflate} dots={b.dots} vignette="office_kick" moving={["human_leg", "printer_shake"]} t={5} />}
          />
        </AbsoluteFill>
      );
    }
    case 3:
      return (
        <AbsoluteFill>
          <Wide
            cast={false}
            set={{ blinds: 0.55, plantStage: 8, leafFall: 0.35, diplomaText: "PhD in Nodding, University of Somewhere Online", neonOn: false, patientNo: 27, timer: { dial: 0, angle: 0, visible: true, ringing: 0.7, jitter: [0, 0] } }}
            patient={null}
          />
        </AbsoluteFill>
      );
    case 4: {
      const parts = particlesAt(70, { from: 0, to: 210, type: "paper", origin: [410, 1020], count: 40 }, 1001);
      return (
        <AbsoluteFill>
          <Wide
            set={{ windowLayer: "office_print_queue", windowT: 600 }}
            doctor={{ mouth: "O", lens: "siren", brows: "high", glassesJump: 12, extras: ["sweat"] }}
            chester={{ eyes: "one_open", mouth: "flat", sag: 0.02 }}
            patient={patientBase(printer, { mouth: "B", brows: "raised", tears: 1 })}
            shadow={null}
            overlay={
              <g>
                <Particles type="paper" particles={parts} />
                <PropItem id="paper_strip" x={760} y={834} scale={1} rotate={0} opacity={1} t={18} motionLines={false} />
              </g>
            }
          />
        </AbsoluteFill>
      );
    }
    case 5:
    case 6:
    case 7:
      return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: "block" }}>
            <NotepadCard doodle={page === 7 ? "printer_with_horns" : "A01_fence"} strokes={[]} drawProgress={page === 5 ? 0.58 : 1} boilSeed={page} flip={1} />
            <Set layer="vignette" {...setBase} />
          </svg>
        </AbsoluteFill>
      );
    default: {
      // window: the S01E01 consequence (office_print_queue) — growth over QUEUE_RAMP and readability at ×1 (WIDE)
      const crop = (key: string, t: number, x: number, y: number, k: number, label: string, layer = "office_print_queue") => (
        <g key={key}>
          <clipPath id={`qa-win-${key}`}>
            <rect x={370} y={340} width={340} height={330} />
          </clipPath>
          <g transform={`translate(${x} ${y}) scale(${k}) translate(-540 -505)`}>
            <g clipPath={`url(#qa-win-${key})`}>
              <Set layer="background" {...setBase} />
              <Set layer="window" {...setBase} windowLayer={layer} windowT={t} />
            </g>
          </g>
          <Label x={x} y={y + 165 * k + 40} size={26}>{label}</Label>
        </g>
      );
      return (
        <AbsoluteFill style={{ backgroundColor: SET_COLORS.wall }}>
          <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: "block" }}>
            <Label x={540} y={70} size={40}>Window · office_print_queue (S01E01 consequence)</Label>
            {crop("zoom", 600, 540, 560, 2.4, "×2.4 · windowT 600 (f 1500): queue maxed, heads on keyboards")}
            {crop("t60", 60, 190, 1330, 1, "×1 · t 60 (f 960)")}
            {crop("t300", 300, 540, 1330, 1, "×1 · t 300 (f 1200)")}
            {crop("t600", 600, 890, 1330, 1, "×1 · t 600+ (f 1500)")}
            {crop("calm", 0, 540, 1720, 0.9, `calm (S0 and f ${ritual(1920).GLASSES}+)`, "calm")}
          </svg>
        </AbsoluteFill>
      );
    }
  }
};

// ───────────────────────────── ModelSheetPatient ─────────────────────────────

const PAL = Object.values(PATIENT_PALETTE);
const genericSpec = (i: number, over: Partial<PatientSpec> = {}): PatientSpec => {
  const base = PAL[i % PAL.length];
  return {
    ...printer,
    name: `Shape ${i}`, captionName: `SHAPE ${i}`, size: "M", shape: PATIENT_SHAPES[i % 20], functionMarker: "none",
    palette: { base, shade: shadeOf(base), accent: PAL[(i + 5) % PAL.length] },
    eyes: (["tired_bags", "half_lidded", "bloodshot", "droopy_sad", "slanted_angry"] as PatientEyes[])[i % 5],
    brows: (["flat_heavy", "worried", "angry_v", "raised", "furrowed", "unibrow", "none"] as PatientSpec["brows"][])[i % 7],
    mouth: { type: "rhubarb", driver: "rms", style: MOUTH_STYLES[i % 3] },
    wear: [PATIENT_WEAR[i % PATIENT_WEAR.length]], accessories: [], adultCoding: ["eye_bags"], seed: 2000 + i,
    ...over,
  };
};
function shadeOf(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(v * 0.78).toString(16).padStart(2, "0");
  return `#${f((n >> 16) & 255)}${f((n >> 8) & 255)}${f(n & 255)}`;
}

/** Puppet in a grid cell: bottom-centre at (x, y), scaled to `s`. */
const Cell: React.FC<{ spec: PatientSpec; x: number; y: number; s: number; label: string; over?: Partial<PatientProps>; maxSize?: { w: number; h: number } }> = ({ spec, x, y, s, label, over = {}, maxSize }) => (
  <g>
    <Patient {...patientBase(spec, { x, y, scale: s, maxSize: maxSize ?? (spec.size === "L" ? L : { w: 300, h: 300 }), ...over })} />
    <Label x={x} y={y + 40} size={26}>{label}</Label>
  </g>
);

const ModelSheetPatient: React.FC = () => {
  const page = useCurrentFrame();
  const bg = <rect x={0} y={0} width={1080} height={1920} fill={SET_COLORS.wall} />;
  const grid = (n: number, cols: number, render: (i: number, x: number, y: number) => React.ReactNode, top = 120, rowH = 360) =>
    Array.from({ length: n }, (_, i) => render(i, (1080 / cols) * (i % cols + 0.5), top + rowH * (Math.floor(i / cols) + 1) - 40));
  let content: React.ReactNode = null;
  switch (page) {
    case 0: {
      const variants: [string, Partial<PatientProps>][] = [
        ["X neutral", {}], ["B talk", { mouth: "B" }], ["D rant · angry_v", { mouth: "D", brows: "angry_v" }],
        ["cry · worried", { mouth: "B", brows: "worried", tears: 1 }], ["blink", { blink: 1 }], ["landing squash (clamped)", { sx: landing("heavy", 15, 15).sx, sy: landing("heavy", 15, 15).sy }],
      ];
      content = (
        <g>
          <Label x={540} y={80} size={44}>S01E01 patient · Office Printer (L, generator)</Label>
          {variants.map(([label, over], i) => {
            const x = 270 + (i % 2) * 540, y = 560 + Math.floor(i / 2) * 560;
            return (
              <g key={i}>
                <rect x={x - 165} y={y - 380} width={330} height={380} fill="none" stroke="#8EF0C9" strokeWidth={2} strokeDasharray="8 8" opacity={0.5} />
                <Cell spec={printer} x={x} y={y} s={1} label={label} over={over} />
              </g>
            );
          })}
        </g>
      );
      break;
    }
    case 1:
      content = (
        <g>
          <Label x={540} y={70} size={44}>20 shapes (size M, generic faces)</Label>
          {grid(20, 4, (i, x, y) => <Cell key={i} spec={genericSpec(i)} x={x} y={y} s={0.82} label={`${i + 1} ${PATIENT_SHAPES[i]}`} over={{ mouth: (["X", "B", "D", "C"] as MouthShape[])[i % 4] }} />, 60, 360)}
        </g>
      );
      break;
    case 2:
      content = (
        <g>
          <Label x={540} y={70} size={44}>20 eye pairs (22–30 % of body width)</Label>
          {grid(20, 4, (i, x, y) => (
            <Cell key={i} spec={genericSpec(i % 2 ? 5 : 1, { eyes: PATIENT_EYES[i], brows: "none", palette: { base: PAL[i % PAL.length], shade: shadeOf(PAL[i % PAL.length]), accent: "#E4572E" }, wear: ["dust"] })} x={x} y={y} s={0.82} label={PATIENT_EYES[i]} />
          ), 60, 360)}
        </g>
      );
      break;
    case 3:
      content = (
        <g>
          <Label x={540} y={70} size={44}>Mouths A–H, X × thin / fleshy / teeth</Label>
          {grid(27, 9, (i, x, y) => {
            const shape = MOUTH_SHAPES[i % 9];
            const style = MOUTH_STYLES[Math.floor(i / 9)];
            return (
              <g key={i}>
                <Cell spec={genericSpec(1, { shape: "rect_horizontal", eyes: "half_lidded", brows: "none", mouth: { type: "rhubarb", style }, wear: ["dust"], size: "S", palette: { base: "#E9E4D8", shade: "#BDB6A6", accent: "#E4572E" } })} x={x} y={y} s={0.7} label={shape} over={{ mouth: shape }} maxSize={{ w: 160, h: 160 }} />
                {i % 9 === 0 ? <Label x={20} y={y - 60} size={24} anchor="start">{style}</Label> : null}
              </g>
            );
          }, 200, 330)}
          <Label x={540} y={1320} size={34}>slot mouth (printer, RMS X / B / D)</Label>
          {(["X", "B", "D"] as MouthShape[]).map((m, i) => <Cell key={m} spec={printer} x={200 + i * 340} y={1760} s={0.75} label={m} over={{ mouth: m }} />)}
        </g>
      );
      break;
    case 4: {
      content = (
        <g>
          <Label x={540} y={70} size={44}>Wear (11) · accessories (7) · markers</Label>
          {grid(11, 4, (i, x, y) => (
            <Cell key={i} spec={genericSpec(1, { shape: "rect_vertical", wear: [PATIENT_WEAR[i]], eyes: "half_lidded", palette: { base: "#C0C4C8", shade: "#9a9ea2", accent: "#E4572E" } })} x={x} y={y} s={0.62} label={PATIENT_WEAR[i]} />
          ), 40, 300)}
          {/* accessory placement search: two flat accessories on a round body avoid eyes, mouth and each other */}
          <Cell spec={genericSpec(5, { shape: "sphere", accessories: ["display:1%", "urgent_sticky"], wear: ["dust"], eyes: "tired_bags", mouth: { type: "rhubarb", driver: "rms", style: "thin" } })} x={945} y={1000} s={0.62} label="display + urgent" />
          {PATIENT_ACCESSORY_KINDS.map((a, i) => {
            const x = (1080 / 4) * ((i % 4) + 0.5), y = 1360 + 250 * Math.floor(i / 4);
            const acc = a === "display" ? "display:ERR 49" : a;
            return <Cell key={a} spec={genericSpec(3, { shape: "rect_horizontal", accessories: [acc as PatientSpec["accessories"][number]], wear: ["scratches"], eyes: "tired_bags", palette: { base: "#E9E4D8", shade: "#BDB6A6", accent: "#E4572E" } })} x={x} y={y} s={0.72} label={a} />;
          })}
          {(["toaster_slots", "cracked_screen_badge", "calendar_mon"] as const).map((mk, i) => (
            <Cell key={mk} spec={genericSpec(i, { functionMarker: mk, shape: mk === "cracked_screen_badge" ? "rounded_slab" : mk === "calendar_mon" ? "sheet" : "rect_horizontal", palette: { base: mk === "toaster_slots" ? "#C0C4C8" : mk === "calendar_mon" ? "#F4F1EA" : "#5C6B73", shade: "#8a8e92", accent: "#D94A64" }, wear: ["scratches"], eyes: "half_lidded" })} x={200 + i * 340} y={1850} s={0.5} label={mk} />
          ))}
        </g>
      );
      break;
    }
    default: {
      // R1 icon test: black silhouette at 160 px height next to the colour puppet at 160 px, and phone-size WIDE
      const m = makePatient(printer, L);
      const k = 160 / (m.h + 12);
      content = (
        <g>
          <rect x={0} y={0} width={1080} height={1920} fill="#f2efe8" />
          <text x={540} y={90} textAnchor="middle" fontFamily={FONTS.crt} fontSize={44} fill={INK}>R1 icon test · 160 px</text>
          <g transform={`translate(300 ${360}) scale(${k})`}>
            <PatientPuppet m={m} mouth="X" eyes={printer.eyes} brows={printer.brows} blink={0} tears={0} silhouette="#000" uid="icon-a" />
          </g>
          <g transform={`translate(780 ${360}) scale(${k})`}>
            <PatientPuppet m={m} mouth="X" eyes={printer.eyes} brows={printer.brows} blink={0} tears={0} uid="icon-b" />
          </g>
          <text x={540} y={460} textAnchor="middle" fontFamily={FONTS.crt} fontSize={30} fill={INK}>
            eyes {(m.eyes.ratio * 100).toFixed(1)} % of body width · L* Δ couch {m.contrast.couch.toFixed(0)} / wall {m.contrast.wall.toFixed(0)} ({m.contrast.ok ? "R3 ok" : "R3 FAIL"})
          </text>
          <g transform="translate(540 520) scale(0.62) translate(-540 0)">
            <svg x={0} y={0} width={1080} height={1920} viewBox="0 0 1080 1920">
              <Wide patient={patientBase(printer, { y: 230 + L.h, motionLines: true })} caption="PATIENT #001: OFFICE PRINTER" />
            </svg>
          </g>
        </g>
      );
    }
  }
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: "block" }}>
        {bg}
        {content}
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────────── ModelSheetProps ─────────────────────────────

const ModelSheetProps: React.FC = () => {
  const page = useCurrentFrame();
  let content: React.ReactNode;
  if (page === 0) {
    content = (
      <g>
        <Label x={540} y={70} size={44}>Bubbles · caption</Label>
        <Bubble kind="memory" box={[140, 130, 640, 490]} tail={[420, 640]} inflate={1} dots={[1, 1, 1]} vignette="office_yell" moving={["human_arm"]} t={10} />
        <Bubble kind="thought" box={[680, 150, 1040, 400]} tail={[900, 560]} inflate={1} dots={[1, 1, 0.6]} t={0} />
        <Bubble kind="speech" box={[120, 700, 600, 980]} tail={[300, 1120]} inflate={1} dots={[1, 1, 1]} t={30} grawlix={grawlix(40, 0, "#$%&!", 7)} />
        <Bubble kind="speech" box={[660, 720, 1000, 960]} tail={[760, 1120]} inflate={1} dots={[1, 1, 1]} t={0} text="NO." />
        <Bubble kind="memory" box={[140, 1180, 640, 1540]} tail={[400, 1700]} inflate={1} dots={[1, 1, 1]} vignette="paper_jam_yank" moving={["paper"]} t={6} />
        <Bubble kind="memory" box={[660, 1180, 1060, 1480]} tail={[860, 1640]} inflate={0.7} dots={[1, 0.8, 0.3]} vignette="office_kick" moving={[]} t={0} />
        <Caption text="PATIENT #001: OFFICE PRINTER" scale={1} opacity={1} />
        <g transform="translate(0 520)">
          <Caption text="PATIENT #014: PLUTO" scale={1} opacity={1} />
        </g>
      </g>
    );
  } else if (page === 1) {
    content = (
      <g>
        <Label x={540} y={70} size={44}>The Humans · 8 poses · accessories</Label>
        {HUMAN_POSES.map((pose, i) => {
          const x = 270 * ((i % 4) + 0.5), y = 520 + 460 * Math.floor(i / 4);
          const mv = HUMAN_MOVES[pose].range;
          return (
            <g key={pose}>
              <Human pose={pose} x={x} y={y} scale={0.95} moveAngle={(mv[0] + mv[1]) / 2} accessory={HUMAN_ACCESSORIES[i % 4]} />
              <Label x={x} y={y + 50} size={28}>{pose}</Label>
              <Label x={x} y={y + 80} size={22} color="#b9ad97">{HUMAN_ACCESSORIES[i % 4]}</Label>
            </g>
          );
        })}
        {[0, 19, 38].map((a, i) => (
          <g key={a}>
            <Human pose="type" x={240 + i * 300} y={1700} scale={0.9} moveAngle={a} />
            <Label x={240 + i * 300} y={1760} size={24}>type · head-bang {a}°</Label>
          </g>
        ))}
      </g>
    );
  } else {
    const types = ["paper", "confetti", "feathers", "coins", "sparks", "smoke", "dust"] as const;
    content = (
      <g>
        <Label x={540} y={70} size={44}>Props · particles</Label>
        {(["paper_strip", "paper_jam", "paper_sheet", "paper_ball"] as const).map((id, i) => (
          <g key={id}>
            <PropItem id={id} x={140 + i * 260} y={id === "paper_strip" ? 160 : 300} scale={1} rotate={0} opacity={1} t={30} motionLines={id === "paper_ball"} />
            <Label x={140 + i * 260} y={460} size={26}>{id}</Label>
          </g>
        ))}
        {types.map((type, i) => {
          const x = 155 + (i % 4) * 255, y = 760 + Math.floor(i / 4) * 560;
          return (
            <g key={type}>
              <Particles type={type} particles={particlesAt(24, { from: 0, to: 120, type, origin: [x, y], count: 24 }, 3)} />
              <Label x={x} y={y + 300} size={26}>{type}</Label>
            </g>
          );
        })}
      </g>
    );
  }
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: "block" }}>
        <rect x={0} y={0} width={1080} height={1920} fill={SET_COLORS.wall} />
        {content}
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────────── PatientIcon (R1, qa/icon.png) ─────────────────────────────

type IconProps = { episodeId: string; actor?: string; spec: PatientSpec | null };

const PatientIcon: React.FC<IconProps> = ({ spec }) => {
  const s = spec ?? printer;
  const m = makePatient(s, L);
  const k = 160 / (m.h + 12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <svg viewBox="0 0 160 160" width="100%" height="100%" style={{ display: "block" }}>
        <g transform={`translate(80 ${160 - 6 * k}) scale(${k})`}>
          <PatientPuppet m={m} mouth="X" eyes={s.eyes} brows={s.brows} blink={0} tears={0} silhouette="#000000" uid="icon" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const SetCompositions: React.FC = () => (
  <Folder name="set">
    <Composition id="ModelSheetSet" component={ModelSheetSet} width={1080} height={1920} fps={30} durationInFrames={9} />
    <Composition id="ModelSheetPatient" component={ModelSheetPatient} width={1080} height={1920} fps={30} durationInFrames={6} />
    <Composition id="ModelSheetProps" component={ModelSheetProps} width={1080} height={1920} fps={30} durationInFrames={3} />
    <Composition
      id="PatientIcon"
      component={PatientIcon}
      width={160}
      height={160}
      fps={30}
      durationInFrames={1}
      defaultProps={{ episodeId: "S01E01", actor: "patient", spec: null } as IconProps}
      calculateMetadata={async ({ props }) => {
        const ep = await fetch(staticFile(`episodes/${props.episodeId}/episode.json`)).then((r) => r.json());
        const actor = (ep.actors as { id: string; ref: string }[]).find((a) => a.id === (props.actor ?? "patient"));
        const ref = actor?.ref ?? "patient.json";
        const spec = (await fetch(staticFile(ref.startsWith("assets/") ? ref : `episodes/${props.episodeId}/${ref}`)).then((r) => r.json())) as PatientSpec;
        return { props: { ...props, spec } };
      }}
    />
  </Folder>
);
