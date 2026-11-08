#!/usr/bin/env bash
# Loop verification (bible §6.2, lint 1–2; report "Idealną pętlę gwarantuje matematyka klatek i próbek").
# Usage: tools/check_loop.sh [EP=S01E01]
#  1. PNG master: frame count == N and every frame_0000..frame_{N-1} present
#  2. PNG master: frames 0–5 and N−15…N−1 have the SAME decoded-pixel md5 as frame 0 (21 frames)
#  3. mix WAV (if rendered): exactly N×1600 samples at 48 kHz
#  3b. master WAV (npm run master:audio): exactly N×1600 samples at 48 kHz, I = −14 ± 0.5 LUFS, true peak ≤ −1.5 dBTP
#  4. final MP4: N video frames, r_frame_rate 30/1, 1080x1920
#  5. final MP4: audio decodes to exactly N×1600 samples (AAC priming caveat reported if off by 1024/2048;
#     with NO_EDITLIST=1 that offset is accepted as the report's "No Edit Lists" variant)
#  5b. final MP4 seam: decoded frames N−15…N−10 bit-identical to decoded frames 0–5 (framemd5), so the encoded
#      loop point cannot shimmer; INFO: how many of the 21 S0 frames decode identical to frame 0, worst PSNR
#  5c. final MP4 audio loudness (INFO: I / true peak after AAC)
#  6. seam spectrogram (report command 4) written to out/<EP>/qa/seam.png for a visual check (INFO)
# Exit code 0 only if every check ran and passed.
set -uo pipefail
cd "$(dirname "$0")/.."
EP="${1:-S01E01}"
D="out/$EP"; FR="$D/frames"; MIX="$D/${EP}_mix.wav"; MASTER="$D/${EP}_master.wav"; MP4="$D/${EP}_final.mp4"
N=$(node -e "console.log(require('./episodes/$EP/episode.json').durationInFrames)" 2>/dev/null || echo 1920)
SAMPLES=$((N * 1600))
pass=0; fail=0; skip=0
ok()   { echo "PASS  $*"; pass=$((pass+1)); }
bad()  { echo "FAIL  $*"; fail=$((fail+1)); }
skp()  { echo "SKIP  $*"; skip=$((skip+1)); }
info() { echo "INFO  $*"; }
fpath() { printf '%s/frame_%04d.png' "$FR" "$1"; }
pixmd5() { ffmpeg -v error -i "$1" -map 0:v:0 -pix_fmt rgba -f md5 - 2>/dev/null | sed 's/^MD5=//'; }

echo "== check_loop $EP  (N=$N, expected audio samples=$SAMPLES)"

# 1. frame count
if [[ -d "$FR" ]]; then
  have=$(ls "$FR" | grep -c '^frame_[0-9]\{4\}\.png$')
  missing=0; for ((i=0; i<N; i++)); do [[ -f "$(fpath $i)" ]] || missing=$((missing+1)); done
  extra=$((have - (N - missing)))
  if [[ $missing -eq 0 && $extra -eq 0 ]]; then ok "frames: $have PNG frames = N"
  else bad "frames: $have present, $missing of 0..$((N-1)) missing, $extra extra"; fi
else
  bad "frames: $FR does not exist (npm run render:frames)"
fi

# 2. S0 identity (pixels)
if [[ -f "$(fpath 0)" ]]; then
  ref=$(pixmd5 "$(fpath 0)"); diff=(); absent=()
  for i in 0 1 2 3 4 5 $(seq $((N-15)) $((N-1))); do
    f="$(fpath $i)"
    if [[ ! -f "$f" ]]; then absent+=("$i"); continue; fi
    [[ "$(pixmd5 "$f")" == "$ref" ]] || diff+=("$i")
  done
  if [[ ${#absent[@]} -gt 0 ]]; then bad "S0 identity: frames not rendered: ${absent[*]}"
  elif [[ ${#diff[@]} -gt 0 ]]; then bad "S0 identity: frames differing from frame 0: ${diff[*]}"
  else ok "S0 identity: frames 0–5 and $((N-15))–$((N-1)) == frame 0 (pixel md5 $ref)"; fi
  f6="$(fpath 6)"; [[ -f "$f6" ]] && [[ "$(pixmd5 "$f6")" == "$ref" ]] && info "frame 6 is also identical to S0 (motion starting at 6 with t=0; harmless — S0 simply lasts 7 frames)"
else
  bad "S0 identity: $(fpath 0) missing"
fi

# 3. mix WAV
if [[ -f "$MIX" ]]; then
  read -r sr dts < <(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate,duration_ts -of default=nw=1:nk=1 "$MIX" | paste -sd' ')
  if [[ "$sr" == 48000 && "$dts" == "$SAMPLES" ]]; then ok "mix WAV: $sr Hz, $dts samples"
  else bad "mix WAV: $sr Hz, $dts samples (expected 48000 Hz, $SAMPLES)"; fi
else
  skp "mix WAV: $MIX not rendered (npm run render:audio)"
fi

# 3b. master WAV (loudness)
loud() { ffmpeg -nostdin -nostats -hide_banner -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Summary:/{s=1} s && $1=="I:"{i=$2} s && $1=="Peak:"{p=$2} END{print i, p}'; }
if [[ -f "$MASTER" ]]; then
  read -r sr dts < <(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate,duration_ts -of default=nw=1:nk=1 "$MASTER" | paste -sd' ')
  read -r li ltp < <(loud "$MASTER")
  lok=$(awk -v i="$li" -v p="$ltp" 'BEGIN{d=i+14; if (d<0) d=-d; print (d <= 0.5 && p <= -1.5) ? 1 : 0}')
  if [[ "$sr" == 48000 && "$dts" == "$SAMPLES" && "$lok" == 1 ]]; then ok "master WAV: $sr Hz, $dts samples, I $li LUFS, true peak $ltp dBTP"
  else bad "master WAV: $sr Hz, $dts samples, I $li LUFS, TP $ltp dBTP (expected 48000 Hz, $SAMPLES, −14 ± 0.5 LUFS, ≤ −1.5 dBTP)"; fi
else
  skp "master WAV: $MASTER not rendered (npm run master:audio)"
fi

# 4–6. final MP4
if [[ -f "$MP4" ]]; then
  vinfo=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames,r_frame_rate,width,height -of default=nw=1 "$MP4")
  nbf=$(sed -n 's/^nb_read_frames=//p' <<<"$vinfo"); rfr=$(sed -n 's/^r_frame_rate=//p' <<<"$vinfo")
  w=$(sed -n 's/^width=//p' <<<"$vinfo"); h=$(sed -n 's/^height=//p' <<<"$vinfo")
  if [[ "$nbf" == "$N" && "$rfr" == "30/1" && "$w" == 1080 && "$h" == 1920 ]]; then ok "MP4 video: $nbf frames @ $rfr, ${w}x${h}"
  else bad "MP4 video: $nbf frames @ $rfr, ${w}x${h} (expected $N @ 30/1, 1080x1920)"; fi
  bytes=$(ffmpeg -v error -i "$MP4" -map 0:a:0 -ac 1 -ar 48000 -f s16le - | wc -c)
  dec=$((bytes / 2))
  if [[ "$dec" == "$SAMPLES" ]]; then ok "MP4 audio: decodes to $dec samples"
  else
    delta=$((dec - SAMPLES))
    if [[ ($delta -eq 1024 || $delta -eq 2048) && "${NO_EDITLIST:-0}" == 1 ]]; then
      ok "MP4 audio: decodes to $dec samples (+$delta) — CAVEAT: expected for the NO_EDITLIST variant (AAC priming ≈ 21 ms kept in the stream, report command 3)"
    elif [[ $delta -eq 1024 || $delta -eq 2048 ]]; then
      bad "MP4 audio: decodes to $dec samples (+$delta) — AAC priming not trimmed (no edit list). Report command 3: 1024 priming samples ≈ 21 ms; re-export without NO_EDITLIST, or run the check with NO_EDITLIST=1 if this variant is intended"
    else bad "MP4 audio: decodes to $dec samples (expected $SAMPLES, delta $delta)"; fi
  fi
  # 5b. encoded seam: decoded S0 frames (framemd5 of the decoded YUV)
  mapfile -t vmd5 < <(ffmpeg -v error -i "$MP4" -map 0:v:0 -vf "select='lte(n\,5)+gte(n\,$((N-15)))'" -fps_mode passthrough -f framemd5 - 2>/dev/null | grep -v '^#' | awk -F', *' '{print $NF}')
  if [[ ${#vmd5[@]} -eq 21 ]]; then
    same=0; for i in 0 1 2 3 4 5; do [[ "${vmd5[$i]}" == "${vmd5[$((6 + i))]}" ]] && same=$((same + 1)); done
    eq0=0; for m in "${vmd5[@]}"; do [[ "$m" == "${vmd5[0]}" ]] && eq0=$((eq0 + 1)); done
    if [[ $same -eq 6 ]]; then ok "MP4 seam: decoded frames $((N-15))–$((N-10)) bit-identical to decoded frames 0–5"
    else bad "MP4 seam: only $same of 6 decoded frame pairs ($((N-15))+i vs i) identical"; fi
    psnr=$(ffmpeg -v error -i "$MP4" -i "$MP4" -filter_complex "[0:v]select='gte(n\,$((N-15)))',setpts=N/TB[a];[1:v]select='eq(n\,0)',loop=loop=14:size=1:start=0,setpts=N/TB[b];[a][b]psnr=stats_file=-" -f null - 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i ~ /^psnr_avg:/){split($i,a,":"); v=a[2]; if(v=="inf") v=999; if(min==""||v+0<min) min=v+0}} END{print (min=="")?"n/a":min}')
    info "MP4 seam: $eq0 of the 21 decoded S0 frames are identical to decoded frame 0; worst PSNR of frames $((N-15))–$((N-1)) vs frame 0: ${psnr} dB (999 = identical)"
  else
    bad "MP4 seam: could not decode the 21 S0 frames (got ${#vmd5[@]})"
  fi
  # 5c. loudness after AAC
  read -r mi mtp < <(loud "$MP4")
  info "MP4 audio loudness: I $mi LUFS, true peak $mtp dBTP (target ≈ −14 LUFS, ≤ −1.5 dBTP; bible §7.4)"
  mkdir -p "$D/qa"
  if ffmpeg -v error -y -i "$MP4" -map 0:a:0 -c:a pcm_s24le "$D/qa/dec.wav" &&
     ffmpeg -v error -y -i "$D/qa/dec.wav" -i "$D/qa/dec.wav" -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" "$D/qa/seam.wav" &&
     ffmpeg -v error -y -ss "$(awk "BEGIN{print $N/30-0.5}")" -t 1 -i "$D/qa/seam.wav" -lavfi showspectrumpic=s=1024x512 -frames:v 1 "$D/qa/seam.png"; then
    info "seam spectrogram (±0.5 s around the loop point): $D/qa/seam.png"
  fi
  rm -f "$D/qa/dec.wav" "$D/qa/seam.wav"
else
  skp "MP4 video: $MP4 not exported (npm run export)"
  skp "MP4 audio: $MP4 not exported"
fi

echo "== $pass passed, $fail failed, $skip skipped"
if [[ $fail -eq 0 && $skip -eq 0 ]]; then echo "RESULT: PASS"; exit 0
elif [[ $fail -eq 0 ]]; then echo "RESULT: INCOMPLETE (nothing failed, but not every check could run)"; exit 2
else echo "RESULT: FAIL"; exit 1; fi
