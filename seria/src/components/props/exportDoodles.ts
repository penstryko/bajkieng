// Exports the notepad doodles (doodles.ts, single source of truth) as static SVG files into
// assets/notepad/doodles/<key>.svg (archive / merch / carousels, bible §7.1, §11). The renderer itself
// draws from doodles.ts (drawOn needs the stroke data). Run: npx tsx src/components/props/exportDoodles.ts
// Owned by the set builder.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DOODLES, doodleStrokes, polyD } from "./doodles";
import { DOODLE_KEYS } from "./registry";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const OUT = join(ROOT, "assets", "notepad", "doodles");
mkdirSync(OUT, { recursive: true });
for (const key of DOODLE_KEYS) {
  const d = DOODLES[key];
  if (!d) throw new Error(`doodle ${key} listed in DOODLE_KEYS but missing in doodles.ts`);
  const paths = doodleStrokes(key, 0).map((s) => `    <path d="${polyD(s)}"/>`).join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 900" width="760" height="900">
  <!-- ${key}: generated from src/components/props/doodles.ts (do not edit by hand) -->
  <g fill="none" stroke="#C8262B" stroke-width="${d.width ?? 17}" stroke-linecap="round" stroke-linejoin="round">
${paths}
  </g>
</svg>
`;
  writeFileSync(join(OUT, `${key}.svg`), svg);
  console.log(`wrote assets/notepad/doodles/${key}.svg`);
}
