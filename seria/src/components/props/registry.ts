// Visual registries owned by the set builder. episode.json refers to visual assets by key
// (assetKey(path) = basename without extension). Lint (rule 10) checks every visual ref against
// these lists, so keep them in sync with what the components can actually draw.
// Pure TS, no imports (lint reads it in Node).

/** Notepad doodles (data: doodles.ts; SVG archive: assets/notepad/doodles/<key>.svg). */
export const DOODLE_KEYS = ["A01_fence", "printer_with_horns", "dollar_circle"] as const;
/** Memory-bubble vignettes (vignettes.tsx). Moving element keys per vignette in VIGNETTE_MOVING. */
export const VIGNETTE_KEYS = ["office_kick", "office_yell", "paper_jam_yank"] as const;
export const VIGNETTE_MOVING: Record<(typeof VIGNETTE_KEYS)[number], readonly string[]> = {
  office_kick: ["human_leg", "printer_shake"],
  office_yell: ["human_arm"],
  paper_jam_yank: ["paper"],
};
/** Flying/popping props (PropItem.tsx). */
export const PROP_KEYS = ["paper_strip", "paper_jam", "paper_sheet", "paper_ball"] as const;
