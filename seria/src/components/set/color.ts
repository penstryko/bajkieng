// Small colour helpers shared by the set, patient and props components (set builder).

const parse = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as [number, number, number];
};
const hex = (rgb: number[]): string =>
  `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;

/** Linear mix a → b by t (0..1). */
export const mixHex = (a: string, b: string, t: number): string => {
  const pa = parse(a), pb = parse(b);
  return hex(pa.map((v, i) => v + (pb[i] - v) * t));
};

/** Darken (k < 0) or lighten (k > 0) towards black/white. */
export const tone = (c: string, k: number): string => (k >= 0 ? mixHex(c, "#ffffff", k) : mixHex(c, "#000000", -k));

/** Relative luminance 0..1 (sRGB, for the R3 contrast check). */
export const luminance = (c: string): number => {
  const [r, g, b] = parse(c).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Perceived greyscale lightness 0..100 (CIE L*), used for R3 "≥ 25 points from couch and wall". */
export const lightness = (c: string): number => {
  const y = luminance(c);
  return y <= 216 / 24389 ? y * (24389 / 27) : 116 * Math.cbrt(y) - 16;
};
