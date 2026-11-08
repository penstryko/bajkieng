#!/usr/bin/env bash
# Render the lossless PNG master sequence into out/<EP>/frames/frame_NNNN.png (4-digit, = frame number).
# Usage: tools/render_frames.sh [EP=S01E01] [--frames=a-b] [extra remotion flags]
#   npm run render:frames                          # all frames (long: run in background / chunks)
#   npm run render:frames -- S01E01 --frames=0-479 # one chunk; chunks may be rendered in any order
# Remotion pads frame numbers to the digit count of the LAST frame of the range (0-479 -> 3 digits),
# so names are normalised to 4 digits after every chunk.
set -euo pipefail
cd "$(dirname "$0")/.."
EP=S01E01
if [[ "${1:-}" =~ ^S[0-9]{2}E[0-9]{2}$ ]]; then EP="$1"; shift; fi
OUT="out/$EP/frames"
mkdir -p "$OUT"
npx remotion render src/index.ts "$EP" "$OUT" --sequence --image-format=png \
  --image-sequence-pattern='frame_[frame].[ext]' --log=warn "$@"
shopt -s nullglob
for f in "$OUT"/frame_*.png; do
  n="${f##*/frame_}"; n="${n%.png}"
  want="$OUT/$(printf 'frame_%04d.png' "$((10#$n))")"
  [[ "$f" != "$want" ]] && mv -f "$f" "$want"
done
echo "render:frames $EP -> $OUT ($(ls "$OUT" | grep -c '^frame_[0-9]\{4\}\.png$') frames present)"
