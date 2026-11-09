#!/usr/bin/env python3
"""One-image QC: a single contact sheet that replaces looking at dozens of full frames.

Picks the frames that matter from episode.json (start of every shot, middle of every dialogue line,
DING, the reset and both ends of the loop), tiles them small with a label (time, frame, camera, who
speaks and what), draws the platform safe zones on every tile and adds a seam strip (last 3 frames |
first 3 frames) with a pixel-identity verdict. Claude reads ONE image (~2–3k tokens) instead of 15–100
full frames; full-size frames are opened only for a tile that looks wrong (use --crop).

Usage (from seria/):
  python3 tools/qc_sheet.py S01E02 --list            # print the chosen frame numbers (for preview stills)
  python3 tools/qc_sheet.py S01E02                   # sheet from out/<EP>/frames (full render)
  python3 tools/qc_sheet.py S01E02 --preview         # sheet from out/<EP>/preview (stills, no full render)
  python3 tools/qc_sheet.py S01E02 --crop 1562       # one full-res frame cropped to the action zone
Options: --max 20 (tiles), --cols 5, --no-guides
Writes out/<EP>/qc_sheet.png (or preview_sheet.png / crop_fNNNN.png) and prints a short text summary.
"""
import argparse
import hashlib
import json
import sys
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
TW, TH = 216, 384          # tile = 1/5 of 1080×1920
LABEL_H = 44
GAP = 8
# Safe zones from src/engine/layout.ts (SAFE), in 1080×1920 pixels.
UI_TOP_Y, UI_BOTTOM_Y = 200, 1420
UI_RIGHT = (940, 700, 1080, 1600)
CAPTION_BAND = (80, 1235, 920, 1320)


def font(size, bold=False):
    try:
        return ImageFont.truetype(FONT_B if bold else FONT, size)
    except OSError:
        return ImageFont.load_default()


def clip_seconds(ep_dir: Path, clip: str) -> float:
    for base in (ROOT, ep_dir):
        p = base / clip
        if p.exists():
            try:
                with wave.open(str(p)) as w:
                    return w.getnframes() / w.getframerate()
            except wave.Error:
                return 1.0
    return 1.0


def pick_frames(ep: dict, ep_dir: Path, max_tiles: int):
    n, fps = ep["durationInFrames"], ep.get("fps", 30)
    cand = {}  # frame -> (priority, info)

    def add(f, prio, info):
        f = max(0, min(n - 1, int(f)))
        if f not in cand or cand[f][0] > prio:
            cand[f] = (prio, info)

    add(0, 0, "S0 / hook")
    add(n - 1, 0, "last frame")
    for d in ep.get("dialogue", []):
        dur = clip_seconds(ep_dir, d.get("clip", "")) * fps
        add(d["at"] + dur / 2, 1, "")
    for s in ep.get("shots", []):
        add(s["from"] + min(10, max(0, (s["to"] - s["from"]) // 3)), 2, "")
    ding = next((t["until"] for t in ep.get("timer", []) if t.get("until") is not None), n - 180)
    add(ding + 6, 1, "DING")
    add(n - 75 + 6, 3, "reset")
    frames = sorted(cand)
    # merge frames closer than 0.5 s, keeping the higher priority one
    merged = []
    for f in frames:
        if merged and f - merged[-1] < fps // 2:
            if cand[f][0] < cand[merged[-1]][0]:
                merged[-1] = f
            continue
        merged.append(f)
    # cap: always keep both ends, then the best priorities, spread over time
    if len(merged) > max_tiles:
        keep = {0, n - 1}
        rest = sorted((f for f in merged if f not in keep), key=lambda f: (cand[f][0], f))
        keep.update(rest[: max_tiles - 2])
        merged = sorted(keep)
    return merged, cand


def active(ep, ep_dir, f, fps):
    cam = next((s["camera"] for s in ep.get("shots", []) if s["from"] <= f <= s["to"]), "?")
    lines = []
    for d in ep.get("dialogue", []):
        dur = clip_seconds(ep_dir, d.get("clip", "")) * fps
        if d["at"] <= f <= d["at"] + dur:
            what = d.get("text") or Path(d.get("clip", "")).stem
            lines.append(f'{d.get("char", "?")}: {what}')
    return cam, "; ".join(lines)


def frame_path(ep_id, f, preview):
    if preview:
        return ROOT / "out" / ep_id / "preview" / f"ep_f{f:04d}.png"
    return ROOT / "out" / ep_id / "frames" / f"frame_{f:04d}.png"


def guides(draw, scale):
    s = scale
    red = (255, 60, 60, 150)
    draw.line([(0, UI_TOP_Y * s), (TW, UI_TOP_Y * s)], fill=red, width=1)
    draw.line([(0, UI_BOTTOM_Y * s), (TW, UI_BOTTOM_Y * s)], fill=red, width=1)
    x0, y0, x1, y1 = UI_RIGHT
    draw.rectangle([x0 * s, y0 * s, x1 * s, y1 * s], outline=red, width=1)
    x0, y0, x1, y1 = CAPTION_BAND
    draw.rectangle([x0 * s, y0 * s, x1 * s, y1 * s], outline=(255, 220, 0, 130), width=1)


def md5(p: Path):
    try:
        return hashlib.md5(Image.open(p).convert("RGB").tobytes()).hexdigest()
    except (OSError, FileNotFoundError):
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ep", nargs="?", default="S01E01")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--crop", type=int)
    ap.add_argument("--max", type=int, default=20)
    ap.add_argument("--cols", type=int, default=5)
    ap.add_argument("--no-guides", action="store_true")
    a = ap.parse_args()

    ep_dir = ROOT / "episodes" / a.ep
    ep = json.loads((ep_dir / "episode.json").read_text(encoding="utf-8"))
    n, fps = ep["durationInFrames"], ep.get("fps", 30)
    frames, cand = pick_frames(ep, ep_dir, a.max)
    seam = [n - 3, n - 2, n - 1, 0, 1, 2]

    if a.list:
        print(" ".join(str(f) for f in sorted(set(frames + seam))))
        return

    out_dir = ROOT / "out" / a.ep
    out_dir.mkdir(parents=True, exist_ok=True)

    if a.crop is not None:
        p = frame_path(a.ep, a.crop, a.preview)
        img = Image.open(p).convert("RGB").crop((0, 180, 1080, 1440)).resize((540, 630))
        dst = out_dir / f"crop_f{a.crop:04d}.png"
        img.save(dst)
        print(f"crop: {dst}")
        return

    cols = a.cols
    rows = (len(frames) + cols - 1) // cols
    head_h, seam_h = 36, 150
    W = cols * TW + (cols + 1) * GAP
    H = head_h + rows * (TH + LABEL_H + GAP) + GAP + seam_h
    sheet = Image.new("RGB", (W, H), (26, 26, 26))
    dr = ImageDraw.Draw(sheet)
    title = ep.get("title", a.ep)
    dr.text((GAP, 8), f"{title}  |  {n} fr @ {fps} fps  |  {'PREVIEW stills' if a.preview else 'render'}", font=font(16, True), fill=(240, 240, 240))

    missing, dark = [], []
    for i, f in enumerate(frames):
        r, c = divmod(i, cols)
        x = GAP + c * (TW + GAP)
        y = head_h + r * (TH + LABEL_H + GAP)
        p = frame_path(a.ep, f, a.preview)
        if p.exists():
            tile = Image.open(p).convert("RGB").resize((TW, TH), Image.LANCZOS)
            from PIL import ImageStat; lum = ImageStat.Stat(tile.convert("L")).mean[0]
            if lum < 10:
                dark.append(f)
            if not a.no_guides:
                ov = Image.new("RGBA", (TW, TH), (0, 0, 0, 0))
                guides(ImageDraw.Draw(ov), TW / 1080)
                tile = Image.alpha_composite(tile.convert("RGBA"), ov).convert("RGB")
            sheet.paste(tile, (x, y))
        else:
            missing.append(f)
            dr.rectangle([x, y, x + TW, y + TH], outline=(255, 0, 0), width=2)
            dr.text((x + 8, y + TH // 2), "MISSING", font=font(18, True), fill=(255, 80, 80))
        cam, talk = active(ep, ep_dir, f, fps)
        tag = cand.get(f, (9, ""))[1]
        dr.text((x, y + TH + 3), f"{f / fps:5.1f}s f{f} {cam} {tag}".strip(), font=font(13, True), fill=(255, 255, 255))
        dr.text((x, y + TH + 22), talk[:34], font=font(12), fill=(170, 220, 255))

    # seam strip: last 3 | first 3
    sy = H - seam_h + 4
    sw, sh = 72, 128
    hashes = {}
    for j, f in enumerate(seam):
        x = GAP + j * (sw + 6) + (24 if j >= 3 else 0)
        p = frame_path(a.ep, f, a.preview)
        if p.exists():
            sheet.paste(Image.open(p).convert("RGB").resize((sw, sh)), (x, sy))
            hashes[f] = md5(p)
        dr.text((x, sy + sh + 2), f"f{f}", font=font(11), fill=(200, 200, 200))
    dr.text((GAP + 3 * (sw + 6) - 2, sy + sh // 2 - 10), "|", font=font(20, True), fill=(255, 255, 0))
    have = [h for h in hashes.values() if h]
    if len(have) == 6:
        ok = len(set(have)) == 1
        verdict = "SEAM: all 6 frames pixel-identical" if ok else "SEAM: frames DIFFER (loop jump!)"
    else:
        ok, verdict = None, "SEAM: frames not available"
    dr.text((GAP + 6 * (sw + 6) + 40, sy + 40), verdict, font=font(16, True),
            fill=(120, 255, 120) if ok else (255, 90, 90))
    dr.text((GAP + 6 * (sw + 6) + 40, sy + 66), "red = platform UI zones, yellow = caption band",
            font=font(12), fill=(200, 200, 200))

    dst = out_dir / ("preview_sheet.png" if a.preview else "qc_sheet.png")
    sheet.save(dst, optimize=True)
    print(f"sheet: {dst}  ({W}x{H}, {len(frames)} tiles)")
    print(verdict)
    if missing:
        print(f"MISSING frames: {missing}")
    if dark:
        print(f"WARN near-black tiles: {dark}")
    sys.exit(1 if (missing or ok is False) else 0)


if __name__ == "__main__":
    main()
