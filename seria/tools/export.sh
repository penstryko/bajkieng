#!/usr/bin/env bash
# Final export per the report's command 3 ("Idealną pętlę gwarantuje matematyka klatek i próbek"),
# from the PNG master + WAV mix, plus a small 540x960 preview.
# Usage: tools/export.sh [EP=S01E01]
#   in : out/<EP>/frames/frame_%04d.png, out/<EP>/<EP>_mix.wav (if missing: exact-length silence + warning)
#   out: out/<EP>/<EP>_final.mp4 (1080x1920 H.264 High/AAC 48 kHz), out/<EP>/<EP>_preview.mp4 (540x960, < ~15 MB)
# Set NO_EDITLIST=1 for the report's "No Edit Lists" variant (AAC priming 1024 samples stays in the stream).
set -euo pipefail
cd "$(dirname "$0")/.."
EP="${1:-S01E01}"
D="out/$EP"
N=$(node -e "console.log(require('./episodes/$EP/episode.json').durationInFrames)")
SAMPLES=$((N * 1600))
FRAMES="$D/frames/frame_%04d.png"
MIX="$D/${EP}_mix.wav"
FINAL="$D/${EP}_final.mp4"
PREVIEW="$D/${EP}_preview.mp4"
have=$(ls "$D/frames" 2>/dev/null | grep -c '^frame_[0-9]\{4\}\.png$' || true)
[[ "$have" -eq "$N" ]] || { echo "export: need $N frames in $D/frames, found $have (npm run render:frames)"; exit 1; }
if [[ -f "$MIX" ]]; then AIN=(-i "$MIX"); else
  echo "export: WARNING $MIX missing -> exporting with digital silence (npm run render:audio)"
  AIN=(-f lavfi -t "$((N / 30 + 1))" -i "anullsrc=r=48000:cl=stereo"); fi
MOV=(-movflags +faststart)
[[ "${NO_EDITLIST:-0}" == 1 ]] && MOV=(-use_editlist 0 -movflags +faststart+negative_cts_offsets)
# PNG is RGB: convert with the BT.709 matrix (tags alone do not convert).
ffmpeg -v error -stats -y -framerate 30 -start_number 0 -i "$FRAMES" "${AIN[@]}" -map 0:v:0 -map 1:a:0 \
  -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -profile:v high -level:v 4.2 -pix_fmt yuv420p \
  -fps_mode cfr -r 30 -crf 18 -maxrate 12M -bufsize 24M \
  -g 15 -keyint_min 15 -sc_threshold 0 -bf 2 \
  -af "atrim=end_sample=$SAMPLES,apad=whole_len=$SAMPLES" \
  -c:a aac -b:a 320k -ar 48000 -ac 2 \
  -frames:v "$N" "${MOV[@]}" \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  "$FINAL"
ffmpeg -v error -stats -y -i "$FINAL" -map 0:v:0 -map 0:a:0 \
  -vf "scale=540:960:flags=lanczos" -c:v libx264 -preset medium -profile:v high -pix_fmt yuv420p \
  -crf 26 -maxrate 1200k -bufsize 2400k -g 15 -c:a copy -movflags +faststart \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 "$PREVIEW"
ls -l "$FINAL" "$PREVIEW" | awk '{printf "export: %s %.1f MB\n", $NF, $5/1048576}'
