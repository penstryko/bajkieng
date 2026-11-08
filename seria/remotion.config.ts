// Remotion CLI config (applies to `remotion studio|still|render`, not to the Node APIs).
// See CONTRACT.md §8 for the render pipeline.
import { Config } from "@remotion/cli/config";

// Remotion's own Chrome download (storage.googleapis.com) is blocked in this environment.
// Use the preinstalled Playwright headless shell (the wrapper adds --force-color-profile=srgb etc.).
Config.setBrowserExecutable(
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell",
);

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
