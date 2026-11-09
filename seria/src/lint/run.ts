// Episode lint (bible §9.5). Owned by the episode/audio builder.
// Usage: tsx src/lint/run.ts [EP=S01E01] [--dev]   (--dev: missing assets / placeholder audio are warnings, not errors)
// Runs in Node: imports only pure TS (enums, schema types, engine constants/tween/primitives, the patient
// generator and the registries) — no JSX, fonts or engine/index.
//
// Rules implemented (numbers = bible §9.5):
//   1 duration/fps/size, 48 kHz audio          2 S0 static checks + continuity into S0 (pixels: tools/check_loop.sh)
//   3 no SFX/VO in frames 0–5 or the last 200 ms (lengths read from the WAV files)
//   4 tick grid (bed file transients) + beds exactly N×1600 samples + seam continuity
//   5 ritual frames consistent with ritual(N); no hard-coded ritual frames in src/
//   6 captions        7 title         8 series ledger rules 1–8 (ledger/series_ledger.json)
//   9 determinism     10 assets/registries/icon/placeholders     11 clear English words / doctor sentence
//   12 blocklist (src/lint/blocklist.json)    13 patient adult coding, eyes, CRY shots, swaps
//   14 exit-type requirements     15 enums + mouthData + voicePreset     16 actor box vs maxSize and Chester's face, every frame
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import * as E from "../enums";
import { FPS, SAMPLE_RATE, isAllowedDuration, ritual } from "../engine/constants";
import { poseAt } from "../engine/tween";
import { landing, motionAt, patientIdle } from "../engine/primitives";
import { POS } from "../engine/layout";
import type { DialogueEvent, Episode, PatientSpec, PoseEvent, SeriesLedger, SfxEvent } from "../schema";
import { SERIES, patientNoLabel, s0Caption } from "../series";
import { makePatient } from "../components/patients/generator";
import { DOODLE_KEYS, PROP_KEYS, RITUAL_PROP_KEYS, VIGNETTE_KEYS, VIGNETTE_MOVING } from "../components/props/registry";
import { WINDOW_LAYER_IDS } from "../components/set/registry";

const ROOT = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const EP = args.find((a) => /^S\d{2}E\d{2}$/.test(a)) ?? "S01E01";
const DEV = args.includes("--dev");
const errors: string[] = [];
const warns: string[] = [];
const infos: string[] = [];
const err = (rule: number, msg: string) => errors.push(`[lint ${rule}] ${msg}`);
const warn = (rule: number, msg: string) => warns.push(`[lint ${rule}] ${msg}`);
const info = (rule: number, msg: string) => infos.push(`[lint ${rule}] ${msg}`);
const devErr = (rule: number, msg: string) => (DEV ? warn(rule, msg) : err(rule, msg));

const EP_DIR = join(ROOT, "episodes", EP);
const resolveAsset = (p: string) => (p.startsWith("assets/") || p.startsWith("episodes/") ? join(ROOT, p) : join(EP_DIR, p));
const key = (p: string) => (p.split("/").pop() ?? p).replace(/\.[a-z0-9]+$/i, "");
const readJson = <T,>(f: string): T => JSON.parse(readFileSync(f, "utf8")) as T;

// ───────────────────────────── WAV reader ─────────────────────────────
interface Wav { samples: number; rate: number; ch: number; bits: number; data: Buffer }
function readWav(file: string): Wav | null {
  const b = readFileSync(file);
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WAVE") return null;
  let off = 12, ch = 0, bits = 0, rate = 0;
  while (off + 8 <= b.length) {
    const id = b.toString("ascii", off, off + 4);
    const size = b.readUInt32LE(off + 4);
    if (id === "fmt ") { ch = b.readUInt16LE(off + 10); rate = b.readUInt32LE(off + 12); bits = b.readUInt16LE(off + 22); }
    if (id === "data") {
      const data = b.subarray(off + 8, off + 8 + size);
      return { samples: Math.floor(size / (ch * (bits / 8))), rate, ch, bits, data };
    }
    off += 8 + size + (size % 2);
  }
  return null;
}
/** Mono (channel max-abs) sample value at index i, −1..1. */
function sampleAt(w: Wav, i: number): number {
  const bps = w.bits / 8;
  let m = 0;
  for (let c = 0; c < w.ch; c++) {
    const o = (i * w.ch + c) * bps;
    let v = 0;
    if (w.bits === 16) v = w.data.readInt16LE(o) / 32768;
    else if (w.bits === 24) v = w.data.readIntLE(o, 3) / 8388608;
    else if (w.bits === 32) v = w.data.readInt32LE(o) / 2147483648;
    if (Math.abs(v) > Math.abs(m)) m = v;
  }
  return m;
}
const wavCache = new Map<string, Wav | null>();
const wav = (p: string): Wav | null => {
  const f = resolveAsset(p);
  if (!wavCache.has(f)) wavCache.set(f, existsSync(f) ? readWav(f) : null);
  return wavCache.get(f) ?? null;
};

// ───────────────────────────── load ─────────────────────────────
const ep = readJson<Episode>(join(EP_DIR, "episode.json"));
const N = ep.durationInFrames;
const R = ritual(N);
const blocklist = readJson<Record<string, string[]>>(join(ROOT, "src/lint/blocklist.json"));
const patients: Record<string, PatientSpec> = {};
for (const a of ep.actors) {
  const f = resolveAsset(a.ref);
  if (existsSync(f)) patients[a.id] = readJson<PatientSpec>(f);
  else err(10, `actor ref missing: ${a.ref}`);
}
const manifestFile = join(ROOT, "assets/audio_manifest.json");
const manifest = existsSync(manifestFile) ? readJson<{ clips: { id: string; path: string; source: string }[] }>(manifestFile) : null;
const isActor = (c: string) => (E.ACTOR_IDS as readonly string[]).includes(c);
const words = (t: string) => t.trim().split(/\s+/).filter(Boolean);

// ───────────────────────────── 1. format ─────────────────────────────
if (!isAllowedDuration(N)) err(1, `durationInFrames ${N} not in ${E.ALLOWED_DURATIONS.join(", ")}`);
if (ep.fps !== FPS || ep.width !== 1080 || ep.height !== 1920) err(1, `fps/size must be 30 / 1080x1920 (got ${ep.fps} / ${ep.width}x${ep.height})`);

// ───────────────────────────── 2. S0 (static) ─────────────────────────────
const S0 = ep.state0;
const expectS0: [string, unknown, unknown][] = [
  ["camera", S0.camera, "WIDE"], ["doctor.pen", S0.doctor.pen, "raised"], ["doctor.brows", S0.doctor.brows, "neutral"],
  ["doctor.mouth", S0.doctor.mouth, "flat"], ["doctor.headTilt", S0.doctor.headTilt, 0], ["doctor.glassesY", S0.doctor.glassesY, 0],
  ["doctor.lens", S0.doctor.lens, "patient_file_icon"], ["doctor.placement", S0.doctor.placement, "chair"],
  ["chester.eyes", S0.chester.eyes, "wide_up"], ["chester.mouth", S0.chester.mouth, "tight"], ["chester.sag", S0.chester.sag, 0.02],
  ["chirp.led", S0.chirp.led, "off"], ["patient.scale", S0.patient.scale, 1], ["patient.motionLines", S0.patient.motionLines, true],
  ["timer.dial", S0.timer.dial, 1], ["window", S0.window, "calm"], ["couchShadow.scale", S0.couchShadow.scale, 1], ["couchShadow.opacity", S0.couchShadow.opacity, 0.6],
];
for (const [k, v, want] of expectS0) if (v !== want) err(2, `state0.${k} = ${JSON.stringify(v)} (bible §6.2 S0 needs ${JSON.stringify(want)})`);
if (S0.patient.topY !== POS.patient.s0TopY) warn(2, `state0.patient.topY = ${S0.patient.topY} (bible default ${POS.patient.s0TopY})`);
if (S0.patient.topY < 220) err(2, `state0.patient.topY ${S0.patient.topY} puts the puppet into the top UI zone (< 220)`);
const solo = patients.patient;
if (solo && S0.caption !== s0Caption(ep.patientNo, solo.captionName)) err(2, `state0.caption "${S0.caption}" ≠ "${s0Caption(ep.patientNo, solo.captionName)}"`);
// shots: contiguous cover of 0..N−1, WIDE at both ends
const shots = [...ep.shots].sort((a, b) => a.from - b.from);
let cursor = 0;
for (const s of shots) {
  if (s.from !== cursor) err(2, `shots: gap/overlap at frame ${cursor} (next shot starts at ${s.from})`);
  if (s.to < s.from) err(2, `shot ${s.from}–${s.to} is empty`);
  cursor = s.to + 1;
}
if (cursor !== N) err(2, `shots end at ${cursor - 1}, must end at N−1 = ${N - 1}`);
const shotAt = (f: number) => shots.find((s) => f >= s.from && f <= s.to);
if (shotAt(0)?.camera !== "WIDE" || shotAt(N - 1)?.camera !== "WIDE") err(2, `frame 0 and frame N−1 must be WIDE`);
// nothing may be scheduled inside the frozen S0 frames
const inHead = (f: number) => f >= 0 && f <= 5;
const inTail = (f: number) => f >= R.HOLD;
for (const p of ep.poses) if (inHead(p.at) || inTail(p.at)) err(2, `pose ${p.char}@${p.at} inside S0 frames (0–5 / ${R.HOLD}–${N - 1})`);
for (const m of ep.motion) {
  if (m.from <= 5) err(2, `motion ${m.char} ${m.from}–${m.to} starts inside S0 head (first allowed frame 6)`);
  if (m.to >= R.HOLD) err(2, `motion ${m.char} ${m.from}–${m.to} runs into the S0 hold (${R.HOLD}+)`);
}
const ritualProp = (svg: string) => (RITUAL_PROP_KEYS as readonly string[]).includes(svg.replace(/^.*\//, "").replace(/\.[a-z0-9]+$/i, ""));
for (const x of [...ep.props.filter((p) => !ritualProp(p.svg)), ...ep.bubbles, ...ep.notepad, ...ep.particles]) {
  if (x.from <= 5 || x.to >= R.GLASSES) err(2, `overlay ${x.from}–${x.to} must live inside [6, ${R.GLASSES - 1}] (reset happens off-screen behind the GLASSES cut)`);
}
// reset-ritual props (cloth, lens glint) live only inside the GLASSES reset shot, never in S0
for (const p of ep.props.filter((q) => ritualProp(q.svg))) {
  if (p.from < R.GLASSES || p.to >= R.S0_IN) err(2, `ritual prop ${p.id} ${p.from}–${p.to} must live inside the GLASSES reset [${R.GLASSES}, ${R.S0_IN - 1}]`);
}
for (const p of ep.props) {
  if (p.flightFrames !== undefined && (!Number.isInteger(p.flightFrames) || p.flightFrames < 1 || p.flightFrames > p.to - p.from)) err(15, `prop ${p.id}: flightFrames ${p.flightFrames} outside 1…${p.to - p.from}`);
  if (p.ease !== undefined && !(E.EASES as readonly string[]).includes(p.ease)) err(15, `prop ${p.id}: ease ${p.ease}`);
}
for (const pe of ep.particles) {
  if (pe.dir !== undefined && (pe.dir < -360 || pe.dir > 720)) err(15, `particles @${pe.from}: dir ${pe.dir}`);
  if (pe.spread !== undefined && (pe.spread <= 0 || pe.spread > 360)) err(15, `particles @${pe.from}: spread ${pe.spread} outside (0, 360]`);
  if (pe.speed !== undefined && (pe.speed < 0.2 || pe.speed > 5)) err(15, `particles @${pe.from}: speed ${pe.speed} outside 0.2…5`);
  if (pe.avoid && (pe.avoid.length !== 4 || pe.avoid[0] >= pe.avoid[2] || pe.avoid[1] >= pe.avoid[3])) err(15, `particles @${pe.from}: avoid rect ${JSON.stringify(pe.avoid)}`);
}
// music ducks / swells (bed.musicDucks): inside [6, GLASSES) including the ramps, so both file ends are identical
for (const d of ep.bed.musicDucks ?? []) {
  const r = d.rampFrames ?? 3;
  if (d.to < d.from) err(4, `bed.musicDucks ${d.from}–${d.to} is empty`);
  if (d.from - r < 6 || d.to + r >= R.GLASSES) err(4, `bed.musicDucks ${d.from}–${d.to} (ramp ${r}) must stay inside [6, ${R.GLASSES - 1}] (the music must be identical at both file ends)`);
  if (d.gainDb < -60 || d.gainDb > 8) err(4, `bed.musicDucks ${d.from}–${d.to}: gainDb ${d.gainDb} outside −60…+8`);
  if (r < 0 || r > 30) err(4, `bed.musicDucks ${d.from}–${d.to}: rampFrames ${r} outside 0…30`);
}
for (const s of ep.shakes) if (s.at <= 5 || s.at + s.decayFrames > R.GLASSES) err(2, `shake @${s.at} overlaps S0 / the reset`);
// lensSwap must not START with static outside [15, N−75)
for (const p of ep.poses) if (p.char === "doctor" && (p.set as { lens?: string }).lens && p.at < 15) err(2, `doctor lens change at ${p.at} < 15 (no lensSwap before frame 15)`);
for (const p of ep.poses) if (p.char === "doctor" && (p.set as { lens?: string }).lens && p.at >= R.BLINK_END) info(2, `doctor lens change at ${p.at} ≥ N−75: instant swap, no static (engine)`);
// continuity: the resolved pose just before HOLD must equal S0 (so the hold does not pop)
const poseOf = <T extends object>(char: string, base: T, numeric: string[]) =>
  poseAt<T>(ep.poses.filter((p) => p.char === char).map((p) => ({ at: p.at, set: expandPreset(p) })), R.HOLD - 1, base, numeric);
function expandPreset(p: PoseEvent): object {
  const s = p.set as Record<string, unknown>;
  if (p.char === "doctor" && typeof s.expression === "string") {
    const { glassesJump: _g, ...preset } = E.DOCTOR_EXPRESSIONS[s.expression as E.DoctorExpression] as Record<string, unknown>;
    return { ...preset, ...s };
  }
  if (p.char === "chester" && typeof s.expression === "string") {
    const { sigh: _s, breath: _b, ...preset } = E.CHESTER_EXPRESSIONS[s.expression as E.ChesterExpression] as Record<string, unknown>;
    return { ...preset, ...s };
  }
  return s;
}
const dEnd = poseOf<Record<string, unknown>>("doctor", { ...S0.doctor, extras: [] }, ["glassesY", "headTilt", "lean"]);
for (const k of Object.keys(S0.doctor) as (keyof typeof S0.doctor)[]) if (dEnd[k] !== S0.doctor[k]) err(2, `doctor.${k} at frame ${R.HOLD - 1} = ${JSON.stringify(dEnd[k])}, S0 needs ${JSON.stringify(S0.doctor[k])} (reset it by S0_IN)`);
if (Array.isArray(dEnd.extras) && dEnd.extras.length) err(2, `doctor.extras at ${R.HOLD - 1} = ${JSON.stringify(dEnd.extras)} (S0 has none)`);
if (dEnd.lean !== undefined && dEnd.lean !== 1) err(2, `doctor.lean at ${R.HOLD - 1} = ${dEnd.lean} (S0 = 1)`);
const cEnd = poseOf<Record<string, unknown>>("chester", { ...S0.chester, spring: false }, ["sag"]);
for (const k of ["eyes", "mouth", "sag"] as const) if (cEnd[k] !== S0.chester[k]) err(2, `chester.${k} at ${R.HOLD - 1} = ${JSON.stringify(cEnd[k])}, S0 needs ${JSON.stringify(S0.chester[k])}`);
if (cEnd.spring) err(2, `chester.spring still out at ${R.HOLD - 1}`);
const chEnd = poseOf<Record<string, unknown>>("chirp", { led: "off" }, []);
if (chEnd.led !== "off") err(2, `chirp.led at ${R.HOLD - 1} = ${chEnd.led} (S0 = off)`);
if (S0.patient.eyes !== undefined && !(E.PATIENT_EYES as readonly string[]).includes(S0.patient.eyes)) err(15, `state0.patient.eyes "${S0.patient.eyes}" not in enum`);
if (S0.patient.eyes !== undefined && E.PATIENT_EYES_SWAP_ONLY.includes(S0.patient.eyes)) err(13, `state0.patient.eyes "${S0.patient.eyes}" is swap-only (≤ 30 frames)`);
if (S0.patient.brows !== undefined && !(E.PATIENT_BROWS as readonly string[]).includes(S0.patient.brows)) err(15, `state0.patient.brows "${S0.patient.brows}" not in enum`);
for (const a of ep.actors) {
  const pEnd = poseOf<Record<string, unknown>>(a.id, {}, []);
  const spec = patients[a.id];
  // S0 eyes/brows: state0.patient.eyes/brows when given, else the patient.json base pair
  const s0Brows = S0.patient.brows ?? spec?.brows;
  const s0Eyes = S0.patient.eyes ?? spec?.eyes;
  if (spec && (pEnd.brows ?? spec.brows) !== s0Brows) err(2, `${a.id}.brows at ${R.HOLD - 1} = ${pEnd.brows ?? spec.brows}, S0 shows ${s0Brows} (set it in the S0_IN pose)`);
  if (spec && (pEnd.eyesSwap ?? spec.eyes) !== s0Eyes) err(2, `${a.id}.eyesSwap at ${R.HOLD - 1} = ${pEnd.eyesSwap ?? spec.eyes}, S0 shows ${s0Eyes} (set it in the S0_IN pose)`);
  if (pEnd.panel !== undefined && pEnd.panel !== "base") err(2, `${a.id}.panel at ${R.HOLD - 1} = ${pEnd.panel} (S0 = base)`);
  if (pEnd.variant !== undefined && pEnd.variant !== "base") err(2, `${a.id}.variant at ${R.HOLD - 1} = ${pEnd.variant} (S0 = base)`);
  const m = motionAt(ep.motion, a.id, R.HOLD - 1);
  const want = [a.anchor[0], S0.patient.topY + a.maxSize.h];
  if (!m) warn(2, `${a.id}: no motion track; S0 hover position ${want} is never reached on screen`);
  else if (Math.abs(m.x - want[0]) > 0.5 || Math.abs(m.y - want[1]) > 0.5 || Math.abs(m.scale - 1) > 1e-6 || m.z !== null)
    err(2, `${a.id} at ${R.HOLD - 1} is at (${m.x.toFixed(1)}, ${m.y.toFixed(1)}) scale ${m.scale} z ${m.z}; S0 needs (${want[0]}, ${want[1]}) scale 1 z 8`);
}
const winAt = (f: number) => ep.windowLayer.find((w) => f >= w.from && f <= w.to)?.layer;
for (const f of [0, 5, R.GLASSES, R.S0_IN, N - 1]) if (winAt(f) !== "calm") err(2, `window layer at frame ${f} = ${winAt(f) ?? "(none)"} (must be calm from GLASSES on and in S0)`);

// ───────────────────────────── 3. audio events ─────────────────────────────
interface Clip { at: number; clip: string; kind: string; gainDb?: number }
const clips: Clip[] = [
  ...ep.sfx.map((s: SfxEvent) => ({ ...s, kind: "sfx" })),
  ...ep.dialogue.map((d: DialogueEvent) => ({ at: d.at, clip: d.clip, gainDb: d.gainDb, kind: `dialogue:${d.char}` })),
];
const clipEnd = new Map<Clip, number>();
for (const c of clips) {
  if (c.at <= 5) err(3, `${c.kind} ${c.clip} starts at frame ${c.at} (frames 0–5 are S0)`);
  if (c.at >= N) err(3, `${c.kind} ${c.clip} starts after the end (${c.at})`);
  const w = wav(c.clip);
  if (!w) {
    if (existsSync(resolveAsset(c.clip))) warn(3, `cannot read WAV header: ${c.clip}`);
    else devErr(10, `audio missing: ${c.clip}`);
    continue;
  }
  if (w.rate !== SAMPLE_RATE) err(1, `${c.clip} is ${w.rate} Hz (must be 48000)`);
  const endS = c.at / FPS + w.samples / w.rate;
  clipEnd.set(c, endS);
  if (endS > N / FPS - 0.2) err(3, `${c.clip} @${c.at} ends at ${endS.toFixed(3)} s (> ${(N / FPS - 0.2).toFixed(1)} s: sounds in the last 200 ms)`);
  else if (endS > R.LAST_SFX_END_S + 1e-6) warn(3, `${c.clip} @${c.at} ends at ${endS.toFixed(3)} s (ritual wants ≤ ${R.LAST_SFX_END_S.toFixed(1)} s)`);
}

// ───────────────────────────── 4. bed ─────────────────────────────
if (ep.bed.tickPeriodSamples !== 24000 || ep.bed.tickOffsetSamples !== 12000) err(4, `tick grid must be 24000 / 12000 samples (got ${ep.bed.tickPeriodSamples} / ${ep.bed.tickOffsetSamples})`);
const tickBed = ep.bed.tickBed ?? `assets/sfx/SFX01_tick_bed${N / FPS}.wav`;
for (const [name, p] of [["tick bed", tickBed], ["room tone", ep.bed.roomTone], ["music", ep.bed.music]] as const) {
  const w = wav(p);
  if (!w) { devErr(10, `bed missing: ${p}`); continue; }
  if (w.samples !== R.TOTAL_SAMPLES || w.rate !== SAMPLE_RATE) { err(4, `${name} ${p}: ${w.samples} samples @ ${w.rate} Hz (need ${R.TOTAL_SAMPLES} @ 48000)`); continue; }
  const jump = Math.abs(sampleAt(w, w.samples - 1) - sampleAt(w, 0));
  if (jump > 0.02) err(4, `${name}: seam jump |x[L−1] − x[0]| = ${jump.toFixed(4)} (click at the loop point; rebuild with report command 5)`);
  if (name === "tick bed") {
    const P = ep.bed.tickPeriodSamples, O = ep.bed.tickOffsetSamples;
    let bad = 0, worst = "";
    for (let k = 0; (k + 1) * P <= w.samples; k++) {
      let am = 0, av = 0, pre = 0;
      for (let i = k * P; i < (k + 1) * P; i++) {
        const v = Math.abs(sampleAt(w, i));
        if (v > av) { av = v; am = i - k * P; }
        if (i - k * P < O - 4) pre = Math.max(pre, v);
      }
      if (am < O || am > O + 3840 || pre > av * 0.05) { bad++; worst = `window ${k}: peak at +${am}, pre-onset ${pre.toFixed(4)}`; }
    }
    if (bad) err(4, `tick bed: ${bad} tick(s) off the grid ${O} + k·${P} (${worst})`);
    else info(4, `tick bed: all ${Math.floor(w.samples / P)} ticks on ${O} + k·${P}`);
  }
}

// ───────────────────────────── 5. ritual ─────────────────────────────
const dingAt = ep.timer.find((t) => t.until !== undefined)?.until ?? R.DING;
if (!ep.sfx.some((s) => s.at === dingAt && /SFX02/.test(s.clip))) err(5, `DING (SFX02) must play at the timer DING = ${dingAt} (default N−180 = ${R.DING})`);
const glassesShot = shots.find((s) => s.from === R.GLASSES);
if (ep.ledger.exitType !== "E16") {
  if (!glassesShot || glassesShot.camera !== "GLASSES" || glassesShot.to !== R.S0_IN - 1) err(5, `ritual: GLASSES shot must cover ${R.GLASSES}–${R.S0_IN - 1}`);
  const s0in = shots.find((s) => s.from === R.S0_IN);
  if (!s0in || s0in.camera !== "WIDE" || s0in.to !== N - 1) err(5, `ritual: WIDE from S0_IN = ${R.S0_IN} to ${N - 1}`);
}
const s0cap = ep.captions.find((c) => c.from === R.S0_IN);
if (!s0cap) err(5, `S0 caption must pop in at S0_IN = ${R.S0_IN} (captions[].from)`);
else {
  if (s0cap.text !== S0.caption) err(5, `S0 caption text "${s0cap.text}" ≠ state0.caption "${S0.caption}"`);
  if (!(s0cap.to >= 5 && s0cap.to < s0cap.from)) err(5, `S0 caption must wrap through the seam and stay ≥ frame 5 (from ${s0cap.from} to ${s0cap.to})`);
  if (s0cap.to !== 59) warn(5, `S0 caption ends at ${s0cap.to} (bible: static to 45, out 46–59)`);
}
const lastTimer = [...ep.timer].sort((a, b) => a.at - b.at)[0];
if (!lastTimer || lastTimer.at !== 15 || lastTimer.mode !== "run" || lastTimer.dial !== 1) warn(5, `timer track does not start with {at:15, dial:1, mode:"run"}`);
for (const a of ep.actors) {
  const fall = ep.motion.find((m) => m.char === a.id && m.from === R.S0_IN);
  if (!fall) err(5, `${a.id}: no motion track starting at S0_IN = ${R.S0_IN} (drop into the S0 hover)`);
  else if (fall.to !== R.HOLD - 1) err(5, `${a.id}: S0 drop ends at ${fall.to}, must end at HOLD−1 = ${R.HOLD - 1}`);
  const enter = ep.motion.find((m) => m.char === a.id && m.from === 6);
  if (!enter) warn(5, `${a.id}: no fall track starting at frame 6`);
}
// hard-coded ritual numbers in code
const walk = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const srcFiles = walk(join(ROOT, "src")).filter((f) => /\.(tsx?|jsx?)$/.test(f) && !f.includes(join("src", "lint")));
const stripComments = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
for (const f of srcFiles) {
  const txt = stripComments(readFileSync(f, "utf8"));
  const rel = f.slice(ROOT.length + 1);
  if (/(?<![\d.])(1740|1845|1890|1905)(?![\d.])/.test(txt)) warn(5, `${rel}: hard-coded ritual frame (1740/1845/1890/1905); use ritual(N)`);
  // 9. determinism
  if (/Math\.random\s*\(|Date\.now\s*\(|performance\.now\s*\(|new Date\s*\(/.test(txt)) err(9, `non-deterministic call in ${rel}`);
  if (/@keyframes|\banimation\s*:|\btransition\s*:|animationName|transitionDuration/.test(txt)) err(9, `CSS animation/transition in ${rel} (only frame functions allowed)`);
}

// ───────────────────────────── 6. captions ─────────────────────────────
const textHits = (t: string, list: string[], caseSensitive = false) =>
  list.filter((w) => {
    const esc = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = /^[\w-]+$/.test(w) ? new RegExp(`(?<![\\w-])${esc}(?![\\w-])`, caseSensitive ? "" : "i") : new RegExp(esc, caseSensitive ? "" : "i");
    return re.test(t);
  });
for (const c of ep.captions) {
  if (words(c.text).length > 6) err(6, `caption > 6 words: "${c.text}"`);
  if (c.text.length > 34) warn(6, `caption "${c.text}" is ${c.text.length} chars (band x 80–920 fits ≈ 34 Anton caps)`);
  const bad = textHits(c.text, blocklist.profanity);
  if (bad.length) err(6, `caption "${c.text}" contains profanity: ${bad.join(", ")}`);
}
for (const n of ep.notepad) if (n.adviceLabel && words(n.adviceLabel).length > 3) err(6, `adviceLabel "${n.adviceLabel}" > 3 words`);

// ───────────────────────────── 7. title / display names ─────────────────────────────
const forbiddenSeries = textHits(`${SERIES.title} | ${SERIES.episodeTitlePrefix} | ${SERIES.names.doctor}`, blocklist.forbiddenDisplayNames);
if (forbiddenSeries.length) err(7, `src/series.ts still uses a retired display name (${forbiddenSeries.join(", ")}): the series is "Dr. Dusty" (bible §12.4) — coordinator must update SERIES`);
const titleRe = /^(.+) #(\d{3}): (.+)$/;
const tm = ep.title.match(titleRe);
if (ep.title.length > 60) err(7, `title ${ep.title.length} chars > 60`);
else if (ep.title.length < 40) warn(7, `title ${ep.title.length} chars < 40 (recommended 40–60)`);
if (!tm) err(7, `title "${ep.title}" is not "<series> #nnn: <title>"`);
else {
  if (tm[2] !== patientNoLabel(ep.patientNo).slice(1)) err(7, `title number #${tm[2]} ≠ patientNo ${patientNoLabel(ep.patientNo)}`);
  if (!forbiddenSeries.length && tm[1] !== SERIES.episodeTitlePrefix) err(7, `title prefix "${tm[1]}" ≠ SERIES.episodeTitlePrefix "${SERIES.episodeTitlePrefix}"`);
}
const titleBad = [...textHits(ep.title, blocklist.profanity), ...textHits(ep.title, blocklist.forbiddenDisplayNames)];
if (titleBad.length) err(7, `title contains forbidden words: ${titleBad.join(", ")}`);
for (const c of [S0.caption, ...ep.captions.map((x) => x.text)]) {
  const bad = textHits(c, blocklist.forbiddenDisplayNames);
  if (bad.length) err(7, `on-screen text "${c}" uses a retired display name`);
}

// ───────────────────────────── 8. series ledger ─────────────────────────────
const ledgerFile = join(ROOT, "ledger/series_ledger.json");
if (!existsSync(ledgerFile)) warn(8, `ledger/series_ledger.json missing (rules 1–8 of §6.3 not checked)`);
else {
  const all = readJson<SeriesLedger>(ledgerFile).episodes;
  const L = ep.ledger;
  const idx = all.findIndex((e) => e.id === ep.id);
  const prior = (idx >= 0 ? all.slice(0, idx) : all.filter((e) => e.id < ep.id));
  if (idx < 0) warn(8, `${ep.id} is not registered in ledger/series_ledger.json`);
  else {
    const me = all[idx];
    for (const k of ["exitType", "winner", "patientCategory", "woundId", "adviceId", "twistId"] as const)
      if (me[k] !== L[k]) err(8, `ledger entry ${ep.id}.${k} = ${me[k]} ≠ episode.json ${L[k]}`);
  }
  const last = (n: number) => prior.slice(-n);
  if (last(6).some((e) => e.exitType === L.exitType)) err(8, `rule 1: exit ${L.exitType} used in the last 6 episodes`);
  if (last(2).length === 2 && last(2).every((e) => e.winner === L.winner)) err(8, `rule 2: ${L.winner} would win a third time in a row`);
  const win10 = [...last(9).map((e) => e.winner), L.winner];
  if (win10.length >= 10) {
    const distinct = new Set(win10).size;
    const top = Math.max(...[...new Set(win10)].map((w) => win10.filter((x) => x === w).length)) / win10.length;
    if (distinct < 4 || top > 0.5) err(8, `rule 3: rolling 10 has ${distinct} winners / top share ${(top * 100).toFixed(0)} %`);
    else if (top > 0.4) warn(8, `rule 3: top winner share ${(top * 100).toFixed(0)} % (> 40 %)`);
  }
  if (last(10).some((e) => e.adviceId === L.adviceId)) err(8, `rule 4: advice ${L.adviceId} used in the last 10 episodes`);
  if (last(2).length === 2 && last(2).every((e) => e.patientCategory === L.patientCategory)) err(8, `rule 5: category ${L.patientCategory} a third time in a row`);
  if (L.exitType === "E16" && last(9).some((e) => e.exitType === "E16")) err(8, `rule 6: E16 more than once in 10`);
  if (L.exitType === "E07" && last(14).some((e) => e.exitType === "E07")) err(8, `rule 6: E07 more than once in 15`);
  const pname = solo?.name ?? "";
  if (prior.some((e) => e.patientName === pname && e.woundId === L.woundId && e.adviceId === L.adviceId)) err(8, `rule 7: (patient, wound, advice) repeats`);
  if (last(4).some((e) => e.twistId === L.twistId)) err(8, `rule 8: twist ${L.twistId} used in the last 4 episodes`);
  const chirpInGag3 = ep.sfx.some((s) => /SFX10/.test(s.clip) && s.at >= 570 && s.at < 690);
  if (L.twistId === "T07" && chirpInGag3) err(8, `rule 8: T07 (Chirp twist) while Chirp plays Gag 3`);
  const knocks = ep.sfx.some((s) => /SFX15/.test(s.clip) && s.at >= 930 && s.at < 1050);
  if (L.twistId === "T06" && knocks) err(8, `rule 8: T06 (landlord twist) while the knocks are the running gag`);
  for (const k of ["exitType", "woundId", "adviceId", "twistId"] as const) {
    const list = { exitType: E.EXIT_TYPES, woundId: E.WOUND_IDS, adviceId: E.ADVICE_IDS, twistId: E.TWIST_IDS }[k];
    if (!list.includes(L[k]) && !(k === "adviceId" && /^A\d{2,}$/.test(L[k]))) err(15, `ledger.${k} "${L[k]}" not in the bible tables`);
  }
  if (!(E.WINNERS as readonly string[]).includes(L.winner)) err(15, `ledger.winner "${L.winner}" not in WINNERS`);
}

// ───────────────────────────── 10. assets ─────────────────────────────
const has = (list: readonly string[], v: string) => list.includes(v);
for (const b of ep.bubbles) {
  const k = key(b.vignette);
  if (!has(VIGNETTE_KEYS, k)) err(10, `vignette "${k}" not in VIGNETTE_KEYS`);
  else for (const mv of b.moving) if (!(VIGNETTE_MOVING as Record<string, readonly string[]>)[k]?.includes(mv)) warn(10, `vignette ${k}: moving element "${mv}" not in VIGNETTE_MOVING`);
  if (b.moving.length > 2) err(10, `vignette ${k}: ${b.moving.length} moving elements (bible: 1–2)`);
}
for (const n of ep.notepad) {
  if (!has(DOODLE_KEYS, key(n.doodle))) err(10, `doodle "${key(n.doodle)}" not in DOODLE_KEYS`);
  if (n.drawOnFrames < 12 || n.drawOnFrames > 20) warn(10, `doodle ${key(n.doodle)}: drawOnFrames ${n.drawOnFrames} (bible 12–20)`);
  if (shotAt(n.from)?.camera !== "NOTEPAD" || shotAt(n.to)?.camera !== "NOTEPAD") err(10, `notepad ${n.from}–${n.to} is not inside a NOTEPAD shot`);
}
for (const s of shots.filter((x) => x.camera === "NOTEPAD")) if (!ep.notepad.some((n) => n.from <= s.from && n.to >= s.to)) err(10, `NOTEPAD shot ${s.from}–${s.to} has no notepad event covering it`);
for (const p of ep.props) if (!has(PROP_KEYS, key(p.svg))) err(10, `prop "${key(p.svg)}" not in PROP_KEYS`);
for (const w of ep.windowLayer) if (!has(WINDOW_LAYER_IDS, w.layer)) err(10, `window layer "${w.layer}" not in WINDOW_LAYER_IDS`);
for (const d of ep.dialogue) if (d.mouthData && !existsSync(resolveAsset(d.mouthData))) devErr(10, `mouthData missing: ${d.mouthData}`);
for (const spec of Object.values(patients)) for (const [k, p] of Object.entries(spec.soundLanguage)) if (!existsSync(resolveAsset(p))) devErr(10, `patient soundLanguage.${k} missing: ${p}`);
if (!existsSync(join(EP_DIR, "qa", "icon.png"))) devErr(10, `episodes/${EP}/qa/icon.png (patient icon test, R1) missing`);
else info(10, `qa/icon.png present — author must approve the 160 px icon test (R1)`);
if (!manifest) warn(10, `assets/audio_manifest.json missing`);
else {
  const used = new Set([tickBed, ep.bed.roomTone, ep.bed.music, ...clips.map((c) => c.clip)].map((p) => resolveAsset(p)));
  const ph = manifest.clips.filter((c) => c.source === "placeholder" && used.has(join(ROOT, c.path)));
  if (ph.length) devErr(10, `${ph.length} placeholder audio clip(s) in use: ${ph.map((c) => c.id).join(", ")} (run tools/gen_audio.mjs with a key)`);
  for (const p of used) if (existsSync(p) && !manifest.clips.some((c) => join(ROOT, c.path) === p)) warn(10, `audio not in the manifest: ${p.slice(ROOT.length + 1)}`);
}

// ───────────────────────────── 11. words ─────────────────────────────
const spoken = ep.dialogue.filter((d) => isActor(d.char) && d.text);
const docLines = ep.dialogue.filter((d) => d.char === "doctor" && d.text);
if (ep.style === "v2") {
  // style v2 (seria/CLAUDE.md, bible §0): plain English lines with subtitles; doctor 3–4 short lines
  for (const d of spoken) if (words(d.text ?? "").length > 10) err(11, `patient line "${d.text}" > 10 words (subtitle must read in < 3 s)`);
  if (docLines.length > 4) err(11, `${docLines.length} doctor lines (max 4 in style v2)`);
  for (const d of docLines) if (words(d.text ?? "").length > 6) err(11, `doctor line "${d.text}" > 6 words`);
  for (const d of ep.dialogue) if (d.clip.includes("vo/") && d.mouth !== "none" && !d.text) warn(11, `voice clip ${d.clip} has no text → no subtitle`);
} else {
  if (spoken.length > 1) err(11, `${spoken.length} clear English patient lines (max 1 per episode)`);
  for (const d of spoken) if (words(d.text ?? "").length > 6) err(11, `patient word line "${d.text}" > 6 words`);
  if (docLines.length > 1) err(11, `more than one rare doctor sentence`);
  else if (docLines.length) warn(11, `rare doctor sentence "${docLines[0].text}": check ≤ 1 per ~10 episodes`);
}

// ───────────────────────────── 12. blocklist ─────────────────────────────
const scanTexts: [string, string][] = [
  ["episode.json", readFileSync(join(EP_DIR, "episode.json"), "utf8")],
  ...ep.actors.filter((a) => existsSync(resolveAsset(a.ref))).map((a) => [a.ref, readFileSync(resolveAsset(a.ref), "utf8")] as [string, string]),
];
if (existsSync(join(EP_DIR, "beat_sheet.md"))) scanTexts.push(["beat_sheet.md", readFileSync(join(EP_DIR, "beat_sheet.md"), "utf8")]);
else warn(12, `episodes/${EP}/beat_sheet.md missing (script not scanned)`);
for (const [name, txt] of scanTexts) {
  const hits = [
    ...textHits(txt, blocklist.brands, true).map((h) => `brand "${h}"`),
    ...textHits(txt, blocklist.selfHarm).map((h) => `self-harm "${h}"`),
    ...textHits(txt, blocklist.chesterVocalWhenInserting).map((h) => `Chester vocal "${h}"`),
    ...textHits(txt, blocklist.medicalProps).map((h) => `medical prop "${h}"`),
    ...(name === "beat_sheet.md" ? [] : textHits(txt, blocklist.profanity).map((h) => `profanity "${h}"`)),
  ];
  if (hits.length) err(12, `${name}: ${hits.join(", ")}`);
}

// ───────────────────────────── 13. patient (adult coding, eyes) ─────────────────────────────
const cryClips = new Set(Object.values(patients).map((s) => s.soundLanguage.cry));
for (const a of ep.actors) {
  const spec = patients[a.id];
  if (!spec) continue;
  if (!spec.adultCoding?.length) err(13, `${a.id}: needs ≥ 1 adultCoding (R8)`);
  if (!spec.wear?.length || spec.wear.length > 3) err(13, `${a.id}: wear needs 1–3 items (got ${spec.wear?.length ?? 0})`);
  if (spec.accessories.length > 2) err(13, `${a.id}: > 2 accessories`);
  for (const acc of spec.accessories) if ((E.FORBIDDEN_ACCESSORIES as readonly string[]).some((f) => acc.includes(f))) err(13, `${a.id}: forbidden accessory ${acc}`);
  if (E.PATIENT_EYES_SWAP_ONLY.includes(spec.eyes)) err(13, `${a.id}: base eyes "${spec.eyes}" allowed only as a swap`);
  if (ep.ledger.exitType === "E03" && E.PATIENT_EYES_NO_CRY.includes(spec.eyes)) err(13, `${a.id}: eyes "${spec.eyes}" not allowed in an E03 episode`);
  const model = makePatient(spec, a.maxSize);
  if (model.eyes.ratio < E.PATIENT_EYE_WIDTH_RATIO.min || model.eyes.ratio > E.PATIENT_EYE_WIDTH_RATIO.max) err(13, `${a.id}: eye width ${(model.eyes.ratio * 100).toFixed(1)} % of the body (R4: 22–30 %)`);
  if (!model.contrast.ok) warn(13, `${a.id}: R3 contrast vs couch ${model.contrast.couch.toFixed(0)} / wall ${model.contrast.wall.toFixed(0)} L* (< 25)`);
  // eye swaps: stars/hearts ≤ 30 frames; no-cry eyes never in a shot that contains the CRY clip
  const evs = ep.poses.filter((p) => p.char === a.id && (p.set as { eyesSwap?: string }).eyesSwap !== undefined).sort((x, y) => x.at - y.at);
  const intervals = evs.map((p, i) => ({ eyes: (p.set as { eyesSwap: E.PatientEyes }).eyesSwap, from: p.at, to: (evs[i + 1]?.at ?? N) - 1 }));
  const cryShots = ep.dialogue.filter((d) => d.char === a.id && cryClips.has(d.clip)).flatMap((d) => {
    const w = wav(d.clip);
    const end = d.at + Math.ceil(((w?.samples ?? 0) / SAMPLE_RATE) * FPS);
    return shots.filter((s) => s.to >= d.at && s.from <= end);
  });
  for (const iv of intervals) {
    if (iv.eyes === spec.eyes) continue;
    if (E.PATIENT_EYES_SWAP_ONLY.includes(iv.eyes) && iv.to - iv.from + 1 > 30) err(13, `${a.id}: eyesSwap ${iv.eyes} lasts ${iv.to - iv.from + 1} frames (≤ 30)`);
    if (E.PATIENT_EYES_NO_CRY.includes(iv.eyes)) {
      if (ep.ledger.exitType === "E03") err(13, `${a.id}: eyes ${iv.eyes} in an E03 episode`);
      for (const s of cryShots) if (iv.to >= s.from && iv.from <= s.to) err(13, `${a.id}: eyes ${iv.eyes} (${iv.from}–${iv.to}) in shot ${s.from}–${s.to} with the CRY clip`);
    }
  }
}
if (ep.ledger.exitType === "E03") {
  const sw = ep.motion.find((m) => m.swallow);
  if (sw && sw.to - sw.from > 30) err(13, `E03 swallow lasts ${sw.to - sw.from} frames (≤ 30)`);
  if (sw && shots.some((s) => s.camera === "PATIENT" && s.to >= sw.from - 60 && s.from < sw.from)) err(13, `E03: PATIENT shot within 60 frames before the swallow`);
}

// ───────────────────────────── 14. exit requirements ─────────────────────────────
const exitTracks = ep.motion.filter((m) => isActor(m.char) && m.from >= dingAt && m.from < R.S0_IN);
const X = ep.ledger.exitType;
const needsMotion = ["E01", "E03", "E05", "E06", "E09", "E13"];
const v2Exit = ep.style === "v2" && ep.motion.some((m) => isActor(m.char) && m.z === 1 && m.from < R.DING);
if (needsMotion.includes(X) && !exitTracks.length && !v2Exit) err(14, `${X} needs an exit motion track between DING ${R.DING} and S0_IN ${R.S0_IN}`);
for (const m of exitTracks) {
  const end = m.path[m.path.length - 1];
  const toWindow = Math.hypot(end[0] - POS.windowExitTarget[0], end[1] - POS.windowExitTarget[1]) < 60;
  if (toWindow && (m.z !== 1 || m.zAt === undefined || !m.scale || m.scale[1] > 0.3)) err(14, `window exit ${m.from}–${m.to}: needs z 1, zAt mid-way and scale → ≤ 0.3 (bible §5.5)`);
  if (toWindow && m.zAt !== undefined && Math.abs(m.zAt - (m.from + m.to) / 2) > (m.to - m.from) * 0.2) warn(14, `window exit: zAt ${m.zAt} is not near the middle of ${m.from}–${m.to}`);
}
if (X === "E03" && (Object.values(patients).some((s) => s.size !== "S") || !ep.motion.some((m) => m.swallow))) err(14, `E03 needs size S and a swallow track`);
if ((X === "E04" || X === "E17") && !ep.poses.some((p) => p.char === "doctor" && (p.set as { placement?: string }).placement && (p.set as { placement?: string }).placement !== "chair")) err(14, `${X} needs doctor.placement ≠ chair`);
if (X === "E05" && !(ep.timer.some((t) => t.mode === "stolen") && ep.timer.some((t) => t.mode === "spare"))) err(14, `E05 needs timer modes stolen + spare`);
if (X === "E08" && ep.actors.length < 2 && !ep.props.length) err(14, `E08 needs a second actor or a partner prop`);
if (X === "E14" && !ep.instances.length) err(14, `E14 needs instances`);
if (X === "E16" && (!ep.rewind || !ep.timer.some((t) => t.mode === "reverse") || glassesShot)) err(14, `E16 needs rewind, timer reverse and no GLASSES cut`);
if (X === "E17" && ep.motion.some((m) => m.from >= R.DING && m.path[m.path.length - 1][1] > m.path[0][1])) err(14, `E17 ejections must go up`);

// ───────────────────────────── 15. enums / ranges / mouth data ─────────────────────────────
const ENUM: Record<string, Record<string, readonly unknown[]>> = {
  doctor: { brows: E.BROWS, mouth: E.DOCTOR_MOUTHS, lens: E.LENS_ICONS, glassesY: E.GLASSES_Y, pen: E.DOCTOR_PENS, placement: E.DOCTOR_PLACEMENTS, expression: Object.keys(E.DOCTOR_EXPRESSIONS), ease: E.EASES },
  chester: { eyes: E.CHESTER_EYES, mouth: E.CHESTER_MOUTHS, expression: Object.keys(E.CHESTER_EXPRESSIONS), ease: E.EASES, spring: [true, false] },
  chirp: { led: E.CHIRP_LEDS, ease: E.EASES },
  patient: { brows: E.PATIENT_BROWS, land: E.PATIENT_LANDINGS, eyesSwap: E.PATIENT_EYES, variant: ["base", "transformed"], enter: ["fall_from_top"], panel: ["base", "fence"], labelStyle: ["print", "paint", "drip"], ease: E.EASES },
};
const RANGES: Record<string, [number, number]> = { headTilt: [-6, 6], sag: [0, 0.05], lean: [1, 1.03], dur: [0, 120] };
for (const p of ep.poses) {
  const table = ENUM[isActor(p.char) ? "patient" : p.char];
  if (!table) { err(15, `unknown char "${p.char}" at ${p.at}`); continue; }
  if (isActor(p.char) && !ep.actors.some((a) => a.id === p.char)) err(15, `pose for ${p.char} but no such actor`);
  for (const [k, v] of Object.entries(p.set)) {
    if (k in RANGES) {
      if (typeof v !== "number" || v < RANGES[k][0] || v > RANGES[k][1]) err(15, `${p.char}.${k} = ${v} outside ${RANGES[k].join("…")} (frame ${p.at})`);
      continue;
    }
    if (k === "label") {
      if (typeof v !== "string" || v.length > 12) err(15, `${p.char}.label must be a short string (frame ${p.at})`);
      continue;
    }
    if (k === "extras") {
      if (!Array.isArray(v) || v.some((x) => !(E.DOCTOR_EXTRAS as readonly string[]).includes(x))) err(15, `doctor.extras ${JSON.stringify(v)} not in DOCTOR_EXTRAS (frame ${p.at})`);
      continue;
    }
    if (!table[k]) err(15, `${p.char}.${k} is not a pose field (frame ${p.at})`);
    else if (!table[k].includes(v)) err(15, `${p.char}.${k} = ${JSON.stringify(v)} not in enum (frame ${p.at})`);
  }
}
for (const s of ep.shots) {
  if (!(E.CAMERAS as readonly string[]).includes(s.camera)) err(15, `shot camera ${s.camera}`);
  if (s.ease && !(E.SHOT_EASES as readonly string[]).includes(s.ease)) err(15, `shot ease ${s.ease}`);
}
for (const m of ep.motion) if (!(E.EASES as readonly string[]).includes(m.ease)) err(15, `motion ease ${m.ease}`);
for (const p of ep.props) if (!(E.PROP_ANIMS as readonly string[]).includes(p.anim)) err(15, `prop anim ${p.anim}`);
for (const p of ep.particles) if (!(E.PARTICLE_TYPES as readonly string[]).includes(p.type)) err(15, `particle type ${p.type}`);
for (const t of ep.timer) if (!(E.TIMER_MODES as readonly string[]).includes(t.mode)) err(15, `timer mode ${t.mode}`);
for (const d of ep.dialogue) {
  if (!(E.CHAR_IDS as readonly string[]).includes(d.char)) err(15, `dialogue char ${d.char}`);
  if (!(E.DIALOGUE_MOUTH as readonly string[]).includes(d.mouth)) err(15, `dialogue mouth ${d.mouth}`);
  if (d.mouth !== "none" && !d.mouthData) err(15, `dialogue at ${d.at} has mouth "${d.mouth}" but no mouthData`);
  if (d.mouthData && existsSync(resolveAsset(d.mouthData))) {
    const md = readJson<{ type?: string; hopSamples?: number; values?: number[]; mouthCues?: unknown[] }>(resolveAsset(d.mouthData));
    const w = wav(d.clip);
    if (md.type === "rms") {
      if (md.hopSamples !== 1600) warn(15, `${d.mouthData}: hopSamples ${md.hopSamples} (1600 = one value per frame)`);
      if (w && md.values && Math.abs(md.values.length - Math.ceil(w.samples / (md.hopSamples ?? 1600))) > 1) err(15, `${d.mouthData}: ${md.values.length} values for a ${w.samples}-sample clip (stale; rerun tools/rms_envelope.py)`);
      if (d.mouth === "rhubarb") err(15, `dialogue at ${d.at}: mouth "rhubarb" but mouthData is an RMS envelope`);
    } else if (!md.mouthCues) err(15, `${d.mouthData}: neither RMS nor Rhubarb JSON`);
  }
}
for (const [id, spec] of Object.entries(patients)) {
  const chk = (field: string, v: unknown, list: readonly unknown[]) => { if (!list.includes(v)) err(15, `${id}.${field} = ${JSON.stringify(v)} not in enum`); };
  chk("category", spec.category, E.PATIENT_CATEGORIES); chk("size", spec.size, E.PATIENT_SIZES); chk("shape", spec.shape, E.PATIENT_SHAPES);
  chk("eyes", spec.eyes, E.PATIENT_EYES); chk("brows", spec.brows, E.PATIENT_BROWS); chk("mouth.type", spec.mouth.type, E.PATIENT_MOUTH_TYPES);
  if (spec.mouth.driver) chk("mouth.driver", spec.mouth.driver, E.MOUTH_DRIVERS);
  chk("idle", spec.idle, E.PATIENT_IDLES); chk("landing", spec.landing, E.PATIENT_LANDINGS);
  for (const w of spec.wear) chk("wear", w, E.PATIENT_WEAR);
  for (const c of spec.adultCoding) chk("adultCoding", c, E.ADULT_CODING);
  for (const acc of spec.accessories) if (!(acc.startsWith("display:") || (E.PATIENT_ACCESSORY_KINDS as readonly string[]).includes(acc))) err(15, `${id}.accessories "${acc}" not in enum`);
  if (spec.voicePreset !== null) chk("voicePreset", spec.voicePreset, E.VOICE_PRESETS);
  for (const k of E.SOUND_LANGUAGE_KEYS) if (!spec.soundLanguage[k]) err(15, `${id}.soundLanguage.${k} missing`);
  if (words(spec.captionName).length > 4 || spec.captionName !== spec.captionName.toUpperCase()) err(15, `${id}.captionName "${spec.captionName}" must be ≤ 4 words, UPPERCASE`);
  if (ep.ledger.patientCategory !== spec.category && id === "patient") err(15, `ledger.patientCategory ${ep.ledger.patientCategory} ≠ patient.json category ${spec.category}`);
  if (ep.dialogue.some((d) => d.char === id && d.text) && !spec.voicePreset) err(15, `${id} speaks a word but voicePreset is null`);
  for (const p of ep.poses.filter((x) => x.char === id)) {
    const b = (p.set as { brows?: string }).brows;
    if (b && spec.brows === "none" && b !== "none") warn(15, `${id}: brows ${b} at ${p.at} but patient.json has no brows`);
  }
}

// ───────────────────────────── 16. actor box, every frame ─────────────────────────────
const FACE = POS.chester.face; // [60, 860, 250, 1010]
const OUTLINE = 6;
for (const a of ep.actors) {
  const spec = patients[a.id];
  if (!spec) continue;
  const model = makePatient(spec, a.maxSize);
  if (model.w + 2 * OUTLINE > a.maxSize.w + 0.5 || model.h + OUTLINE > a.maxSize.h + 0.5) err(16, `${a.id}: drawn ${model.w.toFixed(0)}×${model.h.toFixed(0)} (+outline) exceeds maxSize ${a.maxSize.w}×${a.maxSize.h}`);
  const lands = ep.poses.filter((p) => p.char === a.id && (p.set as { land?: string }).land).sort((x, y) => x.at - y.at);
  const hits: number[] = [];
  let worst = { f: -1, x0: 9999, top: 0 };
  for (let f = 0; f < N; f++) {
    let x = a.anchor[0], y = S0.patient.topY + a.maxSize.h, scale = 1, rot = 0, sx = 1, sy = 1, z: number | null = null;
    if (f > 5 && f < R.HOLD) {
      const m = motionAt(ep.motion, a.id, f);
      if (m) { x = m.x; y = m.y; scale = m.scale; rot = m.rotate; z = m.z; }
      const lc = [...lands].reverse().find((p) => p.at <= f);
      if (lc) {
        const sq = landing((lc.set as { land: E.PatientLanding }).land, f, lc.at, spec.seed);
        // Patient.tsx clamps the squash width to model.maxW / (w + 2·outline) (keeps x ≥ 250): mirror it
        sx = Math.min(sq.sx, model.maxW / (model.w + 2 * OUTLINE)); sy = sq.sy; y += sq.dy; rot += sq.rot;
      }
      const seated = !m || (!m.moving && Math.abs(y - a.anchor[1]) < 1);
      if (seated && m) { const idl = patientIdle(spec.idle, f, N, spec.seed); x += idl.dx; y += idl.dy; rot += idl.rot; scale *= idl.scale; }
    }
    if (z === 1) continue; // inside the window slot, behind the room
    const hw = (model.w / 2) * sx * scale + OUTLINE, h = model.h * sy * scale + OUTLINE;
    const th = (rot * Math.PI) / 180;
    const corners = [[-hw, 0], [hw, 0], [-hw, -h], [hw, -h]].map(([cx, cy]) => [x + cx * Math.cos(th) - cy * Math.sin(th), y + cx * Math.sin(th) + cy * Math.cos(th)]);
    const x0 = Math.min(...corners.map((c) => c[0])), top = Math.min(...corners.map((c) => c[1])), bottom = Math.max(...corners.map((c) => c[1]));
    if (x0 < FACE[2] && top < FACE[3] && bottom > FACE[1]) { hits.push(f); if (x0 < worst.x0) worst = { f, x0, top }; }
  }
  if (hits.length) err(16, `${a.id}: outline enters Chester's face zone (x < ${FACE[2]}, y ${FACE[1]}–${FACE[3]}) on ${hits.length} frame(s) ${hits[0]}–${hits[hits.length - 1]}; worst frame ${worst.f}: left edge x ${worst.x0.toFixed(1)}, top y ${worst.top.toFixed(0)} (model ${model.w.toFixed(0)} px wide; '${spec.landing}' landing squash widens it)`);
}

// ───────────────────────────── report ─────────────────────────────
for (const i of infos) console.log(`INFO  ${i}`);
for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`lint ${EP}: ${errors.length} error(s), ${warns.length} warning(s)${DEV ? " [--dev]" : ""}  (post-render pixel/sample checks: npm run check)`);
process.exit(errors.length ? 1 : 0);
