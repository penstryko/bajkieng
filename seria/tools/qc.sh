#!/usr/bin/env bash
# ONE command for the whole quality check after a full render + export. Prints a short summary
# (only problems + verdicts) and builds ONE contact sheet. Claude reads this output and the single
# image out/<EP>/qc_sheet.png — never the individual frames, unless a tile looks wrong
# (then: python3 tools/qc_sheet.py <EP> --crop <frame>).
# Usage: tools/qc.sh [EP=S01E01]        (npm run qc -- S01E02)
set -uo pipefail
cd "$(dirname "$0")/.."
EP=S01E01
if [[ "${1:-}" =~ ^S[0-9]{2}E[0-9]{2}$ ]]; then EP="$1"; shift; fi
MP4="out/$EP/${EP}_final.mp4"
LOG="out/$EP/qc.log"; mkdir -p "out/$EP"; : > "$LOG"
fail=0
echo "== QC $EP"
# 1. lint (scenario/JSON rules)
if npx tsx src/lint/run.ts "$EP" >>"$LOG" 2>&1; then echo "PASS  lint"; else echo "FAIL  lint"; fail=1; fi
grep -E '^(ERR|ERROR|WARN)' "$LOG" | head -8
# 2. loop, frame count, audio samples, loudness (tools/check_loop.sh)
bash tools/check_loop.sh "$EP" >"out/$EP/check_loop.log" 2>&1
grep -E '^(FAIL|WARN)' "out/$EP/check_loop.log" | head -8
tail -1 "out/$EP/check_loop.log" | grep -q 'RESULT: PASS' && echo "PASS  loop/audio/format (check_loop)" || { echo "FAIL  check_loop (full log: out/$EP/check_loop.log)"; fail=1; }
# 3. black / frozen video on the final file
if [[ -f "$MP4" ]]; then
  ffmpeg -nostdin -hide_banner -i "$MP4" -vf "blackdetect=d=0.2:pix_th=0.05,freezedetect=n=0.001:d=2.5" -an -f null - 2>"out/$EP/detect.log"
  nb=$(grep -c 'black_start' "out/$EP/detect.log"); nf=$(grep -c 'freeze_start' "out/$EP/detect.log")
  [[ $nb -eq 0 ]] && echo "PASS  no black frames" || { echo "FAIL  black segments: $nb"; fail=1; }
  [[ $nf -eq 0 ]] && echo "PASS  no frozen picture ≥ 2.5 s" || echo "WARN  frozen picture ≥ 2.5 s: $nf (check on the sheet; a deliberate static shot is OK)"
  grep -E 'freeze_start' "out/$EP/detect.log" | sed -E 's/.*freeze_start: ([0-9.]+).*/      freeze at \1 s/' | head -4
else
  echo "FAIL  $MP4 missing (npm run export)"; fail=1
fi
# 4. one contact sheet
python3 tools/qc_sheet.py "$EP" || fail=1
[[ $fail -eq 0 ]] && echo "RESULT: PASS — now look at the sheet once" || echo "RESULT: FAIL"
exit $fail
