// PLACEHOLDER — owned by the set builder. Keep CaptionProps. SCREEN space band y 1235–1320, x 80–920.
import React from "react";
import type { CaptionProps } from "../../contract";
import { FONTS, SAFE } from "../../engine";

export const Caption: React.FC<CaptionProps> = ({ text, scale, opacity }) => {
  const [x0, y0, x1, y1] = SAFE.CAPTION_BAND;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      <text
        x={cx}
        y={y1 - 18}
        textAnchor="middle"
        fontFamily={FONTS.caption}
        fontSize={60}
        fill="#F2ECDD"
        stroke="#121212"
        strokeWidth={10}
        paintOrder="stroke"
        textLength={text.length > 22 ? x1 - x0 - 20 : undefined}
        lengthAdjust="spacingAndGlyphs"
      >
        {text}
      </text>
    </g>
  );
};
