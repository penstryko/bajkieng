// Optional helper for FILE-based SVG art (assets/**/*.svg). Fetches the file once per tab (module
// cache), holds the frame with delayRender until loaded, then inlines the markup as a nested <svg>
// in scene coordinates. Deterministic: no frame is captured before the art is present.
// Prefer drawing puppets as TSX; use this for hand-made SVG files. Beware duplicate ids
// (gradients/clipPaths) across inlined files — prefix ids per file.
import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

interface Parsed {
  viewBox: string;
  inner: string;
}
const cache = new Map<string, Parsed>();

export const parseSvg = (text: string): Parsed => {
  const open = text.match(/<svg\b[^>]*>/i);
  if (!open) throw new Error("Not an SVG document");
  const tag = open[0];
  const vb = tag.match(/viewBox\s*=\s*"([^"]+)"/i)?.[1];
  const w = tag.match(/\swidth\s*=\s*"([\d.]+)/i)?.[1];
  const h = tag.match(/\sheight\s*=\s*"([\d.]+)/i)?.[1];
  const start = (open.index ?? 0) + tag.length;
  const end = text.lastIndexOf("</svg>");
  return { viewBox: vb ?? `0 0 ${w ?? 100} ${h ?? 100}`, inner: text.slice(start, end) };
};

export const InlineSvg: React.FC<{
  /** path under public/ (e.g. "assets/set/window_calm.svg") or absolute URL */
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  preserveAspectRatio?: string;
  opacity?: number;
}> = ({ src, x, y, width, height, preserveAspectRatio = "xMidYMid meet", opacity }) => {
  const url = /^(https?:|\/|data:)/.test(src) ? src : staticFile(src);
  const [data, setData] = useState<Parsed | null>(() => cache.get(url) ?? null);
  const [handle] = useState<number | null>(() => (cache.has(url) ? null : delayRender(`InlineSvg ${src}`)));
  useEffect(() => {
    if (data || handle === null) return;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`InlineSvg: ${src} → HTTP ${r.status}`);
        return r.text();
      })
      .then((t) => {
        const p = parseSvg(t);
        cache.set(url, p);
        setData(p);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [data, handle, src, url]);
  if (!data) return null;
  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={data.viewBox}
      preserveAspectRatio={preserveAspectRatio}
      opacity={opacity}
      dangerouslySetInnerHTML={{ __html: data.inner }}
    />
  );
};
