#!/usr/bin/env node
// Generate every audio clip an episode needs with the ElevenLabs API (bible 7.2–7.4, 4.4), under a
// strict credit budget. One take per asset; existing ElevenLabs files are never regenerated.
//
//   node tools/gen_audio.mjs [S01E01] [--library] [--dry-run] [--force id1,id2] [--only id1,id2]
//
//   --library   also generate catalog entries not used by the episode (rest of the 7.2/7.3 library)
//   --dry-run   print the plan and the credit estimate, call nothing that costs credits
//   --force     regenerate these ids even if an ElevenLabs file exists (costs credits again)
//   --only      restrict the run to these ids
//
// Auth: header xi-api-key = $ELEVENLABS_API_KEY, or the dummy "proxy-injected" (the network proxy injects
// the real key). GET /v1/user: 200 → run; 401 → exit 3 (use tools/placeholder_audio.sh instead).
// Catalog (prompts, exact durations): tools/gen_audio.catalog.json. Post-processing (trim, exact length,
// loops with report command 5, tick bed, manifest): tools/gen_audio.post.py.
// Writes: final WAVs (48 kHz), raw API output next to them in _src/, assets/audio_manifest.json,
// ledger/elevenlabs_usage.jsonl (one line per call: estimate, Character-Cost header, running total).
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 (the egress proxy is what injects the key):
// re-run this script once with it set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_ENV_PROXY: "1", NODE_NO_WARNINGS: "1" },
  });
  process.exit(r.status ?? 1);
}

const ROOT = resolve(import.meta.dirname, "..");
const API = "https://api.elevenlabs.io";
const KEY = process.env.ELEVENLABS_API_KEY || "proxy-injected";
const args = process.argv.slice(2);
const EP = args.find((a) => /^S\d{2}E\d{2}$/.test(a)) ?? "S01E01";
const LIBRARY = args.includes("--library");
const DRY = args.includes("--dry-run");
const listArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? new Set(args[i + 1].split(",")) : null;
};
const FORCE = listArg("--force") ?? new Set();
const ONLY = listArg("--only");

const cat = JSON.parse(readFileSync(join(ROOT, "tools/gen_audio.catalog.json"), "utf8"));
const MANIFEST = join(ROOT, "assets/audio_manifest.json");
const LOG = join(ROOT, "ledger/elevenlabs_usage.jsonl");
const POST = join(ROOT, "tools/gen_audio.post.py");
const BUDGET = cat.budgetCredits ?? 15000;
const L = cat.loop.samples;

// ───────────────────────────── helpers ─────────────────────────────
const abs = (p) => join(ROOT, p);
const log = (o) => {
  mkdirSync(dirname(LOG), { recursive: true });
  appendFileSync(LOG, JSON.stringify({ t: new Date().toISOString(), episode: EP, ...o }) + "\n");
};
const say = (...m) => console.log("[gen_audio]", ...m);
const post = (...a) => {
  const out = execFileSync("python3", [POST, ...a.map(String)], { encoding: "utf8", cwd: ROOT, maxBuffer: 1 << 26 });
  const line = out.trim().split("\n").pop();
  return JSON.parse(line);
};
const manifest = () => (existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { clips: [] });
const manifestEntry = (id) => manifest().clips.find((c) => c.id === id);
const setManifest = (entry) => post("manifest", MANIFEST, ROOT, JSON.stringify({ usedIn: usedIds.has(entry.id) ? [EP] : [], ...entry }));
const rawPath = (finalPath, ext) => join(dirname(abs(finalPath)), "_src", basename(finalPath).replace(/\.wav$/, "") + ext);

/** 16-bit mono PCM → WAV container (so ffmpeg can decode the raw file without format flags). */
function pcmToWav(pcm, rate = 48000, ch = 1) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(ch, 22); h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * ch * 2, 28); h.writeUInt16LE(ch * 2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
const saveRaw = (file, buf) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buf);
  return file;
};

let spentEstimate = 0; // conservative running total used by the budget guard
let spentHeader = 0; // sum of Character-Cost headers (when the API reports them)
let calls = 0;

async function api(method, path, { body, query, expect = "json" } = {}) {
  const url = `${API}${path}${query ? "?" + new URLSearchParams(query) : ""}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(url, {
      method,
      headers: { "xi-api-key": KEY, ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 429 || r.status >= 500) {
      say(`  HTTP ${r.status} on ${path}, retry ${attempt + 1}`);
      await new Promise((res) => setTimeout(res, 4000 * (attempt + 1)));
      continue;
    }
    const cost = Number(r.headers.get("character-cost") ?? NaN);
    if (!r.ok) {
      const txt = await r.text();
      const e = new Error(`HTTP ${r.status} ${path}: ${txt.slice(0, 400)}`);
      e.status = r.status;
      throw e;
    }
    const data = expect === "json" ? await r.json() : Buffer.from(await r.arrayBuffer());
    return { data, cost: Number.isFinite(cost) ? cost : null, headers: r.headers };
  }
  throw new Error(`HTTP retries exhausted: ${path}`);
}

/** Budget guard + usage log around one paid call. */
async function paid(asset, endpoint, estimate, fn) {
  if (spentEstimate + estimate > BUDGET) {
    say(`  SKIP ${asset}: budget (${spentEstimate} + ${estimate} > ${BUDGET})`);
    log({ asset, endpoint, skipped: "budget", estimate, spentEstimate });
    return null;
  }
  if (DRY) {
    spentEstimate += estimate;
    say(`  [dry-run] ${asset} via ${endpoint} ≈ ${estimate} credits`);
    return null;
  }
  const res = await fn();
  calls++;
  spentEstimate += Math.max(estimate, res.cost ?? 0);
  if (res.cost != null) spentHeader += res.cost;
  log({ asset, endpoint, estimate, characterCost: res.cost, spentEstimate, spentHeader });
  return res;
}

const textChars = (t) => t.replace(/\[[^\]]*\]/g, "").trim().length;
const estimate = (c) => {
  switch (c.kind) {
    case "sfx": return Math.ceil(40 * c.requestS);
    case "roomtone_loop": return Math.ceil(40 * c.requestS);
    case "music_loop": return Math.ceil(20 * c.requestS); // ≈ 1 200 credits/min (bible 7.2 says ~900)
    default: return 0;
  }
};

// ───────────────────────────── what the episode needs ─────────────────────────────
const epDir = `episodes/${EP}`;
const ep = JSON.parse(readFileSync(abs(`${epDir}/episode.json`), "utf8"));
const norm = (p) => (p.startsWith("assets/") || p.startsWith("episodes/") ? p : `${epDir}/${p}`);
const refs = new Set([
  ep.bed.tickBed ?? `assets/sfx/SFX01_tick_bed${ep.durationInFrames / 30}.wav`, ep.bed.roomTone, ep.bed.music, ep.bed.tickClip,
  ...ep.dialogue.map((d) => d.clip), ...ep.sfx.map((s) => s.clip),
].map(norm));
for (const a of ep.actors) {
  const spec = JSON.parse(readFileSync(abs(norm(a.ref)), "utf8"));
  for (const p of Object.values(spec.soundLanguage)) refs.add(norm(p));
}
const byPath = new Map(cat.clips.map((c) => [c.path, c]));
const usedIds = new Set();
for (const p of refs) {
  const c = byPath.get(p);
  if (c) usedIds.add(c.id);
  else say(`WARN episode references ${p} but the catalog has no entry for it`);
}
for (const c of cat.clips) if (c.kind === "tickbed" && usedIds.has(c.id)) usedIds.add(c.from);

const wanted = cat.clips.filter((c) => (usedIds.has(c.id) || LIBRARY) && (!ONLY || ONLY.has(c.id)));
const isDone = (c) => existsSync(abs(c.path)) && !FORCE.has(c.id) && (manifestEntry(c.id)?.source ?? "elevenlabs") !== "placeholder";
const todo = wanted.filter((c) => !isDone(c));

// ───────────────────────────── generators ─────────────────────────────
async function genSfx(c) {
  const body = { text: c.prompt, duration_seconds: c.requestS, prompt_influence: 0.5, model_id: "eleven_text_to_sound_v3" };
  const res = await paid(c.id, "sound-generation", estimate(c), () =>
    api("POST", "/v1/sound-generation", { body, query: { output_format: "pcm_48000" }, expect: "buf" }));
  if (!res) return false;
  const raw = saveRaw(rawPath(c.path, ".wav"), pcmToWav(res.data));
  const r = post("clip", raw, abs(c.path), ...(c.durationS ? ["--dur", c.durationS] : ["--max", c.maxS ?? 10]), "--fade-out", c.fadeOutMs ?? 40, "--peak", c.peakDb ?? -3);
  setManifest({ id: c.id, path: c.path, kind: c.kind, source: "elevenlabs", endpoint: "POST /v1/sound-generation", model: body.model_id, prompt: c.prompt, requestS: c.requestS, raw: raw.slice(ROOT.length + 1), note: c.note });
  say(`  ok ${c.id}: ${r.samples} samples`);
  return true;
}

async function genRoomtone(c) {
  const body = { text: c.prompt, duration_seconds: c.requestS, loop: !!c.loopFlag, prompt_influence: 0.5, model_id: "eleven_text_to_sound_v3" };
  const res = await paid(c.id, "sound-generation(loop)", estimate(c), () =>
    api("POST", "/v1/sound-generation", { body, query: { output_format: "mp3_44100_128" }, expect: "buf" }));
  if (!res) return false;
  const raw = saveRaw(rawPath(c.path, ".mp3"), res.data);
  const r = post("loop", raw, abs(c.path), "--samples", c.samples, "--xfade", cat.loop.xfadeSamples, "--rms-db", c.rmsDb ?? -44, "--tile", ...(c.channels === 1 ? ["--mono"] : []));
  setManifest({ id: c.id, path: c.path, kind: c.kind, source: "elevenlabs", endpoint: "POST /v1/sound-generation (loop: true, MP3)", model: body.model_id, prompt: c.prompt, requestS: c.requestS, raw: raw.slice(ROOT.length + 1), loop: r, note: c.note });
  say(`  ok ${c.id}: ${r.samples} samples, seam jump ${r.seamJump} (p99.9 step ${r.p999StepJump})`);
  return true;
}

async function genMusic(c) {
  const body = { prompt: c.prompt, music_length_ms: Math.round(c.requestS * 1000), model_id: "music_v1", force_instrumental: true };
  const res = await paid(c.id, "music", estimate(c), () =>
    api("POST", "/v1/music", { body, query: { output_format: "mp3_44100_192" }, expect: "buf" }));
  if (!res) return false;
  const raw = saveRaw(rawPath(c.path, ".mp3"), res.data);
  const r = post("loop", raw, abs(c.path), "--samples", c.samples, "--xfade", cat.loop.xfadeSamples, "--rms-db", c.rmsDb ?? -30,
    "--music", "--bpm", cat.loop.bpm, "--offset", cat.loop.downbeatOffsetSamples);
  setManifest({ id: c.id, path: c.path, kind: c.kind, source: "elevenlabs", endpoint: "POST /v1/music", model: body.model_id, prompt: c.prompt, requestS: c.requestS, raw: raw.slice(ROOT.length + 1), loop: r, note: c.note });
  say(`  ok ${c.id}: ${r.samples} samples, bpm ${r.bpmDetected}${r.atempo ? ` (atempo ${r.atempo})` : ""}, downbeat → 0.25 s, seam jump ${r.seamJump}`);
  return true;
}

function genTickBed(c) {
  const tick = cat.clips.find((x) => x.id === c.from);
  if (!existsSync(abs(tick.path))) return false;
  const r = post("tickbed", abs(tick.path), abs(c.path), "--samples", c.samples, "--period", cat.loop.tickPeriodSamples, "--offset", cat.loop.tickOffsetSamples, "--peak", c.peakDb ?? -16);
  const src = manifestEntry(tick.id)?.source ?? "elevenlabs";
  setManifest({ id: c.id, path: c.path, kind: c.kind, source: src, derivedFrom: tick.id, prompt: c.prompt, ticks: r.ticks, firstTick: r.firstTick, lastTick: r.lastTick, note: c.note });
  say(`  ok ${c.id}: ${r.samples} samples, ${r.ticks} ticks at ${r.firstTick} + k·${cat.loop.tickPeriodSamples}`);
  return true;
}

/** Voice Design → (optionally) save the voice. Returns { voiceId?, generatedVoiceId, previewRaw, model, designed }. */
async function designVoice(key, estimateCredits) {
  const v = cat.voices[key];
  const store = abs(v.store);
  if (existsSync(store)) {
    const s = JSON.parse(readFileSync(store, "utf8"));
    if (s.voiceId || (!v.save && s.previewRaw && existsSync(abs(s.previewRaw)))) return s;
  }
  let res = null, model = v.designModel;
  for (const m of [v.designModel, "eleven_multilingual_ttv_v2"]) {
    const body = { voice_description: v.description, model_id: m, text: v.previewText, guidance_scale: v.guidanceScale, seed: ep.seed };
    try {
      res = await paid(`voice:${key}`, `text-to-voice/design (${m})`, estimateCredits, () =>
        api("POST", "/v1/text-to-voice/design", { body, query: { output_format: "mp3_44100_192" } }));
      model = m;
      break;
    } catch (e) {
      say(`  design with ${m} failed: ${e.message}`);
      if (e.status && e.status !== 400 && e.status !== 422) throw e;
    }
  }
  if (!res) return null;
  const pv = res.data.previews?.[0];
  if (!pv) throw new Error(`voice design ${key}: no previews in response`);
  const previewRaw = saveRaw(join(dirname(store), "_src", `${key}_design_preview.mp3`), Buffer.from(pv.audio_base_64, "base64"));
  const out = { key, designModel: model, description: v.description, previewText: v.previewText, guidanceScale: v.guidanceScale, seed: ep.seed,
    generatedVoiceId: pv.generated_voice_id, previewRaw: previewRaw.slice(ROOT.length + 1), previewsReturned: res.data.previews.length, takeUsed: 0 };
  if (v.save) {
    try {
      const cr = await api("POST", "/v1/text-to-voice", { body: { voice_name: v.saveName, voice_description: v.description.split("\n")[1] ?? v.description, generated_voice_id: pv.generated_voice_id } });
      out.voiceId = cr.data.voice_id;
      out.saved = true;
      log({ asset: `voice:${key}`, endpoint: "text-to-voice (save)", voiceId: out.voiceId });
    } catch (e) {
      say(`  saving voice ${key} failed (${e.message}); using fallback premade voice ${v.fallbackVoiceId}`);
      out.voiceId = v.fallbackVoiceId;
      out.saved = false;
      out.fallback = true;
      log({ asset: `voice:${key}`, endpoint: "text-to-voice (save)", error: e.message, fallbackVoiceId: v.fallbackVoiceId });
    }
  }
  writeFileSync(store, JSON.stringify(out, null, 2) + "\n");
  say(`  voice ${key}: designed with ${model}${out.voiceId ? `, voice_id ${out.voiceId}` : " (not saved)"}`);
  return out;
}

/** One TTS request per group with character timestamps, split into line files (bible 7.3). */
async function genTtsGroup(groupId, lines) {
  const g = cat.ttsGroups[groupId];
  const voice = await designVoice(g.voice, 600);
  if (!voice?.voiceId) return false;
  const all = cat.clips.filter((c) => c.kind === "tts_line" && c.group === groupId);
  const SEP = "\n\n... \n\n";
  let text = "";
  const spans = [];
  for (const c of all) {
    if (text) text += SEP;
    const start = text.length;
    text += c.text;
    const m = c.text.match(/^\s*(\[[^\]]*\]\s*)*/);
    spans.push({ c, c0: start + (m ? m[0].length : 0), c1: start + c.text.length - 1 });
  }
  const rawDir = join(abs("assets/vo/doctor"), "_src");
  let raw = join(rawDir, `${groupId}.wav`);
  let alignFile = join(rawDir, `${groupId}.alignment.json`);
  // The whole group is one paid take: if it was already generated with the same text, re-cut it for free.
  const reuse = existsSync(raw) && existsSync(alignFile) && !FORCE.has(groupId) && JSON.parse(readFileSync(alignFile, "utf8")).text === text;
  if (reuse) {
    say(`  ${groupId}: re-cutting the existing take (no API call)`);
  } else {
    const body = { text, model_id: g.model, voice_settings: { stability: g.stability, similarity_boost: 0.75 }, seed: ep.seed };
    const res = await paid(`tts:${groupId}`, `text-to-speech/with-timestamps (${g.model})`, textChars(text) + all.length * 3, () =>
      api("POST", `/v1/text-to-speech/${voice.voiceId}/with-timestamps`, { body, query: { output_format: "pcm_48000" } }));
    if (!res) return false;
    raw = saveRaw(raw, pcmToWav(Buffer.from(res.data.audio_base64, "base64")));
    alignFile = saveRaw(alignFile, Buffer.from(JSON.stringify({ text, alignment: res.data.alignment }, null, 1)));
    const chars = res.data.alignment?.characters?.join("") ?? "";
    if (chars !== text) say(`  WARN ${groupId}: alignment text differs from request (${chars.length} vs ${text.length} chars); cutting by index anyway`);
  }
  // write every line of the paid take that is still missing (the rest of the 7.3 library comes for free)
  const want = new Set([...lines.map((c) => c.id), ...all.filter((c) => !isDone(c)).map((c) => c.id)]);
  const spec = spans.filter((s) => want.has(s.c.id)).map((s) => ({ out: abs(s.c.path), c0: s.c0, c1: s.c1, maxS: s.c.maxS ?? 2.5, fadeOutMs: 50 }));
  const r = post("split-align", raw, alignFile, saveRaw(join(rawDir, `${groupId}.lines.json`), Buffer.from(JSON.stringify(spec))));
  for (const s of spans.filter((x) => want.has(x.c.id))) {
    const lr = r.lines.find((x) => x.out === abs(s.c.path));
    setManifest({ id: s.c.id, path: s.c.path, kind: s.c.kind, source: "elevenlabs", endpoint: "POST /v1/text-to-speech/{voice}/with-timestamps", model: g.model,
      voiceId: voice.voiceId, voiceDesigned: !voice.fallback, stability: g.stability, prompt: s.c.text, label: s.c.label, group: groupId,
      raw: raw.slice(ROOT.length + 1), cutS: lr?.cut, note: g.note });
    say(`  ok ${s.c.id}: ${lr?.samples} samples (${lr?.durationS} s) "${s.c.text}"`);
  }
  return true;
}

/** The one clear word: last phrase of the VP6 Voice Design preview (no free voice slot to save VP6). */
async function genDesignWord(c) {
  const v = cat.voices[c.voice];
  const voice = await designVoice(c.voice, 600);
  let source = "voice-design-preview", r = null;
  if (voice?.previewRaw) {
    try {
      r = post("split-last", abs(voice.previewRaw), abs(c.path), "--max", c.maxS ?? 1.2, "--gap", 0.3);
      if (r.phraseS < 0.15 || r.phraseS > 1.2) throw new Error(`last phrase ${r.phraseS}s does not look like one word`);
    } catch (e) {
      say(`  cut of "${c.word}" from the preview failed: ${e.message}`);
      r = null;
    }
  }
  if (!r) {
    source = "tts-fallback";
    const body = { text: `[tired] ${c.word}`, model_id: "eleven_v3", voice_settings: { stability: 0.5 } };
    const res = await paid(c.id, "text-to-speech (fallback voice)", 10, () =>
      api("POST", `/v1/text-to-speech/${v.fallbackVoiceId}`, { body, query: { output_format: "pcm_48000" }, expect: "buf" }));
    if (!res) return false;
    const raw = saveRaw(rawPath(c.path, ".wav"), pcmToWav(res.data));
    r = post("clip", raw, abs(c.path), "--max", c.maxS ?? 1.2, "--fade-out", 50);
  }
  setManifest({ id: c.id, path: c.path, kind: c.kind, source: "elevenlabs", endpoint: source === "tts-fallback" ? "POST /v1/text-to-speech" : "POST /v1/text-to-voice/design (preview cut)",
    model: voice?.designModel, voicePreset: "VP6", prompt: `${v.description}\n---\npreview text: ${v.previewText}\n---\nkept: "${c.word}"`, method: source, note: v.note });
  say(`  ok ${c.id}: ${r.samples} samples (${r.durationS} s) via ${source}`);
  return true;
}

// ───────────────────────────── main ─────────────────────────────
async function main() {
  say(`episode ${EP}: ${usedIds.size} catalog clips referenced, ${wanted.length} wanted${LIBRARY ? " (--library)" : ""}, ${todo.length} to generate`);
  const u = await fetch(`${API}/v1/user`, { headers: { "xi-api-key": KEY } });
  if (u.status !== 200) {
    say(`GET /v1/user → ${u.status}: no ElevenLabs key available. Run tools/placeholder_audio.sh instead.`);
    process.exit(3);
  }
  const sub0 = (await u.json()).subscription;
  say(`ElevenLabs ${sub0.tier}: ${sub0.character_count}/${sub0.character_limit} credits used, voice slots ${sub0.voice_slots_used}/${sub0.voice_limit}; budget ${BUDGET}`);
  const est = todo.reduce((s, c) => s + estimate(c), 0) + (todo.some((c) => c.kind === "tts_line") ? 900 : 0) + (todo.some((c) => c.kind === "design_word") ? 600 : 0);
  say(`estimated cost of this run ≤ ${est} credits`);
  if (!DRY) log({ event: "start", creditsUsedBefore: sub0.character_count, creditLimit: sub0.character_limit, todo: todo.map((c) => c.id), estimate: est });

  const failed = [];
  const run = async (c, fn) => {
    try {
      if (!(await fn())) failed.push(c.id);
    } catch (e) {
      say(`  FAIL ${c.id}: ${e.message}`);
      log({ asset: c.id, error: e.message });
      failed.push(c.id);
    }
  };
  // order: SFX (tick first), loops, voices, then derived beds
  for (const c of todo.filter((x) => x.kind === "sfx")) await run(c, () => genSfx(c));
  for (const c of todo.filter((x) => x.kind === "roomtone_loop")) await run(c, () => genRoomtone(c));
  for (const c of todo.filter((x) => x.kind === "music_loop")) await run(c, () => genMusic(c));
  const groups = new Map();
  for (const c of todo.filter((x) => x.kind === "tts_line")) groups.set(c.group, [...(groups.get(c.group) ?? []), c]);
  // groups whose take exists but some library lines were never cut: re-cut for free
  for (const c of cat.clips.filter((x) => x.kind === "tts_line" && !isDone(x) && !groups.has(x.group) && (!ONLY || ONLY.has(x.id))))
    if (existsSync(join(abs("assets/vo/doctor"), "_src", `${c.group}.alignment.json`))) groups.set(c.group, []);
  for (const [g, lines] of groups) await run({ id: g }, () => genTtsGroup(g, lines));
  for (const c of todo.filter((x) => x.kind === "design_word")) await run(c, () => genDesignWord(c));
  for (const c of wanted.filter((x) => x.kind === "tickbed")) {
    if (DRY) continue;
    const tick = manifestEntry(c.from);
    const bed = manifestEntry(c.id);
    if (!existsSync(abs(c.path)) || FORCE.has(c.id) || !bed || bed.source !== tick?.source) await run(c, () => genTickBed(c));
  }
  if (DRY) {
    say(`dry run: ≈ ${spentEstimate} credits would be spent`);
    return;
  }
  // mouth data (RMS envelopes) for every dialogue clip of the episode
  try {
    execFileSync("python3", [join(ROOT, "tools/rms_envelope.py"), "--episode", EP, "--all"], { stdio: "inherit", cwd: ROOT });
  } catch (e) {
    say(`WARN rms_envelope.py failed: ${e.message}`);
  }
  await new Promise((res) => setTimeout(res, 3000));
  const sub1 = (await (await fetch(`${API}/v1/user`, { headers: { "xi-api-key": KEY } })).json()).subscription;
  const delta = sub1.character_count - sub0.character_count;
  log({ event: "end", calls, spentEstimate, spentHeader, creditsUsedAfter: sub1.character_count, accountDelta: delta, failed });
  say(`done: ${calls} paid calls, Character-Cost total ${spentHeader}, conservative estimate ${spentEstimate}, account counter delta ${delta} (may lag)`);
  if (failed.length) {
    say(`FAILED: ${failed.join(", ")} — rerun this script (finished assets are skipped) or fill gaps with tools/placeholder_audio.sh`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
