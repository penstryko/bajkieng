# S01E01 „The Printer Who Said No” — beat sheet 64 s

**Tytuł (metadane):** Dr. Dusty #001: The Printer Who Said No (39 znaków)
**Pacjent #001:** OFFICE PRINTER (drukarka biurowa, `patient.json`, rozmiar L, kotwica (410, 1150))
**Rejestr (§6.3):** wyjście **E01** (wyleczony, przekazanie) · zwycięzca **pacjent** · kategoria `object` · rana **W05** (przepracowany 24/7) · rada **A01** (postaw granice → płotek) · zwrot **T03** (doktor „łapie” problem)
**Łańcuch przyczynowy (§6.4):** przepracowana drukarka (W05) → rada „postaw granice” (A01, płotek w notesie) → dosłownie: odmawia drukowania czegokolwiek → biurowiec za oknem tonie w kolejce wydruków → zwrot: kolejka szuka najbliższego urządzenia i znajduje doktor (T03) → kulminacja: drukarka mówi jedyne wyraźne słowo „NO.” i 99 999 stron wylatuje z doktor → DING → drukarka wychodzi wyleczona przez okno, doktor zostaje z zaciętym papierem (E01).

Specyfikacja: 1080×1920, 30 fps, N = 1920 klatek (64 s), audio 48 kHz = 3 072 000 próbek. Rytuał liczony od N (`ritual(N)`): DING = 1740, GLASSES = 1845, S0_IN = 1890, HOLD = 1905. Klatki 0–5 i 1905–1919 = wyłącznie S0 (identyczne piksele). Szablon 60 s z Raportu rozciągnięty do 64 s (+4 s w eskalacji, bloki po 23 s przesunięte o +4 s), jak w biblii §6.1.

## Tabela beatów

| Sek. | Klatki | Beat Raportu | Obraz (ujęcie) | Dźwięk (klatka startu) | Reguła |
|---|---|---|---|---|---|
| 0,0–0,2 | 0–5 | klatka startowa = końcowa | **S0** (WIDE): drukarka zawieszona w locie nad kanapą, górna krawędź y 230, 3 linie ruchu, cień 1,0 / 60 %; Chester oczy w górę, usta zaciśnięte, ugięcie 2 %; doktor neutralna, w szkłach akta pacjenta, długopis w górze; minutnik pełny; neon włączony; napis „PATIENT #001: OFFICE PRINTER” | tylko tło (tik co 0,5 s z przesunięciem 0,25 s, room tone, motyw 120 BPM) | zero SFX w 0–5 |
| 0,2–0,5 | 6–14 | — | spadek z pozycji S0 na siedzisko (tor 6–14, ease in), cień rośnie | SFX05 gwizd spadania (6) | — |
| 0,5–2,0 | 15–59 | Hook | lądowanie `heavy` (squash 0,7 → 1,15 → 1), Chester ból (zmrużone oczy, ugięcie 4 % → 3 %); drukarka „mówi” po swojemu (usta-szczelina z RMS), brwi zmartwione; doktor nie reaguje | SFX06 lądowanie (15), TALK drukarki (18, 1,5 s), MM01 „Mm-hm.” (50) | R5: sygnatura ≤ 15 klatek od lądowania |
| 2–5 | 60–149 | Stawka | dymek-wspomnienie `office_kick` (62–149): szara sylwetka kopie drukarkę (ruchome: noga, drżenie drukarki); drukarka wściekła; doktor notuje | SFX14 dymek (62), RANT drukarki (72, 2,5 s) | jedna informacja: ludzie ją kopią |
| 5–8 | 150–239 | Gag 1 (wizualny) | **GLASSES**: doktor znudzona (brwi nisko, głowa −4°), szum i w szkłach **hamburger** — myśli o lunchu | SFX11 przełączenie szkieł (153), MM02 znudzone „Mmm-hm.” (185) | gag czytelny bez dźwięku |
| 8–12 | 240–359 | Reakcja | WIDE: drukarka „przeklina” po swojemu, wypluwa zmiętą kulkę papieru, która odbija się od podkładki doktor (252–270); wstrząs 8 px; Chester zdegustowany, potem skrzypi; doktor dalej pisze, szkła wracają do akt | CURSE drukarki (248, 0,8 s), SFX07 sprężyny (262) | wulgaryzm tylko w dialogu (grawlix w dymku: integrator z klipu CURSE) |
| 12–14,5 | 360–434 | Gag 2 | **NOTEPAD**: „notatka” doktor to rysunek **drukarki z rogami** (rysowanie 15 klatek) | SFX13 kartka (360), SFX12 rysowanie (366) | puenta dla dorosłych, nie diagnoza |
| 14,5–20 | 435–599 | Komplikacja | WIDE → **BUBBLE** (480–539): drugi dymek `paper_jam_yank` (452–539) — ludzie wyrywają zacięty papier o 3 w nocy (prawdziwa rana: 24/7); → **PATIENT** (540–599): drukarka szlocha (łzy z klipu CRY), Chester smutny | SFX14 dymek (452), CRY drukarki (485, 2,5 s) | CRY bez oczu „okrągłe/gwiazdki/serduszka” w ujęciu (lint 13) |
| 20–24 | 600–719 | Gag 3 (dźwiękowy) | cięcie na WIDE dokładnie na ćwierknięcie: po szlochu cisza i **Chirp ćwierka w najgorszym momencie** (dioda, przechył); wszyscy patrzą w sufit; doktor sarkastyczna (brew w górę, półuśmiech, w szkłach przewracające się oczy); drugie, słabsze ćwierknięcie, drukarka zła; doktor zaczyna pisać | SFX10 (604), MM07 sarkastyczne (625), SFX10 −4 dB (672) | inny niż running gag (puknięcia) |
| 24–26,3 | 720–789 | Eskalacja: RADA | **NOTEPAD**: rada A01 — **płotek** (rysowanie 18 klatek) | SFX13 kartka (720), SFX12 rysowanie (726) | rysunek bez słów (adviceLabel zbędny) |
| 26,3–31 | 790–929 | Eskalacja: zastosowanie | WIDE: drukarka „łapie” radę (oczy-gwiazdki 796–819, ≤ 30 klatek), zapał; przychodzi zlecenie druku — drukarka zaciska szczelinę i odmawia (brwi ściągnięte); od 850 w oknie warstwa **office_print_queue**: ludzie walą głowami w klawiatury, nad biurowcem dymek „PRINT QUEUE: 99 999”; w szkłach doktor **plaża** (myślami na urlopie) | TALK (800, zapał), sygnał zlecenia (846), stłumiony chaos biura zza okna (856, −9 dB) | konsekwencje w oknie bez zagrożenia życia |
| 31–35 | 930–1049 | Running gag | **trzy ciężkie puknięcia właściciela** (czynsz): Chester jednym okiem na drzwi, doktor brwi w górę, kropla potu, w szkłach **$$$**; drukarka zdziwiona; po chwili wszystko wraca | SFX15 puknięcia (950), cichy blip szkieł (954) | ustanowienie gagu w pilocie |
| 35–39 | 1050–1169 | Catchphrase | **poza-werdykt**: doktor zsuwa okulary o 40 px (widać oczy-kropki), brew w górę, „Mm-hm.” i klik długopisu; okulary wracają, w szkłach akta | MM15 werdykt (1060), SFX04 klik (1098) | nigdy jako plansza |
| 39–40 | 1170–1199 | Zwrot (cisza) | 0,5 s ciszy: muzyka gaśnie (duck −30 dB, 1168–1186), tik zostaje; z płaskich ust doktor zaczyna wysuwać się pasek papieru (1188–1318) — twarz bez zmian | „czknięcie” podajnika papieru z doktor (1186) | moment „wyślij to szefowi” |
| 40–42 | 1200–1259 | Zwrot (T03) | **GLASSES**: w szkłach szum i ikona **zaciętego papieru** — kłamie twarzą, nie szkłami | SFX11 (1206) | zasada świata 6 |
| 42–51 | 1260–1529 | Przygotowanie puenty | WIDE: drukarce ulżyło (brwi w górę); Chester zerka jednym okiem na doktor; doktor czka drugi raz — wylatuje pojedyncza kartka (1338–1386); doktor przerażona po cichu (brwi wysoko), w szkłach **spinner** (przetwarza zlecenie), potem **ERROR** i pot | czknięcie (1336), MM13 przerażone, szeptem „…mm-hm?” (1384) | ironia dramatyczna: widz widzi, dokąd trafi kolejka |
| 51–52 | 1530–1554 | Kulminacja (zapłon) | biuro odsyła ogromne zlecenie — drukarka ściąga brwi | sygnał zlecenia (1532) | — |
| 52–53 | 1555–1589 | Kulminacja: słowo | **PATIENT**: drukarka mówi jedyne wyraźne słowo „**NO.**” (VP6, płasko i ostatecznie); wstrząs 14 px | „NO.” (1562) | lint 11: 1 słowo, voicePreset VP6 |
| 53–58 | 1590–1739 | Kulminacja: pełna skala | WIDE: kolejka 99 999 stron wybucha z doktor (cząsteczki papieru z ust, 1590–1736) i wpada przez okno (1600–1736); doktor `terrified` (syrena w szkłach, „O”, pot); Chester panika, wyskakuje sprężyna; drukarka szczęśliwa (gwiazdki 1610–1635) | szaleńczy wydruk z doktor (1590, 4 s), SFX07 sprężyny (1598) | bez krwi i gore, papier zamiast wybuchu |
| 58,0–61,5 | 1740–1844 | Puenta z powodem resetu | **DING** — sesja skończona; doktor wypluwa zacięty papier (harmonijka, 1746–1844) z dźwiękiem przekleństwa drukarki; drukarka **wychodzi wyleczona przez okno** (tor 1760–1830 do (540, 500), skala 1 → 0,25, warstwa 1 od 1795) — E01: problem przejęła doktor; Chester ulga, potem zadowolony z siebie; w szkłach doktor **płaska linia** | SFX02 DING (1740), CURSE drukarki z ust doktor (1746, −3 dB), EXIT drukarki (1756), fanfara „Cured!” (1768, −7 dB) | puenta kończy się 2,5 s przed szwem |
| 61,5–63,0 | 1845–1889 | Powrót, część 1 | **GLASSES**: doktor już opanowana (brwi, usta, okulary jak w S0, długopis w górze); klik → minutnik sam się nakręca (poza kadrem); ściereczka przeciera szkła (szkła gasną, 1858); blip: ikona akt następnego pacjenta (1884). Za cięciem plan ogólny wraca do S0: okno spokojne, papier znika | SFX04 (1846), SFX03 nakręcanie (1852, −3 dB), SFX20 ściereczka (1858, −6 dB), SFX11 blip (1884, koniec 63,08 s) | ostatni efekt kończy się ≤ 63,1 s |
| 63,0–63,5 | 1890–1904 | Powrót, część 2 | **WIDE**, plan czysty: drukarka wpada z góry kadru do pozycji S0 (tor 1890–1904, ease out) i zawisa; Chester oczy w górę, zaciśnięte usta, ugięcie 2 %; napis wskakuje (1890–1898) | brak SFX | nic w ostatnich 200 ms poza tłem |
| 63,5–64,0 | 1905–1919 | Domknięcie | **S0**, poza zatrzymana 15 klatek (identyczne piksele z klatką 0) | tylko tło | 21 klatek S0 = ten sam md5 |

Gagi padają co 3–7 s (hook 1,7 s → gag 1 → kulminacja przekleństwa → notatka → płacz → Chirp → rada → okno → właściciel → werdykt → zwrot → słowo → burza papieru → DING).

## Ujęcia

| Klatki | Ujęcie | Po co |
|---|---|---|
| 0–149 | WIDE | S0, spadek, hook, pierwszy dymek |
| 150–239 | GLASSES | Gag 1 (hamburger) |
| 240–359 | WIDE | reakcja, przekleństwo, kulka papieru |
| 360–434 | NOTEPAD | Gag 2 (drukarka z rogami) |
| 435–479 | WIDE | drugi dymek się pojawia |
| 480–539 | BUBBLE (1,6×) | winieta 3 w nocy |
| 540–599 | PATIENT (1,9×) | płacz |
| 600–719 | WIDE | Gag 3 (Chirp), doktor pisze |
| 720–789 | NOTEPAD | rada A01 (płotek) |
| 790–1199 | WIDE | zastosowanie, okno, właściciel, werdykt, cisza |
| 1200–1259 | GLASSES | zwrot T03 (zacięty papier w szkłach) |
| 1260–1554 | WIDE | przygotowanie puenty |
| 1555–1589 | PATIENT | „NO.” |
| 1590–1844 | WIDE | burza papieru, DING, wyjście, tag |
| 1845–1889 | GLASSES | rytuał resetu |
| 1890–1919 | WIDE | powrót do S0 |

WIDE = 1380 / 1920 klatek (72 %; biblia: 65–75 %).

## Audio

- **Tło (przez szew):** `SFX01_tick_bed64.wav` (128 tyknięć w próbkach 12 000 + k·24 000), `SFX18_roomtone_loop64.wav` i `theme_loop64.wav` (po 3 072 000 próbek, crossfade qsin 100 ms ogon → głowa, polecenie 5 Raportu; mocne części taktu na 0,25 s + 2k s). Jedyna zmiana głośności tła: duck muzyki 1168–1186 (zwrot).
- **Głosy:** doktor MM01, MM02, MM07, MM15, MM13 (biblioteka §7.3, głos z Voice Design); pacjent: TALK ×2, RANT, CURSE, CRY, EXIT (Thingish, ElevenLabs Sound Effects) i jedno słowo „NO.” (VP6). Usta pacjenta: obwiednia RMS (`*.rms.json`, X/B/D).
- **Efekty:** 30 zdarzeń, pierwsze w klatce 6, ostatnie (SFX11) kończy się 63,08 s. Nic nie brzmi w ostatnich 200 ms.
- Pełna lista z klatkami: `episode.json` (`dialogue`, `sfx`); pliki, długości w próbkach, prompty: `assets/audio_manifest.json`.

## Potrzeby wobec integratora (nie da się ich zapisać w `episode.json` według §9.2)

- grawlix w dymku mowy przy klipie CURSE (248–272) i dymek ze słowem „NO.” (1562–1580) — z `dialogue` (klip `soundLanguage.curse`, pole `text`);
- łzy przy klipie CRY (485–560);
- usta doktor „hum” przy jej liniach (opcjonalnie z `assets/vo/doctor/MMxx.rms.json`);
- duck muzyki (`bed.musicDucks`, rozszerzenie schematu — zaimplementowane w `EpisodeAudio.tsx`).
