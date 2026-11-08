#!/usr/bin/env node
// Render selected frames of an episode as full-size PNG stills with ONE bundle (fast QA without a full render).
// Usage: node tools/qa_stills.mjs [EP=S01E01] OUT_DIR frame [frame …]
//   node tools/qa_stills.mjs S01E01 /tmp/qa 0 250 1750      -> /tmp/qa/ep_f0000.png …
// For the final QA stills / contact sheet from the rendered master use tools/contact_sheet.sh instead.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs, { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const EP = /^S\d{2}E\d{2}$/.test(args[0] ?? "") ? args.shift() : "S01E01";
const outDir = resolve(args.shift() ?? join(ROOT, "out", "stills"));
const frames = args.map(Number).filter((n) => Number.isInteger(n) && n >= 0);
if (!frames.length) {
  console.error("usage: node tools/qa_stills.mjs [EP] OUT_DIR frame [frame …]");
  process.exit(1);
}
const SANDBOX_SHELL = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || (fs.existsSync(SANDBOX_SHELL) ? SANDBOX_SHELL : null);
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: join(ROOT, "src/index.ts"), publicDir: join(ROOT, "public") });
const inputProps = { episodeId: EP, bundle: null };
const composition = await selectComposition({ serveUrl, id: EP, inputProps, browserExecutable });
for (const f of frames) {
  const output = join(outDir, `ep_f${String(f).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, inputProps: composition.props, browserExecutable, imageFormat: "png", overwrite: true });
  console.log(`still ${output}`);
}
