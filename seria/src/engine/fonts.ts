// Fonts come from npm (@fontsource/*), not Google's CDN (blocked here). loadFont() holds rendering
// (delayRender) until the font face is ready, so text never renders with a fallback font.
import { loadFont } from "@remotion/fonts";
import antonUrl from "@fontsource/anton/files/anton-latin-400-normal.woff2";
import vt323Url from "@fontsource/vt323/files/vt323-latin-400-normal.woff2";

export const FONTS = {
  /** captions "PATIENT #001: …", grawlix, the one clear word */
  caption: "Anton",
  /** CRT lens text, window displays ("ERR 49", "PRINT QUEUE: 99 999") */
  crt: "VT323",
} as const;

let started = false;
/** Called once at module load from src/Root.tsx. */
export const ensureFonts = (): void => {
  if (started) return;
  started = true;
  void loadFont({ family: FONTS.caption, url: antonUrl, weight: "400" });
  void loadFont({ family: FONTS.crt, url: vt323Url, weight: "400" });
};
