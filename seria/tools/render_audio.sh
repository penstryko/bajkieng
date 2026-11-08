#!/usr/bin/env bash
# Render the episode mix (all <Audio> placed by src/audio/EpisodeAudio.tsx) to WAV 48 kHz.
# Usage: tools/render_audio.sh [EP=S01E01] [extra remotion flags]  -> out/<EP>/<EP>_mix.wav
set -euo pipefail
cd "$(dirname "$0")/.."
EP=S01E01
if [[ "${1:-}" =~ ^S[0-9]{2}E[0-9]{2}$ ]]; then EP="$1"; shift; fi
mkdir -p "out/$EP"
OUT="out/$EP/${EP}_mix.wav"
npx remotion render src/index.ts "$EP" "$OUT" --codec=wav --sample-rate=48000 --log=warn "$@"
N=$(node -e "console.log(require('./episodes/$EP/episode.json').durationInFrames)")
S=$(ffprobe -v error -select_streams a:0 -show_entries stream=duration_ts,sample_rate -of default=nw=1:nk=1 "$OUT" | paste -sd' ')
echo "render:audio $EP -> $OUT (sample_rate duration_ts = $S; expected 48000 $((N*1600)))"
