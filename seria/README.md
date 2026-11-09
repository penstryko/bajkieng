# Dr. Dusty — serial animowany dla dorosłych (pionowe Shorts 9:16)

Oryginalny serial komediowy dla dorosłych w formacie pionowych Shorts (1080×1920, 30 kl./s, 64 s w pętli).
Dr. Dusty, terapeutka o kamiennej twarzy, z ekranami zamiast szkieł w okularach, przyjmuje w zapuszczonym
gabinecie pacjentów-przedmioty. Kanapa Chester i czujnik dymu Chirp komentują wszystko bez słów, a pacjent mówi
tylko „Thingish” i najwyżej jednym wyraźnym angielskim słowem. Każdy odcinek kończy się dokładnie w tym stanie,
od którego się zaczął (S0), więc na platformie zapętla się bez szwu.

Całość powstaje w kodzie: Remotion + React/SVG (bez ręcznej animacji), audio z ElevenLabs, eksport i kontrola
pętli w ffmpeg.

- **Źródło prawdy:** [`biblia_serialu.md`](biblia_serialu.md). §3 obsada, §4 generator pacjentów, §5 mapa kadru
  9:16, §6 formuła 64 s, rytuał pętli i macierz zakończeń, §7 dźwięk, §8 ziarna odcinków, §9 repo, schemat sceny
  i lint, §10 zasady treści.
- **Kontrakt techniczny dla buildów:** [`CONTRACT.md`](CONTRACT.md) (właściciele plików, współrzędne, propsy
  komponentów, enumy i schemat, silnik, pętla, ścieżki assetów).
- **Raport badawczy:** `../reports/Serial animowany Shorts dla dorosłych.md`. Sekcja „Idealną pętlę gwarantuje
  matematyka klatek i próbek” zawiera komendy eksportu i weryfikacji, na których opierają się `tools/export.sh`
  i `tools/check_loop.sh`.
- **Pilot:** S01E01 „Dr. Dusty #001: The Printer Who Said No” (biblia §8 #1, przykład §9.3). Biurowa drukarka
  słyszy radę „stawiaj granice”, odmawia drukowania („NO.”) i wylatuje wyleczona przez okno. Na koniec to Dr. Dusty
  wypluwa zacięty papier i klnie po drukarkowemu.

## Wymagania

- Node 22 i npm 10. Zależności są przypięte w `package.json`, wystarczy `npm install`.
- ffmpeg i ffprobe 6.x, Python 3 z `numpy` (narzędzia audio).
- Przeglądarka dla Remotion: lokalnie Remotion sam pobiera Chrome Headless Shell przy pierwszym renderze.
  W chmurowym sandboksie to pobieranie jest zablokowane, więc `remotion.config.ts` i `tools/qa_stills.mjs` używają
  preinstalowanej powłoki Playwright, jeśli istnieje. Własną ścieżkę wskażesz zmienną `REMOTION_BROWSER_EXECUTABLE`.
- System: macOS lub Linux. Na Windows uruchamiaj projekt w WSL2 (Ubuntu), bo skrypty w `tools/` są w bashu,
  a `public/assets` i `public/episodes` to dowiązania symboliczne.

### Uruchomienie lokalne

```bash
git clone https://github.com/penstryko/bajkieng.git
cd bajkieng && git checkout claude/festive-hamilton-f2uhee
cd seria && npm install
pip install numpy          # narzędzia audio
npm run studio             # podgląd w przeglądarce
```

Audio z ElevenLabs jest już w repozytorium (`assets/`), więc do renderu klucz nie jest potrzebny. Do generowania
nowych dźwięków ustaw `export ELEVENLABS_API_KEY=...` przed `node tools/gen_audio.mjs` (lokalnie nie ma proxy,
które wstawia klucz).
- Fonty pochodzą z npm (`@fontsource/anton`, `@fontsource/vt323`). Nic nie jest pobierane z Google Fonts.

## Uruchamianie

Wszystkie komendy wykonuj w katalogu `seria/`.

```bash
npm install
npm run studio                 # Remotion Studio (podgląd: S01E01, ModelSheetCast, ModelSheetSet …)
npm run typecheck              # tsc --noEmit
npm run lint                   # tsc + lint biblii §9.5 (17 reguł); ma dać 0 błędów; --dev: braki = ostrzeżenia
```

### Render, master audio, eksport, kontrola

```bash
# 1. klatki PNG (bezstratny master) -> out/S01E01/frames/frame_0000…1919.png
#    Cały odcinek to ok. 6 min na 4 rdzeniach. Można renderować w kawałkach, w dowolnej kolejności:
npm run render:frames -- S01E01 --frames=0-959
npm run render:frames -- S01E01 --frames=960-1919

# 2. miks audio z Remotion (48 kHz, dokładnie 3 072 000 próbek) -> out/S01E01/S01E01_mix.wav
npm run render:audio

# 3. master głośności bezpieczny dla pętli (−14 LUFS ±0,2, true peak ≤ −1,5 dBTP) -> S01E01_master.wav
#    3 kopie miksu -> wzmocnienie -> alimiter -> zostaje tylko środkowa kopia, więc limiter ma po obu stronach szwu
#    ten sam stan. Nie używaj jednoprzebiegowego loudnorm na 64 s pliku.
npm run master:audio

# 4. eksport -> S01E01_final.mp4 (1080×1920 H.264 High, AAC 48 kHz) + S01E01_preview.mp4 (540×960)
#    Eksport bierze master, jeśli jest nie starszy niż miks. GOP 15, mbtree=0, b-adapt=0 i strefy QP sprawiają,
#    że oba GOP-y S0 są kodowane identycznie.
npm run export

# 5. kontrola pętli (klatki S0, próbki, MP4, zdekodowany szew, głośność, spektrogram szwu)
npm run check                  # musi skończyć się "RESULT: PASS"

# 6. QA: pełnowymiarowe klatki-klucze + arkusz kontaktowy z wyrenderowanych klatek
npm run qa                     # -> episodes/S01E01/qa/ep_fNNNN.png + contact_sheet.png
npm run qa:stills -- S01E01 /tmp/qa 0 262 1748   # pojedyncze klatki bez pełnego renderu (jeden bundle)
npm run still -- S01E01 1748   # jedna klatka -> out/stills/
```

Polecenia działające w tle dłużej niż 10 minut dziel na kawałki (`--frames=a-b`). `render_frames.sh` sam
normalizuje nazwy plików do 4 cyfr.

## Audio z ElevenLabs

Wszystkie klipy odcinka (lektorka „Mm-hm.”, Thingish drukarki, jedno słowo „NO.”, SFX, pętla muzyki i room tone)
generuje `tools/gen_audio.mjs` przez API ElevenLabs. Prompty, dokładne długości, zanikania i budżet są w
`tools/gen_audio.catalog.json`.

```bash
# klucz: zmienna środowiskowa ELEVENLABS_API_KEY (nagłówek xi-api-key). Jeśli jej nie ma, skrypt wysyła atrapę
# "proxy-injected", którą proxy sieciowe w tym środowisku podmienia na prawdziwy klucz.
# GET https://api.elevenlabs.io/v1/user: 200 = klucz dostępny, 401 = brak klucza (skrypt kończy się kodem 3).
export ELEVENLABS_API_KEY=…                       # opcjonalnie
node tools/gen_audio.mjs S01E01 --dry-run          # plan i szacunek kosztu, bez wydawania kredytów
node tools/gen_audio.mjs S01E01                    # generuje tylko brakujące klipy (jedno ujęcie na asset)
node tools/gen_audio.mjs S01E01 --only SFX15_knocks --force   # świadoma regeneracja (znowu kosztuje)
node tools/gen_audio.mjs S01E01 --library          # także reszta biblioteki §7.2/7.3
```

- **Budżet:** `budgetCredits` w katalogu (teraz 15 000 kredytów na przebieg). Strażnik budżetu pomija
  wywołania, które przekroczyłyby limit. Każde wywołanie trafia do `ledger/elevenlabs_usage.jsonl` (szacunek,
  nagłówek Character-Cost, suma bieżąca, stan konta przed i po). Istniejące pliki z ElevenLabs nigdy nie są
  generowane ponownie bez `--force`.
- **Postprodukcja** (`tools/gen_audio.post.py`): przycięcie ciszy, dokładna długość, zanikania, normalizacja
  szczytu, pętle 64 s z przenikaniem qsin (komenda 5 z raportu), ścieżka tyknięć na siatce 12000 + k·24000 próbek
  oraz manifest `assets/audio_manifest.json` (źródło, model, prompt i liczba próbek każdego pliku).
  Surowe odpowiedzi API leżą w katalogach `_src/`, więc postprodukcję można powtórzyć bez kredytów, np.
  `python3 tools/gen_audio.post.py clip assets/sfx/_src/SFX15_knocks.wav assets/sfx/SFX15_knocks.wav --dur 1.45 --fade-out 40`.
- **Usta:** `tools/rms_envelope.py` liczy obwiednie RMS (jedna wartość na klatkę) → `*.rms.json`. Pacjent
  porusza ustami X/B/D, a Dr. Dusty zamyka usta w „Mm-”/„-hm” podczas swoich linii. Nie używamy Rhubarba
  (pobieranie binarek z GitHuba jest tu zablokowane).
- **Bez klucza:** `tools/placeholder_audio.sh` tworzy oznaczone zastępniki (manifest `"source": "placeholder"`
  i tytuł RIFF „PLACEHOLDER”) o tych samych ścieżkach i długościach. Ścisły `npm run lint` odrzuca je przy
  finalnym renderze.
- **Po zmianie audio:** `npm run render:audio && npm run master:audio && npm run export && npm run check`.

## Mapa plików

| Ścieżka | Zawartość |
|---|---|
| `biblia_serialu.md`, `bible/` | biblia serialu (źródło prawdy) i jej materiały |
| `CONTRACT.md` | kontrakt techniczny: właściciele, współrzędne, propsy, schemat, pętla, komendy |
| `src/index.ts`, `src/Root.tsx` | wejście Remotion, rejestr kompozycji |
| `src/compositions/` | `episode.tsx` (ładowanie paczki odcinka), `cast.tsx`, `set.tsx` (arkusze modeli i QA) |
| `src/Episode.tsx` | resolver: `episode.json` → stan sceny na klatkę, stos warstw §5.2, twarde nadpisanie S0 |
| `src/contract.ts`, `src/schema.ts`, `src/enums.ts` | interfejsy propsów, schemat sceny §9.2, zamknięte słowniki biblii |
| `src/series.ts` | nazwa serialu, format tytułu („Dr. Dusty #nnn: …”), hashtag |
| `src/engine/` | deterministyczne prymitywy animacji (§9.4), kamera, layout, stałe rytuału, S0 |
| `src/components/cast/` | Dr. Dusty (`Doctor.tsx`, `Glasses.tsx`), Chester, Chirp |
| `src/components/patients/` | generator pacjentów §4 (kształty, oczy, usta, zużycie, akcesoria) |
| `src/components/set/` | gabinet (pokój, okno z warstwami „na zewnątrz”, minutnik, licznik NOW SERVING) |
| `src/components/props/` | dymki, winiety wspomnień, notes, rekwizyty, cząsteczki, napis; `registry.ts` |
| `src/components/humans/` | szare, anonimowe sylwetki ludzi do winiet |
| `src/audio/EpisodeAudio.tsx` | rozmieszczenie audio: podkład (tyknięcia, room tone, muzyka z rampami), dialogi, SFX |
| `src/lint/run.ts`, `src/lint/blocklist.json` | lint biblii §9.5 (17 reguł) i lista blokad treści |
| `episodes/S01E01/episode.json` | scena pilota: ujęcia, pozy, ruch, dialogi, SFX, rekwizyty, cząsteczki, wstrząsy |
| `episodes/S01E01/patient.json` | pacjent: Office Printer (generator §4.6) |
| `episodes/S01E01/beat_sheet.md`, `notes.md` | rozpiska beatów i notatki produkcyjne |
| `episodes/S01E01/sfx/`, `episodes/S01E01/vo/` | audio odcinka (Thingish drukarki, słowo „NO.”, efekty odcinka) |
| `episodes/S01E01/qa/` | `contact_sheet.png`, klatki `ep_fNNNN.png`, test ikony `icon.png`, arkusze modeli `cast_*`, `set_*` |
| `assets/sfx/`, `assets/music/`, `assets/vo/` | biblioteka audio serialu (SFX01–20, motyw w pętli, linie MM lektorki) |
| `assets/audio_manifest.json` | pochodzenie i długość każdego pliku audio |
| `assets/notepad/doodles/`, `assets/patients/` | archiwum SVG rysunków z notesu i presety pacjentów |
| `ledger/series_ledger.json` | rejestr odcinków dla reguł 1–8 z §6.3 (rotacja zakończeń, zwycięzców, rad) |
| `ledger/elevenlabs_usage.jsonl` | dziennik kredytów ElevenLabs |
| `tools/render_frames.sh`, `render_audio.sh` | render klatek PNG i miksu WAV |
| `tools/master_audio.sh` | master głośności bezpieczny dla pętli (−14 LUFS, ≤ −1,5 dBTP) |
| `tools/export.sh` | eksport MP4 (finał i podgląd) |
| `tools/check_loop.sh` | weryfikacja pętli: klatki, S0, próbki, MP4, zdekodowany szew, głośność |
| `tools/contact_sheet.sh`, `tools/qa_stills.mjs`, `tools/still.sh` | stillsy QA i arkusz kontaktowy |
| `tools/gen_audio.mjs`, `gen_audio.catalog.json`, `gen_audio.post.py`, `rms_envelope.py`, `placeholder_audio.sh` | generowanie i postprodukcja audio |
| `public/` | dowiązania `assets` i `episodes` dla `staticFile()` |
| `out/` (poza gitem) | `S01E01/frames/`, `S01E01_mix.wav`, `S01E01_master.wav`, `S01E01_final.mp4`, `S01E01_preview.mp4`, `qa/seam.png` |

## Co jest finalne, a co zastępcze

Stan na 2026-11-08 (pilot S01E01):

**Finalne**

- Cała grafika jest rysowana w kodzie (SVG/React): obsada, gabinet, generowany pacjent, rekwizyty, dymki,
  winiety, notes i cząsteczki. Puste katalogi `assets/cast/*`, `assets/glasses`, `assets/set` i
  `assets/humans` są celowe, bo te grafiki nie istnieją jako pliki.
- Audio: wszystkie 43 klipy w manifeście mają źródło `elevenlabs` i ani jednego zastępnika. Należą do nich lektorka
  (linie MM), Thingish drukarki, słowo „NO.” (preset VP6), SFX, muzyka i room tone w pętli 64 s oraz ścieżka
  tyknięć. SFX15 (pukanie) jest przycięty do trzech uderzeń z tego samego surowego pliku, bez nowych kredytów.
- Pętla: klatki 0–5 i 1905–1919 to piksel w piksel stan S0, a audio ma dokładnie 3 072 000 próbek. Szew miksu i
  mastera jest ciągły, a zdekodowane GOP-y S0 w MP4 są identyczne (`npm run check`).
- Master: −14 LUFS, true peak ≤ −1,5 dBTP.

**Zastępcze lub uproszczone (świadomie)**

- Usta: obwiednia RMS zamiast Rhubarba (X/B/D u pacjenta, „Mm-”/„-hm” u lektorki). Przy jednym słowie na odcinek
  to wystarcza.
- Poziomy klipów: postprodukcja normalizuje szczyt (−3 dBFS), a nie głośność. Balans miksu ustawiają `gainDb`
  w `episode.json` i master. Docelowo `gen_audio.post.py` powinien normalizować głośność według kategorii
  (VO ≈ −16, uderzenia ≈ −18, ambient ≈ −26 LUFS).
- Nakładki UI platform (YouTube/TikTok/Instagram) do podglądu stref bezpiecznych z §5.3 nie są jeszcze w repo.
- Test ikony 160 px (`episodes/S01E01/qa/icon.png`, reguła R1) czeka na akceptację autora (lint 10 to zgłasza).
- Tytuł ma 39 znaków. Lint daje ostrzeżenie (zalecane 40–60), ale to akceptowany wyjątek.

## Znane ograniczenia pilota

Ten rozdział jest uzupełniany po każdym przebiegu QA. Patrz sekcja „Stan QA” niżej.
