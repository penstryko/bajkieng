// Timing constants. Ritual frames are ALWAYS derived from N = durationInFrames (bible §6.1, lint 5);
// never hard-code 1740 / 1845 / 1890 / 1905.
import { ALLOWED_DURATIONS } from "../enums";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const SAMPLE_RATE = 48000;
export const SAMPLES_PER_FRAME = SAMPLE_RATE / FPS; // 1600 — every frame boundary is an exact sample

/** S0 head: frames 0..S0_HEAD_LAST render state0 only. */
export const S0_HEAD_LAST = 5;
/** S0 tail: the last S0_TAIL_LEN frames (N−15..N−1) render state0 only. */
export const S0_TAIL_LEN = 15;
/** Idle motion, blinks and lens swaps never start before this frame. */
export const ANIM_START = 15;

export const TICK_PERIOD_SAMPLES = 24000; // 0.5 s
export const TICK_OFFSET_SAMPLES = 12000; // 0.25 s → nearest ticks 250 ms either side of the seam
/** No SFX/dialogue may still be sounding in the last 200 ms (lint 3). */
export const SEAM_TAIL_SILENCE_S = 0.2;

export interface Ritual {
  N: number;
  /** DING = N − 180 (session ends, exit per §6.3) */
  DING: number;
  /** GLASSES = N − 75 (cut to glasses close-up, reset off-screen) */
  GLASSES: number;
  /** S0_IN = N − 30 (cut back to WIDE, patient drops into S0 hover, all idle envelopes are 0 from here) */
  S0_IN: number;
  /** HOLD = N − 15 (frozen S0 pose until N − 1) */
  HOLD: number;
  /** caption pops in on N−30 … N−22 */
  CAPTION_IN: [number, number];
  /** blinks / lensSwap may start only in [BLINK_START, BLINK_END) = [15, N − 75) */
  BLINK_START: number;
  BLINK_END: number;
  /** last SFX/VO must end by this time: N/30 − 0.9 s (63.1 s for N = 1920) */
  LAST_SFX_END_S: number;
  /** total audio samples = N × 1600 (3,072,000 for N = 1920) */
  TOTAL_SAMPLES: number;
  /** nothing may sound after this sample (last 200 ms) except the bed */
  TAIL_SILENCE_FROM_SAMPLE: number;
}

export const ritual = (N: number): Ritual => ({
  N,
  DING: N - 180,
  GLASSES: N - 75,
  S0_IN: N - 30,
  HOLD: N - S0_TAIL_LEN,
  CAPTION_IN: [N - 30, N - 22],
  BLINK_START: ANIM_START,
  BLINK_END: N - 75,
  LAST_SFX_END_S: N / FPS - 0.9,
  TOTAL_SAMPLES: N * SAMPLES_PER_FRAME,
  TAIL_SILENCE_FROM_SAMPLE: N * SAMPLES_PER_FRAME - SEAM_TAIL_SILENCE_S * SAMPLE_RATE,
});

/** Frames that must render exactly state0: 0..5 and N−15..N−1 (bible §6.2, lint 2). */
export const isState0Frame = (frame: number, N: number): boolean =>
  frame <= S0_HEAD_LAST || frame >= N - S0_TAIL_LEN;

/** Blinks and lensSwap may only START in [15, N − 75) (bible §6.2, lint 2). */
export const blinkAllowed = (frame: number, N: number): boolean => frame >= ANIM_START && frame < N - 75;

/** No SFX/dialogue may START in frames 0..5 (lint 3). */
export const sfxStartAllowed = (frame: number): boolean => frame > S0_HEAD_LAST;

export const isAllowedDuration = (N: number): boolean => (ALLOWED_DURATIONS as readonly number[]).includes(N);

export const assertAllowedDuration = (N: number): void => {
  if (!isAllowedDuration(N)) {
    throw new Error(`durationInFrames ${N} is not one of ${ALLOWED_DURATIONS.join(", ")} (bible §6.1, lint 1)`);
  }
};

/** Loop length in seconds for bed file naming: SFX18_roomtone_loop{S}.wav, theme_loop{S}.wav. */
export const loopSeconds = (N: number): number => N / FPS;

export const framesToSamples = (frames: number): number => frames * SAMPLES_PER_FRAME;
export const secondsToFrames = (s: number): number => Math.round(s * FPS);
