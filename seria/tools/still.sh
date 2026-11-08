#!/usr/bin/env bash
# Render one PNG still.  Usage: tools/still.sh [COMPOSITION=S01E01] [FRAME=0] [OUT.png] [--remotion-flags…]
#   npm run still                               -> out/stills/S01E01_f0000.png
#   npm run still -- ModelSheetCast 3           -> out/stills/ModelSheetCast_f0003.png
#   npm run still -- S01E01 150 out/x.png --scale=0.5
set -euo pipefail
cd "$(dirname "$0")/.."
pos=(); while [[ $# -gt 0 && "$1" != --* ]]; do pos+=("$1"); shift; done
COMP="${pos[0]:-S01E01}"; FRAME="${pos[1]:-0}"
OUT="${pos[2]:-out/stills/${COMP}_f$(printf '%04d' "$FRAME").png}"
mkdir -p "$(dirname "$OUT")"
npx remotion still src/index.ts "$COMP" "$OUT" --frame="$FRAME" --log=warn "$@"
echo "still: $OUT"
