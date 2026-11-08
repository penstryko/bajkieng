#!/usr/bin/env python3
"""Audio post-processing shared by tools/gen_audio.mjs (ElevenLabs) and tools/placeholder_audio.sh.

Every final file is WAV 48 kHz with an exact, known sample count (bible 6.2, 9.5 lint 3/4).

Subcommands (all print one JSON line with the result):
  clip IN OUT [--dur S | --max S] [--fade-out MS] [--peak DB] [--lead-db DB] [--no-lead-trim]
        decode -> mono -> trim leading silence -> exact length (--dur, pad/cut) or natural length
        capped at --max -> 3 ms fade-in, fade-out -> peak normalise -> s16 WAV
  split-align WAV ALIGN.json LINES.json
        cut one TTS request into lines using ElevenLabs character timestamps.
        LINES.json = [{"out", "c0", "c1", "maxS", "fadeOutMs"?}]  (c0..c1 = char index range of the spoken text)
  split-last WAV OUT [--max S] [--gap S]
        keep only the last phrase after a pause >= --gap (the one clear word cut from a Voice Design preview)
  tickbed TICK OUT --samples L --period P --offset O [--peak DB]
        silence of exactly L samples with TICK at O + k*P (k = 0.. while it fits)
  loop SRC OUT --samples L --xfade F [--rms-db DB] [--tile] [--mono] [--music --bpm 120 --offset 12000]
        build a seam-safe bed of exactly L samples with the report's command 5
        (acrossfade qsin, tail -> head). --tile: source shorter than L+F is tiled with qsin joins.
        --music: tempo check (atempo to exactly --bpm if drifted) and downbeats placed at --offset + k*bar.
  info WAV
"""
import json
import math
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

SR = 48000


def die(msg):
    print(json.dumps({"ok": False, "error": msg}))
    sys.exit(1)


def decode(path, channels=1, extra_af=None):
    """Decode any file to float32 [n, ch] at 48 kHz via ffmpeg."""
    cmd = ["ffmpeg", "-nostdin", "-v", "error", "-i", path]
    if extra_af:
        cmd += ["-af", extra_af]
    cmd += ["-f", "f32le", "-ac", str(channels), "-ar", str(SR), "-"]
    raw = subprocess.run(cmd, check=True, capture_output=True, stdin=subprocess.DEVNULL).stdout
    x = np.frombuffer(raw, dtype="<f4").astype(np.float64)
    return x.reshape(-1, channels)


def write_wav(path, x, bits=16):
    """x: float [n] or [n, ch] in -1..1 -> PCM WAV (16 or 24 bit)."""
    if x.ndim == 1:
        x = x[:, None]
    x = np.clip(x, -1.0, 1.0)
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(x.shape[1])
        w.setframerate(SR)
        if bits == 16:
            w.setsampwidth(2)
            w.writeframes(np.round(x * 32767).astype("<i2").tobytes())
        else:
            w.setsampwidth(3)
            v = np.round(x * 8388607).astype("<i4")
            b = v.astype("<i4").view(np.uint8).reshape(-1, 4)[:, :3]
            w.writeframes(b.tobytes())


def wav_info(path):
    with wave.open(path, "rb") as w:
        return {"samples": w.getnframes(), "sampleRate": w.getframerate(), "channels": w.getnchannels(), "bits": 8 * w.getsampwidth()}


def db(v):
    return 20 * math.log10(max(v, 1e-12))


def peak_norm(x, peak_db):
    p = np.max(np.abs(x)) if x.size else 0
    if p < 1e-9:
        return x, 0.0
    g = 10 ** (peak_db / 20) / p
    return x * g, db(g)


def frame_rms(x, hop=240):
    m = x if x.ndim == 1 else x.mean(axis=1)
    n = len(m) // hop
    if n == 0:
        return np.zeros(0)
    return np.sqrt(np.mean(m[: n * hop].reshape(n, hop) ** 2, axis=1))


def trim_lead(x, lead_db=-40.0, preroll=0.004):
    """Drop leading silence: first 5 ms window above (peak + lead_db)."""
    m = np.abs(x if x.ndim == 1 else x.max(axis=1))
    if not m.size or m.max() < 1e-9:
        return x
    r = frame_rms(m, 240)
    thr = max(r.max() * 10 ** (lead_db / 20), 1e-5)
    idx = np.argmax(r > thr) * 240
    return x[max(0, idx - int(preroll * SR)):]


def trim_tail(x, tail_db=-42.0, postroll=0.06):
    m = x if x.ndim == 1 else x.max(axis=1)
    r = frame_rms(m, 240)
    if not r.size or r.max() < 1e-9:
        return x
    thr = max(r.max() * 10 ** (tail_db / 20), 1e-5)
    above = np.nonzero(r > thr)[0]
    end = (above[-1] + 1) * 240 if above.size else len(x)
    return x[: min(len(x), end + int(postroll * SR))]


def fades(x, fade_in_ms=3.0, fade_out_ms=30.0):
    n = len(x)
    fi = min(n, int(SR * fade_in_ms / 1000))
    fo = min(n, int(SR * fade_out_ms / 1000))
    y = x.copy()
    if fi > 0:
        y[:fi] *= (np.sin(np.linspace(0, math.pi / 2, fi)) ** 2)[:, None] if y.ndim == 2 else np.sin(np.linspace(0, math.pi / 2, fi)) ** 2
    if fo > 0:
        c = np.cos(np.linspace(0, math.pi / 2, fo)) ** 2
        y[n - fo:] *= c[:, None] if y.ndim == 2 else c
    return y


def finish_clip(x, out, dur=None, max_s=None, fade_out_ms=30.0, peak_db=-3.0, lead=True, lead_db=-40.0):
    x = x[:, 0] if x.ndim == 2 else x
    if lead:
        x = trim_lead(x, lead_db)
    if dur is not None:
        n = int(round(dur * SR))
        x = np.concatenate([x[:n], np.zeros(max(0, n - len(x)))])
    else:
        x = trim_tail(x)
        if max_s is not None:
            x = x[: int(round(max_s * SR))]
    x = fades(x, 3.0, fade_out_ms)
    x, gain = peak_norm(x, peak_db)
    write_wav(out, x)
    return {"ok": True, "out": out, "samples": int(len(x)), "durationS": round(len(x) / SR, 4), "gainDb": round(gain, 2)}


def arg(args, name, default=None, cast=str):
    if name in args:
        i = args.index(name)
        return cast(args[i + 1])
    return default


# ───────────────────────────── tempo / downbeat analysis ─────────────────────────────
HOP = 480  # 10 ms


def onset_env(mono, fmax=None):
    n = 2048
    win = np.hanning(n)
    frames = (len(mono) - n) // HOP
    if frames <= 0:
        return np.zeros(1)
    idx = np.arange(n)[None, :] + HOP * np.arange(frames)[:, None]
    spec = np.abs(np.fft.rfft(mono[idx] * win, axis=1))
    if fmax:
        spec = spec[:, : int(fmax / (SR / n)) + 1]
    logm = np.log1p(1000 * spec)
    flux = np.maximum(0, np.diff(logm, axis=0)).sum(axis=1)
    k = 50
    smooth = np.convolve(flux, np.ones(k) / k, mode="same")
    return np.maximum(0, flux - smooth)


def comb_score(env, period, phases):
    """mean onset strength on the grid phase + k*period (linear interpolation), for each phase."""
    kmax = int((len(env) - 2 - phases.max()) // period)
    if kmax < 4:
        return np.zeros(len(phases))
    pos = phases[:, None] + period * np.arange(kmax)[None, :]
    i0 = np.floor(pos).astype(int)
    f = pos - i0
    v = env[i0] * (1 - f) + env[i0 + 1] * f
    return v.mean(axis=1)


def estimate_bpm(env, lo=100.0, hi=140.0, step=0.02):
    best = (0.0, 120.0)
    for bpm in np.arange(lo, hi + 1e-9, step):
        period = 6000.0 / bpm  # env frames (100 Hz)
        phases = np.arange(0, period, 0.5)
        s = comb_score(env, period, phases).max()
        if s > best[0]:
            best = (s, bpm)
    return best[1]


def beat_phase(env, bpm):
    period = 6000.0 / bpm
    phases = np.arange(0, period, 0.1)
    sc = comb_score(env, period, phases)
    return phases[int(np.argmax(sc))], period


def detector_lag(bpm=120.0):
    """Onset-envelope lag in env frames (negative = reports early): measured on a synthetic click train with
    percussive attacks at exactly 0.25 s + k*beat, so detected phases can be corrected to true sample times."""
    t = np.arange(16 * SR) / SR
    beat = 60.0 / bpm
    loc = np.mod(t - 0.25, beat)
    x = (0.6 * np.sin(2 * np.pi * 70 * t) + 0.3 * np.sin(2 * np.pi * 2300 * t)) * np.exp(-loc * 30) * (t >= 0.25)
    ph, period = beat_phase(onset_env(x), bpm)
    lag = ph - 0.25 * SR / HOP
    return (lag + period / 2) % period - period / 2


# ───────────────────────────── commands ─────────────────────────────
def cmd_clip(a):
    src, out = a[0], a[1]
    x = decode(src, 1)
    dur = arg(a, "--dur", None, float)
    mx = arg(a, "--max", None, float)
    r = finish_clip(x, out, dur, mx, arg(a, "--fade-out", 30.0, float), arg(a, "--peak", -3.0, float),
                    "--no-lead-trim" not in a, arg(a, "--lead-db", -40.0, float))
    print(json.dumps(r))


def cmd_split_align(a):
    src, align_path, lines_path = a[0], a[1], a[2]
    x = decode(src, 1)[:, 0]
    al = json.load(open(align_path))
    al = al.get("alignment") or al
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    lines = json.load(open(lines_path))
    spans = []
    for ln in lines:
        c0, c1 = ln["c0"], ln["c1"]
        spans.append((st[c0], en[c1]))
    res = []
    for i, ln in enumerate(lines):
        t0, t1 = spans[i]
        prev_end = spans[i - 1][1] if i > 0 else 0.0
        next_start = spans[i + 1][0] if i + 1 < len(spans) else len(x) / SR
        a0 = max((t0 + prev_end) / 2 if i > 0 else 0.0, t0 - 0.12)
        a1 = min((t1 + next_start) / 2 if i + 1 < len(spans) else len(x) / SR, t1 + 0.45)
        seg = x[int(a0 * SR): int(a1 * SR)]
        r = finish_clip(seg, ln["out"], None, ln.get("maxS"), ln.get("fadeOutMs", 40.0), ln.get("peakDb", -3.0), True, -36.0)
        r.update({"t0": round(t0, 3), "t1": round(t1, 3), "cut": [round(a0, 3), round(a1, 3)]})
        res.append(r)
    print(json.dumps({"ok": True, "lines": res}))


def cmd_split_last(a):
    src, out = a[0], a[1]
    gap = arg(a, "--gap", 0.25, float)
    x = decode(src, 1)[:, 0]
    r = frame_rms(x, 240)  # 5 ms
    if not r.size:
        die("empty audio")
    thr = r.max() * 10 ** (-34 / 20)
    voiced = r > thr
    idx = np.nonzero(voiced)[0]
    if not idx.size:
        die("no voiced frames")
    last = idx[-1]
    # walk back from the last voiced frame until a silent run >= gap
    need = int(gap * SR / 240)
    run, start = 0, 0
    for i in range(last, -1, -1):
        if voiced[i]:
            run = 0
            start = i
        else:
            run += 1
            if run >= need:
                break
    seg = x[max(0, start * 240 - int(0.03 * SR)): min(len(x), (last + 1) * 240 + int(0.12 * SR))]
    res = finish_clip(seg, out, None, arg(a, "--max", 1.2, float), 50.0, -3.0, True, -36.0)
    res["segmentStartS"] = round(start * 240 / SR, 3)
    res["phraseS"] = round((last + 1 - start) * 240 / SR, 3)
    print(json.dumps(res))


def cmd_tickbed(a):
    tick, out = a[0], a[1]
    L = arg(a, "--samples", None, int)
    P = arg(a, "--period", 24000, int)
    O = arg(a, "--offset", 12000, int)
    pk = arg(a, "--peak", -16.0, float)
    t = decode(tick, 1)[:, 0]
    t, _ = peak_norm(t, pk)
    bed = np.zeros(L)
    k = 0
    while O + k * P + len(t) <= L:
        bed[O + k * P: O + k * P + len(t)] += t
        k += 1
    write_wav(out, bed)
    print(json.dumps({"ok": True, "out": out, "samples": L, "ticks": k, "firstTick": O, "lastTick": O + (k - 1) * P, "tickSamples": len(t)}))


def xfade_join(a_, b_, F):
    """qsin (equal power) join of two [n, ch] arrays overlapping F samples."""
    t = np.linspace(0, 1, F, endpoint=False)[:, None]
    mid = a_[-F:] * np.cos(t * math.pi / 2) + b_[:F] * np.sin(t * math.pi / 2)
    return np.concatenate([a_[:-F], mid, b_[F:]])


def cmd_loop(a):
    src, out = a[0], a[1]
    L = arg(a, "--samples", None, int)
    F = arg(a, "--xfade", 4800, int)
    rms_db = arg(a, "--rms-db", None, float)
    music = "--music" in a
    bpm_target = arg(a, "--bpm", 120.0, float)
    offset = arg(a, "--offset", 12000, int)
    info = {"ok": True, "out": out, "source": src}
    x = decode(src, 1 if "--mono" in a else 2)
    if music:
        mono = x.mean(axis=1)
        bpm = estimate_bpm(onset_env(mono))
        info["bpmDetected"] = round(float(bpm), 2)
        if abs(bpm - bpm_target) > 0.05:
            f = bpm_target / bpm
            info["atempo"] = round(float(f), 5)
            x = decode(src, 2, f"atempo={f:.6f}")
            mono = x.mean(axis=1)
        env = onset_env(mono)
        phase, period = beat_phase(env, bpm_target)
        lag = detector_lag(bpm_target)
        phase = (phase - lag) % period  # detected -> true onset time
        info["detectorLagS"] = round(lag * HOP / SR, 4)
        env_lo = onset_env(mono, fmax=200)
        bar = 4 * period
        # bar downbeat: low-band (bass/kick) and full-band onset strength per beat position, each normalised
        # to its maximum, summed. Scored in the detector's own time base (phase + lag). Best guess only:
        # check the bar grid in a DAW (bible 7.4).
        cand = [np.array([(phase + lag) % period + j * period]) for j in range(4)]
        lo_s = np.array([comb_score(env_lo, bar, c)[0] for c in cand])
        fu_s = np.array([comb_score(env, bar, c)[0] for c in cand])
        score = lo_s / max(lo_s.max(), 1e-9) + fu_s / max(fu_s.max(), 1e-9)
        best_j = int(np.argmax(score))
        srt = np.sort(score)
        info["downbeatConfidence"] = round(float((srt[-1] - srt[-2]) / srt[-1]), 3)
        d0 = int(round((phase + best_j * period) * HOP))  # first downbeat (samples)
        barS = int(round(bar * HOP))  # 96000 at 120 BPM
        info.update({"beatPhaseS": round(phase * HOP / SR, 4), "downbeat0S": round(d0 / SR, 4), "barSamples": barS})
        cands = [d0 - F - offset + m * barS for m in range(-2, 60)]
        cands = [s for s in cands if s >= 0 and s + L + F <= len(x)]
        if cands:
            s = min(cands, key=lambda v: (v < SR // 2, v))  # prefer >= 0.5 s in (skip any fade-in)
        else:
            s = max(0, min(len(x) - L - F, (d0 - F - offset) % barS))
            info["warning"] = "no bar-aligned start fits; best effort"
        info["startSample"] = int(s)
        x = x[s:]
    if "--tile" in a or len(x) < L + F:
        if len(x) < L + F and "--tile" not in a:
            info["warning"] = f"source shorter than L+F ({len(x)} < {L + F}); tiled"
        J = min(24000, len(x) // 4)
        base = x.copy()
        tiles = 1
        while len(x) < L + F + J:
            x = xfade_join(x, base, J)
            tiles += 1
        info["tiles"] = tiles
    x = x[: L + F + 1]
    if rms_db is not None:
        r = math.sqrt(float(np.mean(x[:L] ** 2)))
        g = 10 ** (rms_db / 20) / max(r, 1e-9)
        pk = float(np.max(np.abs(x))) * g
        if pk > 10 ** (-1.0 / 20):
            g *= 10 ** (-1.0 / 20) / pk
        x = x * g
        info["gainDb"] = round(db(g), 2)
    with tempfile.TemporaryDirectory() as td:
        bed_src = os.path.join(td, "bed_src.wav")
        write_wav(bed_src, x, bits=24)
        # Report command 5, verbatim apart from the variables.
        fc = (f"[0:a]atrim=start_sample={F}:end_sample={L + F},asetpts=PTS-STARTPTS[p];"
              f"[1:a]atrim=end_sample={F},asetpts=PTS-STARTPTS[q];"
              f"[p][q]acrossfade=ns={F}:c1=qsin:c2=qsin[out]")
        os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", bed_src, "-i", bed_src, "-filter_complex", fc,
                        "-map", "[out]", "-c:a", "pcm_s24le", out], check=True, stdin=subprocess.DEVNULL)
    inf = wav_info(out)
    y = decode(out, inf["channels"])
    jump = float(np.max(np.abs(y[-1] - y[0])))
    typ = float(np.percentile(np.max(np.abs(np.diff(y, axis=0)), axis=1), 99.9))
    info.update({"samples": inf["samples"], "channels": inf["channels"], "bits": inf["bits"],
                 "seamJump": round(jump, 5), "p999StepJump": round(typ, 5),
                 "rmsDb": round(db(math.sqrt(float(np.mean(y ** 2)))), 2), "peakDb": round(db(float(np.max(np.abs(y)))), 2)})
    if inf["samples"] != L:
        info["ok"] = False
        info["error"] = f"loop has {inf['samples']} samples, expected {L}"
    print(json.dumps(info))
    sys.exit(0 if info["ok"] else 1)


def cmd_info(a):
    print(json.dumps(wav_info(a[0])))


def cmd_manifest(a):
    """manifest MANIFEST.json ROOT ENTRY_JSON — upsert one clip entry (samples measured from the WAV)."""
    mpath, root, entry = a[0], a[1], json.loads(a[2])
    m = {"$comment": "Every audio clip used by the series, written by tools/gen_audio.mjs and tools/placeholder_audio.sh "
                     "(tools/gen_audio.post.py manifest). samples = exact length at sampleRate. source: elevenlabs | placeholder.",
         "sampleRate": SR, "clips": []}
    if os.path.exists(mpath):
        m = json.load(open(mpath))
    f = os.path.join(root, entry["path"])
    if os.path.exists(f):
        inf = wav_info(f)
        entry.update({"samples": inf["samples"], "sampleRate": inf["sampleRate"], "channels": inf["channels"],
                      "bits": inf["bits"], "durationS": round(inf["samples"] / inf["sampleRate"], 4)})
    m["clips"] = [c for c in m["clips"] if c.get("id") != entry["id"]] + [entry]
    m["clips"].sort(key=lambda c: c["path"])
    with open(mpath, "w") as fh:
        json.dump(m, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print(json.dumps({"ok": True, "id": entry["id"], "samples": entry.get("samples")}))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    c, rest = sys.argv[1], sys.argv[2:]
    {"clip": cmd_clip, "split-align": cmd_split_align, "split-last": cmd_split_last, "tickbed": cmd_tickbed,
     "loop": cmd_loop, "info": cmd_info, "manifest": cmd_manifest}.get(c, lambda _a: die(f"unknown command {c}"))(rest)
