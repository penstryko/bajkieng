// Scene schema = bible §9.2 (complete), plus patient.json (§4.6) and mouth-data formats.
// episodes/<ID>/episode.json must satisfy `Episode`; episodes/<ID>/patient.json must satisfy `PatientSpec`.
// Owner: architect/coordinator. Builders READ ONLY (propose changes to the coordinator).

import type {
  ActorId, AdultCoding, AllowedDuration, Brows, Camera, ChesterEyes, ChesterMouth, ChirpLed, CharId,
  DialogueMouth, DoctorExpression, ChesterExpression, DoctorMouth, DoctorPen, DoctorPlacement, Ease,
  GlassesY, LensIcon, MouthDriver, MouthShape, MouthStyle, ParticleType, PatientAccessory, PatientBrows,
  PatientCategory, PatientEyes, PatientIdle, PatientLanding, PatientMouthType, PatientShape, PatientSize,
  PatientWear, PropAnim, ShotEase, SoundLanguageKey, TimerMode, VoicePreset, Winner, DoctorExtra,
} from "./enums";

export type Frame = number; // 0 .. N-1, N = durationInFrames, 30 fps
export type XY = [number, number];
export type Rect = [number, number, number, number]; // x0, y0, x1, y1 (scene px)

// ───────────────────────────── Poses (§9.2) ─────────────────────────────
/** dur in frames; no dur = swap in a single frame. Numeric fields tween, enum fields swap at `at`. */
export interface Tween {
  dur?: number;
  ease?: Ease;
}
export interface DoctorPose extends Tween {
  brows?: Brows;
  mouth?: DoctorMouth;
  lens?: LensIcon;
  glassesY?: GlassesY;
  headTilt?: number; // −6..6 degrees
  pen?: DoctorPen;
  placement?: DoctorPlacement;
  /** Extension: shorthand for a §3.1 table row; explicit fields in the same event win. */
  expression?: DoctorExpression;
  /** Extension: lean-in scale (1 … 1.03). */
  lean?: number;
  /** Extension: sweat / steam / sigh overlays from the §3.1 table. */
  extras?: DoctorExtra[];
}
export interface ChesterPose extends Tween {
  eyes?: ChesterEyes;
  mouth?: ChesterMouth;
  sag?: number; // 0..0.05
  spring?: boolean;
  /** Extension: shorthand for a §3.2 table row; explicit fields in the same event win. */
  expression?: ChesterExpression;
}
export interface ChirpPose extends Tween {
  led?: ChirpLed;
}
export interface PatientPose extends Tween {
  brows?: PatientBrows; // checked against patient.json library
  enter?: "fall_from_top";
  land?: PatientLanding;
  variant?: "base" | "transformed";
  eyesSwap?: PatientEyes;
  /** Extension: control-panel state for function markers with a panel (printer): "fence" = blinking amber LED +
   *  fence glyph on the display (advice A01 applied), "base" = back to the patient.json display. */
  panel?: "base" | "fence";
}
export type PoseEvent =
  | { char: "doctor"; at: Frame; set: DoctorPose }
  | { char: "chester"; at: Frame; set: ChesterPose }
  | { char: "chirp"; at: Frame; set: ChirpPose }
  | { char: ActorId; at: Frame; set: PatientPose };

// ───────────────────────────── Episode (§9.2) ─────────────────────────────
export interface Ledger {
  exitType: string; // "E01".."E17"
  winner: Winner;
  patientCategory: PatientCategory;
  woundId: string;
  adviceId: string;
  twistId: string;
}

export interface Continuity {
  plantStage: number; // 0..12
  diplomaText: string;
  spareTimers: number;
  spareGlasses: number;
}

export interface Actor {
  id: ActorId;
  ref: string; // "patient.json" (episode-relative)
  anchor: XY; // bottom-center; solo [410, 1150]; pair [330,1150] & [495,1150]
  maxSize: { w: number; h: number }; // solo { w: 330, h: 380 }; pair { w: 165, h: 300 }
}

export interface State0 {
  camera: "WIDE";
  doctor: { pen: "raised"; brows: "neutral"; mouth: "flat"; headTilt: 0; glassesY: 0; lens: "patient_file_icon"; placement: "chair" };
  chester: { eyes: "wide_up"; mouth: "tight"; sag: 0.02 };
  chirp: { led: "off" };
  patient: {
    topY: number; // default 230; x from actor anchor
    scale: 1.0;
    motionLines: true;
    /** Extension: eye pair shown in S0 (the hook frame: mid-fall), default = patient.json eyes. The pose before
     *  HOLD must set the same eyesSwap (lint 2), so frames 0–5 and N−15…N−1 stay identical. */
    eyes?: PatientEyes;
    /** Extension: brows shown in S0, default = patient.json brows (same continuity rule). */
    brows?: PatientBrows;
  };
  timer: { dial: 1.0 };
  window: "calm";
  couchShadow: { scale: 1.0; opacity: 0.6 };
  caption: string; // "PATIENT #001: OFFICE PRINTER"
}

export interface Shot {
  from: Frame;
  to: Frame;
  camera: Camera;
  ease?: ShotEase;
}

export interface MotionTrack {
  char: ActorId | "doctor";
  from: Frame;
  to: Frame;
  path: XY[]; // bottom-center anchor positions
  scale?: [number, number];
  rotate?: [number, number];
  z?: number; // target z-layer (e.g. 1 = behind window glass)
  zAt?: Frame; // frame where z switches
  swallow?: boolean; // E03: path to Chester's mouth (155, 985), ≤ 30 frames
  ease: Ease;
}

export interface Instances {
  ref: string;
  from: Frame;
  to: Frame;
  n: number;
  seed: number;
  area: Rect;
} // E14

export interface Rewind {
  from: Frame;
  to: Frame;
  sourceFrom: Frame;
  sourceTo: Frame;
} // E16

export interface TimerEvent {
  at: Frame;
  dial: number; // 1.0 = fully wound
  mode: TimerMode;
}

export interface DialogueEvent {
  char: CharId;
  at: Frame;
  clip: string; // audio path, see CONTRACT.md "asset paths"
  mouth: DialogueMouth;
  mouthData?: string; // JSON path (RMS envelope or Rhubarb); required when mouth ≠ "none"
  text?: string; // the one clear English word / rare doctor sentence
  gainDb?: number; // extension: per-line gain
}

export interface SfxEvent {
  at: Frame;
  clip: string;
  gainDb?: number;
}

export interface Bed {
  tickClip: string; // single tick sample (SFX01, 80 ms)
  tickPeriodSamples: 24000;
  tickOffsetSamples: 12000;
  roomTone: string; // *_loop{S}.wav, exactly N × 1600 samples
  music: string; // *_loop{S}.wav, exactly N × 1600 samples
  /** Extension: pre-rendered tick track (N × 1600 samples, ticks at 12000 + k·24000).
   *  Default when absent: "assets/sfx/SFX01_tick_bed{S}.wav" (S = N/30). Built by tools/gen_audio.* */
  tickBed?: string;
  /** Extension: bed gain in dB (default music −18 dB under VO, see §7.4). */
  musicGainDb?: number;
  roomToneGainDb?: number;
  tickGainDb?: number;
  /** Extension: music gain ramps (dB, linear-in-dB ramps of `rampFrames`, default 3, on both sides). Negative =
   *  duck (e.g. the twist's half second of silence), positive = swell (e.g. the climax). Gains of overlapping
   *  entries add up. Keep every entry inside [6, N−75) so the bed is identical at both ends of the file. */
  musicDucks?: MusicDuck[];
}

export interface MusicDuck {
  from: Frame;
  to: Frame;
  gainDb: number; // −60 … +8
  rampFrames?: number;
}

export interface PropEvent {
  id: string;
  svg: string; // registry key or path; resolved by basename (CONTRACT.md "visual refs")
  from: Frame;
  to: Frame;
  anim: PropAnim;
  path?: XY[];
  /** Extension (fly/launch): the path is travelled in this many frames, then the prop rests at the last point
   *  until `to` (default: the whole range). */
  flightFrames?: number;
  /** Extension (fly/launch): easing of the travel (default launch "in", fly "inOut"). */
  ease?: Ease;
}

export interface BubbleEvent {
  from: Frame;
  to: Frame;
  vignette: string; // registry key or path (basename)
  moving: string[];
}

export interface NotepadEvent {
  from: Frame;
  to: Frame;
  doodle: string; // registry key or path (basename)
  drawOnFrames: number; // 12–20
  adviceLabel?: string; // ≤ 3 words EN
}

export interface WindowLayerEvent {
  from: Frame;
  to: Frame;
  layer: string; // "calm" in S0; others from the Set.tsx registry
}

export interface ParticleEvent {
  from: Frame;
  to: Frame;
  type: ParticleType;
  origin: XY;
  count: number;
  /** Extension: emission cone centre in degrees (screen coords, y down: 0 = right, 90 = down, 180 = left);
   *  absent = all directions. */
  dir?: number;
  /** Extension: cone width in degrees (default 360). */
  spread?: number;
  /** Extension: initial speed multiplier (default 1). */
  speed?: number;
  /** Extension: particles older than 4 frames are hidden while inside this rect (keep a face readable). */
  avoid?: Rect;
}

export interface CaptionEvent {
  from: Frame; // from > to = wraps through the seam (modulo N)
  to: Frame;
  text: string; // ≤ 6 words
}

export interface ShakeEvent {
  at: Frame;
  amp: number; // 6–24 px (4–6 for small knocks)
  decayFrames: number;
  /** Extension: also jolt the wall decor (diploma, NOW SERVING counter) by ~40 % of the amplitude. */
  decor?: boolean;
}

export interface Episode {
  id: string; // "S01E01"
  patientNo: number;
  title: string; // EN, ≤ 60 chars (40–60 recommended), no profanity
  fps: 30;
  width: 1080;
  height: 1920;
  durationInFrames: AllowedDuration;
  seed: number; // the only source of randomness
  ledger: Ledger;
  continuity: Continuity;
  actors: Actor[];
  state0: State0;
  shots: Shot[];
  poses: PoseEvent[];
  motion: MotionTrack[];
  instances: Instances[];
  rewind?: Rewind;
  timer: TimerEvent[]; // default [{ at: 15, dial: 1.0, mode: "run" }]
  dialogue: DialogueEvent[];
  sfx: SfxEvent[];
  bed: Bed;
  props: PropEvent[];
  bubbles: BubbleEvent[];
  notepad: NotepadEvent[];
  windowLayer: WindowLayerEvent[];
  particles: ParticleEvent[];
  captions: CaptionEvent[];
  shakes: ShakeEvent[];
}

// ───────────────────────────── patient.json (§4.2, §4.6) ─────────────────────────────
export interface PatientSpec {
  name: string;
  captionName: string; // ≤ 4 words, UPPERCASE
  category: PatientCategory;
  size: PatientSize;
  shape: PatientShape;
  palette: { base: string; shade: string; accent: string };
  functionMarker: string; // e.g. "paper_tray_tongue" (free-form, drawn by the set builder)
  eyes: PatientEyes;
  brows: PatientBrows;
  mouth: { type: PatientMouthType; driver?: MouthDriver; style?: MouthStyle };
  wear: PatientWear[]; // ≥ 1, ≤ 3
  accessories: PatientAccessory[]; // ≤ 2
  idle: PatientIdle;
  landing: PatientLanding;
  soundLanguage: Record<SoundLanguageKey, string>; // audio paths (episode-relative unless "assets/...")
  voicePreset: VoicePreset | null;
  adultCoding: AdultCoding[]; // ≥ 1
  seed: number;
  /** Optional second puppet variant for E12 (transformation). */
  transformed?: Partial<Omit<PatientSpec, "transformed" | "soundLanguage">>;
}

// ───────────────────────────── Mouth data (dialogue[].mouthData) ─────────────────────────────
/** RMS envelope written by tools/rms_envelope.py: one value per hop (default hop = 1 frame = 1600 samples). */
export interface RmsMouthData {
  type: "rms";
  sampleRate: 48000;
  hopSamples: number; // 1600 recommended (one value per video frame)
  values: number[]; // normalised 0..1
  thresholds?: { B: number; D: number }; // default { B: 0.12, D: 0.4 }
}
/** Rhubarb Lip Sync JSON export (only used for the rare English word). */
export interface RhubarbMouthData {
  metadata?: { soundFile?: string; duration?: number };
  mouthCues: { start: number; end: number; value: MouthShape }[];
}
export type MouthData = RmsMouthData | RhubarbMouthData;

// ───────────────────────────── Series ledger (§6.3) ─────────────────────────────
export interface SeriesLedgerEntry extends Ledger {
  id: string; // "S01E01"
  patientName: string;
}
export interface SeriesLedger {
  episodes: SeriesLedgerEntry[];
}

// ───────────────────────────── Loaded bundle (calculateMetadata → props) ─────────────────────────────
/** What the S01E01 composition receives as props (see src/engine/assets.ts loadEpisodeBundle). */
export interface EpisodeBundle {
  episodeId: string;
  episode: Episode;
  patients: Partial<Record<ActorId, PatientSpec>>;
  /** keyed by the dialogue[].mouthData path as written in episode.json */
  mouthData: Record<string, MouthData>;
  /** audio paths referenced by episode.json that are not (yet) present: EpisodeAudio skips them. */
  missingAudio: string[];
}
