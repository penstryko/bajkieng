// Owned by the SET builder. Add any number of set/patient/props model-sheet compositions here
// (Root.tsx never changes). Reads the S01E01 patient.json statically for a preview puppet.
import React from "react";
import { AbsoluteFill, Composition, Folder, useCurrentFrame } from "remotion";
import { Set } from "../components/set/Set";
import { Patient, PatientShadow } from "../components/patients/Patient";
import { Caption } from "../components/props/Caption";
import { Bubble } from "../components/props/Bubble";
import { NO_IDLE, POS, bubbleInflate } from "../engine";
import type { SetProps } from "../contract";
import type { PatientSpec } from "../schema";
import patientJson from "../../episodes/S01E01/patient.json";

const patient = patientJson as unknown as PatientSpec;

const setBase: Omit<SetProps, "layer"> = {
  windowLayer: "calm", windowT: 0, neonOn: true, blinds: 0, plantStage: 0, diplomaText: "Doctor of Nodding",
  chairState: "intact", timer: { dial: 1, angle: -330, visible: true, ringing: 0, jitter: [0, 0] }, vignetteOpacity: 0.35,
};

/** Frame 0: S0-like layout (patient hovering). Frames 1+: seated patient + memory bubble + window variant. */
const ModelSheetSet: React.FC = () => {
  const frame = useCurrentFrame();
  const seated = frame > 0;
  const s = { ...setBase, windowLayer: seated ? "office_print_queue" : "calm", windowT: frame };
  const b = bubbleInflate(frame, 1, 59);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <Set layer="background" {...s} />
        <Set layer="window" {...s} />
        <Set layer="decor" {...s} />
        <Set layer="chair" {...s} />
        <PatientShadow cx={410} cy={POS.shadow.c[1]} rx={POS.shadow.rx} ry={POS.shadow.ry} scale={1} opacity={0.6} />
        <Patient
          spec={patient} x={410} y={seated ? 1150 : 610} scale={1} sx={1} sy={1} rotate={0} brows={patient.brows} eyes={patient.eyes}
          mouth="X" variant="base" blink={0} idle={NO_IDLE} motionLines={!seated} tears={0} swallow={0} maxSize={{ w: 330, h: 380 }}
        />
        <Set layer="table" {...s} />
        {b.visible ? <Bubble kind="memory" box={POS.bubble} tail={[410, 770]} inflate={b.inflate} dots={b.dots} vignette="office_kick" moving={["human_leg"]} t={b.t} /> : null}
        <Caption text="PATIENT #001: OFFICE PRINTER" scale={1} opacity={1} />
        <Set layer="vignette" {...s} />
      </svg>
    </AbsoluteFill>
  );
};

export const SetCompositions: React.FC = () => (
  <Folder name="set">
    <Composition id="ModelSheetSet" component={ModelSheetSet} width={1080} height={1920} fps={30} durationInFrames={60} />
  </Folder>
);
