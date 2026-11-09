// Owned by the INTEGRATOR. Resolver (episode.json → per-frame scene state) + the z-ordered layer stack
// + the state0 hard override. Invariants:
//   1. withState0(): frames 0–5 and N−15…N−1 render ONLY state0Scene() (lint 2),
//   2. the layer order of bible §5.2 (engine/layout.ts Z),
//   3. components receive props only (no frame reads inside components).
// Beyond the scaffold this resolves what episode.json cannot express directly (beat sheet "Potrzeby wobec
// integratora"): the NOW SERVING number, grawlix / one-word speech bubbles from dialogue, tears during the
// patient's CRY clip (liquid tears, drops, puddle, sob squash), the doctor's closed-mouth hum ("Mm-" / "-hm") from
// the MM line envelopes, the doctor's own grawlix when she "catches" the patient's curse (T03), the one-off glasses
// jump of the `terrified` preset, motion lines only while falling, a shadow that follows the patient, the printer's
// panel state (advice applied), Chester's spring placed off the patient, and the wall decor jolting on knocks.
import { Subtitle, type SubtitleProps } from "./components/props/Subtitle";
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type {
  BubbleProps, CaptionProps, ChesterProps, ChirpProps, DoctorProps, NotepadCardProps, ParticlesProps,
  PatientProps, PatientShadowProps, PropItemProps,
} from "./contract";
import { CHESTER_EXPRESSIONS, DOCTOR_EXPRESSIONS, type ActorId, type ChirpLed, type LensIcon } from "./enums";
import { SPRING_DEFAULT_AT } from "./components/cast/Chester";
import type {
  Actor, ChesterPose, ChirpPose, DialogueEvent, DoctorPose, ShakeEvent, EpisodeBundle, MouthData, PatientPose, PatientSpec,
  PoseEvent, Rect, XY,
} from "./schema";
import {
  NO_IDLE, POS, SET_COLORS, WIDE_CAMERA, assetKey, blinkAt, blinkSchedule, bubbleInflate, cameraAt,
  cameraTransform, captionAt, chirpAt, clamp, dialAt, drawOn, grawlix, idleBob, breath, interpolateClamp, landing,
  lastChange, lensAt, motionAt, mouthAt, noise, particlesAt, patientIdle, poseAt, popIn, popOut, progress, propAt,
  shakeAt, springPoke, withState0, type CameraState,
} from "./engine";
import { Doctor } from "./components/cast/Doctor";
import { Chester } from "./components/cast/Chester";
import { Chirp } from "./components/cast/Chirp";
import { Set, type SetPropsExt } from "./components/set/Set";
import { Patient, PatientShadow, makePatient } from "./components/patients/Patient";
import { NotepadCard } from "./components/props/Notepad";
import { Bubble } from "./components/props/Bubble";
import { Caption } from "./components/props/Caption";
import { PropItem } from "./components/props/PropItem";
import { Particles } from "./components/props/Particles";
import { EpisodeAudio } from "./audio/EpisodeAudio";

// ───────────────────────────── scene state ─────────────────────────────
type NoLayer<T> = Omit<T, "layer">;
interface PatientRender {
  props: PatientProps;
  z: number; // 8 = default; 1 = inside the window slot
}
export interface SceneState {
  camera: CameraState;
  shake: XY;
  set: NoLayer<SetPropsExt>;
  doctor: NoLayer<DoctorProps>;
  chester: NoLayer<ChesterProps>;
  chirp: ChirpProps;
  patients: PatientRender[];
  shadows: PatientShadowProps[];
  bubbles: BubbleProps[];
  props: PropItemProps[];
  particles: ParticlesProps[];
  notepad: NotepadCardProps | null;
  caption: CaptionProps | null;
  subtitle?: SubtitleProps | null;
}

const s0AnchorY = (topY: number, a: Actor) => topY + a.maxSize.h;

/** Chester's panic spring sits on the bare seat strip left of the leftmost actor (never on a patient). */
const springBase = (actors: readonly Actor[]): XY => {
  const left = Math.min(...actors.map((a) => a.anchor[0] - a.maxSize.w / 2), 10000);
  return left < 10000 ? [clamp(left - 33, 190, 240), SPRING_DEFAULT_AT[1]] : SPRING_DEFAULT_AT;
};

/** The ONE state rendered on frames 0–5 and N−15…N−1 (bible §6.2). Frame-independent by construction. */
export function state0Scene(b: EpisodeBundle): SceneState {
  const ep = b.episode;
  const s0 = ep.state0;
  return {
    camera: WIDE_CAMERA,
    shake: [0, 0],
    set: {
      windowLayer: s0.window, windowT: 0, neonOn: true, blinds: 0, plantStage: ep.continuity.plantStage,
      diplomaText: ep.continuity.diplomaText, chairState: "intact",
      timer: { dial: s0.timer.dial, angle: -s0.timer.dial * 330, visible: true, ringing: 0, jitter: [0, 0] },
      vignetteOpacity: SET_COLORS.vignetteOpacity,
      patientNo: ep.patientNo,
    },
    doctor: {
      ...s0.doctor, lensNoise: 0, noiseSeed: 0, glassesJump: 0, lean: 1, penPhase: 0, blink: 0, bob: 0, breath: 0,
      placementT: 1, extras: [], patient: b.patients.patient, patientNo: ep.patientNo,
    },
    chester: { ...s0.chester, mouthOpen: 0, blink: 0, pupil: [0, 0], eyeShake: [0, 0], spring: 0, springWobble: 0, springAt: springBase(ep.actors), breath: 0 },
    chirp: { led: s0.chirp.led, ledLevel: 0, tilt: 0, jitter: [0, 0] },
    patients: ep.actors.flatMap((a) => {
      const spec = b.patients[a.id];
      if (!spec) return [];
      return [{
        z: 8,
        props: {
          spec, x: a.anchor[0], y: s0AnchorY(s0.patient.topY, a), scale: s0.patient.scale, sx: 1, sy: 1, rotate: 0,
          brows: s0.patient.brows ?? spec.brows, eyes: s0.patient.eyes ?? spec.eyes, mouth: "X", variant: "base", blink: 0, idle: NO_IDLE,
          motionLines: s0.patient.motionLines, tears: 0, swallow: 0, maxSize: a.maxSize,
        },
      }];
    }),
    shadows: ep.actors.map((a) => ({
      cx: a.anchor[0], cy: POS.shadow.c[1], rx: Math.min(POS.shadow.rx, a.maxSize.w * 0.4), ry: POS.shadow.ry,
      scale: s0.couchShadow.scale, opacity: s0.couchShadow.opacity,
    })),
    bubbles: [],
    props: [],
    particles: [],
    notepad: null,
    caption: { text: s0.caption, scale: 1, opacity: 1 },
  };
}

// ───────────────────────────── prepared (per bundle, once) ─────────────────────────────
const byChar = <S,>(poses: readonly PoseEvent[], char: string) =>
  poses.filter((p) => p.char === char).map((p) => ({ at: p.at, set: p.set as S }));

/** Length of a clip in frames, from its RMS envelope (one value per 1600-sample hop). */
const rmsFrames = (md: MouthData | undefined): number =>
  md && "type" in md && md.type === "rms" ? Math.ceil((md.values.length * md.hopSamples) / 1600) : 0;

/** A doctor hum line: voiced runs (frames relative to `at`) → "Mm-" on the first run, "-hm" after it. */
interface HumLine {
  at: number;
  len: number;
  runs: [number, number][];
}

/** Speech bubble from a patient line: grawlix for the curse clip, one word for `text`. */
interface SpeechLine {
  actor: ActorId | "doctor";
  at: number;
  to: number;
  grawlix: boolean;
  text?: string;
}

/** Tears ramp for the patient's CRY clip. */
interface CryLine {
  actor: ActorId;
  at: number;
  end: number;
}

interface Prepared {
  doctor: { at: number; set: DoctorPose }[];
  chester: { at: number; set: ChesterPose }[];
  chirp: { at: number; set: ChirpPose }[];
  patients: Partial<Record<ActorId, { at: number; set: PatientPose }[]>>;
  lensChanges: { at: number; lens: string }[];
  blinks: { doctor: number[]; chester: number[]; patient: number[] };
  hums: HumLine[];
  glassesJumps: { at: number; amp: number }[];
  speech: SpeechLine[];
  cries: CryLine[];
  /** style v2: doctor speaking lines (RMS mouth) and burned-in subtitles */
  talk: { at: number; md: string }[];
  subtitles: { at: number; to: number; text: string; who: "doctor" | "patient" | "boss" }[];
}

/** The doctor's own voice lines (MM hums) live in assets/vo/doctor/. */
const isDoctorVo = (clip: string): boolean => clip.startsWith("assets/vo/doctor/");

/** Path of the RMS envelope that belongs to a dialogue clip (explicit mouthData, else <clip>.rms.json). */
export const humDataPath = (d: DialogueEvent): string => d.mouthData ?? d.clip.replace(/\.wav$/i, ".rms.json");

function voicedRuns(md: MouthData | undefined): [number, number][] {
  if (!md || !("type" in md) || md.type !== "rms") return [];
  const th = md.thresholds?.B ?? 0.12;
  const per = md.hopSamples / 1600; // frames per value (1 for hop 1600)
  const runs: [number, number][] = [];
  md.values.forEach((v, i) => {
    if (v < th) return;
    const f = Math.floor(i * per);
    const last = runs[runs.length - 1];
    if (last && f - last[1] <= 2) last[1] = f; // bridge gaps of ≤ 2 frames
    else runs.push([f, f]);
  });
  return runs.filter(([a, b]) => b - a >= 1);
}

function prepare(b: EpisodeBundle): Prepared {
  const ep = b.episode;
  const N = ep.durationInFrames;
  // expand §3 expression presets (explicit fields win); glassesJump is a one-off pulse (glassesJumps)
  const doctor = byChar<DoctorPose>(ep.poses, "doctor").map((e) => {
    if (!e.set.expression) return e;
    const { glassesJump: _j, ...preset } = DOCTOR_EXPRESSIONS[e.set.expression] as Record<string, unknown>;
    return { at: e.at, set: { ...(preset as DoctorPose), ...e.set } };
  });
  const glassesJumps = byChar<DoctorPose>(ep.poses, "doctor").flatMap((e) => {
    const preset = e.set.expression ? (DOCTOR_EXPRESSIONS[e.set.expression] as { glassesJump?: number }) : null;
    return preset?.glassesJump ? [{ at: e.at, amp: preset.glassesJump }] : [];
  });
  const chester = byChar<ChesterPose>(ep.poses, "chester").map((e) => {
    if (!e.set.expression) return e;
    const { sigh: _s, breath: _b, ...preset } = CHESTER_EXPRESSIONS[e.set.expression] as Record<string, unknown>;
    return { at: e.at, set: { ...(preset as ChesterPose), ...e.set } };
  });
  const patients: Prepared["patients"] = {};
  for (const a of ep.actors) patients[a.id] = byChar<PatientPose>(ep.poses, a.id);

  // hum mouths only for her MM lines (assets/vo/doctor/…), never for borrowed clips such as the patient's curse
  const hums: HumLine[] = ep.dialogue
    .filter((d) => d.char === "doctor" && d.mouth === "none" && isDoctorVo(d.clip))
    .flatMap((d) => {
      const md = b.mouthData[humDataPath(d)];
      const runs = voicedRuns(md);
      return runs.length ? [{ at: d.at, len: rmsFrames(md), runs }] : [];
    });

  const speech: SpeechLine[] = [];
  const cries: CryLine[] = [];
  // T03 callback: a doctor line that plays a patient's curse clip gets her own grawlix bubble
  const curseClips = Object.values(b.patients).flatMap((sp) => (sp ? [sp.soundLanguage.curse] : []));
  for (const d of ep.dialogue) {
    if (d.char !== "doctor" || !curseClips.includes(d.clip)) continue;
    const len = rmsFrames(b.mouthData[humDataPath(d)]) || 24;
    speech.push({ actor: "doctor", at: d.at, to: d.at + len + 8, grawlix: true });
  }
  for (const d of ep.dialogue) {
    const actor = ep.actors.find((a) => a.id === d.char);
    const spec = actor ? b.patients[actor.id] : undefined;
    if (!actor || !spec) continue;
    const len = rmsFrames(d.mouthData ? b.mouthData[d.mouthData] : undefined) || 24;
    const curse = d.clip === spec.soundLanguage.curse;
    if (ep.style === "v2" ? curse && !d.text : curse || d.text) speech.push({ actor: actor.id, at: d.at, to: d.at + len + 8, grawlix: curse && !d.text, text: d.text });
    if (d.clip === spec.soundLanguage.cry) cries.push({ actor: actor.id, at: d.at, end: d.at + len + 15 });
  }

  const v2 = ep.style === "v2";
  const talk = v2 ? ep.dialogue.filter((d) => d.char === "doctor" && d.mouth === "rms").map((d) => ({ at: d.at, md: humDataPath(d) })) : [];
  const subtitles = v2
    ? ep.dialogue.filter((d) => d.text).map((d) => {
        const len = rmsFrames(b.mouthData[humDataPath(d)]) || 45;
        return { at: d.at, to: d.at + len + 12, text: d.text as string, who: (d.char === "doctor" ? "doctor" : d.char === "boss" ? "boss" : "patient") as "doctor" | "patient" | "boss" };
      })
    : [];

  return {
    talk, subtitles,
    doctor, chester, patients,
    chirp: byChar<ChirpPose>(ep.poses, "chirp"),
    lensChanges: doctor.filter((e) => e.set.lens).map((e) => ({ at: e.at, lens: e.set.lens as string })),
    blinks: {
      doctor: blinkSchedule(`${ep.seed}-doctor`, N),
      chester: blinkSchedule(`${ep.seed}-chester`, N, { minGap: 90, maxGap: 180 }),
      patient: blinkSchedule(`${ep.seed}-patient`, N),
    },
    hums, glassesJumps, speech, cries,
  };
}

// ───────────────────────────── small per-frame helpers ─────────────────────────────

/** Closed-mouth hum while an MM line sounds: "hum" on the first voiced run and between runs, "hum_up" after. */
function humMouth(frame: number, hums: readonly HumLine[]): "hum" | "hum_up" | null {
  for (const h of hums) {
    const t = frame - h.at;
    if (t < 0 || t >= h.len) continue;
    const i = h.runs.findIndex(([a, b]) => t >= a && t <= b);
    if (i >= 0) return i === 0 ? "hum" : "hum_up";
    if (t > h.runs[0][0] && t < h.runs[h.runs.length - 1][1]) return "hum";
  }
  return null;
}

/** One-off upward glasses jump: up in 2 frames, hold 4, settle over 8 (px). */
function glassesJumpAt(frame: number, jumps: readonly { at: number; amp: number }[]): number {
  let out = 0;
  for (const j of jumps) {
    const t = frame - j.at;
    if (t < 0 || t >= 14) continue;
    const k = t < 2 ? (t + 1) / 3 : t < 6 ? 1 : 1 - progress(t, 6, 8, "inOut");
    out = Math.max(out, j.amp * k);
  }
  return out;
}

/** Speech bubble body (scene px): above the solo patient, inside the action zone and visible in WIDE and PATIENT. */
const SPEECH_BOX: Rect = [240, 600, 580, 762];
/** The doctor's speech bubble: above her perm (over the diploma / right half of the window), tail to her head. */
const DOCTOR_SPEECH_BOX: Rect = [556, 372, 876, 504];
const DOCTOR_SPEECH_TAIL: XY = [716, 548];

/** Wall-decor jolt: ≈ 60 % of the shakes flagged `decor` (the landlord's knocks), on top of the camera shake. */
function decorJoltAt(frame: number, shakes: readonly ShakeEvent[]): XY | undefined {
  const flagged = shakes.filter((sh) => sh.decor);
  if (!flagged.length) return undefined;
  const [dx, dy] = shakeAt(frame, flagged);
  return dx === 0 && dy === 0 ? undefined : [0.6 * dx, 0.6 * dy];
}

// ───────────────────────────── resolver ─────────────────────────────
function resolveScene(b: EpisodeBundle, pre: Prepared, frame: number): SceneState {
  const ep = b.episode;
  const N = ep.durationInFrames;
  const s0 = state0Scene(b);
  const camera = cameraAt(frame, ep.shots);

  // doctor
  const d = poseAt<Record<string, unknown>>(pre.doctor, frame, { ...s0.doctor }, ["glassesY", "headTilt", "lean"]) as unknown as DoctorProps;
  const lens = lensAt(pre.lensChanges, frame, N, ep.state0.doctor.lens);
  const penChange = lastChange(pre.doctor, "pen", frame);
  const placeChange = lastChange(pre.doctor, "placement", frame);
  const hum = humMouth(frame, pre.hums);
  const tl = pre.talk.find((t) => frame >= t.at && frame < t.at + rmsFrames(b.mouthData[t.md]));
  const talkShape = tl ? mouthAt(b.mouthData[tl.md], frame, tl.at) : null;
  const talkMouth = talkShape === null ? null : talkShape === "D" ? "O" : talkShape === "B" ? "o_small" : "flat";
  const doctor: NoLayer<DoctorProps> = {
    ...s0.doctor,
    brows: d.brows,
    mouth: hum ?? (talkMouth as DoctorProps["mouth"] | null) ?? d.mouth,
    glassesY: d.glassesY, headTilt: d.headTilt, lean: d.lean ?? 1, pen: d.pen,
    glassesJump: glassesJumpAt(frame, pre.glassesJumps),
    placement: d.placement, extras: d.extras ?? [],
    lens: lens.lens as LensIcon, lensNoise: lens.noise, noiseSeed: lens.noiseSeed,
    penPhase: d.pen === "writing" ? (frame % 20) / 20 : d.pen === "click" && penChange ? progress(frame, penChange.at, 4) : 0,
    placementT: placeChange ? progress(frame, placeChange.at, 12, "in") : 1,
    blink: blinkAt(frame, pre.blinks.doctor),
    bob: idleBob(frame, N, { amp: 2, period: 80 }),
    breath: breath(frame, N, { amp: 0.006, period: 110 }),
  };

  // chester
  const c = poseAt<Record<string, unknown>>(pre.chester, frame, { ...s0.chester, spring: false }, ["sag"]);
  const springChange = lastChange(pre.chester, "spring", frame);
  const poke = springChange && springChange.value ? springPoke(frame, springChange.at) : { out: 0, wobble: 0 };
  const chester: NoLayer<ChesterProps> = {
    ...s0.chester,
    eyes: c.eyes as ChesterProps["eyes"], mouth: c.mouth as ChesterProps["mouth"], sag: c.sag as number,
    blink: blinkAt(frame, pre.blinks.chester),
    eyeShake: c.eyes === "wide_shake" ? [3 * noise("chester-shake", `x${frame}`), 3 * noise("chester-shake", `y${frame}`)] : [0, 0],
    spring: poke.out, springWobble: poke.wobble,
  };

  // chirp
  const ledChange = lastChange(pre.chirp, "led", frame);
  const led = (ledChange?.value as ChirpLed | undefined) ?? "off";
  const chirp: ChirpProps = { led, ...chirpAt(led, frame, ledChange?.at ?? 0) };

  // patients
  const patients: PatientRender[] = [];
  const shadows: PatientShadowProps[] = [];
  const patientTops: Partial<Record<ActorId, XY>> = {};
  ep.actors.forEach((a, i) => {
    const base = s0.patients.find((p) => p.props.spec === b.patients[a.id]);
    const spec = b.patients[a.id] as PatientSpec | undefined;
    if (!base || !spec) return;
    const pose = poseAt<Record<string, unknown>>(pre.patients[a.id] ?? [], frame, {});
    const landChange = lastChange(pre.patients[a.id] ?? [], "land", frame);
    const m = motionAt(ep.motion, a.id, frame);
    // the track motionAt() used: motion lines only on tracks that go DOWN (falls), not on the exit upwards
    const track = m ? ep.motion.filter((t) => t.char === a.id && t.from <= frame).sort((p, q) => p.from - q.from).pop() : undefined;
    const down = !!track && track.path.length > 1 && track.path[track.path.length - 1][1] > track.path[0][1];
    const x = m ? m.x : base.props.x;
    const y = m ? m.y : base.props.y;
    const seated = !m || (!m.moving && Math.abs(y - a.anchor[1]) < 1);
    const falling = !!m && m.moving && down && y < a.anchor[1] - 1;
    const sq = landChange ? landing(landChange.value as PatientProps["spec"]["landing"], frame, landChange.at, spec.seed) : { sx: 1, sy: 1, dy: 0, rot: 0 };
    const line = [...ep.dialogue].reverse().find((l) => l.char === a.id && l.at <= frame && l.mouth !== "none");
    const cry = pre.cries.find((cr) => cr.actor === a.id && frame >= cr.at && frame < cr.end + 12);
    const tears = cry ? progress(frame, cry.at, 8, "out") * (1 - progress(frame, cry.end, 12, "in")) : 0;
    // sobbing: scaleY 1 → 0.96 at ≈ 4 Hz (7.5 frames) while the tears run
    const sob = cry && tears > 0 ? 1 - 0.04 * tears * (0.5 - 0.5 * Math.cos((2 * Math.PI * (frame - cry.at)) / 7.5)) : 1;
    // control panel (pose `panel`): "fence" = advice applied → amber LED blinks (4 on / 4 off) + fence glyph;
    // the paper slot clamps shut with a 3-frame squash when it switches on
    const panelChange = lastChange(pre.patients[a.id] ?? [], "panel", frame);
    const fenceOn = panelChange?.value === "fence";
    const panelT = panelChange ? frame - panelChange.at : 0;
    const panel = fenceOn ? { led: panelT % 8 < 4 ? 1 : 0.25, glyph: "fence" as const } : undefined;
    const clamp3 = fenceOn && panelT < 3 ? [0.9, 0.93, 0.97][panelT] : 1;
    const scale = m ? m.scale : 1;
    patients.push({
      z: m?.z ?? 8,
      props: {
        ...base.props,
        x, y: y + sq.dy, scale, sx: sq.sx * (2 - clamp3), sy: sq.sy * sob * clamp3, rotate: (m ? m.rotate : 0) + sq.rot,
        brows: (pose.brows as PatientProps["brows"]) ?? spec.brows,
        eyes: (pose.eyesSwap as PatientProps["eyes"]) ?? spec.eyes,
        variant: (pose.variant as PatientProps["variant"]) ?? "base",
        mouth: line?.mouthData ? mouthAt(b.mouthData[line.mouthData], frame, line.at) : "X",
        blink: blinkAt(frame, pre.blinks.patient.map((f) => f + i * 17)),
        idle: seated && m ? patientIdle(spec.idle, frame, N, spec.seed) : NO_IDLE,
        motionLines: !m || falling,
        tears,
        tearsT: cry ? frame - cry.at : 0,
        panel,
        label: (() => {
          const lc = lastChange(pre.patients[a.id] ?? [], "label", frame);
          if (!lc || !spec.header) return undefined;
          const st = lastChange(pre.patients[a.id] ?? [], "labelStyle", frame);
          return { text: String(lc.value), style: ((st?.value as string) ?? "print") as "print" | "paint" | "drip", t: frame - Math.max(lc.at, st?.at ?? 0) };
        })(),
        swallow: m?.swallow ? m.t : 0,
      },
    });
    patientTops[a.id] = [x, y - makePatient(spec, a.maxSize).h * scale];
    shadows.push({
      ...s0.shadows[i],
      cx: x,
      scale: interpolateClamp(y, [0, base.props.y, a.anchor[1]], [0.6, 1, 1.1]),
      opacity: m?.z != null ? 0 : s0.shadows[i].opacity,
    });
  });

  // set
  const win = ep.windowLayer.find((w) => frame >= w.from && frame <= w.to);
  const timer = dialAt(frame, ep.timer, N);
  const set: NoLayer<SetPropsExt> = {
    ...s0.set,
    windowLayer: win?.layer ?? "calm",
    windowT: win ? frame - win.from : 0,
    timer: { dial: timer.dial, angle: timer.angle, visible: timer.visible, ringing: timer.ringing, jitter: [0, 0] },
    decorJolt: decorJoltAt(frame, ep.shakes),
  };

  // overlays: memory bubbles (episode.bubbles) + speech bubbles (from dialogue)
  const tail: XY = [POS.patient.soloAnchor[0], POS.patient.soloBox[1]];
  const bubbles: BubbleProps[] = ep.bubbles.flatMap((bb) => {
    const st = bubbleInflate(frame, bb.from, bb.to);
    if (!st.visible) return [];
    return [{ kind: "memory" as const, box: POS.bubble, tail, inflate: st.inflate, dots: st.dots, vignette: assetKey(bb.vignette), moving: bb.moving, t: st.t }];
  });
  for (const sp of pre.speech) {
    if (frame < sp.at || frame > sp.to) continue;
    const out = popOut(frame, sp.to + 1, 5);
    const grow = progress(frame, sp.at, 4, "out") * out;
    const isDoc = sp.actor === "doctor";
    const top = sp.actor === "doctor" ? DOCTOR_SPEECH_TAIL : patientTops[sp.actor] ?? tail;
    const box = isDoc ? DOCTOR_SPEECH_BOX : SPEECH_BOX;
    bubbles.push({
      kind: "speech",
      box,
      tail: isDoc ? DOCTOR_SPEECH_TAIL : [clamp(top[0] + 30, SPEECH_BOX[0] + 70, SPEECH_BOX[2] - 70), Math.max(SPEECH_BOX[3] + 30, top[1] + 26)],
      inflate: popIn(frame, sp.at, { settle: 12 }) * out,
      dots: [grow, grow, grow],
      t: frame - sp.at,
      grawlix: sp.grawlix ? grawlix(frame, sp.at + 2, "#$%&!", `${ep.seed}-${sp.at}`) : undefined,
      text: sp.text,
    });
  }
  const props: PropItemProps[] = ep.props.flatMap((p) => {
    const st = propAt(p, frame);
    return st ? [{ id: assetKey(p.svg), x: st.x, y: st.y, scale: st.scale, rotate: st.rotate, opacity: st.opacity, t: st.t, motionLines: st.motionLines, heading: st.heading }] : [];
  });
  // reset ritual: the doctor's left arm follows the cloth prop
  const cloth = props.find((pi) => pi.id === "cloth");
  if (cloth) doctor.wipeHand = [cloth.x, cloth.y];
  const particles: ParticlesProps[] = ep.particles.flatMap((pe) => {
    const ps = particlesAt(frame, pe, ep.seed);
    return ps.length ? [{ type: pe.type, particles: ps }] : [];
  });
  let notepad: NotepadCardProps | null = null;
  if (camera.card === "notepad") {
    const n = ep.notepad.find((e) => frame >= e.from && frame <= e.to);
    if (n) {
      const dr = drawOn(frame, n.from + 6, n.drawOnFrames, 8, `${ep.seed}-${n.from}`);
      notepad = { doodle: assetKey(n.doodle), strokes: dr.strokes, drawProgress: dr.total, boilSeed: dr.boilSeed, adviceLabel: n.adviceLabel, flip: progress(frame, n.from, 6, "out") };
    }
  }
  return {
    camera, shake: shakeAt(frame, ep.shakes), set, doctor, chester, chirp, patients, shadows, bubbles, props, particles, notepad,
    caption: captionAt(frame, N, ep.captions),
    subtitle: (() => {
      const st = pre.subtitles.find((x) => frame >= x.at && frame <= x.to);
      return st ? { text: st.text, who: st.who, k: Math.min(1, (frame - st.at + 1) / 4, (st.to - frame + 1) / 4) } : null;
    })(),
  };
}

// ───────────────────────────── layer stack (bible §5.2) ─────────────────────────────
export const Scene: React.FC<{ s: SceneState }> = ({ s }) => {
  const inWindow = s.patients.filter((p) => p.z === 1);
  const front = s.patients.filter((p) => p.z !== 1);
  const doctorInCouch = s.doctor.placement === "sunk_in_couch";
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: "block" }}>
      {s.notepad ? (
        <NotepadCard {...s.notepad} />
      ) : (
        <g transform={cameraTransform(s.camera, s.shake)}>
          <Set layer="background" {...s.set} />
          <Set
            layer="window"
            {...s.set}
            windowSlot={inWindow.map((p, i) => <Patient key={i} {...p.props} />)}
          />
          <Set layer="decor" {...s.set} />
          <Chirp {...s.chirp} />
          <Set layer="chair" {...s.set} />
          {doctorInCouch ? null : <Doctor layer="body" {...s.doctor} />}
          <Chester layer="back" {...s.chester} />
          {s.shadows.map((sh, i) => <PatientShadow key={i} {...sh} />)}
          {doctorInCouch ? <Doctor layer="body" {...s.doctor} /> : null}
          {front.map((p, i) => <Patient key={i} {...p.props} />)}
          <Chester layer="front" {...s.chester} />
          <Set layer="table" {...s.set} />
          <Doctor layer="hands" {...s.doctor} />
          {s.bubbles.map((bb, i) => <Bubble key={i} {...bb} />)}
          {s.particles.map((pp, i) => <Particles key={i} {...pp} />)}
          {s.props.map((pi, i) => <PropItem key={i} {...pi} />)}
        </g>
      )}
      {s.caption ? <Caption {...s.caption} /> : null}
      {s.subtitle ? <Subtitle {...s.subtitle} /> : null}
      <Set layer="vignette" {...s.set} />
    </svg>
  );
};

// ───────────────────────────── composition component ─────────────────────────────
export type EpisodeCompProps = { episodeId: string; bundle: EpisodeBundle | null };

export const Episode: React.FC<EpisodeCompProps> = ({ bundle }) => {
  const frame = useCurrentFrame();
  const pre = useMemo(() => (bundle ? prepare(bundle) : null), [bundle]);
  const s0 = useMemo(() => (bundle ? state0Scene(bundle) : null), [bundle]);
  if (!bundle || !pre || !s0) return <AbsoluteFill style={{ backgroundColor: "#000" }} />;
  const N = bundle.episode.durationInFrames;
  const s = withState0(frame, N, () => s0, () => resolveScene(bundle, pre, frame));
  return (
    <AbsoluteFill style={{ backgroundColor: SET_COLORS.wall }}>
      <Scene s={s} />
      <EpisodeAudio episode={bundle.episode} episodeId={bundle.episodeId} missingAudio={bundle.missingAudio} />
    </AbsoluteFill>
  );
};
