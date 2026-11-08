// Owned by the episode/audio builder. Places every audio clip of episode.json on the timeline.
//
// Sample accuracy: at 30 fps / 48 kHz one frame = exactly 1600 samples, and Remotion delays each
// asset with `adelay=<n>S` (samples), so a clip at frame f starts at sample f × 1600 exactly.
// Sub-frame timing (the tick grid offset of 12000 samples = 7.5 frames) is NOT expressible with
// <Sequence from>, so the tick grid is a pre-rendered bed file (N × 1600 samples, ticks at
// 12000 + k·24000) built by tools/gen_audio.* — see Bed.tickBed in src/schema.ts.
//
// Missing files (bundle.missingAudio) are skipped so the episode renders while assets are in progress.
// Lint rule 10 fails the final render if anything is still missing.
import React from "react";
import { Audio, Sequence } from "remotion";
import type { Episode } from "../schema";
import { assetUrl, dbToGain, defaultTickBed } from "../engine";

export interface EpisodeAudioProps {
  episode: Episode;
  episodeId: string;
  missingAudio: string[];
}

export const EpisodeAudio: React.FC<EpisodeAudioProps> = ({ episode, episodeId, missingAudio }) => {
  const N = episode.durationInFrames;
  const missing = new Set(missingAudio);
  const clip = (key: string, path: string, from: number, gainDb?: number, durationInFrames?: number) =>
    missing.has(path) ? null : (
      <Sequence key={key} from={from} durationInFrames={durationInFrames} layout="none" name={key}>
        <Audio src={assetUrl(path, episodeId)} volume={dbToGain(gainDb)} />
      </Sequence>
    );
  const bed = episode.bed;
  return (
    <>
      {clip("bed:tick", bed.tickBed ?? defaultTickBed(N), 0, bed.tickGainDb, N)}
      {clip("bed:room", bed.roomTone, 0, bed.roomToneGainDb, N)}
      {clip("bed:music", bed.music, 0, bed.musicGainDb, N)}
      {episode.dialogue.map((d, i) => clip(`vo:${i}:${d.char}`, d.clip, d.at, d.gainDb))}
      {episode.sfx.map((s, i) => clip(`sfx:${i}`, s.clip, s.at, s.gainDb))}
    </>
  );
};
