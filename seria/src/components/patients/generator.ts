// Patient generator (bible §4): makePatient(spec, maxSize) → a deterministic geometric model that
// Patient.tsx draws from the parts library (lib/*). Pure TS (no React), so lint/QA can import it in
// Node (eye-ratio R4, contrast R3, size checks). Randomness only via remotion random(seed).
// Owned by the set builder.
//
// Local frame of every puppet: x ∈ [−w/2, w/2], y ∈ [−h, 0]; (0, 0) = bottom-centre anchor.
import { random } from "remotion";
import { PATIENT_EYE_WIDTH_RATIO, PATIENT_SIZE_MAX, type PatientShape } from "../../enums";
import type { PatientSpec } from "../../schema";
import { lightness } from "../set/color";

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ShapeDef {
  /** natural body aspect w/h */
  aspect: number;
  /** face region as fractions of the body box (0..1 from the top-left) */
  face: [number, number, number, number];
  /** eye-line position inside the face (fraction of face height), default 0.3 = upper third */
  eyeLine?: number;
  /** mouth position inside the face (fraction of face height), default 0.7 */
  mouthLine?: number;
}

/** 20 shapes (§4.3). Outlines are drawn in lib/shapes.tsx from the same keys. */
export const SHAPES: Record<PatientShape, ShapeDef> = {
  rect_vertical: { aspect: 0.62, face: [0.12, 0.08, 0.88, 0.62] },
  rect_horizontal: { aspect: 1.6, face: [0.08, 0.14, 0.92, 0.9] },
  rounded_slab: { aspect: 0.52, face: [0.12, 0.12, 0.88, 0.8] },
  cylinder: { aspect: 0.62, face: [0.12, 0.2, 0.88, 0.82] },
  disc: { aspect: 1.0, face: [0.2, 0.2, 0.8, 0.8], eyeLine: 0.32 },
  sphere: { aspect: 1.0, face: [0.18, 0.18, 0.82, 0.86], eyeLine: 0.32 },
  wedge: { aspect: 0.86, face: [0.24, 0.14, 0.76, 0.56], eyeLine: 0.28, mouthLine: 0.78 },
  cone: { aspect: 0.78, face: [0.3, 0.3, 0.7, 0.78] },
  sheet: { aspect: 0.72, face: [0.12, 0.1, 0.88, 0.62] },
  sticky_note: { aspect: 1.0, face: [0.1, 0.1, 0.9, 0.78] },
  speech_bubble: { aspect: 1.25, face: [0.12, 0.08, 0.88, 0.7] },
  cloud: { aspect: 1.45, face: [0.2, 0.3, 0.8, 0.86] },
  bag: { aspect: 0.82, face: [0.16, 0.36, 0.84, 0.9] },
  bottle: { aspect: 0.46, face: [0.1, 0.42, 0.9, 0.9] },
  lidded_box: { aspect: 1.18, face: [0.1, 0.32, 0.9, 0.92] },
  arcs: { aspect: 1.3, face: [0.26, 0.16, 0.74, 0.62] },
  cable_plug: { aspect: 0.56, face: [0.14, 0.26, 0.86, 0.72] },
  house: { aspect: 0.9, face: [0.16, 0.46, 0.84, 0.94] },
  triangle_tree: { aspect: 0.76, face: [0.3, 0.38, 0.7, 0.76] },
  ribbed_sphere: { aspect: 1.25, face: [0.2, 0.24, 0.8, 0.86] },
};

/** Function markers the generator knows (§4.2 `functionMarker`); unknown markers draw nothing extra. */
export interface MarkerDef {
  /** overrides the shape's body aspect (e.g. an office printer is boxier than a TV remote) */
  bodyAspect?: number;
  /** extra height above the body as a fraction of the TOTAL height (paper fan, toaster slots…) */
  topExtra?: number;
  /** face override (fractions of the body box) */
  face?: [number, number, number, number];
  eyeLine?: number;
  mouthLine?: number;
  /** the marker draws its own mouth (slot = function opening) */
  ownsSlot?: boolean;
  /** preferred wear spots (fractions of the body box: fx, fy) in order */
  wearSpots?: [number, number][];
}
export const MARKERS: Record<string, MarkerDef> = {
  // office printer: control-panel lid, paper fan in the input tray, output slot = mouth with a paper tongue, paper drawer
  paper_tray_tongue: {
    bodyAspect: 1.02,
    topExtra: 0.26,
    face: [0.06, 0.15, 0.94, 0.92],
    eyeLine: 0.25,
    mouthLine: 0.6,
    ownsSlot: true,
    wearSpots: [[0.16, 0.42], [0.84, 0.47], [0.3, 0.86], [0.75, 0.86]],
  },
  toaster_slots: { bodyAspect: 1.25, topExtra: 0.08, face: [0.1, 0.2, 0.9, 0.9] },
  cracked_screen_badge: { face: [0.12, 0.16, 0.88, 0.8] },
  calendar_mon: { face: [0.12, 0.3, 0.88, 0.94], eyeLine: 0.3 },
};

export interface PatientModel {
  spec: PatientSpec;
  /** drawn size incl. marker extras (px, without the 6 px outline overhang) */
  w: number;
  h: number;
  /** body box (main silhouette), local coords */
  body: Box;
  face: Box;
  /** eye centres are (eyes.cx ± eyes.gap/2, eyes.cy); ew = single eye width */
  eyes: { cx: number; cy: number; ew: number; eh: number; gap: number; ratio: number };
  browY: number;
  mouth: { cx: number; cy: number; w: number };
  /** function opening (slot) centre, local coords — particle/prop origin for the integrator */
  slot: { cx: number; cy: number; w: number };
  /** wear placements (local px) */
  wear: { kind: string; x: number; y: number; s: number; rot: number }[];
  marker: MarkerDef | null;
  /** allowed max horizontal size incl. squash (maxSize.w − 14: keeps x ≥ 250 at anchor 410, lint 16) */
  maxW: number;
  maxH: number;
  /** R3 greyscale lightness difference vs couch and wall (L* points) */
  contrast: { couch: number; wall: number; ok: boolean };
}

const COUCH = "#1E4A37";
const WALL = "#4A4237";

/** Merge the E12 transformed variant into the spec. */
export const effectiveSpec = (spec: PatientSpec, variant: "base" | "transformed"): PatientSpec =>
  variant === "transformed" && spec.transformed ? ({ ...spec, ...spec.transformed } as PatientSpec) : spec;

/**
 * makePatient(spec, maxSize): fit the shape into the size class and the actor box, place face parts.
 * Deterministic in (spec, maxSize). Eye width = 22–30 % of the body width (R4), from spec.seed.
 */
export function makePatient(spec: PatientSpec, maxSize?: { w: number; h: number }): PatientModel {
  const cls = PATIENT_SIZE_MAX[spec.size] ?? PATIENT_SIZE_MAX.L;
  const lim = { w: Math.min(cls.w, maxSize?.w ?? cls.w), h: Math.min(cls.h, maxSize?.h ?? cls.h) };
  const maxW = lim.w - 14;
  const maxH = lim.h;
  const shape = SHAPES[spec.shape] ?? SHAPES.rect_horizontal;
  const marker = MARKERS[spec.functionMarker] ?? null;
  const aspect = marker?.bodyAspect ?? shape.aspect;
  const topExtra = marker?.topExtra ?? 0;
  // total natural aspect: body w / (body h / (1 − topExtra))
  const totalAspect = aspect * (1 - topExtra);
  const boxW = maxW / 1.1; // leave 10 % for horizontal squash
  const boxH = maxH;
  let w = boxW, h = boxW / totalAspect;
  if (h > boxH) {
    h = boxH;
    w = h * totalAspect;
  }
  const bodyH = h * (1 - topExtra);
  const body: Box = { x0: -w / 2, y0: -bodyH, x1: w / 2, y1: 0 };
  const f = marker?.face ?? shape.face;
  const face: Box = { x0: body.x0 + f[0] * w, y0: body.y0 + f[1] * bodyH, x1: body.x0 + f[2] * w, y1: body.y0 + f[3] * bodyH };
  const fw = face.x1 - face.x0, fh = face.y1 - face.y0;
  const ratio = PATIENT_EYE_WIDTH_RATIO.min + 0.02 + (PATIENT_EYE_WIDTH_RATIO.max - PATIENT_EYE_WIDTH_RATIO.min - 0.04) * random(`patient:${spec.seed}:eyes`);
  let ew = ratio * w;
  ew = Math.min(ew, fw * 0.42); // two eyes + gap must fit the face
  const eh = ew * 0.82;
  const gap = Math.min(ew * 1.42, fw - ew - 4);
  const eyeCy = face.y0 + fh * (marker?.eyeLine ?? shape.eyeLine ?? 0.3);
  const eyes = { cx: (face.x0 + face.x1) / 2, cy: eyeCy, ew, eh, gap, ratio: ew / w };
  const mouthCy = face.y0 + fh * (marker?.mouthLine ?? shape.mouthLine ?? 0.7);
  const mouth = { cx: eyes.cx, cy: mouthCy, w: Math.min(fw * 0.62, w * 0.5) };
  const slot = { cx: mouth.cx, cy: mouth.cy, w: marker?.ownsSlot ? w * 0.66 : mouth.w };

  // wear placements: marker-preferred spots first, then seeded spots away from the eyes/mouth
  const spots = marker?.wearSpots ?? [];
  const wear = spec.wear.slice(0, 3).map((kind, i) => {
    const r = (k: string) => random(`patient:${spec.seed}:wear:${i}:${k}`);
    let fx: number, fy: number;
    if (spots[i]) [fx, fy] = spots[i];
    else {
      const side = i % 2 === 0 ? -1 : 1;
      fx = 0.5 + side * (0.3 + 0.08 * r("x"));
      fy = 0.55 + 0.3 * r("y");
    }
    return { kind, x: body.x0 + fx * w, y: body.y0 + fy * bodyH, s: Math.min(w, bodyH) * (0.13 + 0.03 * r("s")), rot: -25 + 50 * r("r") };
  });

  const L = lightness(spec.palette.base);
  const dc = Math.abs(L - lightness(COUCH)), dw = Math.abs(L - lightness(WALL));
  return {
    spec, w, h, body, face, eyes, browY: eyeCy - eh / 2 - Math.max(8, ew * 0.2), mouth, slot, wear, marker,
    maxW, maxH, contrast: { couch: dc, wall: dw, ok: dc >= 25 && dw >= 25 },
  };
}

/** Scene position of the function slot for a patient drawn at anchor (x, y) with `scale` (particle origin). */
export const slotScenePoint = (m: PatientModel, x: number, y: number, scale = 1): [number, number] => [x + m.slot.cx * scale, y + m.slot.cy * scale];
