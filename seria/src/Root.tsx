// Composition registry. Builders NEVER edit this file: each owner registers compositions in
// their own file under src/compositions/ (cast.tsx, set.tsx, episode.tsx).
import React from "react";
import { ensureFonts } from "./engine/fonts";
import { EpisodeCompositions } from "./compositions/episode";
import { CastCompositions } from "./compositions/cast";
import { SetCompositions } from "./compositions/set";

ensureFonts();

export const RemotionRoot: React.FC = () => (
  <>
    <EpisodeCompositions />
    <CastCompositions />
    <SetCompositions />
  </>
);
