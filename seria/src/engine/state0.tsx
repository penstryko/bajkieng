// State0 hard override (bible §6.2, lint 2): for f ≤ 5 and f ≥ N − 15 render ONLY state0 —
// no episode tracks, no idle, no blinks, no lens noise. Because every component is a pure
// function of its props, identical state0 props ⇒ identical pixels on all 21 seam frames.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { isState0Frame, ritual, type Ritual } from "./constants";

/** Render `state0` on S0 frames, otherwise `children`. */
export const State0Override: React.FC<{
  frame: number;
  N: number;
  state0: React.ReactNode;
  children: React.ReactNode;
}> = ({ frame, N, state0, children }) => <>{isState0Frame(frame, N) ? state0 : children}</>;

/** Compute-side variant: resolve() is not even called on S0 frames. */
export function withState0<T>(frame: number, N: number, state0: () => T, resolve: () => T): T {
  return isState0Frame(frame, N) ? state0() : resolve();
}

export interface EpisodeTiming extends Ritual {
  frame: number;
  isS0: boolean;
}

/** For the integrator ONLY (src/Episode.tsx). Components must never read the frame themselves. */
export const useEpisodeTiming = (): EpisodeTiming => {
  const frame = useCurrentFrame();
  const { durationInFrames: N } = useVideoConfig();
  return { ...ritual(N), frame, isS0: isState0Frame(frame, N) };
};
