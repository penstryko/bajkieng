// Owned by the CAST builder. Model sheets for the recurring cast (bible §3). Root.tsx never changes.
// Model sheets may read the frame at THIS level to pick a sheet / expression; the components stay pure.
//   CastSheets      — 8 one-frame QA sheets (frame = sheet index, see SHEETS below)
//   ModelSheetCast  — 12 frames: frame i = DOCTOR_EXPRESSIONS[i] + CHESTER_EXPRESSIONS[i % 10] in place
import React from "react";
import { AbsoluteFill, Composition, Folder, useCurrentFrame } from "remotion";
import { Doctor, DOCTOR_MOUTH_ART_KEYS, type DoctorMouthArt } from "../components/cast/Doctor";
import { Chester } from "../components/cast/Chester";
import { Chirp } from "../components/cast/Chirp";
import { GlassesFrame } from "../components/cast/Glasses";
import {
  BROWS, CHESTER_EXPRESSIONS, CHIRP_LEDS, DOCTOR_EXPRESSIONS, LENS_ICONS,
  type ChesterExpression, type ChirpLed, type DoctorExpression, type DoctorMouth,
} from "../enums";
import { CAMERA_PRESETS, DOCTOR_COLORS, FONTS, SET_COLORS } from "../engine";
import type { ChesterProps, ChirpProps, DoctorProps } from "../contract";
import type { PatientSpec } from "../schema";
import patientJson from "../../episodes/S01E01/patient.json";

const PATIENT = patientJson as unknown as PatientSpec;
const INK = "#161616";
const PAPER = "#F2ECDD";
const BG = "#2E2822";
const CELL_BG = SET_COLORS.wall;

type NoLayer<T> = Omit<T, "layer">;

// ───────────────────────────── base props (= state0 pose) ─────────────────────────────
export const DOCTOR_S0: NoLayer<DoctorProps> = {
  brows: "neutral", mouth: "flat", lens: "patient_file_icon", lensNoise: 0, noiseSeed: 0, glassesY: 0, glassesJump: 0,
  headTilt: 0, lean: 1, pen: "raised", penPhase: 0, blink: 0, bob: 0, breath: 0, placement: "chair", placementT: 1, extras: [],
  patient: PATIENT, patientNo: 1,
};
export const CHESTER_S0: NoLayer<ChesterProps> = {
  eyes: "wide_up", mouth: "tight", mouthOpen: 0, sag: 0.02, blink: 0, pupil: [0, 0], eyeShake: [0, 0], spring: 0, springWobble: 0, breath: 0,
};
export const CHIRP_S0: ChirpProps = { led: "off", ledLevel: 0, tilt: 0, jitter: [0, 0] };

/** Expand a §3.1 expression preset onto the base pose. */
export const doctorExpr = (k: DoctorExpression, extra: Partial<NoLayer<DoctorProps>> = {}): NoLayer<DoctorProps> => {
  const e = DOCTOR_EXPRESSIONS[k] as Partial<NoLayer<DoctorProps>> & { glassesY?: number };
  return { ...DOCTOR_S0, ...e, extras: [...(e.extras ?? [])], ...extra } as NoLayer<DoctorProps>;
};
/** Expand a §3.2 expression preset onto the neutral couch. */
export const chesterExpr = (k: ChesterExpression, extra: Partial<NoLayer<ChesterProps>> = {}): NoLayer<ChesterProps> => {
  const e = CHESTER_EXPRESSIONS[k] as { eyes?: ChesterProps["eyes"]; mouth?: ChesterProps["mouth"]; sag?: number; spring?: boolean; breath?: boolean };
  return {
    ...CHESTER_S0, eyes: "half", mouth: "flat", sag: 0,
    ...(e.eyes ? { eyes: e.eyes } : {}), ...(e.mouth ? { mouth: e.mouth } : {}), ...(e.sag !== undefined ? { sag: e.sag } : {}),
    spring: e.spring ? 1 : 0, springWobble: e.spring ? -8 : 0,
    eyeShake: e.eyes === "wide_shake" ? [2.5, -2] : [0, 0],
    ...extra,
  };
};
/** Chirp props for an LED mode at a representative moment (static, for sheets). */
const chirpState = (led: ChirpLed): ChirpProps => {
  switch (led) {
    case "chirp": return { led, ledLevel: 1, tilt: 10, jitter: [1.5, -1] };
    case "plead": return { led, ledLevel: 0.6, tilt: 0, jitter: [0, 0] };
    case "alarm": return { led, ledLevel: 1, tilt: 0, jitter: [4, -3] };
    case "faint": return { led, ledLevel: 0.25, tilt: 0, jitter: [0, 0] };
    default: return CHIRP_S0;
  }
};

// ───────────────────────────── sheet helpers ─────────────────────────────
const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; anchor?: "start" | "middle" }> = ({
  x, y, text, size = 30, color = PAPER, anchor = "middle",
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONTS.caption} fontSize={size} fill={color} letterSpacing={0.5}>
    {text}
  </text>
);

/** A framed cell that shows the scene rect `view` (scene px) scaled into (x, y, w, h). */
const Cell: React.FC<{
  x: number; y: number; w: number; h: number; view: [number, number, number, number]; label?: string; bg?: string; labelColor?: string; children: React.ReactNode;
}> = ({ x, y, w, h, view, label, bg = CELL_BG, labelColor = PAPER, children }) => {
  const lh = label ? 40 : 0;
  return (
    <g>
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={10} fill={bg} stroke="#1A1612" strokeWidth={4} />
      <svg x={x + 8} y={y + 8} width={w - 16} height={h - 16 - lh} viewBox={view.join(" ")} preserveAspectRatio="xMidYMid meet" overflow="hidden">
        {children}
      </svg>
      {label ? <Label x={x + w / 2} y={y + h - 16} text={label} size={26} color={labelColor} /> : null}
    </g>
  );
};

const Header: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <g>
    <Label x={40} y={78} text={title} size={58} anchor="start" />
    {sub ? (
      <text x={42} y={118} fontFamily={FONTS.crt} fontSize={30} fill={DOCTOR_COLORS.phosphor}>
        {sub}
      </text>
    ) : null}
  </g>
);

const Sheet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <defs>
        <filter id="cast-sheet-sil" x="0" y="0" width="100%" height="100%">
          <feFlood floodColor="#000" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Plain backdrop (wall + carpet) so the sheets read like the set without depending on it. */
const Backdrop: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1310} fill={SET_COLORS.wall} />
    <rect x={0} y={0} width={1080} height={200} fill={SET_COLORS.ceiling} />
    <rect x={0} y={1310} width={1080} height={610} fill={SET_COLORS.carpet} />
    <rect x={610} y={820} width={310} height={460} rx={40} fill={DOCTOR_COLORS.chair} />
  </g>
);

const DoctorFull: React.FC<{ d: NoLayer<DoctorProps> }> = ({ d }) => (
  <g>
    <Doctor layer="body" {...d} />
    <Doctor layer="hands" {...d} />
  </g>
);

const CastScene: React.FC<{ d: NoLayer<DoctorProps>; c: NoLayer<ChesterProps>; ch: ChirpProps; backdrop?: boolean }> = ({ d, c, ch, backdrop = true }) => {
  const inCouch = d.placement === "sunk_in_couch";
  return (
    <g>
      {backdrop ? <Backdrop /> : null}
      <Chirp {...ch} />
      {inCouch ? null : <Doctor layer="body" {...d} />}
      <Chester layer="back" {...c} />
      {inCouch ? <Doctor layer="body" {...d} /> : null}
      <Chester layer="front" {...c} />
      <Doctor layer="hands" {...d} />
    </g>
  );
};

// ───────────────────────────── sheets ─────────────────────────────
const HEAD_VIEW: [number, number, number, number] = [598, 470, 324, 540];

const SheetLineup: React.FC = () => (
  <Sheet>
    <svg x={0} y={0} width={1080} height={1920} viewBox="0 0 1080 1920">
      <CastScene d={DOCTOR_S0} c={CHESTER_S0} ch={CHIRP_S0} />
    </svg>
    <rect x={0} y={1420} width={1080} height={500} fill="#000" opacity={0.35} />
    <Label x={40} y={1500} text={`CAST LINE-UP · STATE 0 (FRAME 0 POSE)`} size={48} anchor="start" />
    <text x={42} y={1550} fontFamily={FONTS.crt} fontSize={32} fill={DOCTOR_COLORS.phosphor}>
      {`doctor: neutral, pen raised, lens = patient file #001`}
    </text>
    <text x={42} y={1590} fontFamily={FONTS.crt} fontSize={32} fill={DOCTOR_COLORS.phosphor}>
      {`chester: brace (wide_up / tight / sag 0.02)`}
    </text>
    <text x={42} y={1630} fontFamily={FONTS.crt} fontSize={32} fill={DOCTOR_COLORS.phosphor}>
      {`chirp: LED off`}
    </text>
    <text x={42} y={1690} fontFamily={FONTS.crt} fontSize={26} fill={PAPER} opacity={0.7}>
      (placeholder wall/chair; the real set is drawn by the set builder)
    </text>
  </Sheet>
);

const SheetDoctorExpressions: React.FC = () => {
  const keys = Object.keys(DOCTOR_EXPRESSIONS) as DoctorExpression[];
  const cw = 360;
  const chh = 445;
  return (
    <Sheet>
      <Header title="DOCTOR · EXPRESSIONS (§3.1)" sub="brows / mouth / glasses slide / lens / extras" />
      {keys.map((k, i) => (
        <Cell key={k} x={(i % 3) * cw} y={140 + Math.floor(i / 3) * chh} w={cw} h={chh} view={[590, 440, 340, 570]} label={k}>
          <DoctorFull d={doctorExpr(k, k === "distracted" ? { lens: "pizza" } : {})} />
        </Cell>
      ))}
    </Sheet>
  );
};

/** Hum mouths are drawn by Doctor.tsx but not yet in DOCTOR_MOUTHS (contract request) — preview-only cast. */
const hum = (m: DoctorMouthArt): DoctorMouth => m as DoctorMouth;

const SheetDoctorParts: React.FC = () => {
  const mouths = DOCTOR_MOUTH_ART_KEYS;
  const mw = 1080 / 7;
  return (
    <Sheet>
      <Header title="DOCTOR · MOUTHS, BROWS, GLASSES" sub="hum / hum_up = closed-mouth 'Mm-hm' (needs enum)" />
      {mouths.map((m, i) => (
        <Cell key={m} x={(i % 7) * mw} y={140 + Math.floor(i / 7) * 200} w={mw} h={200} view={[700, 790, 140, 90]} label={m}>
          <Doctor layer="body" {...DOCTOR_S0} mouth={hum(m)} />
        </Cell>
      ))}
      {BROWS.map((b, i) => (
        <Cell key={b} x={(i % 5) * 216} y={545 + Math.floor(i / 5) * 210} w={216} h={210} view={[650, 630, 220, 110]} label={b}>
          <Doctor layer="body" {...DOCTOR_S0} brows={b} />
        </Cell>
      ))}
      {(
        [
          ["slide 0", { glassesY: 0 }],
          ["slide 20", { glassesY: 20, brows: "skeptic" }],
          ["slide 40", { glassesY: 40, brows: "v", mouth: "tight" }],
          ["slide 40 blink", { glassesY: 40, blink: 1 }],
          ["jump 12", { glassesJump: 12, brows: "high", mouth: "O" }],
        ] as [string, Partial<NoLayer<DoctorProps>>][]
      ).map(([lab, e], i) => (
        <Cell key={lab} x={i * 216} y={975} w={216} h={330} view={[630, 600, 260, 280]} label={lab}>
          <Doctor layer="body" {...DOCTOR_S0} {...e} />
        </Cell>
      ))}
      {(
        [
          ["Mm- (hum)", { mouth: hum("hum") }],
          ["-hm (hum_up)", { mouth: hum("hum_up") }],
          ["verdict 1", { glassesY: 40, brows: "one_up", mouth: hum("hum"), pen: "click", penPhase: 0.5 }],
          ["verdict 2", { glassesY: 40, brows: "one_up", mouth: hum("hum_up"), pen: "click", penPhase: 0 }],
        ] as [string, Partial<NoLayer<DoctorProps>>][]
      ).map(([lab, e], i) => (
        <Cell key={lab} x={i * 270} y={1305} w={270} h={600} view={[600, 470, 320, 760]} label={lab}>
          <DoctorFull d={{ ...DOCTOR_S0, ...e } as NoLayer<DoctorProps>} />
        </Cell>
      ))}
    </Sheet>
  );
};

const SheetDoctorPoses: React.FC = () => {
  const cam = CAMERA_PRESETS.GLASSES as { scale: number; focal: [number, number]; screen: [number, number] };
  const vw = 1080 / cam.scale;
  const vh = 1920 / cam.scale;
  const glassesView: [number, number, number, number] = [cam.focal[0] - cam.screen[0] / cam.scale, cam.focal[1] - cam.screen[1] / cam.scale, vw, vh];
  return (
    <Sheet>
      <Header title="DOCTOR · PEN, EXTRAS, PLACEMENT" sub="GLASSES camera preview = same puppet at 3.2x" />
      {(
        [
          ["pen raised (S0)", { pen: "raised" }],
          ["pen writing", { pen: "writing", penPhase: 0.3 }],
          ["pen click", { pen: "click", penPhase: 0.5 }],
        ] as [string, Partial<NoLayer<DoctorProps>>][]
      ).map(([lab, e], i) => (
        <Cell key={lab} x={i * 360} y={140} w={360} h={400} view={[610, 850, 300, 380]} label={lab}>
          <DoctorFull d={{ ...DOCTOR_S0, ...e } as NoLayer<DoctorProps>} />
        </Cell>
      ))}
      {(
        [
          ["sweat", doctorExpr("terrified")],
          ["steam", doctorExpr("furious")],
          ["sigh", doctorExpr("disappointed")],
        ] as [string, NoLayer<DoctorProps>][]
      ).map(([lab, d], i) => (
        <Cell key={lab} x={i * 360} y={540} w={360} h={400} view={[600, 450, 320, 450]} label={lab}>
          <Doctor layer="body" {...d} />
        </Cell>
      ))}
      <Cell x={0} y={940} w={540} h={970} view={glassesView} label="GLASSES cam (3.2x): S0 lens">
        <Backdrop />
        <DoctorFull d={DOCTOR_S0} />
      </Cell>
      {(
        [
          ["sunk_in_couch", { placement: "sunk_in_couch", placementT: 1, brows: "low_flat", mouth: "flat_down", lens: "zzz" }],
          ["drop_out t=0.5", { placement: "drop_out", placementT: 0.5, brows: "high", mouth: "O", lens: "siren" }],
          ["drop_out t=1", { placement: "drop_out", placementT: 1 }],
        ] as [string, Partial<NoLayer<DoctorProps>>][]
      ).map(([lab, e], i) => (
        <Cell key={lab} x={540} y={940 + i * 323} w={540} h={323} view={[0, 440, 1080, 1000]} label={lab}>
          <CastScene d={{ ...DOCTOR_S0, ...e } as NoLayer<DoctorProps>} c={chesterExpr(i === 0 ? "pain" : "alert")} ch={CHIRP_S0} />
        </Cell>
      ))}
    </Sheet>
  );
};

const SheetLenses: React.FC = () => {
  const lenses = [...LENS_ICONS];
  const cols = 3;
  const cw = 360;
  const chh = 222;
  return (
    <Sheet>
      <Header title={`LENS ICONS (${lenses.length}) · CRT GLASSES`} sub="green phosphor; amber = alarm (siren, flame, error)" />
      {lenses.map((l, i) => (
        <Cell key={l} x={(i % cols) * cw} y={140 + Math.floor(i / cols) * chh} w={cw} h={chh} view={[628, 682, 264, 112]} label={l} bg="#3A332B">
          <GlassesFrame cx={760} cy={738} slideY={0} lens={l} lensNoise={0} noiseSeed={0} patient={PATIENT} patientNo={1} />
        </Cell>
      ))}
      <Cell x={2 * cw} y={140 + 7 * chh} w={cw} h={chh} view={[628, 682, 264, 112]} label="lensSwap noise f+1" bg="#3A332B">
        <GlassesFrame cx={760} cy={738} slideY={0} lens="burger" lensNoise={1} noiseSeed={151} />
      </Cell>
    </Sheet>
  );
};

const SheetChesterFaces: React.FC = () => {
  const keys = Object.keys(CHESTER_EXPRESSIONS) as ChesterExpression[];
  return (
    <Sheet>
      <Header title="CHESTER · EXPRESSIONS (§3.2)" sub="leather-lid tufts open into eyes; mouth = leather fold" />
      {keys.map((k, i) => (
        <Cell key={k} x={(i % 2) * 540} y={140 + Math.floor(i / 2) * 356} w={540} h={356} view={[30, 836, 330, 230]} label={k}>
          <Chester layer="back" {...chesterExpr(k)} />
          <Chester layer="front" {...chesterExpr(k)} />
        </Cell>
      ))}
    </Sheet>
  );
};

const SheetChesterBody: React.FC = () => (
  <Sheet>
    <Header title="CHESTER · BODY, GULP, SPRING, SAG" sub="couchSag scales back+seat about the floor (y 1380)" />
    {(
      [
        ["S0 brace: wide_up / tight / sag 0.02", CHESTER_S0],
        ["pain: squint / wavy / sag 0.04", chesterExpr("pain")],
        ["gulp: mouthOpen 1.0", chesterExpr("alert", { eyes: "squint", mouthOpen: 1 })],
        ["panic: spring out + stuffing", chesterExpr("panic")],
      ] as [string, NoLayer<ChesterProps>][]
    ).map(([lab, c], i) => (
      <Cell key={lab} x={0} y={140 + i * 445} w={1080} h={445} view={[20, 820, 640, 590]} label={lab}>
        <rect x={0} y={0} width={1080} height={1310} fill={SET_COLORS.wall} />
        <rect x={0} y={1310} width={1080} height={200} fill={SET_COLORS.carpet} />
        <Chester layer="back" {...c} />
        <Chester layer="front" {...c} />
      </Cell>
    ))}
  </Sheet>
);

const SheetChirpAndSilhouettes: React.FC = () => (
  <Sheet>
    <Header title="CHIRP · LED STATES (§3.3) + SILHOUETTES" sub="off / chirp (3 fr flash, 10 deg) / plead / alarm / faint" />
    {CHIRP_LEDS.map((l, i) => (
      <Cell key={l} x={(i % 3) * 360} y={140 + Math.floor(i / 3) * 330} w={360} h={330} view={[80, 220, 200, 150]} label={l} bg={SET_COLORS.ceiling}>
        <Chirp {...chirpState(l)} />
      </Cell>
    ))}
    <Cell x={720} y={470} w={360} h={330} view={[0, 180, 400, 300]} label="in context (wide)" bg={SET_COLORS.ceiling}>
      <Backdrop />
      <Chirp {...chirpState("chirp")} />
    </Cell>
    <Label x={40} y={870} text="SILHOUETTE TEST (black fill)" size={44} anchor="start" />
    <Cell x={0} y={890} w={1080} h={1010} view={[0, 230, 1080, 1180]} label="chester · chirp · doctor (each must read as a pure black shape)" bg="#D8D2C4" labelColor={INK}>
      <g filter="url(#cast-sheet-sil)">
        <g transform="translate(0 -20)">
          <Chester layer="back" {...CHESTER_S0} />
          <Chester layer="front" {...CHESTER_S0} />
        </g>
        <g transform="translate(120 0)">
          <DoctorFull d={{ ...DOCTOR_S0, pen: "click", penPhase: 0 }} />
        </g>
        <g transform="translate(330 560) scale(1.6) translate(-170 -300)">
          <Chirp {...CHIRP_S0} />
        </g>
      </g>
    </Cell>
  </Sheet>
);

export const CAST_SHEETS = [
  { id: "lineup", C: SheetLineup },
  { id: "doctor_expressions", C: SheetDoctorExpressions },
  { id: "doctor_parts", C: SheetDoctorParts },
  { id: "doctor_poses", C: SheetDoctorPoses },
  { id: "lenses", C: SheetLenses },
  { id: "chester_faces", C: SheetChesterFaces },
  { id: "chester_body", C: SheetChesterBody },
  { id: "chirp_silhouettes", C: SheetChirpAndSilhouettes },
] as const;

const CastSheets: React.FC = () => {
  const frame = useCurrentFrame();
  const S = CAST_SHEETS[Math.min(frame, CAST_SHEETS.length - 1)].C;
  return <S />;
};

/** One frame per expression, full cast in place: frame i shows DOCTOR_EXPRESSIONS[i] and CHESTER_EXPRESSIONS[i % 10]. */
const ModelSheetCast: React.FC = () => {
  const frame = useCurrentFrame();
  const dKeys = Object.keys(DOCTOR_EXPRESSIONS) as DoctorExpression[];
  const cKeys = Object.keys(CHESTER_EXPRESSIONS) as ChesterExpression[];
  const dk = dKeys[frame % dKeys.length];
  const ck = cKeys[frame % cKeys.length];
  const leds = CHIRP_LEDS;
  return (
    <Sheet>
      <CastScene d={doctorExpr(dk, dk === "distracted" ? { lens: "kitten" } : {})} c={chesterExpr(ck)} ch={chirpState(leds[frame % leds.length])} />
      <rect x={0} y={1440} width={1080} height={120} fill="#000" opacity={0.4} />
      <Label x={540} y={1520} text={`doctor: ${dk} · chester: ${ck}`} size={56} />
    </Sheet>
  );
};

export const CastCompositions: React.FC = () => (
  <Folder name="cast">
    <Composition id="ModelSheetCast" component={ModelSheetCast} width={1080} height={1920} fps={30} durationInFrames={12} />
    <Composition id="CastSheets" component={CastSheets} width={1080} height={1920} fps={30} durationInFrames={CAST_SHEETS.length} />
  </Folder>
);
