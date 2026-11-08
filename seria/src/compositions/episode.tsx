// Owned by the INTEGRATOR. Registers episode compositions. calculateMetadata loads the whole
// episode bundle (episode.json, patient.json, mouth data, missing-audio list) once per render,
// and takes durationInFrames from episode.json (ritual frames derive from it, lint 5).
import React from "react";
import { Composition, Folder } from "remotion";
import { Episode, type EpisodeCompProps } from "../Episode";
import { FPS, HEIGHT, WIDTH, assertAllowedDuration, loadEpisodeBundle } from "../engine";

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
      const bundle = await loadEpisodeBundle(props.episodeId);
      assertAllowedDuration(bundle.episode.durationInFrames);
      return { props: { ...props, bundle }, durationInFrames: bundle.episode.durationInFrames };
    }}
  />
);

export const EpisodeCompositions: React.FC = () => <Folder name="episodes">{["S01E01"].map(episodeComposition)}</Folder>;
