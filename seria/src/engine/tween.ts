// Easing + pose-track resolution. Pure functions of the frame number.
import { Easing, interpolate, spring } from "remotion";
import type { Ease } from "../enums";
import { FPS } from "./constants";

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** remotion interpolate() with both ends clamped. */
export const interpolateClamp = (v: number, input: readonly number[], output: readonly number[]): number =>
  interpolate(v, [...input], [...output], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const EASINGS: Record<Exclude<Ease, "spring">, (t: number) => number> = {
  linear: Easing.linear,
  in: Easing.in(Easing.cubic),
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
};

/** Eased progress 0..1 of `frame` within [start, start+dur]. Exactly 0 before, exactly 1 after. */
export const progress = (frame: number, start: number, dur: number, ease: Ease = "linear"): number => {
  if (dur <= 0) return frame >= start ? 1 : 0;
  if (frame <= start) return 0;
  if (frame >= start + dur) return 1;
  if (ease === "spring") {
    return spring({ frame: frame - start, fps: FPS, durationInFrames: dur, config: { damping: 14, stiffness: 160, mass: 1 } });
  }
  return EASINGS[ease](interpolate(frame, [start, start + dur], [0, 1]));
};

/** Tween a number from→to over [start, start+dur]. */
export const tween = (frame: number, start: number, dur: number, from: number, to: number, ease: Ease = "inOut"): number =>
  lerp(from, to, progress(frame, start, dur, ease));

interface Segment {
  from: number;
  to: number;
  at: number;
  dur: number;
  ease: Ease;
}
const segValue = (s: Segment, frame: number): number => (frame >= s.at + s.dur ? s.to : tween(frame, s.at, s.dur, s.from, s.to, s.ease));

/**
 * Resolve a pose track at `frame`.
 * - events: pose events of ONE character (any order); each `set` may carry `dur`/`ease`.
 * - base: the pose before the first event (normally the state0 pose).
 * - numericKeys: fields that tween over `dur` (e.g. glassesY, headTilt, sag, lean). Every other field swaps at `at`.
 * Events at the same frame apply in array order.
 */
export function poseAt<T extends object>(
  events: readonly { at: number; set: object }[],
  frame: number,
  base: T,
  numericKeys: readonly string[] = [],
): T {
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  const segs: Record<string, Segment> = {};
  const sorted = events.map((e, i) => ({ e, i })).sort((a, b) => a.e.at - b.e.at || a.i - b.i);
  for (const { e } of sorted) {
    if (e.at > frame) break;
    const { dur = 0, ease = "inOut", ...fields } = e.set as Record<string, unknown> & { dur?: number; ease?: Ease };
    for (const [k, v] of Object.entries(fields)) {
      if (v === undefined) continue;
      if (numericKeys.includes(k) && typeof v === "number") {
        const prev = segs[k];
        const current = prev ? segValue(prev, e.at) : (out[k] as number);
        segs[k] = { from: current, to: v, at: e.at, dur, ease };
      } else {
        out[k] = v;
      }
    }
  }
  for (const [k, s] of Object.entries(segs)) out[k] = segValue(s, frame);
  return out as T;
}

/** Last event (by `at`) at or before frame that sets `key`; null if none. */
export function lastChange<K extends string>(
  events: readonly { at: number; set: Partial<Record<K, unknown>> }[],
  key: K,
  frame: number,
): { at: number; value: unknown } | null {
  let best: { at: number; value: unknown } | null = null;
  for (const e of events) {
    const v = e.set[key];
    if (v !== undefined && e.at <= frame && (!best || e.at >= best.at)) best = { at: e.at, value: v };
  }
  return best;
}
