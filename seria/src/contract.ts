// FINAL component prop interfaces (CONTRACT.md §4). Builders implement these exactly; the
// integrator (src/Episode.tsx) only ever passes these props. Changing an interface = coordinator
// decision, never a unilateral edit.
//
// Rules for every visual component:
//  • Returns SVG content (<g>…</g>) in SCENE coordinates (viewBox 0 0 1080 1920, see engine/layout.ts).
//    The integrator wraps all layers in ONE root <svg> and applies the camera transform.
//  • Pure function of props: NEVER call useCurrentFrame()/useVideoConfig() inside components;
//    time-varying values arrive as props (computed by engine primitives in Episode.tsx).
//    This is what makes the 21 S0 seam frames pixel-identical.
//  • No Math.random / Date.now / CSS animations or transitions. Randomness = remotion random(seed)
//    with a seed from props.
//  • Draw only inside your own layer; do not paint full-frame backgrounds outside the Set.
import type { ReactNode } from "react";
import type {
  Brows, ChesterEyes, ChesterMouth, ChirpLed, DoctorExtra, DoctorMouth, DoctorPen, DoctorPlacement,
  HumanAccessory, HumanPose, LensIcon, MouthShape, ParticleType, PatientBrows, PatientEyes,
} from "./enums";
import type { PatientSpec, Rect, XY } from "./schema";
import type { GrawlixChar, IdleOffset, ParticleState } from "./engine/primitives";

// ───────────────────────────── Doctor (cast builder) ─────────────────────────────
/** "body" = z4–5 torso, head, perm, glasses, brows, mouth, badge. "hands" = z11 clipboard, hands, pen. */
export type DoctorLayer = "body" | "hands";

export interface DoctorProps {
  layer: DoctorLayer;
  brows: Brows;
  mouth: DoctorMouth;
  lens: LensIcon;
  /** 0..1 static over the lenses (lensSwap). 0 in S0. */
  lensNoise: number;
  /** seed for the static pattern (frame number while noise > 0, else 0) */
  noiseSeed: number;
  /** 0..40 px glasses slide down (continuous during tweens); > 0 reveals tiny dot eyes */
  glassesY: number;
  /** one-off upward jump of the glasses in px (terrified: 12), 0 normally */
  glassesJump: number;
  /** degrees −6..6, pivot POS.doctor.neckPivot (760, 860) */
  headTilt: number;
  /** uniform lean scale about the neck pivot: 1 rest, 1.03 interested */
  lean: number;
  pen: DoctorPen;
  /** 0..1 phase inside "writing" scribble / "click" press; 0 in S0 */
  penPhase: number;
  /** 0 open … 1 closed (dot eyes, visible only when glassesY > 0) */
  blink: number;
  /** px vertical idle bob of head+torso (already enveloped; 0 in S0) */
  bob: number;
  /** chest scale delta ±0.01 (0 in S0) */
  breath: number;
  placement: DoctorPlacement;
  /** 0..1 progress of the move into `placement` (drop_out fall, sunk_in_couch settle); 1 = settled. Ignored for "chair". */
  placementT: number;
  extras: DoctorExtra[];
  /** patient shown on the "patient_file_icon" lens (monochrome #8EF0C9 silhouette) */
  patient?: PatientSpec;
  patientNo?: number;
}

// ───────────────────────────── Glasses (cast builder) ─────────────────────────────
/** Used by Doctor (body layer) and by model sheets. GLASSES camera = same component at scale 3.2. */
export interface GlassesProps {
  /** bridge centre in scene px (rest: 760, 738) */
  cx: number;
  cy: number;
  /** additional downward slide 0..40 px */
  slideY: number;
  lens: LensIcon;
  lensNoise: number;
  noiseSeed: number;
  patient?: PatientSpec;
  patientNo?: number;
  /** 0..1 phosphor glow (default 1) */
  glow?: number;
}

// ───────────────────────────── Chester (cast builder) ─────────────────────────────
/** "back" = z6 backrest + face. "front" = z9 seat front edge, valance, armrest, tape patch, spring. */
export type ChesterLayer = "back" | "front";

export interface ChesterProps {
  layer: ChesterLayer;
  eyes: ChesterEyes;
  mouth: ChesterMouth;
  /** 0..1: mouth fold opens into a dark hole up to 90 px (gulp, swallow, snore). 0 in S0 */
  mouthOpen: number;
  /** 0..0.05 couchSag: scaleY of back+seat about the floor line y = 1380 (engine couchSagTransform) */
  sag: number;
  /** 0..1 lid closure on top of `eyes` (blink) */
  blink: number;
  /** extra pupil offset px (look-at); [0,0] = default for `eyes` */
  pupil: XY;
  /** px pupil tremble ("wide_shake", panic); [0,0] in S0 */
  eyeShake: XY;
  /** springPoke: 0 hidden … 1 fully out; with wobble angle in degrees */
  spring: number;
  springWobble: number;
  /** scaleY delta ±0.01 (sleepy breathing); 0 in S0 */
  breath: number;
}

// ───────────────────────────── Chirp (cast builder) ─────────────────────────────
export interface ChirpProps {
  led: ChirpLed;
  /** 0..1 LED brightness (engine chirpAt); 0 in S0 */
  ledLevel: number;
  /** degrees (chirp pose: 10) */
  tilt: number;
  /** px tremble (±2 chirp, ±6 alarm) */
  jitter: XY;
}

// ───────────────────────────── Set (set builder) ─────────────────────────────
export type SetLayer = "background" | "window" | "decor" | "chair" | "table" | "vignette";

export interface TimerProps {
  /** 1 = fully wound (S0) … 0 = rang */
  dial: number;
  /** dial angle in degrees (engine dialAt: −dial × 330) */
  angle: number;
  visible: boolean;
  /** 0..1 DING wobble */
  ringing: number;
  /** px rattle (wind-up) */
  jitter: XY;
}

export interface SetProps {
  /** which z-layer to draw: background z0, window z1, decor z2 (diploma + plant), chair z3, table z10 (table + timer), vignette z15 (screen space) */
  layer: SetLayer;
  /** window outside-layer id: "calm" (S0) or a registry id exported by Set.tsx (WINDOW_LAYER_IDS) */
  windowLayer: string;
  /** frames since the current windowLayer started (for loops inside the window); 0 in S0 */
  windowT: number;
  /** extra scene-px content drawn INSIDE the window clip, above the outside layer, below blinds/frame (e.g. a patient exiting with z = 1) */
  windowSlot?: ReactNode;
  /** rival neon (Nod-O-Matic 99¢) in its steady ON phase in S0 */
  neonOn: boolean;
  /** 0 raised (S0) … 1 dropped */
  blinds: number;
  /** 0..12 (continuity.plantStage) */
  plantStage: number;
  /** 0..1 progress of a falling leaf (running gag); undefined = none */
  leafFall?: number;
  /** continuity.diplomaText */
  diplomaText: string;
  /** E10/E15 chair breakdown */
  chairState: "intact" | "collapsed";
  timer: TimerProps;
  /** z15 vignette opacity (default 0.35) */
  vignetteOpacity: number;
}

// ───────────────────────────── Patient (set builder) ─────────────────────────────
export interface PatientProps {
  /** patient.json */
  spec: PatientSpec;
  /** bottom-centre anchor in scene px (solo rest: 410, 1150; S0 hover: y = 230 + maxSize.h) */
  x: number;
  y: number;
  /** uniform scale (window exit → 0.25) */
  scale: number;
  /** squash/stretch about the anchor (engine landing/squashLand) */
  sx: number;
  sy: number;
  /** degrees about the anchor */
  rotate: number;
  brows: PatientBrows;
  eyes: PatientEyes;
  /** current mouth shape (engine mouthAt): X closed, B half, D open (RMS); A–H/X (Rhubarb) */
  mouth: MouthShape;
  variant: "base" | "transformed";
  /** 0..1 lid closure */
  blink: number;
  /** engine patientIdle(); NO_IDLE in S0 */
  idle: IdleOffset;
  /** 3 speed lines above the puppet (S0 hover, falling) */
  motionLines: boolean;
  /** 0..1 crying intensity (tears) */
  tears: number;
  /** 0..1 swallow progress into Chester's mouth (mask + scaleY → 0); 0 = none */
  swallow: number;
  /** if set: render as a flat silhouette of this colour (icon test R1, lens patient file icon) */
  silhouette?: string;
  /** bounding box limit from the actor (lint 16); the puppet must fit inside */
  maxSize: { w: number; h: number };
}

/** Elliptical shadow on the seat top (z7): centre (410, 1078), rx 130, ry 18, #000 @ 60 % in S0. */
export interface PatientShadowProps {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** 0.6 → 1.0 while falling into S0, 1.0 in S0 */
  scale: number;
  opacity: number;
}

// ───────────────────────────── Props (set builder) ─────────────────────────────
/** NOTEPAD camera card (screen space, replaces the scene): clipboard 900×1300 centred (540, 900), drawing field 760×900. */
export interface NotepadCardProps {
  /** doodle registry key (assetKey of episode.json notepad[].doodle) */
  doodle: string;
  /** per-stroke drawOn progress (engine drawOn().strokes); length may differ from the doodle's stroke count — map proportionally */
  strokes: number[];
  /** overall drawOn progress 0..1 */
  drawProgress: number;
  /** line-boil seed (engine drawOn().boilSeed) */
  boilSeed: number;
  /** optional ≤ 3-word label in the caption band style */
  adviceLabel?: string;
  /** 0..1 page flip-in (SFX13); 1 = settled */
  flip: number;
}

export type BubbleKind = "memory" | "speech" | "thought";

/** z12 bubble. memory = vignette of humans (box x 140–640, y 330–690); speech = grawlix / one word. */
export interface BubbleProps {
  kind: BubbleKind;
  /** body box in scene px */
  box: Rect;
  /** speaker point the tail / dot trail aims at */
  tail: XY;
  /** body scale 0..1 (engine bubbleInflate) */
  inflate: number;
  /** three tail dots 0..1 */
  dots: [number, number, number];
  /** memory: vignette registry key */
  vignette?: string;
  /** memory: keys of the 1–2 moving elements inside the vignette */
  moving?: string[];
  /** frames since the bubble appeared (drives moving elements) */
  t: number;
  /** speech: grawlix characters (engine grawlix) */
  grawlix?: GrawlixChar[];
  /** speech: the one clear word, e.g. "NO." */
  text?: string;
}

/** Caption band (z14, SCREEN space): y 1235–1320, x 80–920, ≤ 6 words. */
export interface CaptionProps {
  text: string;
  /** popIn scale (exactly 1 when static) */
  scale: number;
  opacity: number;
}

/** z13 flying/popping prop from episode.json props[] */
export interface PropItemProps {
  /** registry key (assetKey of props[].svg) */
  id: string;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  /** frames since the prop appeared */
  t: number;
  motionLines: boolean;
}

/** z13 particles (engine particlesAt) */
export interface ParticlesProps {
  type: ParticleType;
  particles: ParticleState[];
}

// ───────────────────────────── Humans (set builder) ─────────────────────────────
/** Grey faceless silhouette (#7B7E86 / #5F626A), bottom-centre anchor. Used inside vignettes. */
export interface HumanProps {
  pose: HumanPose;
  x: number;
  y: number;
  scale: number;
  flip?: boolean;
  accessory?: HumanAccessory;
  /** angle (deg) of the one moving part (kicking leg, pointing arm…), 0 = rest */
  moveAngle?: number;
}
