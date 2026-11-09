# Dr. Dusty: zasady pracy w trybie oszczędnym

Serial animowany dla dorosłych: pionowe Shorts 9:16, 1080×1920, 30 fps, 64 s (1920 klatek), idealna pętla
(klatka 0 = ostatnia klatka). Stała obsada: terapeutka Dr. Dusty, kanapa Chester, czujnik dymu Chirp.
Co odcinek nowy pacjent (przedmiot, postać albo istota). Silnik: Remotion + lalki SVG, dźwięk z ElevenLabs.

- Biblia: `biblia_serialu.md` (ok. 1300 linii). **Nie czytaj całej.** Szukaj sekcji: `grep -n '^##' biblia_serialu.md`, potem `sed -n 'od,dop'`.
- Kontrakt kodu i warstw: `CONTRACT.md`. Typy sceny: `src/schema.ts`. Czytaj tylko potrzebny fragment.
- Wzorzec odcinka: `episodes/S01E01/` (`episode.json`, `patient.json`, `beat_sheet.md`).

## Styl scenariusza (decyzja Karola, 9.11.2026)
- Jeden żart na odcinek, 6 scen, zwykłe zdania, które rozumie nowy widz.
- Terapeutka mówi 3–4 krótkie kwestie po angielsku („Tell me everything.”, „Mm-hm. …”, „Time's up.”). Pacjent mówi prostym angielskim. Napisy na ekranie.
- Bez pobocznych gagów (Chirp, właściciel, ikony w okularach) do mniej więcej 5. odcinka.
- Powrót na kanapę (pętla) ma za każdym razem inny powód, a wynik odcinka różni się od poprzednich (polityka YouTube „inauthentic content”).
- Do zrobienia przed S01E02: biblia §2–3 i lint (reguła 11: „1 angielskie słowo pacjenta”, „doktor tylko Mm-hm”) jeszcze opisują stary styl.

## Limit Claude: twarde zasady
1. **Jedna sesja, jeden przebieg.** Bez subagentów i workflowów, chyba że Karol o nie poprosi.
2. **Najpierw scenariusz** jako tabela 6 scen (czas, co widać, kto co mówi) do akceptacji Karola. Produkcja dopiero po akceptacji. Poprawki scenariusza są tanie, poprawki po renderze drogie.
3. **Nowy odcinek z szablonu:** `npm run new-episode -- S01E02 "Title"`. Edytuj tylko `episodes/<EP>/episode.json` i `patient.json` (generator części, sekcja 4 biblii). Nowy komponent albo rekwizyt w kodzie tylko wtedy, gdy scenariusz go wymaga, najwyżej jeden na odcinek.
4. **Czytanie:** nie otwieraj w całości dużych plików (biblia, `src/schema.ts`, `episode.json` S01E01, logi). Używaj `grep`, `sed -n`, `tail`.
5. **Podgląd zamiast renderu:** `npm run preview -- <EP>` renderuje tylko ok. 20 kluczowych klatek (ok. 20 s) i składa je w **jeden obraz** `out/<EP>/preview_sheet.png`. Oglądaj tylko ten obraz. Najwyżej 3 iteracje.
6. **Pełny render raz, na końcu,** potem `npm run qc -- <EP>`: kilka linii tekstu (lint, pętla, próbki audio, głośność, czarne i zamrożone klatki) i **jeden obraz** `out/<EP>/qc_sheet.png`. Nie otwieraj pojedynczych klatek ani MP4. Gdy kafelek wygląda źle: `python3 tools/qc_sheet.py <EP> --crop <klatka>` (jedno małe zbliżenie).
7. **Audio:** `node tools/gen_audio.mjs <EP> --dry-run`, potem bez `--dry-run`. Jedno podejście na klip, tylko brakujące klipy; efekty, room tone, motyw i „Mm-hm” są w bibliotece wielokrotnego użytku. Lokalnie klucz w zmiennej `ELEVENLABS_API_KEY`.
8. **Commit raz, na końcu odcinka.** Filmy (`out/`) nie trafiają do gita.
9. Claude nie słyszy dźwięku: na koniec wypisz Karolowi, które kwestie odsłuchać.

## Komendy (z katalogu `seria/`)
```bash
npm run new-episode -- S01E02 "Monday Wants to Be Liked"   # szablon odcinka z poprzedniego
npm run lint -- S01E02 --dev                                # reguły scenariusza i JSON (--dev: brak audio = ostrzeżenie)
npm run preview -- S01E02                                   # 20 klatek -> out/S01E02/preview_sheet.png
node tools/gen_audio.mjs S01E02 --dry-run                   # plan i koszt ElevenLabs, bez wydawania kredytów
npm run render:frames -- S01E02 --frames=0-959              # pełny render w 2 częściach
npm run render:frames -- S01E02 --frames=960-1919
npm run render:audio -- S01E02 && npm run master:audio -- S01E02 && npm run export -- S01E02
npm run qc -- S01E02                                        # wynik + out/S01E02/qc_sheet.png
```
