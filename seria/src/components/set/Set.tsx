// The single set (bible §5.1–5.2): run-down therapy office in the evening, frontal, flat colours.
// <Set layer=…> draws one z-layer: background z0, window z1, decor z2 (diploma, plant shelf, patient
// counter), chair z3 (doctor's armchair), table z10 (table, drawer, mug, tomato timer), vignette z15.
// Pure function of props: everything time-varying arrives as props (windowT, blinds, leafFall, timer…).
// Owned by the set builder. Keep registry.ts in sync (lint checks windowLayer ids against WINDOW_LAYER_IDS).
import React from "react";
import type { SetProps } from "../../contract";
import { Background, Chair, Decor, Table, Vignette } from "./room";
import { WindowLayer } from "./window";

export { WINDOW_LAYER_IDS } from "./registry";
export { TomatoTimer, ROOM } from "./room";

/** Kept as an alias: `patientNo` (NOW SERVING counter) and `decorJolt` are now part of SetProps (contract.ts). */
export type SetPropsExt = SetProps;

export const Set: React.FC<SetPropsExt> = (p) => {
  switch (p.layer) {
    case "background":
      return <Background />;
    case "window":
      return <WindowLayer windowLayer={p.windowLayer} windowT={p.windowT} windowSlot={p.windowSlot} neonOn={p.neonOn} blinds={p.blinds} />;
    case "decor":
      return <Decor diplomaText={p.diplomaText} plantStage={p.plantStage} leafFall={p.leafFall} patientNo={p.patientNo} jolt={p.decorJolt} />;
    case "chair":
      return <Chair state={p.chairState} />;
    case "table":
      return <Table timer={p.timer} />;
    case "vignette":
      return <Vignette opacity={p.vignetteOpacity} />;
  }
};
