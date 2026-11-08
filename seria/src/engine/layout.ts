// Shot map 1080×1920 (bible §5.2) and platform safe zones (§5.3). All values are SCENE pixels
// (the master WIDE frame). Components draw in these coordinates; the camera transforms the group.
import type { Rect, XY } from "../schema";

/** z-layers, back to front (bible §5.2). Integrator stacks layers in exactly this order. */
export const Z = {
  BACKGROUND: 0, // wall, ceiling, carpet                         Set layer="background"
  WINDOW: 1, // window + outside layer + blinds (+ window slot)    Set layer="window"
  DECOR: 2, // diploma, plant, Chirp                              Set layer="decor" + <Chirp/>
  CHAIR: 3, // doctor's armchair                                  Set layer="chair"
  DOCTOR: 4, // doctor torso/head/perm/glasses (4–5)               <Doctor layer="body"/>
  CHESTER_BACK: 6, // Chester backrest + face                     <Chester layer="back"/>
  SHADOW: 7, // patient shadow on the seat                         <PatientShadow/>
  PATIENT: 8, // patient(s); also doctor when sunk_in_couch        <Patient/>
  CHESTER_FRONT: 9, // seat front edge, valance, armrest           <Chester layer="front"/>
  TABLE: 10, // table + tomato timer                               Set layer="table"
  HANDS: 11, // clipboard + doctor's hands + pen                   <Doctor layer="hands"/>
  BUBBLE: 12, // memory/speech/thought bubbles                     <Bubble/>
  PARTICLES: 13, // particles + flying props                       <Particles/>, <PropItem/>
  CAPTION: 14, // caption band (SCREEN space, outside camera)       <Caption/>
  VIGNETTE: 15, // vignette (SCREEN space, outside camera)         Set layer="vignette"
} as const;
export type ZLayer = (typeof Z)[keyof typeof Z];

export const FRAME_W = 1080;
export const FRAME_H = 1920;

/** Platform UI safe zones (§5.3, conservative production assumption). */
export const SAFE = {
  UI_TOP: [0, 0, 1080, 200] as Rect, // nothing important
  UI_BOTTOM: [0, 1420, 1080, 1920] as Rect, // carpet only
  UI_RIGHT: [940, 700, 1080, 1600] as Rect, // like/comment/share buttons
  ACTION: [60, 220, 920, 1420] as Rect, // action zone
  CAPTION_BAND: [80, 1235, 920, 1320] as Rect, // caption band
} as const;

/** Element positions (§5.2 table, §3 silhouettes). */
export const POS = {
  window: [390, 360, 690, 640] as Rect,
  diploma: [740, 380, 900, 520] as Rect,
  plant: [60, 470, 200, 720] as Rect,
  chirp: { c: [170, 300] as XY, r: 46, ledR: 7 },
  chair: [610, 820, 920, 1280] as Rect,
  doctor: {
    box: [637, 525, 883, 1210] as Rect,
    body: [670, 600, 850, 1210] as Rect, // 180 px wide "ruler", face y 600–860, cardigan from 860
    face: [670, 600, 850, 860] as Rect,
    perm: [655, 525, 865, 660] as Rect,
    glasses: { box: [637, 690, 883, 786] as Rect, center: [760, 738] as XY, lens: { w: 112, h: 96 }, bridge: 22 },
    badge: { c: [760, 955] as XY, w: 60, h: 40 },
    neckPivot: [760, 860] as XY, // headTilt pivot
    clipboard: [650, 1010, 830, 1210] as Rect,
    dropOutClipY: 1010, // drop_out mask
  },
  chester: {
    sofa: [40, 840, 620, 1380] as Rect,
    back: [40, 840, 620, 1090] as Rect,
    seat: [40, 1090, 620, 1190] as Rect,
    valance: [40, 1190, 620, 1380] as Rect,
    armrest: [40, 1010, 170, 1340] as Rect,
    face: [60, 860, 250, 1010] as Rect, // NO actor outline may enter this (lint 16)
    eyes: [[115, 905], [200, 905]] as [XY, XY],
    eyeR: 28,
    mouth: { y: 985, x0: 105, x1: 205, maxOpen: 90 },
    mouthTarget: [155, 985] as XY, // swallow target (E03)
    floorY: 1380, // couchSag pivot
    frontEdgeY: 1100, // seat front edge (z9) covers y ≥ 1100
  },
  patient: {
    soloAnchor: [410, 1150] as XY,
    soloBox: [245, 770, 575, 1150] as Rect,
    pairAnchors: [[330, 1150], [495, 1150]] as [XY, XY],
    pairMax: { w: 165, h: 300 },
    inChairAnchor: [765, 1010] as XY,
    s0TopY: 230, // S0 hover: top edge of the puppet
  },
  shadow: { c: [410, 1078] as XY, rx: 130, ry: 18, color: "#000000", opacity: 0.6 },
  table: [430, 1200, 700, 1310] as Rect,
  timer: [540, 1130, 630, 1215] as Rect,
  tableAndTimer: [430, 1130, 700, 1310] as Rect,
  bubble: [140, 330, 640, 690] as Rect,
  windowExitTarget: [540, 500] as XY,
  notepadCard: { c: [540, 900] as XY, w: 900, h: 1300, field: { w: 760, h: 900 } },
} as const;

/** Set palette (§5.1) — shared so placeholders and final art agree. */
export const SET_COLORS = {
  wall: "#4A4237", wallStripe: "#52493D", stain: "#3A3329", ceiling: "#39332B",
  carpet: "#3B2828", carpetPattern: "#4B3333",
  sky: "#2B3A57", city: "#1C2436", cityLights: "#F2C14E", neon: "#3FE0FF",
  windowFrame: "#26221E", blinds: "#8C8578",
  diplomaFrame: "#B8962E", diplomaPaper: "#EDE3CA",
  pot: "#9C4F2A", leaves0: "#5E8A2E", leaves12: "#7E6036",
  table: "#2C1F16", timerTomato: "#D3263A", timerLeaf: "#3A7D44", timerDial: "#F2ECDD",
  vignette: "#000000", vignetteOpacity: 0.35,
} as const;

export const DOCTOR_COLORS = {
  cardigan: "#1F5E66", cardiganShade: "#15454B", collar: "#E8E2D4", lanyard: "#161616", badge: "#F2ECDD",
  hair: "#B7B2AB", hairShade: "#8D8882", skin: "#E3BE9E", skinShade: "#C99D7C", frames: "#161616",
  lensOff: "#1F2B2F", phosphor: "#8EF0C9", phosphorAlarm: "#FFC857", clipboard: "#8A5A2E", paper: "#F2ECDD",
  pen: "#2448A8", chair: "#3A2418",
} as const;

export const CHESTER_COLORS = {
  leather: "#1E4A37", shade: "#123024", gloss: "#2D6650", eyeWhite: "#EEE8DA", pupil: "#101010",
  seams: "#0B2016", mouthInside: "#0A0F0C", spring: "#9AA0A6", stuffing: "#E8E0CC", tape: "#A8A8A0",
} as const;

export const CHIRP_COLORS = {
  body: "#E9E7E1", rim: "#C2BFB6", vents: "#9F9B91", ledOff: "#4A1414", ledOn: "#FF2B2B", ledGlow: "#FF6B6B",
} as const;

export const HUMAN_COLORS = { body: "#7B7E86", shade: "#5F626A" } as const;

/** true if rect a intersects rect b */
export const rectsIntersect = (a: Rect, b: Rect): boolean => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
