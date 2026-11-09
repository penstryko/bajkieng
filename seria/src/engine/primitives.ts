// Deterministic animation primitives (bible §9.4). Every function is a pure function of the
// frame number (+ explicit seeds). Randomness ONLY via remotion `random(seed)` — never
// Math.random() / Date.now() (lint 9). Periodic motion is multiplied by idleEnvelope(), which is
// exactly 0 before frame 15 and from S0_IN = N − 30 (lint 5), so the seam frames are static.
import { interpolate, random, spring } from "remotion";
import type { ActorId, ChirpLed, Ease, ParticleType, PatientIdle, PatientLanding } from "../enums";
import type {
  CaptionEvent, MotionTrack, MouthData, ParticleEvent, PropEvent, Rewind, ShakeEvent, TimerEvent, XY,
} from "../schema";
import type { MouthShape } from "../enums";
import { ANIM_START, FPS, SAMPLES_PER_FRAME, blinkAllowed, ritual } from "./constants";
import { POS } from "./layout";
import { clamp, lerp, progress } from "./tween";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TAU = Math.PI * 2;

/** Signed noise in [-1, 1] for (seed, key). */
export const noise = (seed: string | number, key: string | number): number => random(`${seed}:${key}`) * 2 - 1;

// ───────────────────────────── ranges ─────────────────────────────

/** Range test that supports wrap-around through the seam (from > to ⇒ [from, N) ∪ [0, to]). */
export const rangeActive = (frame: number, from: number, to: number, N: number): boolean =>
  from <= to ? frame >= from && frame <= to : frame >= from || frame <= to;

/** Frames since `from`, modulo N (for wrapped ranges). */
export const localFrame = (frame: number, from: number, N: number): number => (((frame - from) % N) + N) % N;

/** Length (frames, inclusive) of a possibly wrapped range. */
export const rangeLength = (from: number, to: number, N: number): number => localFrame(to, from, N) + 1;

// ───────────────────────────── idle / breath ─────────────────────────────

/** 0 before frame 15 and from S0_IN (N−30); smooth ramps of `ramp` frames in between. */
export function idleEnvelope(frame: number, N: number, ramp = 15): number {
  const { S0_IN } = ritual(N);
  if (frame < ANIM_START || frame >= S0_IN) return 0;
  const up = interpolate(frame, [ANIM_START, ANIM_START + ramp], [0, 1], CLAMP);
  const down = interpolate(frame, [S0_IN - ramp, S0_IN], [1, 0], CLAMP);
  const e = Math.min(up, down);
  return e * e * (3 - 2 * e); // smoothstep
}

/** Vertical bob in px (amp 2–6). */
export const idleBob = (frame: number, N: number, { amp = 4, period = 60, phase = 0 } = {}): number =>
  amp * idleEnvelope(frame, N) * Math.sin((TAU * frame) / period + phase);

/** Breathing scale delta (±1 % → amp 0.01). Use as scaleY = 1 + breath(). */
export const breath = (frame: number, N: number, { amp = 0.01, period = 90, phase = 0 } = {}): number =>
  amp * idleEnvelope(frame, N) * Math.sin((TAU * frame) / period + phase);

export interface IdleOffset {
  dx: number;
  dy: number;
  rot: number;
  scale: number;
  opacity: number;
}
export const NO_IDLE: IdleOffset = { dx: 0, dy: 0, rot: 0, scale: 1, opacity: 1 };

/** Patient idle motion by patient.json `idle` type, already enveloped (zero at the seam). */
export function patientIdle(type: PatientIdle, frame: number, N: number, seed: number | string, amount = 1): IdleOffset {
  const e = idleEnvelope(frame, N) * amount;
  if (e === 0) return NO_IDLE;
  const s = Math.sin;
  switch (type) {
    case "bob":
      return { ...NO_IDLE, dy: 4 * e * s((TAU * frame) / 60) };
    case "jitter": {
      const k = Math.floor(frame / 2);
      return { ...NO_IDLE, dx: 1.5 * e * noise(seed, `jx${k}`), dy: 1.5 * e * noise(seed, `jy${k}`) };
    }
    case "vibrate":
      return { ...NO_IDLE, dx: 2 * e * noise(seed, `vx${frame}`), rot: 0.4 * e * noise(seed, `vr${frame}`) };
    case "sway":
      return { ...NO_IDLE, rot: 2 * e * s((TAU * frame) / 90) };
    case "pulse":
      return { ...NO_IDLE, scale: 1 + 0.02 * e * s((TAU * frame) / 45) };
    case "flicker":
      return { ...NO_IDLE, opacity: 1 - 0.18 * e * (random(`${seed}:fl${Math.floor(frame / 2)}`) > 0.85 ? 1 : 0) };
    case "drip":
      return { ...NO_IDLE, dy: 1.5 * e * s((TAU * frame) / 75) };
    case "spin":
      return { ...NO_IDLE, rot: 3 * e * s((TAU * frame) / 120) };
  }
}

// ───────────────────────────── blink ─────────────────────────────

/** Random blink start frames every 2–5 s, only inside [15, N−75) (bible §9.4, lint 2). */
export function blinkSchedule(
  seed: number | string,
  N: number,
  { minGap = 60, maxGap = 150, dur = 3 }: { minGap?: number; maxGap?: number; dur?: number } = {},
): number[] {
  const out: number[] = [];
  let i = 0;
  let f = ANIM_START + Math.floor(random(`${seed}:blink:${i}`) * maxGap);
  while (blinkAllowed(f, N) && f + dur < N - 75) {
    out.push(f);
    i++;
    f += minGap + Math.floor(random(`${seed}:blink:${i}`) * (maxGap - minGap));
  }
  return out;
}

/** Lid closure 0 (open) … 1 (closed) for a blink starting at one of `starts`, lasting `dur` (2–4) frames. */
export function blinkAt(frame: number, starts: readonly number[], dur = 3): number {
  for (const s of starts) {
    if (frame >= s && frame < s + dur) {
      const t = (frame - s + 0.5) / dur; // 0..1
      return Math.min(1, (1 - Math.abs(2 * t - 1)) * 1.5); // dur 3: 0.5 → 1 → 0.5
    }
  }
  return 0;
}

// ───────────────────────────── squash / landing / pop ─────────────────────────────

export interface Squash {
  sx: number;
  sy: number;
  dy: number; // px vertical offset (bounces), negative = up
  rot: number; // degrees
}
export const NO_SQUASH: Squash = { sx: 1, sy: 1, dy: 0, rot: 0 };

/** Volume-preserving squash: sy goes peak (0.7) → overshoot (≈1.15) → 1 via spring(); sx = 1/√sy. */
export function squashLand(frame: number, at: number, { peak = 0.7, damping = 6, stiffness = 200, mass = 1 } = {}): Squash {
  const t = frame - at;
  if (t < 0) return NO_SQUASH;
  const s = spring({ frame: t, fps: FPS, config: { damping, stiffness, mass }, from: peak, to: 1 });
  const sy = t > 60 ? 1 : s;
  return { sx: 1 / Math.sqrt(sy), sy, dy: 0, rot: 0 };
}

/** Landing variants from patient.json `landing` (bible §4.2), event at `at` (normally frame 15). */
export function landing(type: PatientLanding, frame: number, at: number, seed: number | string = 0): Squash {
  const t = frame - at;
  if (t < 0) return NO_SQUASH;
  switch (type) {
    case "heavy":
      return squashLand(frame, at, { peak: 0.7 });
    case "float":
      return squashLand(frame, at, { peak: 0.92, damping: 14 });
    case "splat": {
      const sy = t > 45 ? 1 : interpolate(t, [0, 4, 45], [0.5, 0.55, 1], { ...CLAMP, easing: (x) => 1 - Math.pow(1 - x, 3) });
      return { sx: 1 / Math.sqrt(sy), sy, dy: 0, rot: 0 };
    }
    case "bouncy": {
      // two bounces: 60 px then 20 px, squash at each contact
      const b1 = 12, b2 = 8;
      let dy = 0;
      if (t < b1) dy = -60 * Math.sin((Math.PI * t) / b1);
      else if (t < b1 + b2) dy = -20 * Math.sin((Math.PI * (t - b1)) / b2);
      const contact = t < 3 ? squashLand(frame, at, { peak: 0.8 }) : t >= b1 && t < b1 + 3 ? squashLand(frame, at + b1, { peak: 0.9 }) : NO_SQUASH;
      return { ...contact, dy, rot: 0 };
    }
    case "clatter": {
      const base = squashLand(frame, at, { peak: 0.85, damping: 10 });
      const k = clamp(1 - t / 14, 0, 1);
      return { ...base, rot: 4 * k * noise(seed, `clatter${frame}`), dy: -2 * k * Math.abs(noise(seed, `cy${frame}`)) };
    }
  }
}

/** popIn: scale 0 → 1 with ≈15 % overshoot; exactly 0 before `at`, exactly 1 after `settle` frames. */
export function popIn(frame: number, at: number, { settle = 30, damping = 14, stiffness = 200 } = {}): number {
  const t = frame - at;
  if (t < 0) return 0;
  if (t >= settle) return 1;
  return spring({ frame: t, fps: FPS, config: { damping, stiffness, mass: 1 } });
}

/** Like popIn but compressed into exactly `dur` frames and exactly 1 from at+dur on (captions). */
export function popInFixed(frame: number, at: number, dur: number): number {
  const t = frame - at;
  if (t < 0) return 0;
  if (t >= dur) return 1;
  return spring({ frame: t, fps: FPS, durationInFrames: dur, config: { damping: 12, stiffness: 200, mass: 0.8 } });
}

/** popOut: 1 → 0 over `dur` frames ending at `end` (ease-in). */
export const popOut = (frame: number, end: number, dur = 6): number => 1 - progress(frame, end - dur, dur, "in");

/** Sprung spring (Chester's springPoke): 0 → 1 pop + decaying wobble angle. */
export function springPoke(frame: number, at: number): { out: number; wobble: number } {
  const t = frame - at;
  if (t < 0) return { out: 0, wobble: 0 };
  return { out: popIn(frame, at, { damping: 9 }), wobble: t > 40 ? 0 : 12 * Math.exp(-t / 8) * Math.sin(t * 1.3) };
}

// ───────────────────────────── paths / motion / props ─────────────────────────────

const easeProgress = (frame: number, from: number, to: number, ease: Ease): number => progress(frame, from, to - from, ease);

/** Point on a Catmull-Rom spline through `path` at t ∈ [0,1], segments weighted by chord length. */
export function pathAt(path: readonly XY[], t: number): XY {
  if (path.length === 0) return [0, 0];
  if (path.length === 1 || t <= 0) return [path[0][0], path[0][1]];
  if (t >= 1) return [path[path.length - 1][0], path[path.length - 1][1]];
  const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  let d = t * total;
  let i = 0;
  while (i < lens.length - 1 && d > lens[i]) d -= lens[i++];
  const u = lens[i] === 0 ? 0 : d / lens[i];
  const p0 = path[Math.max(0, i - 1)], p1 = path[i], p2 = path[i + 1], p3 = path[Math.min(path.length - 1, i + 2)];
  const cr = (a: number, b: number, c: number, e: number) =>
    0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - e) * u * u + (-a + 3 * b - 3 * c + e) * u * u * u);
  return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
}

export interface MotionState {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  /** target z-layer once past zAt (null = default layer of the character) */
  z: number | null;
  /** true while inside [from, to] of a track */
  moving: boolean;
  /** eased progress of the current/last track */
  t: number;
  swallow: boolean;
}

/**
 * fly/drop/launch for characters: position from episode.motion tracks of `char`.
 * Inside a track: interpolated along `path`. After a track: holds its end state until the next track.
 * Before the first track: null (caller uses the default anchor / state0 position).
 */
export function motionAt(tracks: readonly MotionTrack[], char: ActorId | "doctor", frame: number): MotionState | null {
  const mine = tracks.filter((m) => m.char === char && m.from <= frame).sort((a, b) => a.from - b.from);
  const m = mine[mine.length - 1];
  if (!m) return null;
  const t = easeProgress(Math.min(frame, m.to), m.from, m.to, m.ease);
  const [x, y] = pathAt(m.path, t);
  const scale = m.scale ? lerp(m.scale[0], m.scale[1], t) : 1;
  const rotate = m.rotate ? lerp(m.rotate[0], m.rotate[1], t) : 0;
  const z = m.z !== undefined && (m.zAt === undefined || frame >= m.zAt) ? m.z : null;
  return { x, y, scale, rotate, z, moving: frame <= m.to, t, swallow: !!m.swallow };
}

export interface PropState {
  visible: boolean;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  motionLines: boolean;
  t: number; // local frame since prop.from
  /** direction of travel in degrees (screen coords, 0 = right, 90 = down); motion lines trail behind it */
  heading?: number;
}

/** Props track (bible §9.2 `props`): pop | fly | drop | launch. Without a path, props sit at path[0] or the patient anchor. */
export function propAt(p: PropEvent, frame: number, fallback: XY = POS.patient.soloAnchor): PropState | null {
  if (frame < p.from || frame > p.to) return null;
  const path = p.path && p.path.length ? p.path : [fallback];
  const t = frame - p.from;
  const out = popOut(frame, p.to + 1, 4);
  switch (p.anim) {
    case "pop": {
      const [x, y] = path[0];
      return { visible: true, x, y, scale: popIn(frame, p.from) * out, rotate: 0, opacity: 1, motionLines: false, t };
    }
    case "drop": {
      const k = progress(frame, p.from, Math.min(20, p.to - p.from), "in");
      const [x, y] = pathAt(path.length > 1 ? path : [[path[0][0], -100], path[0]], k);
      return { visible: true, x, y, scale: out, rotate: 0, opacity: 1, motionLines: k < 1, t };
    }
    case "fly":
    case "launch": {
      const ease: Ease = p.ease ?? (p.anim === "launch" ? "in" : "inOut");
      // optional flight time: travel the path in `flightFrames`, then rest at its last point until `to`
      const end = p.flightFrames ? Math.min(p.to, p.from + p.flightFrames) : p.to;
      const k = easeProgress(Math.min(frame, end), p.from, end, ease);
      const [x, y] = pathAt(path, k);
      const flying = frame < end || !p.flightFrames;
      const [px, py] = pathAt(path, Math.max(0, k - 0.03));
      const [nx, ny] = pathAt(path, Math.min(1, k + 0.03));
      const heading = (Math.atan2(ny - py, nx - px) * 180) / Math.PI;
      return { visible: true, x, y, scale: 1, rotate: p.anim === "launch" ? k * 360 : 0, opacity: 1, motionLines: p.anim === "launch" && flying, t, heading };
    }
  }
}

// ───────────────────────────── mouth ─────────────────────────────

/** mouthSwap: mouth shape for a dialogue line starting at `at` (RMS → X/B/D, Rhubarb → A–H/X). */
export function mouthAt(data: MouthData | undefined, frame: number, at: number): MouthShape {
  if (!data || frame < at) return "X";
  if ("type" in data && data.type === "rms") {
    const idx = Math.floor(((frame - at) * SAMPLES_PER_FRAME) / data.hopSamples);
    const v = data.values[idx];
    if (v === undefined) return "X";
    const th = data.thresholds ?? { B: 0.12, D: 0.4 };
    return v >= th.D ? "D" : v >= th.B ? "B" : "X";
  }
  const t = (frame - at) / FPS;
  const cue = (data as { mouthCues: { start: number; end: number; value: MouthShape }[] }).mouthCues.find(
    (c) => t >= c.start && t < c.end,
  );
  return cue ? cue.value : "X";
}

// ───────────────────────────── lens / glasses ─────────────────────────────

export interface LensState {
  lens: string;
  /** 0..1 static overlay; 1 during the 3 noise frames of a lensSwap */
  noise: number;
  noiseSeed: number;
}

/**
 * lensSwap: 3 frames of static, then the new icon (bible §9.4).
 * `changes` = [{at, lens}] in time order (from doctor pose events). A change at f < 15 or f ≥ N−75 is an
 * instant swap without static (lint 2) — e.g. the S0 reset at S0_IN.
 */
export function lensAt(changes: readonly { at: number; lens: string }[], frame: number, N: number, base: string): LensState {
  let cur = { at: -1, lens: base };
  for (const c of changes) if (c.at <= frame && c.at >= cur.at) cur = c;
  const inNoise = cur.at >= 0 && blinkAllowed(cur.at, N) && frame - cur.at < 3;
  return { lens: cur.lens, noise: inNoise ? 1 : 0, noiseSeed: inNoise ? frame : 0 };
}

/** glassesSlide: Y offset 0..40 px tweened over `dur` frames (reveals the dot eyes). */
export const glassesSlide = (frame: number, at: number, from: number, to: number, dur = 6): number =>
  lerp(from, to, progress(frame, at, dur, "out"));

// ───────────────────────────── couch ─────────────────────────────

/** couchSag 0..0.05 → SVG transform scaling back+seat about the floor line (y = 1380). */
export const couchSagTransform = (sag: number, floorY = POS.chester.floorY): string =>
  sag === 0 ? "" : `translate(0 ${floorY}) scale(1 ${1 - sag}) translate(0 ${-floorY})`;

// ───────────────────────────── drawOn / bubbles / grawlix ─────────────────────────────

export interface DrawOnState {
  /** overall progress 0..1 */
  total: number;
  /** per-stroke progress 0..1 (strokes drawn one after another, weighted equally) */
  strokes: number[];
  /** seed for line boil (changes every 2 frames while drawing, frozen after) */
  boilSeed: number;
}

/** drawOn: stroke-dashoffset progress over 12–20 frames. Use pathLength={1} and strokeDashoffset={1 - p}. */
export function drawOn(frame: number, from: number, drawOnFrames: number, strokeCount: number, seed: number | string = 0): DrawOnState {
  const total = progress(frame, from, drawOnFrames, "out");
  const n = Math.max(1, strokeCount);
  const strokes = Array.from({ length: n }, (_, i) => clamp(total * n - i, 0, 1));
  const boilFrame = Math.min(frame, from + drawOnFrames);
  const boilSeed = Math.floor(random(`${seed}:boil:${Math.floor(boilFrame / 2)}`) * 1e6);
  return { total, strokes, boilSeed };
}

/** Deterministic point jitter for hand-drawn line boil. */
export const jitterPoint = (boilSeed: number, i: number, amp = 1.5): XY => [amp * noise(boilSeed, `x${i}`), amp * noise(boilSeed, `y${i}`)];

export interface BubbleState {
  visible: boolean;
  /** bubble body scale 0..1 (popIn after the dots) */
  inflate: number;
  /** three tail dots 0..1 each */
  dots: [number, number, number];
  /** local frame since `from` (for moving vignette elements) */
  t: number;
}

/** bubbleInflate: dots pop one by one (2 frames apart), then the bubble pops; deflates over the last 6 frames. */
export function bubbleInflate(frame: number, from: number, to: number): BubbleState {
  if (frame < from || frame > to) return { visible: false, inflate: 0, dots: [0, 0, 0], t: 0 };
  const out = popOut(frame, to + 1, 6);
  const dots = [0, 1, 2].map((i) => popIn(frame, from + 2 * i, { settle: 12 }) * out) as [number, number, number];
  return { visible: true, inflate: popIn(frame, from + 6) * out, dots, t: frame - from };
}

export interface GrawlixChar {
  char: string;
  scale: number;
  rot: number;
  dx: number;
  dy: number;
}

/** grawlix: "#$%&!" chars popIn staggered by 2 frames, jittering every 2 frames. */
export function grawlix(frame: number, at: number, text = "#$%&!", seed: number | string = 0): GrawlixChar[] {
  const k = Math.floor(frame / 2);
  return [...text].map((char, i) => ({
    char,
    scale: popIn(frame, at + 2 * i, { settle: 14 }),
    rot: 9 * noise(seed, `gr${i}`), // capped so neighbouring glyphs cannot collide (Bubble lays them out with spacing)
    dx: 2 * noise(seed, `gx${i}:${k}`),
    dy: 2 * noise(seed, `gy${i}:${k}`),
  }));
}

// ───────────────────────────── shake / zoom helpers ─────────────────────────────

/** shake: sum of active shakes, quadratic decay, noise from random("shake-"+at+"-"+frame). */
export function shakeAt(frame: number, shakes: readonly ShakeEvent[]): XY {
  let dx = 0, dy = 0;
  for (const s of shakes) {
    const t = frame - s.at;
    if (t < 0 || t >= s.decayFrames) continue;
    const k = Math.pow(1 - t / s.decayFrames, 2);
    dx += s.amp * k * noise(`shake-${s.at}`, `x${frame}`);
    dy += s.amp * k * noise(`shake-${s.at}`, `y${frame}`);
  }
  return [dx, dy];
}

// ───────────────────────────── particles ─────────────────────────────

export interface ParticleState {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
  /** stable per-particle variant 0..1 (colour/shape pick) */
  variant: number;
}

const PHYS: Record<ParticleType, { g: number; v: number; up: number; drag: number; spin: number; flutter: number; size: [number, number] }> = {
  paper: { g: 0.35, v: 9, up: 10, drag: 0.04, spin: 6, flutter: 18, size: [0.8, 1.2] },
  confetti: { g: 0.4, v: 12, up: 14, drag: 0.03, spin: 14, flutter: 8, size: [0.6, 1.0] },
  feathers: { g: 0.12, v: 7, up: 6, drag: 0.06, spin: 3, flutter: 24, size: [0.8, 1.3] },
  coins: { g: 0.9, v: 10, up: 16, drag: 0.0, spin: 18, flutter: 0, size: [0.9, 1.1] },
  sparks: { g: 0.5, v: 18, up: 12, drag: 0.02, spin: 0, flutter: 0, size: [0.4, 0.9] },
  smoke: { g: -0.08, v: 3, up: 2, drag: 0.05, spin: 1, flutter: 10, size: [1.0, 2.2] },
  dust: { g: 0.05, v: 4, up: 2, drag: 0.08, spin: 2, flutter: 6, size: [0.5, 1.4] },
};

/** particles: deterministic trajectories with gravity; spawn spread over the first half (≤ 60 f) of the range. */
export function particlesAt(frame: number, ev: ParticleEvent, seed: number | string): ParticleState[] {
  if (frame < ev.from || frame > ev.to) return [];
  const ph = PHYS[ev.type];
  const span = ev.to - ev.from;
  const spawnWindow = Math.max(1, Math.min(60, Math.floor(span / 2)));
  const out: ParticleState[] = [];
  for (let i = 0; i < ev.count; i++) {
    const r = (k: string) => random(`${seed}:${ev.type}:${ev.from}:${i}:${k}`);
    const t0 = ev.from + Math.floor(r("t0") * spawnWindow);
    const age = frame - t0;
    if (age < 0) continue;
    // emission: all directions, or a cone (ev.dir ± ev.spread / 2, degrees, y down) with a faster, tighter speed range
    const cone = ev.dir !== undefined;
    const ang = cone ? (((ev.dir as number) + ((ev.spread ?? 360) * (r("a") - 0.5))) * Math.PI) / 180 : r("a") * TAU;
    const speed = ph.v * (ev.speed ?? 1) * (cone ? 0.7 + 0.3 * r("s") : 0.4 + 0.6 * r("s"));
    const vx = Math.cos(ang) * speed;
    const vy = Math.sin(ang) * speed * (cone ? 1 : 0.6) - ph.up * r("u") * (cone ? 0.5 : 1);
    // linear drag approximation: v(t) = v0·e^(−d t); x(t) = v0 (1 − e^(−d t)) / d
    const dragT = ph.drag > 0 ? (1 - Math.exp(-ph.drag * age)) / ph.drag : age;
    const x = ev.origin[0] + vx * dragT + ph.flutter * Math.sin(age * 0.18 + r("p") * TAU) * (ph.flutter ? 1 : 0);
    const y = ev.origin[1] + vy * dragT + 0.5 * ph.g * age * age * (ph.drag > 0 ? Math.exp(-ph.drag * age * 0.5) : 1);
    const fadeIn = clamp(age / 3, 0, 1);
    const fadeOut = clamp((ev.to - frame) / 10, 0, 1);
    const a = ev.avoid;
    if (a && age > 4 && x > a[0] && x < a[2] && y > a[1] && y < a[3]) continue; // keep the protected rect clear
    out.push({
      x, y,
      rot: (r("r0") * 360 + ph.spin * age * noise(seed, `spin${i}`)) % 360,
      scale: lerp(ph.size[0], ph.size[1], r("sz")),
      opacity: fadeIn * fadeOut * (y > 1500 || y < -200 ? 0 : 1),
      variant: r("var"),
    });
  }
  return out;
}

// ───────────────────────────── timer (dialRotate) ─────────────────────────────

export interface TimerState {
  /** 1 = fully wound (S0) … 0 = rang */
  dial: number;
  /** dial angle in degrees for the drawing: −dial × 330 */
  angle: number;
  visible: boolean;
  /** 0..1 ringing wobble right after DING */
  ringing: number;
  mode: "run" | "reverse" | "stolen" | "spare";
}

/**
 * dialRotate from episode.timer (bible §9.4). Default track [{at:15, dial:1, mode:"run"}].
 * run: dial goes linearly to 0 at DING (N−180), rings for 30 frames, is wound back 0 → 1 off-screen in
 *      [GLASSES+7, GLASSES+31) (SFX03 at N−68), and is exactly 1 from then on (S0 needs dial 1.0).
 * reverse (E16): from `at`, dial moves back up to 1 by HOLD−1.  stolen: invisible from `at`.
 * spare: a new timer appears at `at` with `dial`, then runs to DING.
 */
export function dialAt(frame: number, timer: readonly TimerEvent[], N: number): TimerState {
  const { DING, GLASSES, HOLD } = ritual(N);
  const events = (timer.length ? [...timer] : [{ at: 15, dial: 1, mode: "run" as const }]).sort((a, b) => a.at - b.at);
  const mk = (dial: number, visible = true, ringing = 0, mode: TimerState["mode"] = "run"): TimerState => ({
    dial, angle: -dial * 330, visible, ringing, mode,
  });
  const windStart = GLASSES + 7;
  const windEnd = windStart + 24;
  if (frame >= windEnd) return mk(1);
  if (frame >= windStart) return mk(progress(frame, windStart, windEnd - windStart, "out"));
  let cur: (typeof events)[number] | null = null;
  for (const e of events) if (e.at <= frame) cur = e;
  if (!cur) return mk(1);
  switch (cur.mode) {
    case "stolen":
      return mk(0, false, 0, "stolen");
    case "reverse": {
      const from = dialAt(cur.at - 1, events.filter((e) => e !== cur), N).dial;
      return mk(lerp(from, 1, progress(frame, cur.at, Math.max(1, HOLD - 1 - cur.at), "inOut")), true, 0, "reverse");
    }
    case "run":
    case "spare": {
      const ding = cur.until ?? DING;
      if (frame >= ding) {
        const ring = frame - ding < 30 ? 1 - (frame - ding) / 30 : 0;
        return mk(0, true, ring, cur.mode);
      }
      const dial = interpolate(frame, [cur.at, ding], [cur.dial, 0], CLAMP);
      return mk(dial, true, 0, cur.mode);
    }
  }
}

// ───────────────────────────── blinds / caption / chirp / rewind ─────────────────────────────

/** blindsDrop: 0 (raised) → 1 (down) over `dur` frames from `at`. */
export const blindsAt = (frame: number, at: number, dur = 8): number => progress(frame, at, dur, "in");

export interface CaptionState {
  text: string;
  scale: number;
  opacity: number;
}

/**
 * Captions (bible §6.2): pop in over the first 9 frames of the range (N−30…N−22 for the S0 caption),
 * fully static in between, shrink/fade over the last 14 frames (46–59). Ranges may wrap (from > to).
 */
export function captionAt(frame: number, N: number, captions: readonly CaptionEvent[], { inFrames = 9, outFrames = 14 } = {}): CaptionState | null {
  for (const c of captions) {
    if (!rangeActive(frame, c.from, c.to, N)) continue;
    const t = localFrame(frame, c.from, N);
    const len = rangeLength(c.from, c.to, N);
    const pin = popInFixed(t, 0, inFrames);
    const out = t >= len - outFrames ? 1 - progress(t, len - outFrames, outFrames, "in") : 1;
    return { text: c.text, scale: pin * out, opacity: out };
  }
  return null;
}

export interface ChirpState {
  ledLevel: number;
  tilt: number;
  jitter: XY;
}

/** Chirp LED behaviour (bible §3.3) for an LED mode set at `at`. */
export function chirpAt(led: ChirpLed, frame: number, at: number, seed: number | string = "chirp"): ChirpState {
  const t = frame - at;
  const j = (amp: number): XY => [amp * noise(seed, `x${frame}`), amp * noise(seed, `y${frame}`)];
  switch (led) {
    case "off":
      return { ledLevel: 0, tilt: 0, jitter: [0, 0] };
    case "chirp": // 3-frame flash, ±2 px tremble, 10° tilt
      return t >= 0 && t < 3 ? { ledLevel: 1, tilt: 10, jitter: j(2) } : { ledLevel: 0, tilt: t < 8 ? 10 * (1 - (t - 3) / 5) : 0, jitter: [0, 0] };
    case "plead":
      return { ledLevel: 0.5 + 0.5 * Math.sin((TAU * t) / 40), tilt: 0, jitter: [0, 0] };
    case "alarm":
      return { ledLevel: Math.floor(t / 3) % 2 === 0 ? 1 : 0.15, tilt: 0, jitter: j(6) };
    case "faint":
      return { ledLevel: clamp(1 - t / 20, 0, 1), tilt: 0, jitter: [0, 0] };
  }
}

/** rewind (E16): source frame rendered at frame f. */
export const rewindSource = (frame: number, r: Rewind): number =>
  Math.round(interpolate(frame, [r.from, r.to], [r.sourceFrom, r.sourceTo], CLAMP));
