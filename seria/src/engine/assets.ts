// Asset path resolution + episode bundle loading.
//
// AUDIO / DATA paths in episode.json & patient.json are file paths:
//   "assets/…"    → seria/assets/…            (library: SFX, doctor VO, music)
//   "episodes/…"  → seria/episodes/…          (explicit)
//   anything else → seria/episodes/<ID>/…     (episode-local: patient SFX, patient VO, mouth data)
// public/assets and public/episodes are symlinks, so staticFile(resolved) works in Studio and render.
//
// VISUAL refs (bubbles[].vignette, notepad[].doodle, props[].svg, windowLayer[].layer, lens icons)
// are registry keys: assetKey("doodles/A01_fence.svg") === "A01_fence".
import { getStaticFiles, staticFile } from "remotion";
import type { Episode, EpisodeBundle, MouthData, PatientSpec } from "../schema";
import type { ActorId } from "../enums";
import { loopSeconds } from "./constants";

export const resolveAssetPath = (path: string, episodeId: string): string => {
  const p = path.replace(/^\.?\//, "");
  if (p.startsWith("assets/") || p.startsWith("episodes/")) return p;
  return `episodes/${episodeId}/${p}`;
};

export const assetUrl = (path: string, episodeId: string): string => staticFile(resolveAssetPath(path, episodeId));

/** Registry key of a visual ref: basename without extension. */
export const assetKey = (path: string): string => {
  const base = path.split("/").pop() ?? path;
  return base.replace(/\.[a-z0-9]+$/i, "");
};

export const dbToGain = (db?: number): number => (db === undefined ? 1 : Math.pow(10, db / 20));

/** Default pre-rendered tick track for a duration (built by tools/gen_audio.*). */
export const defaultTickBed = (N: number): string => `assets/sfx/SFX01_tick_bed${loopSeconds(N)}.wav`;

/** All audio paths an episode references (bed + dialogue + sfx), as written in the JSON. */
export const episodeAudioPaths = (ep: Episode): string[] => {
  const bed = [ep.bed.tickBed ?? defaultTickBed(ep.durationInFrames), ep.bed.roomTone, ep.bed.music];
  return [...new Set([...bed, ...ep.dialogue.map((d) => d.clip), ...ep.sfx.map((s) => s.clip)])];
};

/** Existence check: the bundle's static-file listing (follows the public/ symlinks), else an HTTP probe. */
const listedFiles = (): Set<string> | null => {
  try {
    const names = getStaticFiles().map((f) => f.name.replace(/^\/+/, ""));
    return names.length ? new Set(names) : null;
  } catch {
    return null;
  }
};

const probe = async (url: string): Promise<boolean> => {
  try {
    const r = await fetch(url, { method: "HEAD" });
    if (r.ok) return true;
    if (r.status === 404) return false;
    const g = await fetch(url, { headers: { Range: "bytes=0-0" } });
    return g.ok;
  } catch {
    return false;
  }
};

const getJson = async <T,>(url: string): Promise<T> => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to load ${url}: HTTP ${r.status}`);
  return (await r.json()) as T;
};

/**
 * Load everything an episode composition needs, once, inside calculateMetadata():
 * episode.json, patient.json for each actor, mouthData JSONs, and the list of audio files not yet present.
 */
export async function loadEpisodeBundle(episodeId: string): Promise<EpisodeBundle> {
  const listed = listedFiles();
  const exists = async (path: string): Promise<boolean> =>
    listed ? listed.has(resolveAssetPath(path, episodeId)) : probe(assetUrl(path, episodeId));
  const episode = await getJson<Episode>(staticFile(`episodes/${episodeId}/episode.json`));
  const patients: Partial<Record<ActorId, PatientSpec>> = {};
  for (const a of episode.actors) patients[a.id] = await getJson<PatientSpec>(assetUrl(a.ref, episodeId));
  const mouthData: Record<string, MouthData> = {};
  for (const d of episode.dialogue) {
    if (!d.mouthData || d.mouthData in mouthData) continue;
    if (await exists(d.mouthData)) mouthData[d.mouthData] = await getJson<MouthData>(assetUrl(d.mouthData, episodeId));
  }
  const missingAudio: string[] = [];
  for (const p of episodeAudioPaths(episode)) if (!(await exists(p))) missingAudio.push(p);
  return { episodeId, episode, patients, mouthData, missingAudio };
}
