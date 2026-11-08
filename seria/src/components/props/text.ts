// Text metrics for the two npm fonts (FONTS.caption = Anton, FONTS.crt = VT323), so text can be
// fitted to a box deterministically without DOM measurement. Advance widths are in em, extracted
// from the @fontsource woff2 files (hmtx / unitsPerEm). Owned by the set builder.

/** Anton advance widths (em). Unknown glyphs fall back to 0.48 em. */
const ANTON: Record<string, number> = {
  " ": 0.2344, "!": 0.229, '"': 0.4287, "#": 0.5464, $: 0.4619, "%": 1.0566, "&": 0.52, "'": 0.2139, "(": 0.291,
  ")": 0.291, "*": 0.4521, "+": 0.3555, ",": 0.2363, "-": 0.311, ".": 0.2285, "/": 0.4053, "0": 0.4941, "1": 0.3306,
  "2": 0.4941, "3": 0.4941, "4": 0.4941, "5": 0.4941, "6": 0.4941, "7": 0.4941, "8": 0.4941, "9": 0.4941, ":": 0.2417,
  ";": 0.2451, "<": 0.3213, "=": 0.311, ">": 0.3213, "?": 0.4922, "@": 0.8643, A: 0.4854, B: 0.4785, C: 0.4741,
  D: 0.4932, E: 0.4116, F: 0.3989, G: 0.4849, H: 0.499, I: 0.2266, J: 0.4663, K: 0.4722, L: 0.3975, M: 0.7461,
  N: 0.498, O: 0.4863, P: 0.4722, Q: 0.4937, R: 0.4766, S: 0.4614, T: 0.3955, U: 0.4736, V: 0.4692, W: 0.7119,
  X: 0.4839, Y: 0.4463, Z: 0.4102, "[": 0.3179, "\\": 0.4053, "]": 0.3179, "^": 0.4736, _: 0.3652, a: 0.4834,
  b: 0.5015, c: 0.4912, d: 0.498, e: 0.4883, f: 0.2803, g: 0.5039, h: 0.5054, i: 0.2432, j: 0.2627, k: 0.4907,
  l: 0.248, m: 0.7583, n: 0.4985, o: 0.4966, p: 0.5015, q: 0.498, r: 0.3467, s: 0.4746, t: 0.3052, u: 0.499,
  v: 0.4609, w: 0.6963, x: 0.459, y: 0.4609, z: 0.3857, "{": 0.3398, "|": 0.2163, "}": 0.3403, "~": 0.4927, "¢": 0.4814,
};

/** Cap height (em): Anton 0.859, VT323 0.56. */
export const CAP_HEIGHT = { anton: 0.859, vt323: 0.56 } as const;

export type FontKey = "anton" | "vt323";

/** Text width in px at `size` px (letterSpacing in px is added between glyphs). */
export function textWidth(text: string, size: number, font: FontKey = "anton", letterSpacing = 0): number {
  const chars = [...text];
  const em = font === "vt323" ? chars.length * 0.4 : chars.reduce((a, c) => a + (ANTON[c] ?? 0.48), 0);
  return em * size + Math.max(0, chars.length - 1) * letterSpacing;
}

/** Largest font size ≤ maxSize so that `text` fits in `maxWidth` px. */
export function fitSize(text: string, maxWidth: number, maxSize: number, font: FontKey = "anton", letterSpacing = 0): number {
  const w1 = textWidth(text, 1, font, 0);
  const n = Math.max(0, [...text].length - 1);
  if (w1 <= 0) return maxSize;
  return Math.min(maxSize, (maxWidth - n * letterSpacing) / w1);
}

/** Greedy word wrap into lines no wider than maxWidth at `size`. */
export function wrapText(text: string, maxWidth: number, size: number, font: FontKey = "anton"): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (cur && textWidth(t, size, font) > maxWidth) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Fit a multi-line block into a box: tries sizes from maxSize down until the wrapped block fits
 * (width and height, line height = lineHeight × size, at most maxLines lines).
 */
export function fitBlock(
  text: string,
  box: { w: number; h: number },
  { maxSize, minSize = 8, lineHeight = 1.1, maxLines = 4, font = "anton" as FontKey } : { maxSize: number; minSize?: number; lineHeight?: number; maxLines?: number; font?: FontKey },
): { size: number; lines: string[] } {
  for (let size = maxSize; size >= minSize; size -= 0.5) {
    const lines = wrapText(text, box.w, size, font);
    if (lines.length <= maxLines && lines.length * size * lineHeight <= box.h && lines.every((l) => textWidth(l, size, font) <= box.w)) {
      return { size, lines };
    }
  }
  const size = minSize;
  return { size, lines: wrapText(text, box.w, size, font).slice(0, maxLines) };
}
