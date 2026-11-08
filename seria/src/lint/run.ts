// Episode lint (bible §9.5). Owned by the episode/audio builder — this is the scaffold with the
// mechanical rules wired; extend it with the remaining rules (2 post-render is tools/check_loop.sh,
// 4 bed lengths, 8 ledger, 11–14, 16).
// Usage: tsx src/lint/run.ts [EP=S01E01] [--dev]     (--dev: missing assets are warnings, not errors)
// Runs in Node: import only pure TS (no engine/index, no components with JSX/fonts).
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import * as E from "../enums";
import { FPS, SAMPLE_RATE, isAllowedDuration, ritual } from "../engine/constants";
import type { Episode, PatientSpec } from "../schema";
import { DOODLE_KEYS, PROP_KEYS, VIGNETTE_KEYS } from "../components/props/registry";
import { WINDOW_LAYER_IDS } from "../components/set/registry";

const ROOT = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const EP = args.find((a) => /^S\d{2}E\d{2}$/.test(a)) ?? "S01E01";
const DEV = args.includes("--dev");
const errors: string[] = [];
const warns: string[] = [];
const err = (rule: number, msg: string) => errors.push(`[lint ${rule}] ${msg}`);
const warn = (rule: number, msg: string) => warns.push(`[lint ${rule}] ${msg}`);
const missingAsset = (msg: string) => (DEV ? warn(10, msg) : err(10, msg));

const resolveAsset = (p: string) => (p.startsWith("assets/") || p.startsWith("episodes/") ? join(ROOT, p) : join(ROOT, "episodes", EP, p));
const key = (p: string) => (p.split("/").pop() ?? p).replace(/\.[a-z0-9]+$/i, "");

/** WAV length in samples from the RIFF header (PCM / float), or null. */
function wavSamples(file: string): { samples: number; rate: number } | null {
  const b = readFileSync(file);
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WAVE") return null;
  let off = 12, ch = 0, bits = 0, rate = 0;
  while (off + 8 <= b.length) {
    const id = b.toString("ascii", off, off + 4);
    const size = b.readUInt32LE(off + 4);
    if (id === "fmt ") { ch = b.readUInt16LE(off + 10); rate = b.readUInt32LE(off + 12); bits = b.readUInt16LE(off + 22); }
    if (id === "data") return { samples: Math.floor(size / (ch * (bits / 8))), rate };
    off += 8 + size + (size % 2);
  }
  return null;
}

const ep = JSON.parse(readFileSync(join(ROOT, "episodes", EP, "episode.json"), "utf8")) as Episode;
const N = ep.durationInFrames;
const R = ritual(N);

// 1. duration / fps / size
if (!isAllowedDuration(N)) err(1, `durationInFrames ${N} not in ${E.ALLOWED_DURATIONS.join(", ")}`);
if (ep.fps !== FPS || ep.width !== 1080 || ep.height !== 1920) err(1, `fps/size must be 30 / 1080x1920`);

// 3. no sfx/dialogue starting in frames 0–5, none sounding in the last 200 ms
const clips = [...ep.sfx.map((s) => ({ ...s, kind: "sfx" })), ...ep.dialogue.map((d) => ({ ...d, kind: `dialogue:${d.char}` }))];
for (const c of clips) {
  if (c.at <= 5) err(3, `${c.kind} ${c.clip} starts at frame ${c.at} (frames 0–5 are S0)`);
  const f = resolveAsset(c.clip);
  if (!existsSync(f)) { missingAsset(`audio missing: ${c.clip}`); continue; }
  const w = wavSamples(f);
  if (!w) { warn(3, `cannot read WAV header: ${c.clip}`); continue; }
  if (w.rate !== SAMPLE_RATE) err(3, `${c.clip} is ${w.rate} Hz (must be 48000)`);
  const endS = c.at / FPS + w.samples / w.rate;
  if (endS > N / FPS - 0.2) err(3, `${c.clip} at ${c.at} ends at ${endS.toFixed(3)} s (> ${(N / FPS - 0.2).toFixed(1)} s)`);
  else if (endS > R.LAST_SFX_END_S + 1e-6) warn(3, `${c.clip} ends at ${endS.toFixed(3)} s (ritual wants ≤ ${R.LAST_SFX_END_S.toFixed(1)} s)`);
}

// 4 (partial). bed files exist and have exactly N×1600 samples
for (const p of [ep.bed.tickBed ?? `assets/sfx/SFX01_tick_bed${N / FPS}.wav`, ep.bed.roomTone, ep.bed.music]) {
  const f = resolveAsset(p);
  if (!existsSync(f)) { missingAsset(`bed missing: ${p}`); continue; }
  const w = wavSamples(f);
  if (!w || w.samples !== R.TOTAL_SAMPLES || w.rate !== SAMPLE_RATE) err(4, `${p}: ${w?.samples} samples @ ${w?.rate} Hz (need ${R.TOTAL_SAMPLES} @ 48000)`);
}
if (ep.bed.tickPeriodSamples !== 24000 || ep.bed.tickOffsetSamples !== 12000) err(4, `tick grid must be 24000 / 12000 samples`);

// 6. captions
for (const c of ep.captions) if (c.text.trim().split(/\s+/).length > 6) err(6, `caption > 6 words: "${c.text}"`);
// 7. title
if (ep.title.length > 60) err(7, `title ${ep.title.length} chars > 60`);
else if (ep.title.length < 40) warn(7, `title ${ep.title.length} chars < 40 (recommended 40–60)`);

// 9. determinism: no Math.random / Date.now / performance.now in src
const walk = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
for (const f of walk(join(ROOT, "src")).filter((f) => /\.(tsx?|jsx?)$/.test(f) && !f.includes(`${join("src", "lint")}`))) {
  const txt = readFileSync(f, "utf8").replace(/\/\/.*$/gm, "");
  if (/Math\.random\s*\(|Date\.now\s*\(|performance\.now\s*\(|new Date\s*\(/.test(txt)) err(9, `non-deterministic call in ${f.slice(ROOT.length + 1)}`);
}

// 10. visual refs exist in the registries; patient refs exist
const has = (list: readonly string[], v: string) => list.includes(v);
for (const b of ep.bubbles) if (!has(VIGNETTE_KEYS, key(b.vignette))) err(10, `vignette "${key(b.vignette)}" not in VIGNETTE_KEYS`);
for (const n of ep.notepad) if (!has(DOODLE_KEYS, key(n.doodle))) err(10, `doodle "${key(n.doodle)}" not in DOODLE_KEYS`);
for (const p of ep.props) if (!has(PROP_KEYS, key(p.svg))) err(10, `prop "${key(p.svg)}" not in PROP_KEYS`);
for (const w of ep.windowLayer) if (!has(WINDOW_LAYER_IDS, w.layer)) err(10, `window layer "${w.layer}" not in WINDOW_LAYER_IDS`);
for (const a of ep.actors) if (!existsSync(resolveAsset(a.ref))) err(10, `actor ref missing: ${a.ref}`);
if (!existsSync(join(ROOT, "episodes", EP, "qa", "icon.png"))) missingAsset(`episodes/${EP}/qa/icon.png (patient icon test) missing`);

// 15. enums
const ENUM: Record<string, Record<string, readonly unknown[]>> = {
  doctor: { brows: E.BROWS, mouth: E.DOCTOR_MOUTHS, lens: E.LENS_ICONS, glassesY: E.GLASSES_Y, pen: E.DOCTOR_PENS, placement: E.DOCTOR_PLACEMENTS, expression: Object.keys(E.DOCTOR_EXPRESSIONS), ease: E.EASES },
  chester: { eyes: E.CHESTER_EYES, mouth: E.CHESTER_MOUTHS, expression: Object.keys(E.CHESTER_EXPRESSIONS), ease: E.EASES },
  chirp: { led: E.CHIRP_LEDS, ease: E.EASES },
  patient: { brows: E.PATIENT_BROWS, land: E.PATIENT_LANDINGS, eyesSwap: E.PATIENT_EYES, variant: ["base", "transformed"], enter: ["fall_from_top"], ease: E.EASES },
};
for (const p of ep.poses) {
  const table = ENUM[(E.ACTOR_IDS as readonly string[]).includes(p.char) ? "patient" : p.char];
  if (!table) { err(15, `unknown char "${p.char}" at ${p.at}`); continue; }
  for (const [k, v] of Object.entries(p.set)) {
    if (k === "dur" || k === "headTilt" || k === "sag" || k === "spring" || k === "lean" || k === "extras") continue;
    if (!table[k]) err(15, `${p.char}.${k} is not a pose field (frame ${p.at})`);
    else if (!table[k].includes(v)) err(15, `${p.char}.${k} = ${JSON.stringify(v)} not in enum (frame ${p.at})`);
  }
}
for (const d of ep.dialogue) if (d.mouth !== "none" && !d.mouthData) err(15, `dialogue at ${d.at} has mouth "${d.mouth}" but no mouthData`);
for (const a of ep.actors) {
  const f = resolveAsset(a.ref);
  if (!existsSync(f)) continue;
  const spec = JSON.parse(readFileSync(f, "utf8")) as PatientSpec;
  if (ep.dialogue.some((d) => d.char === a.id && d.text) && !spec.voicePreset) err(15, `${a.id} speaks a word but voicePreset is null`);
  if (!spec.adultCoding?.length || !spec.wear?.length) err(13, `${a.id}: needs ≥ 1 adultCoding and ≥ 1 wear`);
  if (spec.accessories.length > 2) err(13, `${a.id}: > 2 accessories`);
  if ((E.PATIENT_EYES_SWAP_ONLY as readonly string[]).includes(spec.eyes)) err(13, `${a.id}: base eyes "${spec.eyes}" allowed only as a swap`);
}

for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`lint ${EP}: ${errors.length} error(s), ${warns.length} warning(s)${DEV ? " [--dev]" : ""}`);
process.exit(errors.length ? 1 : 0);
