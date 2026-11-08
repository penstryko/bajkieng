// Remotion CLI config (applies to `remotion studio|still|render`, not to the Node APIs).
// See CONTRACT.md §8 for the render pipeline.
import fs from "node:fs";
import { Config } from "@remotion/cli/config";

// Browser: on a local machine Remotion downloads its own Chrome Headless Shell automatically.
// In the cloud sandbox that download is blocked, so we use the preinstalled Playwright shell if it exists.
// Override anywhere with REMOTION_BROWSER_EXECUTABLE=/path/to/chrome.
const SANDBOX_SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browser =
  process.env.REMOTION_BROWSER_EXECUTABLE || (fs.existsSync(SANDBOX_SHELL) ? SANDBOX_SHELL : null);
if (browser) {
  Config.setBrowserExecutable(browser);
}

Config.setEntryPoint("src/index.ts");

// Lossless frames: the loop check compares pixel md5 of PNG frames (S0 frames must be identical).
Config.setVideoImageFormat("png");
Config.setStillImageFormat("png");
// Frame files are named frame_<n>.png; tools/render_frames.sh normalises <n> to 4 digits.
Config.setImageSequencePattern("frame_[frame].[ext]");

// 4 CPUs: 3 browser tabs leaves one core for the CLI / ffmpeg / a parallel builder.
Config.setConcurrency(3);
Config.setOverwriteOutput(true);

// public/ holds symlinks: public/assets -> ../assets, public/episodes -> ../episodes,
// so staticFile("assets/...") and staticFile("episodes/S01E01/...") both work.
Config.setPublicDir("public");

// Generous timeout: first frames load fonts and fetch episode JSON via calculateMetadata.
Config.setDelayRenderTimeoutInMilliseconds(60000);
