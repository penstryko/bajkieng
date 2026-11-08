#!/usr/bin/env bash
# Local, clearly-labelled PLACEHOLDER versions of every catalog clip (no ElevenLabs key needed), synthesised
# with ffmpeg (tones, noise, sweeps; gibberish beeps for Thingish; a two-syllable hum for "Mm-hm"), at the
# SAME paths and with the SAME exact lengths as the real clips, so the episode renders and lints end to end.
#
#   tools/placeholder_audio.sh [S01E01] [--all] [--force] [--out DIR]
#     --all    every catalog entry (default: only what the episode references, plus dependencies)
#     --force  overwrite existing files (default: keep existing files, ElevenLabs or not)
#     --out    write under DIR instead of seria/ (test mode: DIR/assets/..., DIR/episodes/...)
#
# Labels: assets/audio_manifest.json "source": "placeholder" for every file written here, plus a RIFF
# LIST/INFO title "PLACEHOLDER <id>" inside each WAV. tools/gen_audio.mjs replaces placeholder files when a key
# is available. Beds: the tick bed is built exactly like the real one (gen_audio.post.py tickbed); room tone and
# music beds go through the same report command 5 (qsin tail->head) at exactly 3,072,000 samples, and the
# placeholder music has its downbeats at 0.25 s + 2k s (bible 6.2).
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
OUT="$ROOT"; EP=S01E01; ALL=0; FORCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    S[0-9][0-9]E[0-9][0-9]) EP="$1" ;;
    --all) ALL=1 ;;
    --force) FORCE=1 ;;
    --out) OUT="$(mkdir -p "$2" && cd "$2" && pwd)"; shift ;;
    *) echo "unknown arg $1"; exit 2 ;;
  esac
  shift
done
POST="python3 $ROOT/tools/gen_audio.post.py"
MANIFEST="$OUT/assets/audio_manifest.json"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
SR=48000

# id|kind|path|durationS|maxS|ph|used|fadeOutMs|samples|from|peakDb|rmsDb  (used: referenced by the episode)
LIST="$(node -e '
const fs = require("fs");
const [root, ep] = process.argv.slice(1);
const cat = JSON.parse(fs.readFileSync(root + "/tools/gen_audio.catalog.json", "utf8"));
const e = JSON.parse(fs.readFileSync(`${root}/episodes/${ep}/episode.json`, "utf8"));
const norm = (p) => (p.startsWith("assets/") || p.startsWith("episodes/") ? p : `episodes/${ep}/${p}`);
const refs = new Set([e.bed.tickBed ?? `assets/sfx/SFX01_tick_bed${e.durationInFrames / 30}.wav`, e.bed.roomTone, e.bed.music, e.bed.tickClip,
  ...e.dialogue.map((d) => d.clip), ...e.sfx.map((s) => s.clip)].map(norm));
for (const a of e.actors) {
  const s = JSON.parse(fs.readFileSync(`${root}/${norm(a.ref)}`, "utf8"));
  Object.values(s.soundLanguage).forEach((p) => refs.add(norm(p)));
}
const used = new Set(cat.clips.filter((c) => refs.has(c.path)).map((c) => c.id));
cat.clips.filter((c) => c.kind === "tickbed" && used.has(c.id)).forEach((c) => used.add(c.from));
for (const c of cat.clips) console.log([c.id, c.kind, c.path, c.durationS ?? "", c.maxS ?? "", c.ph ?? "", used.has(c.id) ? 1 : 0,
  c.fadeOutMs ?? 40, c.samples ?? "", c.from ?? "", c.peakDb ?? "", c.rmsDb ?? ""].join("|"));
' "$ROOT" "$EP")"

# ───────────── synthesis recipes (ffmpeg aevalsrc expressions; t in seconds) ─────────────
expr() { # ph dur
  local ph="$1" d="$2"
  case "$ph" in
    tick)          echo "0.9*sin(2*PI*2400*t)*exp(-t*90)" ;;
    ding)          echo "0.6*sin(2*PI*1760*t)*exp(-t*3)+0.3*sin(2*PI*3520*t)*exp(-t*5)" ;;
    ratchet)       echo "0.7*sin(2*PI*1800*t)*exp(-mod(t,0.04)*150)" ;;
    click)         echo "0.8*sin(2*PI*3000*t)*exp(-t*120)" ;;
    whistle_down)  echo "0.5*sin(2*PI*(2000*t-1400*t*t/(2*$d)))" ;;
    thud_boing)    echo "0.9*sin(2*PI*70*t)*exp(-t*12)+0.4*sin(2*PI*(220+60*sin(2*PI*9*t))*t)*exp(-t*4)*gt(t,0.12)" ;;
    creak)         echo "0.4*sin(2*PI*(180+80*sin(2*PI*1.3*t))*t)*(0.6+0.4*sin(2*PI*7*t))" ;;
    gulp)          echo "0.8*sin(2*PI*(160-100*t)*t)*exp(-t*5)" ;;
    cough)         echo "0.5*sin(2*PI*150*t+3*sin(2*PI*1234*t))*exp(-mod(t,0.4)*10)" ;;
    chirp)         echo "0.7*sin(2*PI*3200*t)*lt(t,0.12)" ;;
    blip)          echo "0.4*sin(2*PI*900*t+5*sin(2*PI*1777*t))*exp(-t*18)" ;;
    scribble)      echo "0.4*sin(2*PI*(1200+400*sin(2*PI*13*t))*t)*(0.5+0.5*sin(2*PI*11*t))" ;;
    flip)          echo "0.5*sin(2*PI*600*t+8*sin(2*PI*2300*t))*exp(-t*20)" ;;
    whoosh_up)     echo "0.4*sin(2*PI*(300*t+700*t*t))*sin(PI*t/$d)" ;;
    knocks)        echo "0.9*sin(2*PI*110*t)*exp(-mod(t,0.5)*25)*lt(t,1.3)" ;;
    rattle)        echo "0.5*sin(2*PI*1400*t)*exp(-mod(t,0.05)*80)*(1-t/$d)" ;;
    puff)          echo "0.8*sin(2*PI*60*t+4*sin(2*PI*900*t))*exp(-t*4)" ;;
    buzz)          echo "0.4*sin(2*PI*120*t)*gt(sin(2*PI*120*t),0)*gt(mod(floor(t*12),3),0)" ;;
    rub)           echo "0.3*sin(2*PI*(2500+500*sin(2*PI*6*t))*t)*abs(sin(2*PI*3.3*t))" ;;
    fanfare)       echo "0.4*sin(2*PI*if(lt(t,0.4),523,if(lt(t,0.8),659,if(lt(t,1.2),784,1047)))*t)*if(gt(t,2.6),(3-t)/0.4,1)" ;;
    office_chaos)  echo "0.3*sin(2*PI*90*t)*exp(-mod(t,0.37)*20)+0.15*sin(2*PI*1900*t)*lt(mod(t,0.9),0.1)" ;;
    hiccup)        echo "0.5*sin(2*PI*(400+800*t)*t)*exp(-t*6)" ;;
    job_beeps)     echo "0.5*sin(2*PI*2000*t)*lt(mod(t,0.2),0.1)*lt(t,0.6)+0.3*sin(2*PI*(80+100*t)*t)*gt(t,0.6)" ;;
    frenzy)        echo "0.4*sin(2*PI*(300+200*sin(2*PI*20*t))*t)*(0.6+0.4*sin(2*PI*25*t))" ;;
    # Thingish gibberish: pitch steps from a deterministic sine of the syllable index, gated syllables
    thingish_talk)  echo "0.5*sin(2*PI*(700+300*sin(floor(t*12)*2.7))*t)*lt(mod(t*12,1),0.7)" ;;
    thingish_rant)  echo "0.5*sin(2*PI*(500+400*sin(floor(t*18)*1.9))*t)*lt(mod(t*18,1),0.75)+0.15*sin(2*PI*90*t+6*sin(2*PI*31*t))" ;;
    thingish_cry)   echo "0.5*sin(2*PI*(520-120*t+40*sin(2*PI*5*t))*t)*(0.6+0.4*sin(2*PI*2.2*t))" ;;
    thingish_curse) echo "0.6*sin(2*PI*140*t+3*sin(2*PI*70*t))*gt(sin(2*PI*140*t),-0.2)" ;;
    thingish_exit)  echo "0.5*sin(2*PI*(500*t+300*t*t))*lt(mod(t*8,1),0.8)" ;;
    word_no)        echo "0.6*(sin(2*PI*(220-60*t)*t)+0.5*sin(4*PI*(220-60*t)*t))*sin(PI*t/$d)/1.5" ;;
    # "Mm-hm": nasal hum (3 harmonics), syllable 1 then 2, pitch pair per intonation
    hum_*)
      local f1=150 f2=150 a=0.5
      case "$ph" in
        hum_bored) f1=140; f2=128 ;; hum_up) f1=150; f2=195 ;; hum_skeptic) f1=152; f2=134 ;;
        hum_sarcastic) f1=168; f2=138 ;; hum_sleepy) f1=128; f2=118; a=0.35 ;; hum_down) f1=150; f2=120 ;;
        hum_whisper) a=0.2 ;; hum_firm) f1=150; f2=146 ;; hum_verdict) f1=142; f2=124 ;; hum_angry) f1=175; f2=150 ;;
        hum_alarm) f1=230; f2=290 ;; hum_happy) f1=180; f2=225 ;; hum_scared) f1=200; f2=245; a=0.25 ;; hum_laugh) f1=165; f2=160 ;;
      esac
      local s1; s1=$(python3 -c "print(round($d*0.38,3))")
      local g; g=$(python3 -c "print(round($d*0.48,3))")
      echo "$a*if(lt(t,$s1),sin(PI*t/$s1),if(lt(t,$g),0,sin(PI*(t-$g)/($d-$g))))*(sin(2*PI*if(lt(t,$s1),$f1,$f2)*t)+0.5*sin(4*PI*if(lt(t,$s1),$f1,$f2)*t)+0.25*sin(6*PI*if(lt(t,$s1),$f1,$f2)*t))/1.75" ;;
    *) echo "0.3*sin(2*PI*440*t)" ;;
  esac
}

info_label() { # wav title — append a RIFF LIST/INFO INAM chunk (after data; players ignore it)
  python3 - "$1" "$2" <<'PY'
import struct, sys
p, title = sys.argv[1], sys.argv[2].encode() + b"\0"
if len(title) % 2: title += b"\0"
chunk = b"INFO" + b"INAM" + struct.pack("<I", len(title)) + title
lst = b"LIST" + struct.pack("<I", len(chunk)) + chunk
b = bytearray(open(p, "rb").read()); b += lst
b[4:8] = struct.pack("<I", len(b) - 8)
open(p, "wb").write(bytes(b))
PY
}

manifest() { $POST manifest "$MANIFEST" "$OUT" "$1" >/dev/null; }
jsonstr() { python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$1"; }

made=0; kept=0
synth_clip() { # id path dur fadeOut ph peak
  local id="$1" path="$2" d="$3" fo="$4" ph="$5" peak="${6:--3}"
  local e; e="$(expr "$ph" "$d")"
  mkdir -p "$(dirname "$OUT/$path")"
  ffmpeg -nostdin -v error -y -f lavfi -i "aevalsrc='$e':s=$SR:d=$d" -ac 1 "$TMP/$id.wav"
  $POST clip "$TMP/$id.wav" "$OUT/$path" --dur "$d" --fade-out "$fo" --peak "$peak" --no-lead-trim >/dev/null
  info_label "$OUT/$path" "PLACEHOLDER $id"
}

while IFS='|' read -r id kind path dur maxs ph used fo samples from peak rms; do
  [[ "$ALL" == 1 || "$used" == 1 ]] || continue
  if [[ -f "$OUT/$path" && "$FORCE" == 0 ]]; then kept=$((kept+1)); continue; fi
  case "$kind" in
    sfx)
      synth_clip "$id" "$path" "$dur" "$fo" "$ph" "${peak:--3}"
      recipe="aevalsrc $(expr "$ph" "$dur")" ;;
    tts_line|design_word)
      d=0.8; [[ "$ph" == hum_verdict || "$ph" == hum_sarcastic || "$ph" == hum_skeptic ]] && d=1.1; [[ "$kind" == design_word ]] && d=0.5
      synth_clip "$id" "$path" "$d" 60 "$ph" -3
      recipe="aevalsrc $(expr "$ph" "$d")" ;;
    roomtone_loop)
      ffmpeg -nostdin -v error -y -f lavfi -i "anoisesrc=color=brown:amplitude=0.3:seed=1001:r=$SR" -f lavfi -i "anoisesrc=color=pink:amplitude=0.05:seed=7:r=$SR" \
        -filter_complex "[0][1]amix=inputs=2:normalize=0,lowpass=f=900" -t 70 -ac 1 "$TMP/$id.wav"
      $POST loop "$TMP/$id.wav" "$OUT/$path" --samples "$samples" --xfade 4800 --rms-db "${rms:--44}" --mono >/dev/null
      info_label "$OUT/$path" "PLACEHOLDER $id"
      recipe="anoisesrc brown+pink, lowpass 900 Hz, report command 5 (qsin 4800) to $samples samples" ;;
    music_loop)
      # 120 BPM: beats every 0.5 s, downbeats (bass + accent) at 0.35 s + 2k s in the source, i.e. at
      # 0.25 s + 2k s after command 5 drops the first 4800 samples (0.1 s).
      e="0.30*sin(2*PI*if(lt(mod(t-0.35,8),4),73.4,87.3)*t)*exp(-mod(t-0.35,0.5)*6)*(1+gt(0.5,mod(t-0.35,2)))+0.10*sin(2*PI*if(lt(mod(t-0.35,4),2),293.7,349.2)*t)*exp(-mod(t-0.35,1)*3)"
      ffmpeg -nostdin -v error -y -f lavfi -i "aevalsrc='$e':s=$SR:d=70" -ac 2 "$TMP/$id.wav"
      $POST loop "$TMP/$id.wav" "$OUT/$path" --samples "$samples" --xfade 4800 --rms-db "${rms:--30}" >/dev/null
      info_label "$OUT/$path" "PLACEHOLDER $id"
      recipe="aevalsrc 120 BPM bass/chord pulse (D minor-ish), downbeats at 0.25 s + 2k s, report command 5 to $samples samples" ;;
    tickbed)
      continue ;;  # after the tick exists (below)
  esac
  manifest "{\"id\":\"$id\",\"path\":\"$path\",\"kind\":\"$kind\",\"source\":\"placeholder\",\"usedIn\":$([[ $used == 1 ]] && echo "[\"$EP\"]" || echo "[]"),\"prompt\":$(jsonstr "PLACEHOLDER ($recipe)")}"
  made=$((made+1))
  echo "[placeholder] $id -> $path"
done <<< "$LIST"

# tick bed from the (real or placeholder) tick
while IFS='|' read -r id kind path dur maxs ph used fo samples from peak rms; do
  [[ "$kind" == tickbed && ( "$ALL" == 1 || "$used" == 1 ) ]] || continue
  [[ -f "$OUT/$path" && "$FORCE" == 0 ]] && { kept=$((kept+1)); continue; }
  tickpath=$(grep "^$from|" <<< "$LIST" | cut -d'|' -f3)
  $POST tickbed "$OUT/$tickpath" "$OUT/$path" --samples "$samples" --period 24000 --offset 12000 --peak "${peak:--16}" >/dev/null
  src=$(python3 -c "import json,sys; m=json.load(open(sys.argv[1])); print(next((c['source'] for c in m['clips'] if c['id']==sys.argv[2]),'placeholder'))" "$MANIFEST" "$from")
  [[ "$src" == placeholder ]] && info_label "$OUT/$path" "PLACEHOLDER $id"
  manifest "{\"id\":\"$id\",\"path\":\"$path\",\"kind\":\"tickbed\",\"source\":\"$src\",\"derivedFrom\":\"$from\",\"usedIn\":[\"$EP\"],\"prompt\":\"(code) $from placed at sample 12000 + k*24000\"}"
  made=$((made+1)); echo "[placeholder] $id -> $path (from $from, $src)"
done <<< "$LIST"

if [[ "$OUT" == "$ROOT" ]]; then python3 "$ROOT/tools/rms_envelope.py" --episode "$EP" --all; fi
echo "[placeholder] done: $made written, $kept kept (existing). Manifest: $MANIFEST"
