# CONTRACT — Remotion production repo (series working title, see `src/series.ts`)

Source of truth for *content* is `biblia_serialu.md` (the bible). This file is the source of truth for
*code*: coordinates, layers, interfaces, ownership, asset paths and the render/verify pipeline, so three
builders can work in parallel and an integrator can wire everything without conflicts.

Code uses neutral ids only: `doctor`, `chester`, `chirp`, `patient`. Display names (series title, the
doctor's name, badge text, caption prefix) live **only** in `src/series.ts` — renaming the series is a
one-file change there (plus `title` in each `episode.json`, built with `episodeTitle()`).

---

## 1. Quick start

```bash
cd /home/user/bajkieng/seria
npm install                                  # already done; versions pinned (section 9)
npm run typecheck                            # tsc --noEmit
npm run still                                # out/stills/S01E01_f0000.png
npm run still -- ModelSheetCast 3            # any composition, any frame
npm run render:frames -- S01E01 --frames=0-479   # PNG master chunk (any order, re-runnable)
npm run render:audio                         # out/S01E01/S01E01_mix.wav (48 kHz)
npm run export                               # out/S01E01/S01E01_final.mp4 + S01E01_preview.mp4
npm run check                                # loop verification, PASS/FAIL summary
npm run lint:dev                             # bible §9.5 lint, missing assets = warnings
npm run lint                                 # same, missing assets = errors (use before the final render)
```

Compositions: `S01E01` (1080×1920, 30 fps, N = 1920 from `episode.json`), `ModelSheetCast`,
`ModelSheetSet` (both 1080×1920; builders may add more in their own composition files).

---

## 2. Ownership (who may edit what)

Edit only your own paths. Everything else is read-only for you; ask the coordinator for changes.

| Owner | Paths |
|---|---|
| **Cast builder** | `src/components/cast/**` (Doctor, Chester, Chirp, Glasses), `assets/cast/**`, `assets/glasses/**`, `src/compositions/cast.tsx` |
| **Set builder** | `src/components/set/**` (Set.tsx, `registry.ts`), `src/components/patients/**`, `src/components/props/**` (Notepad, Bubble, Caption, PropItem, Particles, `registry.ts`), `src/components/humans/**`, `assets/set/**`, `assets/patients/**`, `assets/humans/**`, `assets/notepad/**`, `src/compositions/set.tsx` |
| **Episode/audio builder** | `episodes/S01E01/**` (episode.json, patient.json, notes.md, sfx/, vo/, qa/), `assets/sfx/**`, `assets/vo/**`, `assets/music/**`, `src/audio/**`, `src/lint/**`, `tools/gen_audio.*`, `tools/placeholder_audio.*`, `tools/rms_envelope.*`, `ledger/**` |
| **Integrator** | `src/Episode.tsx`, `src/compositions/episode.tsx` |
| **Coordinator / architect** (shared, read-only for builders) | `package.json`, `package-lock.json`, `tsconfig.json`, `remotion.config.ts`, `.gitignore`, `CONTRACT.md`, `src/index.ts`, `src/Root.tsx`, `src/series.ts`, `src/enums.ts`, `src/schema.ts`, `src/contract.ts`, `src/engine/**`, `src/types/**`, `public/**` (symlinks), `tools/check_loop.sh`, `tools/render_frames.sh`, `tools/render_audio.sh`, `tools/export.sh`, `tools/still.sh` |

Rules of thumb:
- `src/Root.tsx` never changes: each owner registers compositions in its own `src/compositions/*.tsx`.
- Need a new npm package? Ask the coordinator (one `package.json`). Audio tooling can use Python 3.13
  (numpy 2.5 is installed) or ffmpeg 6.1.1 without touching `package.json`.
- Need a new enum value (e.g. a lens icon) or a prop? Ask the coordinator; do not fork the type.
- Cross-builder imports are fine **read-only** (e.g. Glasses may render `<Patient silhouette=…/>` for the
  patient-file lens icon; Bubble renders `<Human/>`).

---

## 3. Coordinate system, layers, safe zones

- Scene = the WIDE master frame, **1080×1920 px, origin top-left, y down**. All components draw in scene
  pixels (constants in `src/engine/layout.ts`: `POS`, `Z`, `SAFE`, colour tables).
- The integrator renders **one root `<svg viewBox="0 0 1080 1920">`**; layers z0–z13 sit inside the
  camera group (`cameraTransform()`), z14 caption and z15 vignette are **screen space** (outside the camera).
  The NOTEPAD camera replaces the scene with the full-screen `NotepadCard` (screen space).

| z | Layer (bible §5.2) | Component call | Position |
|---|---|---|---|
| 0 | wall, ceiling, carpet | `<Set layer="background">` | full frame |
| 1 | window + outside layer + blinds (+ `windowSlot`) | `<Set layer="window">` | x 390–690, y 360–640 |
| 2 | diploma, plant, Chirp | `<Set layer="decor">`, `<Chirp>` | diploma 740–900 × 380–520; plant 60–200 × 470–720; Chirp (170, 300) r 46 |
| 3 | doctor's armchair | `<Set layer="chair">` | x 610–920, y 820–1280 |
| 4–5 | doctor torso/head/perm/glasses | `<Doctor layer="body">` | x 637–883, y 525–1210; glasses 637–883 × 690–786 |
| 6 | Chester backrest + face | `<Chester layer="back">` | x 40–620, y 840–1090; face x 60–250, y 860–1010 |
| 7 | patient shadow | `<PatientShadow>` | centre (410, 1078), rx 130, ry 18, #000 @ 0.6 |
| 8 | patient(s) (and the doctor when `sunk_in_couch`) | `<Patient>` | solo anchor (410, 1150), box 245–575 × 770–1150; pair anchors (330/495, 1150) max 165×300; in chair (765, 1010) |
| 9 | seat front edge, valance, armrest | `<Chester layer="front">` | y 1100–1380 (covers ≈ 15 % of the patient) |
| 10 | table + tomato timer | `<Set layer="table">` | table 430–700 × 1200–1310; timer 540–630 × 1130–1215 |
| 11 | clipboard + doctor's hands + pen | `<Doctor layer="hands">` | x 650–830, y 1010–1210 |
| 12 | bubbles | `<Bubble>` | memory bubble x 140–640, y 330–690 |
| 13 | particles, flying props | `<Particles>`, `<PropItem>` | action zone |
| 14 | caption band (screen) | `<Caption>` | y 1235–1320, x 80–920 |
| 15 | vignette (screen) | `<Set layer="vignette">` | full frame, #000 @ 0.35 |

- **Lint 16:** no actor outline may enter Chester's face zone (x < 250, y 860–1010) in any frame.
- A patient exiting through the window switches to z = 1 at `zAt` and is drawn inside `windowSlot`.

**Safe zones (§5.3, `SAFE`):** top UI 0–200 (nothing important), bottom UI 1420–1920 (carpet only),
right buttons x 940–1080 × y 700–1600, action zone x 60–920 × y 220–1420, caption band y 1235–1320.

**Cameras (§5.4, `CAMERA_PRESETS`, `cameraAt()`):** screen = scene × scale + t, with focal → screen:

| Camera | scale | focal (scene) → screen | note |
|---|---|---|---|
| WIDE | 1.0 | — | frame 0 and the last frame |
| GLASSES | 3.2 | (760, 738) → (540, 820) | lenses fill x ≈ 146–934 |
| NOTEPAD | card | clipboard 900×1300 centred (540, 900), field 760×900 | separate flat card |
| PATIENT | 1.9 | (410, 960) → (540, 900) | |
| BUBBLE | 1.6 | (390, 510) → (540, 760) | |

Shot `ease`: `cut` (default) or `zoom8` / `zoom12` (smooth zoom from the previous shot's preset).

---

## 4. Component contract (`src/contract.ts` is the exact source)

Rules for **every** visual component:
1. Returns SVG content (`<g>…</g>`) in scene coordinates; no full-frame background outside the Set.
2. **Pure function of props.** Never call `useCurrentFrame()` / `useVideoConfig()` inside a component.
   Every time-varying value arrives as a prop computed by the engine in `Episode.tsx`. This is what makes
   the 21 S0 frames pixel-identical.
3. No `Math.random`, `Date.now`, `performance.now`, `new Date`, CSS animations/transitions (lint 9).
   Randomness = `random(seed)` from `remotion` with a seed from props (e.g. `noiseSeed`, `boilSeed`, `spec.seed`).
4. SVG ids (`clipPath`, `gradient`) must be unique per component (prefix with the component name).
5. Prefer drawing in TSX. File-based SVG art: `<InlineSvg src="assets/…svg" x y width height/>`
   (engine; fetches once, holds the frame with `delayRender`). Never use a raw `<image href>` (not awaited).

Signatures (abridged; see `src/contract.ts` for docs on each field):

```ts
Doctor   { layer: "body"|"hands"; brows; mouth; lens; lensNoise; noiseSeed; glassesY; glassesJump; headTilt; lean;
           pen; penPhase; blink; bob; breath; placement; placementT; extras; patient?; patientNo? }
Glasses  { cx; cy; slideY; lens; lensNoise; noiseSeed; patient?; patientNo?; glow? }        // rest centre (760, 738)
Chester  { layer: "back"|"front"; eyes; mouth; mouthOpen; sag; blink; pupil; eyeShake; spring; springWobble; breath }
Chirp    { led; ledLevel; tilt; jitter }
Set      { layer: "background"|"window"|"decor"|"chair"|"table"|"vignette"; windowLayer; windowT; windowSlot?;
           neonOn; blinds; plantStage; leafFall?; diplomaText; chairState; timer: TimerProps; vignetteOpacity }
TimerProps { dial; angle; visible; ringing; jitter }
Patient  { spec: PatientSpec; x; y; scale; sx; sy; rotate; brows; eyes; mouth; variant; blink; idle: IdleOffset;
           motionLines; tears; swallow; silhouette?; maxSize }                               // (x, y) = bottom-centre anchor
PatientShadow { cx; cy; rx; ry; scale; opacity }
NotepadCard { doodle; strokes; drawProgress; boilSeed; adviceLabel?; flip }                 // screen space
Bubble   { kind: "memory"|"speech"|"thought"; box; tail; inflate; dots; vignette?; moving?; t; grawlix?; text? }
Caption  { text; scale; opacity }                                                           // screen space
PropItem { id; x; y; scale; rotate; opacity; t; motionLines }
Particles { type; particles: ParticleState[] }
Human    { pose; x; y; scale; flip?; accessory?; moveAngle? }
EpisodeAudio { episode; episodeId; missingAudio }
```

Placement variants (§5.5): `chair` (default); `drop_out` — Doctor clips itself at y 1010 and falls by
`placementT`; `sunk_in_couch` — the integrator draws `<Doctor layer="body">` in the z8 slot instead of z4.

**Registries (open lists, set builder):** visual refs in `episode.json` are keys = basename without
extension (`assetKey("doodles/A01_fence.svg") === "A01_fence"`):
`DOODLE_KEYS`, `VIGNETTE_KEYS`, `PROP_KEYS` in `src/components/props/registry.ts`;
`WINDOW_LAYER_IDS` in `src/components/set/registry.ts` (pure TS — lint imports them in Node).
Add a key there in the same change that teaches the component to draw it.

---

## 5. Enums and schema

- `src/enums.ts` — closed vocabularies from the bible: doctor `BROWS`, `DOCTOR_MOUTHS`, `LENS_ICONS`,
  `DOCTOR_PLACEMENTS`, `DOCTOR_PENS`, `GLASSES_Y`, `DOCTOR_EXTRAS`, `DOCTOR_EXPRESSIONS` (§3.1 table rows);
  `CHESTER_EYES`, `CHESTER_MOUTHS`, `CHESTER_EXPRESSIONS` (§3.2); `CHIRP_LEDS` (§3.3); patient generator
  `PATIENT_CATEGORIES`, `PATIENT_SIZES`/`PATIENT_SIZE_MAX`, `PATIENT_SHAPES` (20), `PATIENT_EYES` (20) +
  swap-only/no-cry lists, `PATIENT_BROWS`, mouth types/drivers/shapes/styles, `PATIENT_WEAR`,
  accessories (`display:<TEXT>`), `PATIENT_IDLES`, `PATIENT_LANDINGS`, `ADULT_CODING`, `VOICE_PRESETS`,
  `PATIENT_PALETTE` (16); `HUMAN_POSES`, `HUMAN_ACCESSORIES`; `CAMERAS`, `SHOT_EASES`, `EASES`, `WINNERS`,
  `EXIT_TYPES` E01–E17, `WOUND_IDS`, `ADVICE_IDS`, `TWIST_IDS`, `PARTICLE_TYPES`, `PROP_ANIMS`,
  `TIMER_MODES`, `ACTOR_IDS`, `CHAR_IDS`, `ALLOWED_DURATIONS` {1920, 2880, 3120, 3360, 3600}.
- `src/schema.ts` — `Episode` (bible §9.2, complete), `State0`, `PoseEvent`, all tracks, `PatientSpec`
  (§4.6), `MouthData` (RMS / Rhubarb), `SeriesLedger`, `EpisodeBundle`.
  Additive, optional extensions to §9.2 (all optional, bible files stay valid):
  `DoctorPose.expression | lean | extras`, `ChesterPose.expression` (expanded from the §3 presets; explicit
  fields win), `DialogueEvent.gainDb`, `Bed.tickBed | musicGainDb | roomToneGainDb | tickGainDb`,
  `PatientSpec.transformed` (E12).

---

## 6. Engine (`src/engine/`, deterministic frame functions)

| Module | Exports |
|---|---|
| `constants.ts` | `FPS`=30, `WIDTH`/`HEIGHT`, `SAMPLE_RATE`=48000, `SAMPLES_PER_FRAME`=1600, `ritual(N)` → `DING`=N−180, `GLASSES`=N−75, `S0_IN`=N−30, `HOLD`=N−15, `CAPTION_IN`, `BLINK_START/END`, `LAST_SFX_END_S`=N/30−0.9, `TOTAL_SAMPLES`; `isState0Frame`, `blinkAllowed`, `sfxStartAllowed`, `assertAllowedDuration`, `TICK_PERIOD_SAMPLES`/`TICK_OFFSET_SAMPLES` |
| `layout.ts` | `Z`, `POS`, `SAFE`, `SET_COLORS`, `DOCTOR_COLORS`, `CHESTER_COLORS`, `CHIRP_COLORS`, `HUMAN_COLORS` |
| `tween.ts` | `progress`, `tween`, `interpolateClamp`, `poseAt` (pose tracks: numeric keys tween over `dur`, enums swap at `at`), `lastChange`, `clamp`, `lerp` |
| `camera.ts` | `CAMERA_PRESETS`, `cameraAt(frame, shots)`, `cameraTransform`, `toScreen` |
| `primitives.ts` | `idleEnvelope`, `idleBob`, `breath`, `patientIdle`, `blinkSchedule`/`blinkAt`, `squashLand`, `landing`, `popIn`, `popInFixed`, `popOut`, `springPoke`, `pathAt`, `motionAt` (fly/drop/launch for characters), `propAt` (pop/fly/drop/launch props), `mouthAt` (mouthSwap), `lensAt` (lensSwap), `glassesSlide`, `couchSagTransform`, `drawOn`/`jitterPoint`, `bubbleInflate`, `grawlix`, `shakeAt`, `particlesAt`, `dialAt` (dialRotate), `blindsAt`, `captionAt`, `chirpAt`, `rewindSource`, `rangeActive`/`localFrame` (wrap-around ranges) |
| `state0.tsx` | `withState0`, `State0Override`, `useEpisodeTiming` (integrator only) |
| `assets.ts` | `resolveAssetPath`, `assetUrl`, `assetKey`, `dbToGain`, `defaultTickBed`, `episodeAudioPaths`, `loadEpisodeBundle` |
| `InlineSvg.tsx`, `fonts.ts` | file-SVG helper; `FONTS.caption` = Anton, `FONTS.crt` = VT323 (npm @fontsource, loaded with `@remotion/fonts`) |

Guarantees: every periodic motion is multiplied by `idleEnvelope` (exactly 0 before frame 15 and from
`S0_IN`); blink schedules and lens static only start in [15, N−75); `popInFixed`/`popIn` return exactly 1
after settling; `dialAt` returns exactly 1.0 from `GLASSES+31` on. Never hard-code 1740/1845/1890/1905 —
use `ritual(N)`.

---

## 7. The loop (bible §6.2) — non-negotiable

- `Episode.tsx` renders `state0Scene(bundle)` — a frame-independent state built only from
  `episode.state0`, `continuity` and `patient.json` — for **f ≤ 5 and f ≥ N−15** (`withState0`). No track is
  evaluated on those frames. Verified: the scaffold's 21 S0 frames are pixel-identical (`npm run check`).
- S0 contents: WIDE, patient hovering with top edge at `state0.patient.topY` (anchor y = topY + maxSize.h,
  i.e. 610 for an L patient), 3 motion lines, shadow scale 1 / opacity 0.6, Chester `wide_up`/`tight`/sag
  0.02, doctor neutral with `patient_file_icon` lenses and pen raised, timer dial 1.0, Chirp off, window
  `calm` with the neon ON, caption fully visible.
- Audio: nothing may start in frames 0–5 or sound in the last 200 ms (lint 3); only the bed crosses the seam.
- Captions with `from > to` wrap through the seam (`captionAt`: pop-in 9 frames, static, 14-frame out).

---

## 8. Assets, audio and paths

**public dir:** `public/assets → ../assets`, `public/episodes → ../episodes` (symlinks; Remotion copies
them as symlinks into the bundle). So `staticFile("assets/sfx/SFX02_ding.wav")` and
`staticFile("episodes/S01E01/episode.json")` work in Studio and in renders. Never put files in `public/`.

**Path rule for audio/data refs in JSON** (`resolveAssetPath`):
`"assets/…"` → `seria/assets/…` (library) · `"episodes/…"` → explicit · anything else →
`seria/episodes/<ID>/…` (episode-local, e.g. `"sfx/printer_talk.wav"`, `"vo/patient/printer_no_VP6.wav"`).
Library doctor lines are therefore written `"assets/vo/doctor/MM01.wav"` (the bible's `vo/doctor/…` shorthand
is not used).

**Audio format:** WAV, 48 000 Hz, 16- or 24-bit PCM, mono or stereo. Bed files are **exactly N × 1600
samples** (3 072 000 for 64 s): `assets/sfx/SFX18_roomtone_loop64.wav`, `assets/music/theme_loop64.wav`
and the pre-rendered tick track `assets/sfx/SFX01_tick_bed64.wav` (ticks = `SFX01_tick.wav` placed at
sample 12 000 + k·24 000, k = 0…127). The tick bed exists because the 12 000-sample offset is 7.5 frames
and cannot be expressed with `<Sequence from>`. Build all three with `tools/gen_audio.*` (report command 5
for the qsin crossfade loops).

**Timing is sample-exact:** a clip at frame f starts at sample f × 1600 (Remotion uses `adelay=<n>S`).
Verified on the scaffold: ticks at 12 000 + k·24 000, a clip at frame 1740 at sample 2 784 000, mix length
3 072 000.

**Missing audio** is skipped (calculateMetadata lists it in `bundle.missingAudio`), so the episode renders
while assets are in progress; `npm run lint` (without `--dev`) fails until every file exists.

**Mouth data** (`dialogue[].mouthData`, JSON): RMS envelope
`{ "type": "rms", "sampleRate": 48000, "hopSamples": 1600, "values": [0..1, …], "thresholds": {"B": 0.12, "D": 0.4} }`
(one value per video frame → X/B/D), or Rhubarb JSON `{ "mouthCues": [{ "start", "end", "value" }] }`.
Rhubarb binaries cannot be downloaded here: use RMS for everything (also for the one clear word).

**ElevenLabs:** `api.elevenlabs.io` is reachable; send header `xi-api-key` with `$ELEVENLABS_API_KEY` or
the dummy `proxy-injected`. `GET /v1/user` = 200 → key available, 401 → generate placeholders instead
(`tools/placeholder_audio.*`) with the same file names and lengths.

---

## 9. Toolchain (installed and verified 2026-11-08)

| Package | Version |
|---|---|
| remotion, @remotion/cli, @remotion/fonts | 4.0.541 |
| react, react-dom | 19.3.1 |
| typescript | 5.9.3 |
| @types/react, @types/react-dom | 19.3.0 |
| @types/node | 22.20.5 |
| tsx | 4.23.15 |
| @fontsource/anton, @fontsource/vt323 | 5.3.0 |
| Node / npm / ffmpeg / Python | 22.23.4 / 10.9.9 / 6.1.1 / 3.13 (numpy 2.5.3) |

`remotion.config.ts`: browser = `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
(Remotion's own Chrome download is blocked), PNG for video and stills, image-sequence pattern
`frame_[frame].[ext]`, concurrency 3, overwrite on, public dir `public`, delayRender timeout 60 s.

---

## 10. Render and verification commands (exact)

| Step | Command | Output | Measured on the scaffold |
|---|---|---|---|
| Still | `npm run still -- <Comp> <frame> [out.png]` | `out/stills/<Comp>_fNNNN.png` | ~15 s (bundling dominates) |
| PNG master | `npm run render:frames -- S01E01 --frames=a-b` (chunks; omit `--frames` for all) | `out/S01E01/frames/frame_0000.png … frame_1919.png` | 1920 placeholder frames ≈ 2 min 20 s |
| Audio mix | `npm run render:audio` | `out/S01E01/S01E01_mix.wav` (48 kHz, 3 072 000 samples) | ~15 s |
| Export | `npm run export` (`NO_EDITLIST=1 npm run export` for the report's variant) | `out/S01E01/S01E01_final.mp4` (H.264 High 4.2, CRF 18, GOP 15, AAC 320k 48 kHz, faststart, BT.709), `out/S01E01/S01E01_preview.mp4` (540×960, ≈ 4–13 MB) | ~60 s |
| Loop check | `npm run check` (= `bash tools/check_loop.sh S01E01`) | PASS/FAIL per check + `out/S01E01/qa/seam.png` | exit 0 = PASS, 1 = FAIL, 2 = incomplete |
| Lint | `npm run lint:dev` / `npm run lint` | errors/warnings, exit 1 on error | — |

`check_loop.sh` verifies: frame count = N and no gaps; frames 0–5 and N−15…N−1 have the same
**decoded-pixel md5** (rgba) as frame 0; mix WAV = 48 kHz × N·1600 samples; final MP4 = N frames at 30/1,
1080×1920; audio decodes to exactly N·1600 samples (an extra 1024/2048 is reported as the AAC-priming
caveat — accepted only with `NO_EDITLIST=1`); writes the seam spectrogram (report command 4).
Scaffold result: **RESULT: PASS** (5/5) with test beds.

Export notes: the input is RGB PNG, so `export.sh` converts with `scale=out_color_matrix=bt709:out_range=tv`
(colour tags alone would leave a BT.601 matrix); the audio is trimmed/padded to exactly N·1600 samples
(`atrim`/`apad`); a missing mix is replaced by exact-length silence with a warning.

---

## 11. Caveats for builders

- **Bash calls time out at 10 min.** Render the full master in chunks (`--frames=0-639`, `640-1279`,
  `1280-1919`) or in the background. Chunks can be re-rendered individually; `render_frames.sh` normalises
  Remotion's per-range zero padding (0–479 → 3 digits) to `frame_NNNN.png`.
- 3 builders share 4 CPUs: for big renders pass `--concurrency=1` or `2` when others are rendering.
- Remotion logs `Failed to load resource … 404` lines only if `getStaticFiles()` is unavailable and it
  falls back to HTTP probing — harmless. The "Detected differing memory amounts" message is harmless too.
- Fonts come from npm (`@fontsource`), never Google Fonts CDN. Use `FONTS.caption` / `FONTS.crt` in SVG
  `fontFamily`; for another font ask the coordinator.
- `Episode.tsx` re-evaluates the resolver per frame: keep components cheap (no heavy filters except the
  lens glow; `feGaussianBlur` is fine on small regions).
- Frame 6 is still visually S0 in the seed data (the fall track starts at 6 with t = 0); `check` reports it
  as INFO only.
- The scaffold drawings are placeholders with the right positions and palette; replace them freely, keep
  the props.
