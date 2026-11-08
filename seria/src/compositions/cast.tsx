// Owned by the CAST builder. Add any number of cast model-sheet compositions here
// (Root.tsx never changes). Model sheets may read the frame at THIS level to step through
// expressions; the components themselves stay pure.
import React from "react";
import { AbsoluteFill, Composition, Folder, useCurrentFrame } from "remotion";
import { Doctor } from "../components/cast/Doctor";
import { Chester } from "../components/cast/Chester";
import { Chirp } from "../components/cast/Chirp";
import { CHESTER_EXPRESSIONS, DOCTOR_EXPRESSIONS } from "../enums";
import { FONTS, SET_COLORS } from "../engine";
import type { ChesterProps, DoctorProps } from "../contract";

const doctorBase: Omit<DoctorProps, "layer"> = {
  brows: "neutral", mouth: "flat", lens: "patient_file_icon", lensNoise: 0, noiseSeed: 0, glassesY: 0, glassesJump: 0,
  headTilt: 0, lean: 1, pen: "raised", penPhase: 0, blink: 0, bob: 0, breath: 0, placement: "chair", placementT: 1, extras: [],
};
const chesterBase: Omit<ChesterProps, "layer"> = {
  eyes: "half", mouth: "flat", mouthOpen: 0, sag: 0, blink: 0, pupil: [0, 0], eyeShake: [0, 0], spring: 0, springWobble: 0, breath: 0,
};

/** One frame per expression: frame i shows DOCTOR_EXPRESSIONS[i] and CHESTER_EXPRESSIONS[i]. */
const ModelSheetCast: React.FC = () => {
  const frame = useCurrentFrame();
  const dKeys = Object.keys(DOCTOR_EXPRESSIONS) as (keyof typeof DOCTOR_EXPRESSIONS)[];
  const cKeys = Object.keys(CHESTER_EXPRESSIONS) as (keyof typeof CHESTER_EXPRESSIONS)[];
  const dk = dKeys[frame % dKeys.length];
  const ck = cKeys[frame % cKeys.length];
  const de = DOCTOR_EXPRESSIONS[dk] as Partial<DoctorProps> & { glassesJump?: number };
  const ce = CHESTER_EXPRESSIONS[ck] as Partial<ChesterProps> & { spring?: boolean | number };
  const doctor = { ...doctorBase, ...de, glassesJump: de.glassesJump ?? 0 } as Omit<DoctorProps, "layer">;
  const chester = { ...chesterBase, ...ce, spring: ce.spring ? 1 : 0 } as Omit<ChesterProps, "layer">;
  return (
    <AbsoluteFill style={{ backgroundColor: SET_COLORS.wall }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <Chirp led="off" ledLevel={0} tilt={0} jitter={[0, 0]} />
        <Doctor layer="body" {...doctor} />
        <Chester layer="back" {...chester} />
        <Chester layer="front" {...chester} />
        <Doctor layer="hands" {...doctor} />
        <text x={540} y={1500} textAnchor="middle" fontFamily={FONTS.caption} fontSize={56} fill="#F2ECDD">
          doctor: {dk} · chester: {ck}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const CastCompositions: React.FC = () => (
  <Folder name="cast">
    <Composition id="ModelSheetCast" component={ModelSheetCast} width={1080} height={1920} fps={30} durationInFrames={12} />
  </Folder>
);
