// Visual registries owned by the set builder. episode.json refers to visual assets by key
// (assetKey(path) = basename without extension). Lint (rule 10) checks every visual ref against
// these lists, so keep them in sync with what the components can actually draw.
// Pure TS, no imports (lint reads it in Node).

/** Notepad doodles (data: doodles.ts; SVG archive: assets/notepad/doodles/<key>.svg). */
export const DOODLE_KEYS = ["A01_fence", "printer_with_horns", "dollar_circle", "calendar_sunglasses"] as const;
/** Memory-bubble vignettes (vignettes.tsx). Moving element keys per vignette in VIGNETTE_MOVING. */
export const VIGNETTE_KEYS = ["office_kick", "office_yell", "paper_jam_yank", "monday_hate"] as const;
export const VIGNETTE_MOVING: Record<(typeof VIGNETTE_KEYS)[number], readonly string[]> = {
  office_kick: ["human_leg", "printer_shake"],
  office_yell: ["human_arm"],
  paper_jam_yank: ["paper", "printer_jolt"],
  monday_hate: ["human_arm", "alarm_shake"],
};
/** Flying/popping props (PropItem.tsx). */
export const PROP_KEYS = ["paper_strip", "paper_jam", "paper_sheet", "paper_ball", "spit_burst", "cloth", "lens_glint"] as const;
/** Reset-ritual props: allowed only inside the GLASSES reset shot [N−75, N−30) (lint 2), never in S0. */
export const RITUAL_PROP_KEYS = ["cloth", "lens_glint"] as const;
