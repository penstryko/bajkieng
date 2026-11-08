// Owned by the episode/audio builder. Places every audio clip of episode.json on the timeline.
//
// Layers (bible 6.2 "Szew audio", report "Dźwięk przechodzi przez szew bez kliku"):
//   1. BED — crosses the seam, runs the whole episode from frame 0 with duration N:
//        tick track (pre-rendered, N × 1600 samples, ticks at 12000 + k·24000; Bed.tickBed),
//        room tone and music loops (exactly N × 1600 samples, qsin tail→head crossfade, report command 5).
//      The music follows bed.musicDucks (schema Bed): negative = duck (the twist's half-second of silence),
//      positive = swell (the climax). All ramps live inside [6, N−75), so both file ends are identical.
//   2. DIALOGUE — doctor hums / patient Thingish / the one clear word: dialogue[].clip at frame `at`.
//   3. SFX — sfx[].clip at frame `at` (library "assets/…" or episode-local paths).
// Nothing but the bed may start in frames 0–5 or sound in the last 200 ms (lint 3 checks the files).
//
// Sample accuracy: at 30 fps / 48 kHz one frame = exactly 1600 samples, and Remotion delays each asset with
// `adelay=<n>S`, so a clip at frame f starts at sample f × 1600. Sub-frame timing (the tick offset of 7.5
// frames) lives inside the pre-rendered tick bed. Gains are constant per clip (only the music duck varies),
// so the bed is identical at both ends of the file and the loop stays seamless.
//
// Missing files (bundle.missingAudio) are skipped so the episode renders while assets are in progress;
// `npm run lint` (rule 10) fails the final render if anything is still missing.
import React from "react";
import { Audio, Sequence } from "remotion";
import type { Episode, MusicDuck } from "../schema";
import { assetUrl, dbToGain, defaultTickBed } from "../engine";

export interface EpisodeAudioProps {
  episode: Episode;
  episodeId: string;
  missingAudio: string[];
}

/** Music duck/swell gain (linear) at a frame of the bed (bed starts at frame 0, so bed frame = episode frame). */
export function duckGain(frame: number, ducks: readonly MusicDuck[] = []): number {
  let dbSum = 0;
  for (const d of ducks) {
    const r = Math.max(0, d.rampFrames ?? 3);
    let k = 0;
    if (frame >= d.from && frame <= d.to) k = 1;
    else if (r > 0 && frame >= d.from - r && frame < d.from) k = (frame - (d.from - r)) / r;
    else if (r > 0 && frame > d.to && frame <= d.to + r) k = 1 - (frame - d.to) / r;
    dbSum += k * d.gainDb;
  }
  return dbToGain(dbSum);
}

export const EpisodeAudio: React.FC<EpisodeAudioProps> = ({ episode, episodeId, missingAudio }) => {
  const N = episode.durationInFrames;
  const missing = new Set(missingAudio);
  const bed = episode.bed;
  const ducks = bed.musicDucks ?? [];
  const musicGain = dbToGain(bed.musicGainDb);

  const clip = (
    key: string,
    path: string,
    from: number,
    volume: number | ((f: number) => number),
    durationInFrames?: number,
  ) =>
    missing.has(path) ? null : (
      <Sequence key={key} from={from} durationInFrames={durationInFrames} layout="none" name={key}>
        <Audio src={assetUrl(path, episodeId)} volume={volume} />
      </Sequence>
    );

  return (
    <>
      {/* 1. bed: whole episode, crosses the seam */}
      {clip("bed:tick", bed.tickBed ?? defaultTickBed(N), 0, dbToGain(bed.tickGainDb), N)}
      {clip("bed:room", bed.roomTone, 0, dbToGain(bed.roomToneGainDb), N)}
      {clip("bed:music", bed.music, 0, ducks.length ? (f: number) => musicGain * duckGain(f, ducks) : musicGain, N)}
      {/* 2. dialogue */}
      {episode.dialogue.map((d, i) => clip(`vo:${i}:${d.char}@${d.at}`, d.clip, d.at, dbToGain(d.gainDb)))}
      {/* 3. sfx */}
      {episode.sfx.map((s, i) => clip(`sfx:${i}@${s.at}`, s.clip, s.at, dbToGain(s.gainDb)))}
    </>
  );
};
