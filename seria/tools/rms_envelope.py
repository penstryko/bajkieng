#!/usr/bin/env python3
"""RMS-envelope mouth data (bible 4.4 "Usta pacjenta", CONTRACT 8). No Rhubarb binary is available here,
so every dialogue clip (Thingish SFX, the one clear word, doctor hums) gets an RMS envelope that the engine
(mouthAt) maps to X (closed) / B (half) / D (open).

Output format (src/schema.ts RmsMouthData):
  {"type": "rms", "sampleRate": 48000, "hopSamples": 1600, "values": [0..1, ...], "thresholds": {"B": 0.12, "D": 0.4}}
values[i] is derived from the RMS of samples [i*hop, (i+1)*hop):
  * hops quieter than -30 dB below the loudest hop are silence -> 0 (mouth X);
  * active hops are mapped by their loudness RANK inside the clip (monotone in RMS): v = 0.95 * rank^1.5.
    Thingish SFX are dense (a motor never stops), so plain peak-normalised RMS keeps the mouth open ~95 % of
    the time; the rank mapping gives roughly 25 % X / 30 % B / 45 % D on active hops, and the loudest
    syllables are always D;
  * 3-hop median filter against single-frame flicker; first and last value forced to 0 (closed at both ends).

Usage:
  rms_envelope.py IN.wav OUT.json [--hop 1600] [--b 0.12] [--d 0.4]
  rms_envelope.py --episode S01E01 [--all]     # every dialogue[].clip with mouthData (default path: clip .rms.json);
                                               # --all also writes <clip>.rms.json for lines with mouth "none"
"""
import json
import os
import sys
import wave

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def read_wav(path):
    with wave.open(path, "rb") as w:
        n, ch, sw, sr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate()
        raw = w.readframes(n)
    if sw == 2:
        x = np.frombuffer(raw, dtype="<i2").astype(np.float64) / 32768
    elif sw == 3:
        b = np.frombuffer(raw, dtype=np.uint8).reshape(-1, 3)
        v = (b[:, 0].astype(np.int32) | (b[:, 1].astype(np.int32) << 8) | (b[:, 2].astype(np.int32) << 16))
        v = np.where(v >= 1 << 23, v - (1 << 24), v)
        x = v.astype(np.float64) / (1 << 23)
    elif sw == 4:
        x = np.frombuffer(raw, dtype="<i4").astype(np.float64) / (1 << 31)
    else:
        raise ValueError(f"unsupported sample width {sw}")
    return x.reshape(-1, ch).mean(axis=1), sr


def envelope(path, hop=1600, b=0.12, d=0.4):
    x, sr = read_wav(path)
    if sr != 48000:
        raise ValueError(f"{path}: {sr} Hz (must be 48000)")
    n = int(np.ceil(len(x) / hop))
    x = np.concatenate([x, np.zeros(n * hop - len(x))])
    rms = np.sqrt(np.mean(x.reshape(n, hop) ** 2, axis=1))
    peak = rms.max() if rms.size else 0
    v = np.zeros(n)
    if peak > 1e-9:
        active = rms > peak * 10 ** (-30 / 20)
        idx = np.nonzero(active)[0]
        if idx.size:
            order = np.argsort(np.argsort(rms[idx], kind="stable"), kind="stable")
            rank = (order + 1) / idx.size  # 1/n .. 1
            v[idx] = 0.95 * rank ** 1.5
    out = v.copy()
    if n >= 3:
        out[1:-1] = np.median(np.stack([v[:-2], v[1:-1], v[2:]]), axis=0)
    if out.size:
        out[0] = 0.0
        out[-1] = 0.0
    return {"type": "rms", "sampleRate": 48000, "hopSamples": hop, "values": [round(float(a), 3) for a in out],
            "thresholds": {"B": b, "D": d}}


def resolve(p, ep):
    return os.path.join(ROOT, p) if p.startswith("assets/") or p.startswith("episodes/") else os.path.join(ROOT, "episodes", ep, p)


def write(data, out):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as fh:
        json.dump(data, fh, separators=(",", ":"))
        fh.write("\n")


def main(a):
    if "--episode" in a:
        ep = a[a.index("--episode") + 1]
        episode = json.load(open(os.path.join(ROOT, "episodes", ep, "episode.json")))
        done = set()
        for d in episode["dialogue"]:
            if d.get("mouth", "none") == "none" and not d.get("mouthData") and "--all" not in a:
                continue
            clip = resolve(d["clip"], ep)
            out_rel = d.get("mouthData") or (d["clip"].rsplit(".", 1)[0] + ".rms.json")
            out = resolve(out_rel, ep)
            if out in done:
                continue
            if not os.path.exists(clip):
                print(f"[rms] skip {d['clip']} (missing)")
                continue
            data = envelope(clip)
            write(data, out)
            done.add(out)
            v = data["values"]
            shapes = sum(1 for x in v if x >= 0.4), sum(1 for x in v if 0.12 <= x < 0.4), sum(1 for x in v if x < 0.12)
            print(f"[rms] {out_rel}: {len(v)} frames (D/B/X = {shapes[0]}/{shapes[1]}/{shapes[2]})")
        return
    if len(a) < 2:
        print(__doc__)
        sys.exit(2)
    hop = int(a[a.index("--hop") + 1]) if "--hop" in a else 1600
    b = float(a[a.index("--b") + 1]) if "--b" in a else 0.12
    d = float(a[a.index("--d") + 1]) if "--d" in a else 0.4
    write(envelope(a[0], hop, b, d), a[1])
    print(f"[rms] {a[1]}")


if __name__ == "__main__":
    main(sys.argv[1:])
