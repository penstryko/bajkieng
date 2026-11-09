// Closed vocabularies from the bible (§3 cast tables, §4 patient generator, §5.4 cameras,
// §6.3/§6.4 seed tables, §9.2 schema). Lint rule 15 rejects any value outside these lists.
// Owner: architect/coordinator. Builders READ ONLY; to add a value (e.g. a new lens icon),
// ask the coordinator so the change lands in one place.

// ───────────────────────────── Doctor (bible §3.1, §9.2) ─────────────────────────────
export const BROWS = ["neutral", "low_flat", "one_up", "skeptic", "v", "high", "arched", "slant_down", "v_strong"] as const;
export type Brows = (typeof BROWS)[number];

/** "hum" ("Mm-") and "hum_up" ("-hm") are the closed-mouth hum pair the integrator drives from the MM line envelopes. */
export const DOCTOR_MOUTHS = ["flat", "flat_down", "o_small", "crooked", "tight", "O", "half_smile", "smile", "wavy", "down", "teeth", "hum", "hum_up"] as const;
export type DoctorMouth = (typeof DOCTOR_MOUTHS)[number];

/** Lens screen icons (bible §7.1: ~24 icons). Cast builder draws each one (Glasses.tsx). */
export const LENS_ICONS = [
  "patient_file_icon", // S0: monochrome patient file with the patient's silhouette
  "zzz", "burger", "question", "dots", "skull", "siren", "eyeroll", "dollars", "stars", "toilet",
  "flatline", "pizza", "kitten", "beach", "flame", "interrobang", "spinner",
  // extra icons named in §7.1 / §8 seeds
  "paper_jam", // S01E01 extra: jammed paper sheet (printer episode)
  "error", // generic "ERR" screen
  "heart_rate", // nervous ECG blips
  "static", // full noise (used by lensSwap internally, also valid as a held state)
  "off", // dark CRT (#1F2B2F)
] as const;
export type LensIcon = (typeof LENS_ICONS)[number];

export const DOCTOR_PLACEMENTS = ["chair", "sunk_in_couch", "drop_out"] as const; // bible §5.5
export type DoctorPlacement = (typeof DOCTOR_PLACEMENTS)[number];

export const DOCTOR_PENS = ["raised", "writing", "click"] as const;
export type DoctorPen = (typeof DOCTOR_PENS)[number];

export const GLASSES_Y = [0, 20, 40] as const;
export type GlassesY = (typeof GLASSES_Y)[number];

export const DOCTOR_EXTRAS = ["sweat", "steam", "sigh"] as const;
export type DoctorExtra = (typeof DOCTOR_EXTRAS)[number];

/** Expression presets = rows of the §3.1 "Zakres min" table. Pose events may use these as a
 *  shorthand (integrator expands them); lint expands them before checking enums. */
export interface DoctorExpressionPreset {
  brows?: Brows;
  mouth?: DoctorMouth;
  glassesY?: GlassesY;
  lens?: LensIcon;
  headTilt?: number;
  lean?: number; // 1.03 = interested lean-in
  glassesJump?: number; // px one-off jump (terrified: 12)
  extras?: DoctorExtra[];
}
export const DOCTOR_EXPRESSIONS = {
  neutral: { brows: "neutral", mouth: "flat", glassesY: 0, lens: "patient_file_icon", headTilt: 0 },
  bored: { brows: "low_flat", mouth: "flat_down", glassesY: 0, lens: "zzz", headTilt: -4 },
  interested: { brows: "one_up", mouth: "o_small", glassesY: 0, lens: "question", lean: 1.03 },
  skeptical: { brows: "skeptic", mouth: "crooked", glassesY: 20, lens: "dots" },
  menacing: { brows: "v", mouth: "tight", glassesY: 40, lens: "skull" },
  terrified: { brows: "high", mouth: "O", glassesY: 0, lens: "siren", glassesJump: 12, extras: ["sweat"] },
  sarcastic: { brows: "one_up", mouth: "half_smile", glassesY: 0, lens: "eyeroll" },
  delighted: { brows: "arched", mouth: "smile", glassesY: 0, lens: "dollars" },
  disgusted: { brows: "v", mouth: "wavy", glassesY: 0, lens: "toilet" },
  disappointed: { brows: "slant_down", mouth: "down", glassesY: 0, lens: "flatline", extras: ["sigh"] },
  distracted: { lens: "pizza" }, // brows/mouth unchanged; lens pizza | kitten | beach
  furious: { brows: "v_strong", mouth: "teeth", glassesY: 0, lens: "flame", extras: ["steam"] },
} as const satisfies Record<string, DoctorExpressionPreset>;
export type DoctorExpression = keyof typeof DOCTOR_EXPRESSIONS;

// ───────────────────────────── Chester (bible §3.2, §9.2) ─────────────────────────────
export const CHESTER_EYES = ["half", "wide_up", "squint", "droop", "closed", "one_open", "one_squint", "side_half", "wide_shake"] as const;
export type ChesterEyes = (typeof CHESTER_EYES)[number];

export const CHESTER_MOUTHS = ["flat", "tight", "wavy", "arc_down", "slightly_open", "crooked", "smirk", "open"] as const;
export type ChesterMouth = (typeof CHESTER_MOUTHS)[number];

export interface ChesterExpressionPreset {
  eyes?: ChesterEyes;
  mouth?: ChesterMouth;
  sag?: number;
  spring?: boolean;
  breath?: boolean; // sleepy/sad breathing (±1% scaleY)
  sigh?: boolean; // one-off scaleY 0.97 and back
}
export const CHESTER_EXPRESSIONS = {
  neutral: { eyes: "half", mouth: "flat", sag: 0 },
  terrified: { eyes: "wide_up", mouth: "tight", sag: 0.02 }, // S0 / frame 0
  pain: { eyes: "squint", mouth: "wavy", sag: 0.04 },
  sad: { eyes: "droop", mouth: "arc_down", sigh: true },
  relief: { eyes: "closed", mouth: "slightly_open" },
  alert: { eyes: "one_open", mouth: "flat" },
  disgusted: { eyes: "one_squint", mouth: "crooked" },
  smug: { eyes: "side_half", mouth: "smirk" },
  sleepy: { eyes: "closed", mouth: "open", breath: true },
  panic: { eyes: "wide_shake", mouth: "open", spring: true },
} as const satisfies Record<string, ChesterExpressionPreset>;
export type ChesterExpression = keyof typeof CHESTER_EXPRESSIONS;

// ───────────────────────────── Chirp (bible §3.3) ─────────────────────────────
export const CHIRP_LEDS = ["off", "chirp", "plead", "alarm", "faint"] as const;
export type ChirpLed = (typeof CHIRP_LEDS)[number];

// ───────────────────────────── Patient generator (bible §4.2–4.4) ─────────────────────────────
export const PATIENT_CATEGORIES = ["object", "digital", "calendar", "concept", "institution", "tool", "nature", "food"] as const;
export type PatientCategory = (typeof PATIENT_CATEGORIES)[number];

export const PATIENT_SIZES = ["S", "M", "L"] as const;
export type PatientSize = (typeof PATIENT_SIZES)[number];
/** Max bounding box per size class (px). L = the whole solo box x 245–575, y 770–1150. */
export const PATIENT_SIZE_MAX: Record<PatientSize, { w: number; h: number }> = {
  S: { w: 160, h: 160 },
  M: { w: 300, h: 300 },
  L: { w: 330, h: 380 },
};

/** 20 shapes, numbered as in §4.3. */
export const PATIENT_SHAPES = [
  "rect_vertical", // 1 fridge, till
  "rect_horizontal", // 2 printer, remote
  "rounded_slab", // 3 phone
  "cylinder", // 4 candle, battery, can
  "disc", // 5 robot vacuum, cookie
  "sphere", // 6 Pluto, Moon, balloon
  "wedge", // 7 pizza slice, cheese
  "cone", // 8 traffic cone
  "sheet", // 9 terms of service, calendar page
  "sticky_note", // 10 Password123
  "speech_bubble", // 11 small talk, spoken concepts
  "cloud", // 12 algorithm, data cloud
  "bag", // 13 plastic bag
  "bottle", // 14 hotel shampoo
  "lidded_box", // 15 pizza box, gift
  "arcs", // 16 Wi-Fi
  "cable_plug", // 17 charger
  "house", // 18 housing market
  "triangle_tree", // 19 Christmas tree
  "ribbed_sphere", // 20 pumpkin
] as const;
export type PatientShape = (typeof PATIENT_SHAPES)[number];

/** 20 eye pairs (§4.3). */
export const PATIENT_EYES = [
  "round_bulging", "tired_bags", "bloodshot", "slanted_angry", "droopy_sad", "dots", "spirals",
  "teary", "mismatched", "cyclops", "led", "pixel", "half_lidded", "terrified_pinpoint", "cross_eyed",
  "stars", "hearts", "bushy_small", "nervous_blink", "monocle",
] as const;
export type PatientEyes = (typeof PATIENT_EYES)[number];
/** Only allowed as a temporary swap (≤ 30 frames), never as the base pair (§4.3, lint 13). */
export const PATIENT_EYES_SWAP_ONLY: readonly PatientEyes[] = ["stars", "hearts"];
/** Never in a shot with the CRY clip, never in an E03 episode (lint 13). */
export const PATIENT_EYES_NO_CRY: readonly PatientEyes[] = ["round_bulging", "stars", "hearts"];
/** Eye width must be 22–30 % of the body width (R4, lint 13). */
export const PATIENT_EYE_WIDTH_RATIO = { min: 0.22, max: 0.3 } as const;

export const PATIENT_BROWS = ["none", "flat_heavy", "angry_v", "worried", "raised", "furrowed", "unibrow"] as const;
export type PatientBrows = (typeof PATIENT_BROWS)[number];

export const PATIENT_MOUTH_TYPES = ["none", "slot", "rhubarb"] as const;
export type PatientMouthType = (typeof PATIENT_MOUTH_TYPES)[number];
export const MOUTH_DRIVERS = ["rms", "rhubarb"] as const;
export type MouthDriver = (typeof MOUTH_DRIVERS)[number];
/** Rhubarb shapes A–F + G, H, X. RMS driver uses only X (closed), B (half), D (open). */
export const MOUTH_SHAPES = ["A", "B", "C", "D", "E", "F", "G", "H", "X"] as const;
export type MouthShape = (typeof MOUTH_SHAPES)[number];
export const MOUTH_STYLES = ["thin", "fleshy", "teeth"] as const;
export type MouthStyle = (typeof MOUTH_STYLES)[number];

export const PATIENT_WEAR = [
  "scratches", "tape_patch", "stickers", "crack", "rust", "coffee_stain", "burn", "price_tag", "dust", "dent",
  "toner_smudge", // from the §4.6 printer example
] as const;
export type PatientWear = (typeof PATIENT_WEAR)[number];

/** Accessories (max 2). "display:<TEXT>" carries its text after the colon, e.g. "display:ERR 49". */
export const PATIENT_ACCESSORY_KINDS = ["cable_plug", "antenna", "display", "out_of_order_sign", "urgent_sticky", "caution_tape", "padlock"] as const;
export type PatientAccessoryKind = (typeof PATIENT_ACCESSORY_KINDS)[number];
export type PatientAccessory = Exclude<PatientAccessoryKind, "display"> | `display:${string}`;
/** Forbidden anywhere (R8, §12): bows, party hats, plasters, bandages, stethoscopes. */
export const FORBIDDEN_ACCESSORIES = ["bow", "party_hat", "plaster", "bandage", "stethoscope"] as const;

export const PATIENT_IDLES = ["bob", "jitter", "vibrate", "sway", "pulse", "flicker", "drip", "spin"] as const;
export type PatientIdle = (typeof PATIENT_IDLES)[number];

export const PATIENT_LANDINGS = ["heavy", "bouncy", "splat", "float", "clatter"] as const;
export type PatientLanding = (typeof PATIENT_LANDINGS)[number];

export const ADULT_CODING = ["eye_bags", "heavy_lids", "rust_stubble", "dust_stubble", "toner_stubble", "tired_gaze"] as const;
export type AdultCoding = (typeof ADULT_CODING)[number];

export const SOUND_LANGUAGE_KEYS = ["talk", "rant", "cry", "curse", "exit"] as const;
export type SoundLanguageKey = (typeof SOUND_LANGUAGE_KEYS)[number];

export const VOICE_PRESETS = ["VP1", "VP2", "VP3", "VP4", "VP5", "VP6", "VP7"] as const; // VP7 = premade "Callum" (S01E02 Monday; no free voice slot)
export type VoicePreset = (typeof VOICE_PRESETS)[number];

/** 16-colour patient palette (§4.3). Every patient: 6 px #121212 outline + light top highlight. */
export const PATIENT_PALETTE = {
  office_beige: "#E9E4D8", silver: "#C0C4C8", mustard: "#F2B33D", orange: "#E4572E", blue: "#3D7DD8",
  violet: "#8E5CC9", yellow: "#F0E14A", raspberry: "#D94A64", rotten_apple: "#7FB069", off_white: "#F4F1EA",
  rust: "#B5651D", turquoise: "#2E9CCA", cardboard: "#CFA15A", pumpkin: "#FF8C42", cherry: "#9B2335",
  graphite: "#5C6B73", // only with a light outline
} as const;
export const PATIENT_OUTLINE = { color: "#121212", width: 6 } as const;

// ───────────────────────────── Humans in bubbles (bible §4.7) ─────────────────────────────
export const HUMAN_POSES = ["phone", "yell", "kick", "point", "sleep", "type", "laugh", "throw"] as const;
export type HumanPose = (typeof HUMAN_POSES)[number];
export const HUMAN_ACCESSORIES = ["tie", "cap", "apron", "headphones"] as const;
export type HumanAccessory = (typeof HUMAN_ACCESSORIES)[number];

// ───────────────────────────── Episode-level vocabularies (bible §5.4, §6.3, §6.4, §9.2) ─────────────────────────────
export const CAMERAS = ["WIDE", "GLASSES", "NOTEPAD", "PATIENT", "BUBBLE", "WINDOW"] as const;
export type Camera = (typeof CAMERAS)[number];
export const SHOT_EASES = ["cut", "zoom8", "zoom12"] as const;
export type ShotEase = (typeof SHOT_EASES)[number];

export const EASES = ["linear", "in", "out", "inOut", "spring"] as const;
export type Ease = (typeof EASES)[number];

export const WINNERS = ["patient", "doctor", "couch", "humans", "nobody", "landlord", "both", "chirp"] as const;
export type Winner = (typeof WINNERS)[number];

const range = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => `${prefix}${String(i + 1).padStart(2, "0")}`);
export const EXIT_TYPES = range("E", 17); // E01..E17 (§6.3)
export const WOUND_IDS = range("W", 25); // W01..W25 (§6.4)
export const ADVICE_IDS = range("A", 30); // A01..A30 (§6.4), grows A31+ per season
export const TWIST_IDS = range("T", 21); // T01..T21 (§6.4)

export const PARTICLE_TYPES = ["smoke", "sparks", "feathers", "confetti", "paper", "coins", "dust"] as const;
export type ParticleType = (typeof PARTICLE_TYPES)[number];

export const PROP_ANIMS = ["pop", "fly", "drop", "launch"] as const;
export type PropAnim = (typeof PROP_ANIMS)[number];

export const TIMER_MODES = ["run", "reverse", "stolen", "spare"] as const;
export type TimerMode = (typeof TIMER_MODES)[number];

export const DIALOGUE_MOUTH = ["none", "rms", "rhubarb"] as const;
export type DialogueMouth = (typeof DIALOGUE_MOUTH)[number];

export const ACTOR_IDS = ["patient", "patient2", "patient3"] as const;
export type ActorId = (typeof ACTOR_IDS)[number];
export const CHAR_IDS = ["doctor", "chester", "chirp", ...ACTOR_IDS] as const;
export type CharId = (typeof CHAR_IDS)[number];

/** 64 s or 96–120 s (multiples of 8 s → audio length divisible by 1024 samples, §6.1, lint 1). */
export const ALLOWED_DURATIONS = [1920, 2880, 3120, 3360, 3600] as const;
export type AllowedDuration = (typeof ALLOWED_DURATIONS)[number];

// Window layers, vignettes, doodles and props are open registries owned by the set builder
// (exported from src/components/set/Set.tsx and src/components/props/registry.ts), not enums here.
