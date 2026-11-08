// Visual registries owned by the set builder. episode.json refers to visual assets by key
// (assetKey(path) = basename without extension). Lint (rule 10) checks every visual ref against
// these lists, so keep them in sync with what the components can actually draw.
export const DOODLE_KEYS = ["A01_fence", "printer_with_horns"] as const;
export const VIGNETTE_KEYS = ["office_kick"] as const;
export const PROP_KEYS = ["paper_strip"] as const;
