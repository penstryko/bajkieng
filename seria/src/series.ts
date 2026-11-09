// Display names live ONLY here (the series title and character names are still working titles
// and may change). Code everywhere else uses the neutral ids: doctor, chester, chirp, patient.
// Owner: coordinator. Builders read, never edit.

export const SERIES = {
  /** Series display title (working title, see bible §12 clearance). */
  title: "Dr. Dusty",
  /** Episode title prefix, e.g. "Dr. Dusty #001: The Printer Who Said No". */
  episodeTitlePrefix: "Dr. Dusty",
  /** On-screen badge text on the doctor's lanyard (bible §3.1). */
  doctorBadge: "DR.",
  /** Display names (captions, model sheets). Never used as identifiers. */
  names: {
    doctor: "Dr. Dusty",
    chester: "Chester",
    chirp: "Chirp",
  },
  /** Caption shown in S0: "PATIENT #001: OFFICE PRINTER" (bible §4.5 R6). */
  captionPrefix: "PATIENT",
} as const;

export const patientNoLabel = (n: number): string => `#${String(n).padStart(3, "0")}`;

export const s0Caption = (patientNo: number, captionName: string): string =>
  `${SERIES.captionPrefix} ${patientNoLabel(patientNo)}: ${captionName}`;

export const episodeTitle = (patientNo: number, title: string): string =>
  `${SERIES.episodeTitlePrefix} ${patientNoLabel(patientNo)}: ${title}`;

/** Episodes registered as compositions (tools/new_episode.sh appends here). */
export const EPISODES: string[] = ["S01E01"];
