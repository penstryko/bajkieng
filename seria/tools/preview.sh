#!/usr/bin/env bash
# Cheap visual check WITHOUT a full render: renders only the ~20 key frames (one Remotion bundle) and
# tiles them into ONE image (tools/qc_sheet.py --preview). Use it for every iteration on episode.json;
# render the full episode only once, at the end.
# Usage: tools/preview.sh [EP=S01E01] [extra frames …]      (npm run preview -- S01E02)
#   -> out/<EP>/preview/ep_fNNNN.png, out/<EP>/preview_sheet.png
set -euo pipefail
cd "$(dirname "$0")/.."
EP=S01E01
if [[ "${1:-}" =~ ^S[0-9]{2}E[0-9]{2}$ ]]; then EP="$1"; shift; fi
FRAMES=$(python3 tools/qc_sheet.py "$EP" --list)
OUT="out/$EP/preview"
rm -rf "$OUT"; mkdir -p "$OUT"
node tools/qa_stills.mjs "$EP" "$OUT" $FRAMES "$@" > "out/$EP/preview.log" 2>&1 || { tail -20 "out/$EP/preview.log"; exit 1; }
python3 tools/qc_sheet.py "$EP" --preview
