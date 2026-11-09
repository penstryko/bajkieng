// Camera presets (bible §5.4) and shot resolution. All shots are scale + translate of the same
// SVG master (no perspective). NOTEPAD is a separate flat card rendered in screen space.
import type { Camera, ShotEase } from "../enums";
import type { Shot, XY } from "../schema";
import { lerp, progress } from "./tween";

export interface CameraPreset {
  scale: number;
  focal: XY; // scene point …
  screen: XY; // … mapped to this screen point
}

export const CAMERA_PRESETS: Record<Exclude<Camera, "NOTEPAD">, CameraPreset> = {
  WIDE: { scale: 1, focal: [540, 960], screen: [540, 960] },
  GLASSES: { scale: 3.2, focal: [760, 738], screen: [540, 820] }, // lenses fill ≈ x 146–934
  PATIENT: { scale: 1.9, focal: [410, 960], screen: [540, 900] }, // L patient ≈ x 227–853, y 539–1261
  BUBBLE: { scale: 1.6, focal: [390, 510], screen: [540, 760] }, // bubble ≈ x 140–940, y 472–1048
  WINDOW: { scale: 3.4, focal: [540, 500], screen: [540, 820] }, // window x 390–690 → ≈ x 30–1050, y 344–1296 (style v2)
};

export interface CameraState {
  camera: Camera;
  /** screen = scene * scale + [tx, ty] */
  scale: number;
  tx: number;
  ty: number;
  /** "notepad" → render the NotepadCard full-screen instead of the scene */
  card: "notepad" | null;
}

export const WIDE_CAMERA: CameraState = { camera: "WIDE", scale: 1, tx: 0, ty: 0, card: null };

const fromPreset = (camera: Camera, p: CameraPreset): CameraState => ({
  camera,
  scale: p.scale,
  tx: p.screen[0] - p.focal[0] * p.scale,
  ty: p.screen[1] - p.focal[1] * p.scale,
  card: null,
});

export const cameraFromPreset = (camera: Camera): CameraState =>
  camera === "NOTEPAD" ? { ...WIDE_CAMERA, camera, card: "notepad" } : fromPreset(camera, CAMERA_PRESETS[camera]);

const zoomFrames = (ease?: ShotEase): number => (ease === "zoom8" ? 8 : ease === "zoom12" ? 12 : 0);

/** Interpolate between two presets: focal/screen lerp, scale geometric. */
const blend = (a: CameraPreset, b: CameraPreset, t: number): CameraPreset => ({
  scale: a.scale * Math.pow(b.scale / a.scale, t),
  focal: [lerp(a.focal[0], b.focal[0], t), lerp(a.focal[1], b.focal[1], t)],
  screen: [lerp(a.screen[0], b.screen[0], t), lerp(a.screen[1], b.screen[1], t)],
});

/**
 * Camera at `frame` from episode.shots. Frames not covered by any shot are WIDE.
 * ease "cut" (default) = hard cut; "zoom8"/"zoom12" = smooth zoom from the previous shot's preset over 8/12 frames.
 * NOTEPAD is always a cut (it is a separate card).
 */
export function cameraAt(frame: number, shots: readonly Shot[]): CameraState {
  const idx = shots.findIndex((s) => frame >= s.from && frame <= s.to);
  if (idx < 0) return WIDE_CAMERA;
  const shot = shots[idx];
  if (shot.camera === "NOTEPAD") return cameraFromPreset("NOTEPAD");
  const target = CAMERA_PRESETS[shot.camera];
  const zf = zoomFrames(shot.ease);
  const prev = idx > 0 ? shots[idx - 1] : null;
  if (zf > 0 && prev && prev.camera !== "NOTEPAD" && frame < shot.from + zf) {
    const t = progress(frame, shot.from, zf, "inOut");
    return fromPreset(shot.camera, blend(CAMERA_PRESETS[prev.camera], target, t));
  }
  return fromPreset(shot.camera, target);
}

/** SVG transform attribute for the camera group, with optional shake offset (screen px). */
export const cameraTransform = (c: CameraState, shake: XY = [0, 0]): string =>
  `translate(${c.tx + shake[0]} ${c.ty + shake[1]}) scale(${c.scale})`;

/** Scene → screen point. */
export const toScreen = (c: CameraState, p: XY): XY => [p[0] * c.scale + c.tx, p[1] * c.scale + c.ty];
