#!/usr/bin/env bash
# Loop-safe loudness master (bible §7.4: ≈ −14 LUFS integrated, true peak ≤ −1.5 dBTP).
# Usage: tools/master_audio.sh [EP=S01E01]          (npm run master:audio)
#   in : out/<EP>/<EP>_mix.wav     (npm run render:audio: the raw Remotion mix, 48 kHz, N×1600 samples)
#   out: out/<EP>/<EP>_master.wav  (24-bit PCM, 48 kHz, exactly N×1600 samples; tools/export.sh prefers it)
# Env: TARGET_LUFS (default −14), LIMIT (limiter ceiling, linear, default 0.75 ≈ −2.5 dBFS sample peak; lowered automatically
#      while the true peak exceeds MAX_TP),
#      MAX_TP (default −1.5 dBTP).
#
# Why three copies: the episode is a loop. The mix is concatenated 3×, gained, limited
# (alimiter attack 5 ms / release 50 ms, auto-level off, latency compensated) and only the MIDDLE copy is kept,
# so the limiter has the same history on both sides of the seam (the last sample of the file and the first one
# see the same gain) and the loop stays click-free. Single-pass dynamic loudnorm on the 64 s file would ride the
# gain differently at the head and the tail. The gain is static and found iteratively (≤ 6 passes) from EBU R128.
set -euo pipefail
cd "$(dirname "$0")/.."
EP=S01E01
if [[ "${1:-}" =~ ^S[0-9]{2}E[0-9]{2}$ ]]; then EP="$1"; shift; fi
TARGET="${TARGET_LUFS:--14}"
LIMIT="${LIMIT:-0.75}"
MAX_TP="${MAX_TP:--1.5}"
N=$(node -e "console.log(require('./episodes/$EP/episode.json').durationInFrames)")
L=$((N * 1600))
MIX="out/$EP/${EP}_mix.wav"
OUT="out/$EP/${EP}_master.wav"
[[ -f "$MIX" ]] || { echo "master:audio: $MIX missing (npm run render:audio)"; exit 1; }

# "I TP" (integrated LUFS, true peak dBTP) of a file
measure() {
  ffmpeg -nostdin -nostats -hide_banner -i "$1" -af ebur128=peak=true -f null - 2>&1 |
    awk '/Summary:/{s=1} s && $1=="I:"{i=$2} s && $1=="Peak:"{p=$2} END{print i, p}'
}

read -r I0 TP0 < <(measure "$MIX")
echo "master:audio $EP: mix I = $I0 LUFS, TP = $TP0 dBTP -> target $TARGET LUFS, TP <= $MAX_TP dBTP"
gain=$(awk -v t="$TARGET" -v i="$I0" 'BEGIN{printf "%.2f", t - i}')
for pass in 1 2 3 4 5 6; do
  ffmpeg -nostdin -v error -y -i "$MIX" -i "$MIX" -i "$MIX" -filter_complex \
    "[0:a][1:a][2:a]concat=n=3:v=0:a=1,volume=${gain}dB,alimiter=limit=${LIMIT}:attack=5:release=50:level=0:latency=1,atrim=start_sample=${L}:end_sample=$((2 * L)),asetpts=N/SR/TB[a]" \
    -map "[a]" -c:a pcm_s24le -ar 48000 "$OUT"
  read -r I TP < <(measure "$OUT")
  echo "  pass $pass: gain ${gain} dB, limit ${LIMIT} -> I = $I LUFS, TP = $TP dBTP"
  ok=$(awk -v t="$TARGET" -v i="$I" -v p="$TP" -v m="$MAX_TP" 'BEGIN{d=t-i; if (d<0) d=-d; print (d <= 0.2 && p <= m) ? 1 : 0}')
  [[ "$ok" == 1 ]] && break
  # inter-sample peaks overshoot the sample-peak ceiling: lower the ceiling by the excess (+0.1 dB margin)
  LIMIT=$(awk -v l="$LIMIT" -v p="$TP" -v m="$MAX_TP" 'BEGIN{ if (p > m) l = l * 10 ^ ((m - p - 0.1) / 20); printf "%.4f", l }')
  gain=$(awk -v g="$gain" -v t="$TARGET" -v i="$I" 'BEGIN{printf "%.2f", g + (t - i)}')
done
S=$(ffprobe -v error -select_streams a:0 -show_entries stream=duration_ts -of default=nw=1:nk=1 "$OUT")
[[ "$S" == "$L" ]] || { echo "master:audio: $OUT has $S samples, expected $L"; exit 1; }
tp_ok=$(awk -v p="$TP" -v m="$MAX_TP" 'BEGIN{print (p <= m) ? 1 : 0}')
[[ "$tp_ok" == 1 ]] || echo "master:audio: WARNING true peak $TP dBTP > $MAX_TP (lower LIMIT)"
echo "master:audio $EP -> $OUT ($S samples, I = $I LUFS, TP = $TP dBTP, gain ${gain} dB, limit $LIMIT)"
