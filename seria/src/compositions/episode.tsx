import { EPISODES } from "../series";
// Owned by the INTEGRATOR. Registers episode compositions. calculateMetadata loads the whole
// episode bundle (episode.json, patient.json, mouth data, missing-audio list) once per render,
// and takes durationInFrames from episode.json (ritual frames derive from it, lint 5).
// It also loads the RMS envelopes of the doctor's hum lines (<clip>.rms.json next to the WAV, written by
// tools/rms_envelope.py) so Episode.tsx can close her mouth into "Mm-" / "-hm" while the line sounds.
import React from "react";
import { Composition, Folder, getStaticFiles } from "remotion";
import { Episode, humDataPath, type EpisodeCompProps } from "../Episode";
import { FPS, HEIGHT, WIDTH, assertAllowedDuration, assetUrl, loadEpisodeBundle, resolveAssetPath } from "../engine";
import type { EpisodeBundle, MouthData } from "../schema";

const staticNames = (): Set<string> | null => {
  try {
    const names = getStaticFiles().map((f) => f.name.replace(/^\/+/, ""));
    return names.length ? new Set(names) : null;
  } catch {
    return null;
  }
};

/** Add the doctor lines' hum envelopes (optional files; a missing one just means no hum mouth). */
async function withDoctorHums(bundle: EpisodeBundle): Promise<EpisodeBundle> {
  const listed = staticNames();
  const mouthData: Record<string, MouthData> = { ...bundle.mouthData };
  for (const d of bundle.episode.dialogue) {
    if (d.char !== "doctor" || d.mouth !== "none") continue;
    const path = humDataPath(d);
    if (path in mouthData) continue;
    if (listed && !listed.has(resolveAssetPath(path, bundle.episodeId))) continue;
    try {
      const r = await fetch(assetUrl(path, bundle.episodeId));
      if (r.ok) mouthData[path] = (await r.json()) as MouthData;
    } catch {
      // optional data: render without the hum mouth
    }
  }
  return { ...bundle, mouthData };
}

const episodeComposition = (id: string) => (
  <Composition
    key={id}
    id={id}
    component={Episode}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={1920}
    defaultProps={{ episodeId: id, bundle: null } satisfies EpisodeCompProps}
    calculateMetadata={async ({ props }) => {
      const bundle = await withDoctorHums(await loadEpisodeBundle(props.episodeId));
      assertAllowedDuration(bundle.episode.durationInFrames);
      return { props: { ...props, bundle }, durationInFrames: bundle.episode.durationInFrames };
    }}
  />
);

export const EpisodeCompositions: React.FC = () => <Folder name="episodes">{EPISODES.map(episodeComposition)}</Folder>;
