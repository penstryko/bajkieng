# S01E01 — notatki autora (decyzje i redakcja)

> Ten plik jest dowodem ludzkiego wkładu (biblia §6.4, §6.6 krok 2, §10 „inauthentic content”).
> Sekcje oznaczone **[DO DECYZJI AUTORA]** wypełnia autor. Claude zapisał tylko propozycje i stan techniczny.

## 1. Losowanie (`roll_seed`) i wybór

`tools/roll_seed.ts` jeszcze nie istnieje. Pilot bierze zalążek §8 #1 wprost z biblii:

| Opcja | Pacjent | Rana | Rada | Zwrot | Wyjście | Zwycięzca |
|---|---|---|---|---|---|---|
| A (wybrana wstępnie, biblia §8 #1 / §9.3) | Office Printer | W05 przepracowany 24/7 | A01 postaw granice | T03 doktor łapie problem | E01 | pacjent |
| B (alternatywa) | Office Printer | W06 pamiętany tylko, gdy zawodzi | A05 naucz się mówić „nie” | T05 konsekwencje wchodzą przez okno | E10 | pacjent |
| C (alternatywa) | Office Printer | W02 obwiniany o wszystko | A07 wyraź gniew | T14 radę stosuje ktoś inny, w oknie | E02 | nikt |

- **[DO DECYZJI AUTORA]** Zatwierdzam opcję: ____ (data, podpis).
- **[DO DECYZJI AUTORA]** Moje zmiany w zalążku / beat sheecie: ____

## 2. Decyzje, które Claude podjął za autora (do zatwierdzenia lub zmiany)

1. **Gag 3 = Chirp** (ćwierka po szlochu, drugi raz słabiej). Running gag = **puknięcia właściciela** (ustanowienie w pilocie). Zwrot T03 nie koliduje z regułą 8 rejestru.
2. **Gag 1 = hamburger** w szkłach (biblia §9.3). Inne ikony szkieł w odcinku: przewracające się oczy (sarkazm), plaża (obojętność wobec chaosu w oknie), $$$ (puknięcia = czynsz), zacięty papier (zwrot), spinner i ERROR (doktor „przetwarza” kolejkę), syrena (kulminacja), płaska linia (tag), wyłączone szkła (ściereczka).
3. **Notatka-puenta (Gag 2) = drukarka z rogami**; rada = płotek. Rysunek `dollar_circle` jest w bibliotece, niewykorzystany.
4. **Kulka papieru** wypluta podczas przekleństwa (rekwizyt `paper_ball`) — dodatkowy wizualny akcent reakcji.
5. **Zwrot (T03):** pasek papieru wysuwa się z płaskich ust doktor; twarz bez zmian, prawdę mówią szkła.
6. **Kulminacja:** jedyne słowo pacjenta „NO.” w ujęciu PATIENT, potem burza papieru z doktor i przez okno (zamiast samego `particles` przy drukarce z §9.3 — logiczniej, bo drukarka odmawia drukowania).
7. **Wyjście E01 przez okno** (tor z §9.3) + fanfara „Cured!” (cue z §7.4, wygenerowane jako Sound Effects).
8. **Reset:** twarz doktor wraca do S0 już w klatce 1846 (opanowanie w zbliżeniu GLASSES), szkła gasną przy ściereczce (1858), ikona akt w 1884.
9. **Nowy SFX20 „ściereczka”** do rytuału resetu (biblia §6.1 wymienia ściereczkę, ale §7.2 nie ma dźwięku) — dopisać do §7.2, jeśli zostaje.
10. **Duck muzyki** 1168–1186 (−30 dB) na „0,5 s ciszy” przed zwrotem — wymaga rozszerzenia schematu `bed.musicDucks`.

- **[DO DECYZJI AUTORA]** Odrzucam / zmieniam punkty: ____

## 3. Głosy i model (karta głosu)

- **Doktor:** Voice Design (`eleven_ttv_v3`, guidance 35, seed 1001), prompt i tekst podglądu dosłownie z §3.1, zapisany głos `LZirsF5GBfgWydOjub6v` („seria doctor (therapist) - Voice Design”). Biblioteka MM01–MM15 nagrana **dwoma żądaniami** (płaskie: stability 0,5 „Natural”; ekspresyjne: 0,0 „Creative”) na `eleven_v3`, cięta po znacznikach czasu znaków. Jedno podejście na żądanie (budżet).
  - **[DO DECYZJI AUTORA]** Odsłuchać MM01–MM15 (`assets/vo/doctor/`), w razie potrzeby wygenerować ponownie (`node tools/gen_audio.mjs --force doctor_flat,MM01,...`). Test A/B v3 vs v4 (§3.1) jeszcze nie zrobiony.
  - Transkrypcja kontrolna (ElevenLabs STT) rozpoznała MM01/MM07/MM13/MM15 jako mruknięcia, bez słów.
- **Drukarka „NO.” (VP6):** na koncie zostało 0 wolnych slotów głosów po zapisaniu doktor, więc VP6 nie jest zapisany: słowo wycięte z podglądu Voice Design (ostatnia fraza po pauzie). STT potwierdza „No”. Jeśli VP6 ma wracać w kolejnych odcinkach, zwolnić slot i zapisać głos (`generatedVoiceId` w `vo/patient/voice_vp6.json`).
- **Thingish drukarki:** 5 klipów SFX (`eleven_text_to_sound_v3`) według szablonu §4.4 (TALK i CURSE dosłownie z biblii; TALK skrócony do 1,5 s pod hook).
- **[DO DECYZJI AUTORA]** Akceptuję brzmienie: TALK / RANT / CRY / CURSE / EXIT / NO.: ____

## 4. Kontrola jakości przed publikacją (biblia §6.6 krok 10)

- [ ] Test ikony 160 px (`qa/icon.png`, R1) — zaakceptowany przez autora.
- [ ] Odsłuch miksu w pętli (`out/S01E01/S01E01_mix.wav`, spektrogram szwu `out/S01E01/qa/seam.png`).
- [ ] Brand check każdego kadru (drukarka generyczna, bez logo i trade dress).
- [ ] Test na telefonie w trzech aplikacjach (strefy UI §5.3).
- [ ] Wynik Checks w YouTube Studio.
- [ ] Głośność: miks ma ok. −19 LUFS / −1,9 dBFS szczytu; ewentualna normalizacja do ok. −14 LUFS dopiero z limiterem przy eksporcie.

## 5. Metadane (propozycja)

- Tytuł: `Dr. Dusty #001: The Printer Who Said No` (39 znaków; < 40 daje tylko ostrzeżenie lint 7)
- Hashtagi: `#DrDusty #adultanimation #animation`
- Opis: „Adult animated satire. Not a real doctor. Not real advice.”
- **[DO DECYZJI AUTORA]** Ostateczny tytuł i opis: ____
