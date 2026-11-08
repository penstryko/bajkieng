#!/usr/bin/env bash
# QA stills + contact sheet from the rendered PNG master (run after npm run render:frames).
# Usage: tools/contact_sheet.sh [EP=S01E01] [frame …]          (npm run qa)
#   -> episodes/<EP>/qa/ep_fNNNN.png (full-size copies of the chosen frames)
#   -> episodes/<EP>/qa/contact_sheet.png (5 columns, 360×640 tiles with frame labels)
# Default frames: the S01E01 beats (hook/S0, landing, memories, curse, cry, advice, running gag, twist, climax,
# spit, exit, reset wipe, last frame). For stills of single frames WITHOUT a full render: node tools/qa_stills.mjs.
set -euo pipefail
cd "$(dirname "$0")/.."
EP=S01E01
if [[ "${1:-}" =~ ^S[0-9]{2}E[0-9]{2}$ ]]; then EP="$1"; shift; fi
FRAMES=("$@")
[[ ${#FRAMES[@]} -gt 0 ]] || FRAMES=(0 15 125 262 500 560 870 967 1220 1500 1650 1748 1790 1866 1919)
FR="out/$EP/frames"
QA="episodes/$EP/qa"
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$QA"
rm -f "$QA"/ep_f[0-9][0-9][0-9][0-9].png
i=0
for f in "${FRAMES[@]}"; do
  src=$(printf '%s/frame_%04d.png' "$FR" "$f")
  [[ -f "$src" ]] || { echo "contact_sheet: $src missing (npm run render:frames)"; exit 1; }
  cp "$src" "$(printf '%s/ep_f%04d.png' "$QA" "$f")"
  draw="drawbox=x=6:y=6:w=$((28 + 15 * ${#f})):h=40:color=black@0.85:t=fill"
  [[ -f "$FONT" ]] && draw="$draw,drawtext=fontfile=$FONT:text='f$f':x=14:y=12:fontsize=28:fontcolor=white"
  ffmpeg -nostdin -v error -y -i "$src" -vf "scale=360:640:flags=lanczos,$draw" "$(printf '%s/t%03d.png' "$TMP" "$i")"
  i=$((i + 1))
done
rows=$(( (i + 4) / 5 ))
ffmpeg -nostdin -v error -y -framerate 1 -i "$TMP/t%03d.png" \
  -vf "tile=5x${rows}:padding=6:margin=6:color=0x1a1a1a" -frames:v 1 "$QA/contact_sheet.png"
echo "contact_sheet: $QA/contact_sheet.png ($i frames: ${FRAMES[*]})"
