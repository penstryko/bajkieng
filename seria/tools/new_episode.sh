#!/usr/bin/env bash
# Start a new episode from the previous one (cheaper than writing episode.json from scratch).
# Usage: tools/new_episode.sh S01E02 "Monday Wants to Be Liked" [FROM=S01E01]   (npm run new-episode -- …)
# Copies episode.json + patient.json, sets id / patientNo / title, writes notes.md, registers the
# composition in src/series.ts (EPISODES). Then edit episode.json (shots, poses, dialogue, sfx) and
# iterate with: npm run lint -- S01E02 --dev && npm run preview -- S01E02
set -euo pipefail
cd "$(dirname "$0")/.."
EP="${1:?usage: new_episode.sh S01E02 \"Title\" [FROM]}"; TITLE="${2:?title}"; FROM="${3:-S01E01}"
[[ "$EP" =~ ^S[0-9]{2}E[0-9]{2}$ ]] || { echo "bad id $EP"; exit 1; }
[[ -e "episodes/$EP" ]] && { echo "episodes/$EP already exists"; exit 1; }
mkdir -p "episodes/$EP/qa" "episodes/$EP/sfx" "episodes/$EP/vo"
cp "episodes/$FROM/episode.json" "episodes/$FROM/patient.json" "episodes/$EP/"
python3 - "$EP" "$TITLE" <<'PY'
import json, sys, re, pathlib
ep, title = sys.argv[1], sys.argv[2]
p = pathlib.Path(f"episodes/{ep}/episode.json"); d = json.loads(p.read_text())
no = int(ep[-2:])
d["id"], d["patientNo"] = ep, no
d["title"] = f"Dr. Dusty #{no:03d}: {title}"
p.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
s = pathlib.Path("src/series.ts"); t = s.read_text()
t = re.sub(r'EPISODES: string\[\] = \[([^\]]*)\]', lambda m: f'EPISODES: string[] = [{m.group(1)}, "{ep}"]', t)
s.write_text(t)
pathlib.Path(f"episodes/{ep}/notes.md").write_text(
    f"# {ep} — {title}\n\n## Decyzje autora (dowód autorstwa, polityka inauthentic content)\n- \n\n"
    "## Wynik (różny od poprzednich odcinków)\n- \n")
PY
echo "new episode: episodes/$EP (from $FROM). Next: edit episode.json, npm run lint -- $EP --dev, npm run preview -- $EP"
