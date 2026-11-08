# Perfekcyjna pętla w pionowych odcinkach 60–120 s: technika (narracja, montaż, ffmpeg, audio) i metryki platform (stan na 2026-11-08)

Notatki badawcze. Data sprawdzenia: 2026-11-08. Komendy ffmpeg oznaczone **[TEST LOKALNY]** zostały uruchomione w tej sesji na ffmpeg 6.1.1 (Ubuntu) na syntetycznym materiale testowym. Wyniki podaję liczbowo. Pliki testowe były w katalogu tymczasowym i nie są częścią repozytorium. Definicje filtrów: [FFmpeg Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html), opcje muxera MP4: [FFmpeg Formats Documentation](https://ffmpeg.org/ffmpeg-formats.html).

Najważniejsze zmiany z lat 2025–2026, które warto zaznaczyć w raporcie:
- **YouTube, 31.03.2025**: „wyświetlenie” Shorta liczy się przy każdym starcie lub replayu (pętli). Stara metryka to teraz „engaged views”.
- **YouTube, 24.08.2026**: liczenie „od pierwszej klatki” objęło też long-form i live.
- **YouTube, od 01.02.2027**: nowi kandydaci do YPP potrzebują 20 mln kwalifikowanych wyświetleń Shorts w 90 dni. Dodatkowo do udziału w Creator Pool trzeba stale utrzymywać 10 mln kwalifikowanych wyświetleń Shorts w kroczącym oknie 90 dni.
- **Instagram, styczeń 2025**: Reelsy mogą trwać do 3 min.
- **CapCut**: regulamin z 15.04.2026, stroną umowy dla użytkowników z USA jest TikTok USDS Joint Venture LLC.

---

## A) Techniki narracyjne i montażowe pętli (sentence loop, pętla wizualna, planowanie puenty)

### Takeaway
Pętlę projektuje się od końca. Ostatnie zdanie ma gramatycznie przechodzić w pierwsze („sentence loop”), a ostatni stan obrazu ma płynnie przechodzić w pierwszy. Najlepiej udokumentowanym przykładem skuteczności jest Jake Fellman, który według vidIQ dostał 15 mln wyświetleń w 48 h na zapętlonym Shorcie. vidIQ pokazuje też wartości „average percentage viewed” powyżej 100% (np. 187,1%). Obie liczby pochodzą jednak z ery przed zmianą liczenia wyświetleń z 2025 r. Nie znalazłem twardych, niezależnych danych z lat 2025–2026.

### Cited Findings
- vidIQ opisuje pętlę wizualną tak: końcowe ujęcie ma pasować do otwierającego, a szew ukrywa się dopasowanymi kadrami. Akcja ma trwać tylko tyle, ile trzeba, by wrócić do punktu startu. Zakończenie należy planować jako pierwsze, zgodnie z YouTube 2021 Shorts Report. Audio ma czysto przechodzić przez szew, a jeśli cięcie przeszkadza, lepiej usunąć dźwięk. Artykuł opublikowano 11.05.2021, zrecenzowano 18.09.2026 — [vidIQ: How to Loop YouTube Shorts for More Watch Time](https://vidiq.com/blog/post/double-youtube-watch-time-looping-shorts/)
- Ten sam artykuł podaje „percentage viewed” 96,8% (styczeń 2021) i 187,1% (kwiecień 2021). Przykład twórcy: Jake Fellman (3D Minecraft, „Minecraft RTX 24% Arrowhead Loop”), cytat: „It did 15 million views in 48 hours”, przy typowych 3–4 mln w 48 h — [vidIQ](https://vidiq.com/blog/post/double-youtube-watch-time-looping-shorts/)
- vidIQ zastrzega, że pętla nie gwarantuje podwojenia watch time, a replaye nie liczą się jako engaged views, bo te wykluczają pętle — [vidIQ](https://vidiq.com/blog/post/double-youtube-watch-time-looping-shorts/)
- Technika sentence loop według Fei Wu (Feisworld, 23.03.2023):
  - kończyć w pół zdania lub zdaniem podrzędnym („But if you really wanna know…”, „when I was younger,”);
  - pisać scenariusz z myślą o zakończeniu, tak by miał sens po zamianie początku z końcem;
  - unikać fraz zamykających („that's it”, „thanks for watching”), bo dają sygnał do przesunięcia.

  Autorka zaleca też Shorty poniżej 30 s, ale to porada sprzed 3-minutowych Shortsów — [Feisworld: How to SCRIPT and Loop YouTube Shorts](https://www.feisworld.com/blog/how-to-script-and-loop-youtube-shorts)
- Średni procent obejrzenia powyżej 100% oznacza, że widzowie oglądają ponownie lub pozwalają Shortowi się zapętlić. Przy dobrze ukrytym szwie widz ogląda 2–3 s następnej pętli, zanim zauważy, że film się skończył. To praktyczne poradniki twórców, a nie dokumentacja YouTube — [subscribr.ai](https://subscribr.ai/youtube-strategy/youtube-shorts-low-watch-time-boost); [faceless.so: Viewed vs Swiped Away, Retention, Replays](https://faceless.so/blog/youtube-shorts-analytics-a-complete-guide)
- W YouTube Analytics „Average view duration” liczy się z engaged views i odpowiadającego im czasu oglądania — [YouTube Help: audience retention](https://support.google.com/youtube/answer/9314415). Jeśli engaged views wykluczają pętle (zob. D1), to replaye zwiększają licznik w czasie oglądania, a nie w mianowniku. Stąd wartości powyżej 100%. To wnioskowanie, oficjalny wzór nie jest opublikowany.

### Inferences
- **Planowanie w scenariuszu**:
  1. Zapisz najpierw ostatnie 2–3 s i pierwsze 2–3 s jako jeden ciągły „beat szwu”.
  2. Puenta ma wybrzmieć 1–3 s przed końcem.
  3. Ostatnie 1–2 s to „domknięcie ruchu” (powrót kamery lub pozy), które wizualnie i dźwiękowo jest już początkiem odcinka.
  4. Ostatnia kwestia dialogu urywa się na spójniku lub dopełnieniu, które pierwsza kwestia gramatycznie kończy (np. koniec: „…i dlatego nigdy nie…” → start: „…ufam gołębiom.”).
  5. Sprawdź, czy pierwsze zdanie ma sens dla nowego widza bez kontekstu. Hook nie może zależeć od końcówki.
- **Storyboard**: dodaj kolumnę „stan na klatce 0” (poza postaci, pozycja i ogniskowa kamery, oświetlenie, muzyka: takt i tonacja). Ostatni panel musi wracać dokładnie do tych wartości. W serii każdy odcinek może mieć własną pozę startową, ale reset musi być domknięty w obrębie odcinka.
- **Typowe narzędzia pętli wizualnej**:
  - match cut (kształt lub ruch),
  - kamera wracająca do pozycji startowej (dolly/pan po okręgu),
  - postać wracająca do pozy startowej,
  - ruch ciągły przez cięcie (obiekt wylatuje z kadru na końcu i wlatuje na początku),
  - powtarzalne tło (cykl dnia, wiatrak, zegar o okresie równym długości odcinka).
- **Pułapki**:
  - zbyt oczywisty reset (widz „czuje się oszukany”, gdy fabuła resetuje się bez powodu): pętla powinna być nagrodą, np. ukrytym żartem przy drugim obejrzeniu, a nie trikiem;
  - hook zależny od końcówki;
  - puenta przecięta szwem;
  - frazy pożegnalne;
  - plansza końcowa lub CTA, które łamie pętlę.

  W serialu dla dorosłych dobrze działa pętla jako „running gag” (np. bohater zawsze wraca do tej samej absurdalnej sytuacji).
- **Kluczowa konsekwencja techniczna wymogu „ostatnia klatka = pierwsza klatka”**: przy odtwarzaniu w pętli ta sama klatka pojawi się dwa razy z rzędu (ostatnia, potem pierwsza). Daje to mikrozatrzymanie o długości 2 klatek (66,7 ms przy 30 fps). W teście lokalnym hash framemd5 pierwszej i ostatniej klatki mastera był identyczny, więc duplikat jest pewny. Są dwa wyjścia:
  - (a) zaprojektować szew na **zatrzymanej pozie** (hold ≥4–6 klatek na końcu i na początku), żeby duplikat był niewidoczny;
  - (b) jeśli ruch ma płynąć przez szew bez zatrzymania, renderować z okresem animacji = N klatek, tak by klatka N (nierenderowana) była równa klatce 0. Wtedy jednak ostatnia klatka pliku nie jest identyczna z pierwszą.

  Wariant (b) narusza literę wymogu, więc trzeba go omówić z autorem. Wariant (a) spełnia wymóg i jest bezpieczniejszy także wobec niepewności odtwarzaczy platform (zob. B1).

### Gaps
- Nie znalazłem niezależnych, aktualnych (2025–2026) danych ilościowych, że pętle podnoszą zasięg lub rekomendacje. Dane vidIQ są z 2021 r., a wypowiedzi Fellmana anegdotyczne.
- Nie znalazłem źródeł o reakcji widzów na „zbyt oczywistą pętlę” („feeling cheated”). To wniosek redakcyjny.
- Brak zweryfikowanych przykładów kanałów animowanych dla dorosłych opartych na pętli. Jedynym udokumentowanym przykładem jest Jake Fellman (3D/Minecraft).

---

## B1) ffmpeg: weryfikacja klatek, CFR, długość co do próbki, kodeki, AAC priming i edit listy, eksport

### Takeaway
Zgodność pierwszej i ostatniej klatki weryfikuj **na bezstratnym masterze** (framemd5 identyczne, PSNR = inf). Po kompresji H.264 klatki nie będą bitowo identyczne: w teście PSNR wyniosło około 59,8 dB, a SSIM 0,997. Pętle po stronie audio psuje głównie dopełnienie AAC (padding) na końcu: ffmpeg dekodował 144 384 próbki zamiast 144 000, z czego 8 ms ciszy na końcu. Rozwiązanie: długość odcinka w klatkach będąca **wielokrotnością 16 przy 30 fps i 48 kHz**, czyli liczba próbek podzielna przez 1024. Przy 30 fps spełnia to każda długość będąca wielokrotnością 8 s: 64, 72, 80, 88, 96, 104, 112, 120 s. YouTube zaleca w uploadzie „No Edit Lists”, a ffmpeg domyślnie je zapisuje. Trzeba świadomie wybrać wariant (opis niżej).

### Cited Findings
- **Oficjalne zalecenia YouTube dla uploadu**:
  - kontener MP4, atom moov na początku pliku (fast start), **„No Edit Lists”**, bo inaczej wideo może zostać źle przetworzone;
  - audio AAC-LC, Opus lub Eclipsa Audio, 48 kHz, stereo;
  - H.264 High profile, progresywnie, 2 kolejne B-klatki, CABAC, 4:2:0;
  - zamknięty GOP o długości połowy liczby klatek na sekundę;
  - zmienny bitrate bez wymaganego limitu;
  - liczba klatek na sekundę taka jak przy nagraniu;
  - 1080p SDR: 8 Mb/s przy 24/25/30 fps i 12 Mb/s przy 48/50/60 fps.

  — [YouTube Help: Recommended upload encoding settings](https://support.google.com/youtube/answer/1722171)
- **AAC priming**:
  - Apple przyjmuje domyślnie 2112 próbek primingu i 0 próbek reszty. Wartość 2112 była typowym opóźnieniem większości ówczesnych enkoderów AAC — [Apple TN2258: AAC Audio – Encoder Delay and Synchronization](https://developer.apple.com/library/mac/technotes/tn2258/_index.html);
  - opóźnienie enkodera można sygnalizować jawnie atomem edit list (elst) i strukturami sample group — [Apple QuickTime File Format, Appendix G: Audio Priming](https://developer.apple.com/documentation/quicktime-file-format/appendix_g_audio_priming_handling_encoder_delay_in_aac.md);
  - wbudowany enkoder AAC w ffmpeg ma opóźnienie 1024 próbek, FDK-AAC zwykle 2048 — [AAC.js wiki: EncoderDelay](https://github.com/uupaa/AAC.js/wiki/EncoderDelay). To źródło wtórne, ale zgodne z testem lokalnym poniżej (pierwszy pakiet ma pts = −1024).
- **Pętla audio**: przerwa zwykle bierze się z paddingu enkodera (formaty stratne dodają ciszę na początku i końcu) albo z punktu pętli, który nie jest dokładny co do próbki. Trzaski powstają przy niedopasowaniu amplitudy lub nachylenia fali na szwie. Pętlę trzeba testować w docelowym odtwarzaczu — [bugnet.io: how to fix music that doesn't loop cleanly](https://bugnet.io/blog/how-to-fix-music-that-doesnt-loop-cleanly)
- Na forum Adobe są zgłoszenia, że wideo z Premiere nie zapętla się płynnie i że winne bywa skompresowane audio. Usunięcie ścieżki audio usuwało szew — [Adobe Community: video not looping seamlessly after export from Premiere](https://community.adobe.com/questions-729/video-not-looping-seamlessly-after-export-from-premiere-1335045)
- **[TEST LOKALNY] Wyniki** (master 90 klatek przy 30 fps, audio 144 000 próbek przy 48 kHz):
  - **Domyślny mux ffmpeg (z edit listami)**: wideo i audio start_time 0, czas trwania dokładnie 3,000 s, w pliku 2 atomy `elst`. Dekodowanie przez ffmpeg dało jednak **144 384 próbki**: początkowy priming został obcięty, końcowy padding 384 próbek już nie. RMS tych 384 próbek wyniósł 0,0003 przy 0,167 w treści, czyli 8 ms ciszy na końcu.
  - **`-use_editlist 0`** (B-klatki włączone): start_time wideo 0,0667 s (offset kompozycji 2 B-klatek), audio 3,0667 s i 145 408 próbek. Priming nie został obcięty, więc audio jest opóźnione o 1024 próbki, czyli 21,3 ms.
  - **`-use_editlist 0 -movflags +negative_cts_offsets`**: wideo zaczyna się od 0 mimo B-klatek. Audio nadal zawiera priming (czas trwania 3,0213 s).
  - **Długość wyrównana do 1024** (96 klatek = 3,2 s = 153 600 próbek = 150 × 1024): dekodowanie dało **dokładnie 153 600 próbek**, bez paddingu na końcu.
  - **Pierwsza i ostatnia klatka**: master FFV1 dał PSNR = inf i identyczny framemd5. Plik H.264 CRF 18 dał PSNR średnio 59,76 dB i SSIM 0,9974, czyli wizualnie identyczne, bitowo nie.
  - **Symulacja pętli przez `ffmpeg -stream_loop 1`** (ponowny seek i dekodowanie AAC): na szwie pojawiła się cisza około 9 ms nawet w pliku wyrównanym do 1024, a w pliku niewyrównanym około 17 ms. Na początku pierwszej iteracji takiej ciszy nie było. Wniosek: `-stream_loop` **nie nadaje się** do oceny płynności pętli, a każdy odtwarzacz, który zapętla przez seek i ponowne dekodowanie, może wprowadzić podobną mikroprzerwę.

### Procedury ffmpeg (sprawdzone w teście lokalnym, ffmpeg 6.1.1)

**1. Liczba klatek i fps (CFR)**
```bash
ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames,r_frame_rate,avg_frame_rate -of compact master.mov
```

**2. Pierwsza i ostatnia klatka do PNG**
```bash
ffmpeg -i master.mov -vf "select=eq(n\,0)" -frames:v 1 first.png
N=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 master.mov)
ffmpeg -i master.mov -vf "select=eq(n\,$((N-1)))" -frames:v 1 last.png
# Szybsza alternatywa dla ostatniej klatki:
ffmpeg -sseof -0.5 -i master.mov -update 1 -frames:v 999 last.png
```

**3. Test identyczności**
```bash
# a) hash każdej klatki: pierwsza i ostatnia linia muszą mieć ten sam MD5 (tylko master bezstratny!)
ffmpeg -v error -i master.mov -f framemd5 - | grep -v '^#' | awk -F, 'NR==1{f=$NF} {l=$NF} END{print (f==l?"IDENTYCZNE":"RÓŻNE"), f, l}'
# b) PSNR/SSIM (master: oczekiwane "inf"; plik H.264: ~55-60 dB i SSIM >0,99 to norma)
ffmpeg -i first.png -i last.png -lavfi "[0:v][1:v]psnr" -f null -
ffmpeg -i first.png -i last.png -lavfi "[0:v][1:v]ssim" -f null -
```

**4. Wymuszenie CFR i dokładnej liczby klatek**
```bash
-fps_mode cfr -r 30 -frames:v 2880
```
`-fps_mode` zastąpiło starsze `-vsync`.

**5. Dokładna długość audio co do próbki**
Pomiń `-shortest`, który działa na poziomie przeplotu pakietów. Zamiast tego obetnij i dopełnij audio jawnie:
```bash
-af "atrim=end_sample=4608000,apad=whole_len=4608000"
```
Przykład: 96 s × 48 000 = 4 608 000 = 4500 × 1024.

**6. Normalizacja głośności, dwa przebiegi** (w teście: I = −14,0 LUFS, liczba próbek zachowana)
```bash
# przebieg 1: pomiar
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -
# przebieg 2: wpisz zmierzone input_i, input_tp, input_lra, input_thresh, target_offset
ffmpeg -i mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=X:measured_TP=X:measured_LRA=X:measured_thresh=X:offset=X:linear=true" \
  -ar 48000 -c:a pcm_s24le mix_norm.wav
```
loudnorm wewnętrznie upsampluje, więc `-ar 48000` jest konieczne.

**7. Finalny eksport jednego pliku dla YT Shorts, TikToka i Reels** (sprawdzony: 90 klatek, wideo i audio po 3,000 s, High@4.2, 30/1)
```bash
ffmpeg -i master.mov -i mix_norm.wav -map 0:v:0 -map 1:a:0 \
  -c:v libx264 -preset slow -profile:v high -level:v 4.2 -pix_fmt yuv420p \
  -fps_mode cfr -r 30 -crf 18 -maxrate 12M -bufsize 24M \
  -g 15 -keyint_min 15 -sc_threshold 0 -bf 2 \
  -af "atrim=end_sample=4608000,apad=whole_len=4608000" \
  -c:a aac -b:a 320k -ar 48000 -ac 2 \
  -frames:v 2880 -movflags +faststart \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  odcinek_1080x1920.mp4
```
Master powinien mieć 1080×1920. Jeśli nie ma, dodaj `-vf scale=1080:1920:flags=lanczos`.

**8. Wariant zgodny z zaleceniem YouTube „No Edit Lists”**
```bash
-use_editlist 0 -movflags +faststart+negative_cts_offsets
```
Wideo zaczyna się od 0, ale audio ma 1024 próbki primingu, czyli jest 21 ms dłuższe i opóźnione. Opóźnienie 21 ms jest niesłyszalne dla synchronizacji ust, ale wydłuża ścieżkę audio względem wideo.

**9. Weryfikacja szwu bez `-stream_loop`**
Zdekoduj raz do WAV, sklej dwie kopie i odsłuchaj lub obejrzyj okolice szwu:
```bash
ffmpeg -i odcinek.mp4 -map 0:a -c:a pcm_s24le dec.wav
ffmpeg -i dec.wav -i dec.wav -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" seam.wav
ffmpeg -ss 95.5 -t 1 -i seam.wav -lavfi showspectrumpic=s=1024x512 seam.png
# obraz w pętli:
ffplay -loop 0 odcinek.mp4
```

### Inferences
- **fps**: wybieraj 30 lub 60 fps (całkowite), nie 29,97. Przy 48 kHz daje to 1600 lub 800 próbek na klatkę, więc długość jest jednocześnie dokładna co do klatki i co do próbki. Przy 29,97 fps klatka ma 1601,6 próbki.
- **Długości odcinków bez paddingu AAC** (30 fps, 48 kHz): liczba klatek podzielna przez 16. Przy 60 fps: przez 32. Wynikają z tego długości 64/72/80/88/96/104/112/120 s, każda wielokrotność 8 s. Dokładne 60 s (1800 klatek) **nie** spełnia warunku. Najbliższe poprawne to 1808 klatek (60,27 s), a ze względu na wymóg TikToka „co najmniej 1 minuta” bezpieczniej jest użyć 64 s lub więcej.
- **Edit listy**: domyślny mux ffmpeg (z edit listami) to jedyny sposób na dokładny co do próbki start A/V w MP4 z AAC. YouTube jednak zaleca „No Edit Lists”. Proponowana procedura: przygotuj oba warianty (domyślny i z pkt 8), wgraj prywatnie lub jako niepubliczne, sprawdź synchronizację i szew w aplikacji mobilnej każdej platformy i wybierz wariant, który brzmi lepiej. Wyrównanie do 1024 próbek usuwa padding końcowy w obu wariantach.
- **Platformy i tak transkodują audio i wideo.** Własny priming i padding enkodera platformy oraz sposób zapętlania odtwarzacza (seek i ponowne dekodowanie czy pętla na zbuforowanych danych) są poza kontrolą twórcy. Test `-stream_loop` pokazał, że naiwny loop przez seek daje około 9–17 ms ciszy. Dlatego zalecam „strefę bezpieczeństwa szwu”: około 100–200 ms przed i po szwie bez twardych transjentów i bez sylaby przeciętej szwem, ciągłe tło (room tone lub muzyka) z crossfadem oraz zatrzymana poza w obrazie. Wtedy ewentualna mikroprzerwa lub zdublowana klatka są niezauważalne.
- **GOP i keyframe na klatce 0**: x264 zawsze zaczyna od IDR. `-g 15 -sc_threshold 0` daje stały, zamknięty GOP zgodny z zaleceniem YouTube (połowa fps). Nie wpływa to na identyczność klatek, bo po kompresji i tak nie będą bitowo równe.

### Gaps
- Brak oficjalnej dokumentacji YouTube, TikToka i Instagrama o tym, jak ich odtwarzacze zapętlają klipy (czy na szwie jest przerwa lub zacięcie) i czy honorują edit listy z uploadu. Nie znalazłem też wiarygodnych pomiarów stron trzecich.
- Nie pobrałem oficjalnych specyfikacji uploadu TikToka ani Instagrama (rozdzielczość, bitrate). Powyższe ustawienia opierają się na zaleceniach YouTube jako najbardziej rygorystycznych.
- Nie zweryfikowano, czy YouTube faktycznie źle przetwarza pliki ffmpeg z edit listami, które kompensują wyłącznie priming AAC. Zalecenie „No Edit Lists” jest ogólne.

---

## B2) Edytory GUI: DaVinci Resolve, Premiere Pro, CapCut (w tym regulamin i dostępność w USA)

### Takeaway
We wszystkich trzech programach procedura wygląda podobnie:
1. Ustaw projekt na 1080×1920 i 30 fps (CFR).
2. Wyeksportuj pierwszą klatkę jako still albo zrób frame hold i postaw ją na końcu osi.
3. Zastosuj crossfade audio „constant power” na ciągłym tle przy szwie.
4. Wyeksportuj z dokładną liczbą klatek i sprawdź wynik w ffmpeg (B1).

CapCut ma od 15.04.2026 regulamin, w którym stroną umowy dla USA jest TikTok USDS Joint Venture LLC. Licencja na treści użytkownika jest bardzo szeroka (wieczysta, przenoszalna, sublicencjonowalna).

### Cited Findings
- **DaVinci Resolve**: menu Retime Controls → Freeze Frame służy do zatrzymania i wznowienia w obrębie klipu, a Clip → Freeze Frame zamraża cały klip. To źródło wtórne, oficjalnego manuala nie pobrałem — [ChatCut: how to freeze frame a video](https://chatcut.io/blog/how-to-freeze-frame-a-video)
- **Premiere Pro**:
  - podstawowa metoda: playhead na wybranej klatce, PPM na klipie → Add Frame Hold — [Joseph Nilo: guide to freeze frames in Premiere Pro](https://josephnilo.com/blog/the-ultimate-guide-to-freeze-frames-in-adobe-premiere-pro/);
  - zgłoszenie ze stycznia 2026, że Add Frame Hold nie działa w Premiere Pro 2026 — [Adobe Community bug report](https://community.adobe.com/bug-reports-728/add-frame-hold-on-premiere-pro-2026-does-not-work-1547100);
  - zgłoszenie z wersji 23.2/Mac: komenda działała dopiero z kursorem na początku klipu — [Adobe Community](https://community.adobe.com/t5/premiere-pro-discussions/premier-pro-2020-cannot-use-add-frame-hold/m-p/11994775).
- **CapCut, regulamin**:
  - „Last updated: April 15, 2026”; dla USA stroną jest TikTok USDS Joint Venture LLC;
  - licencja na User Content: „unconditional, non-exclusive, royalty-free, fully transferable, sub-licensable, perpetual and worldwide”, w celu „operating, developing and providing the Services”;
  - licencja na nazwę użytkownika, wizerunek i podobiznę, także „for use in sponsored content”;
  - zrzeczenie się praw do wizerunku (publicity) w zakresie dozwolonym prawem;
  - regulamin nie wspomina wprost o trenowaniu AI;
  - stwierdza „We don't own your User Content”.

  — [CapCut Terms of Service](https://www.capcut.com/clause/terms-of-service)
- Wtórne źródła opisują aktualizację regulaminu CapCut z czerwca 2025 jako dodanie szerokiej, wieczystej licencji. Część komentatorów uważa, że nie zmieniła ona istoty wcześniejszych praw, tylko je doprecyzowała — [Studio L7 (Substack)](https://studiol7.substack.com/p/who-really-owns-your-edits-what-capcuts); [Payhip/Flutter Creative Studio](https://payhip.com/FlutterCreativeStudio/blog/archive/what-every-creator-should-know-about-capcut-s-2025-terms-update)
- **Dostępność CapCut w USA** (źródła sprzeczne):
  - VEED, konkurent, pisze o blokadzie od stycznia 2025 i niepewnej dostępności — [VEED CapCut review](https://www.veed.io/learn/capcut-review);
  - poradnik samego CapCut (sierpień 2026) podaje, że 10.08.2026 strony w App Store i Google Play dla USA działały — [CapCut resource (US guide)](https://www.capcut.com/resource/capcut-product-image-to-video-ads-guide);
  - przewodnik deweloperski wspomina status „available, still under PAFACA review” w kwietniu 2026 — [DEV Community](https://dev.to/jondavis/capcut-in-2026-a-developers-guide-to-the-ban-status-data-risks-and-migration-paths-16pj).

### Procedury (kroki według praktyki, menu do weryfikacji w posiadanej wersji)

**DaVinci Resolve 19/20 (wersja darmowa)**
1. File → Project Settings → Master Settings:
   - Timeline resolution: Custom 1080×1920;
   - Timeline frame rate: 30 (nie 29,97);
   - Playback frame rate: 30.
   - Częstotliwość timeline'u ustaw **przed** dodaniem klipów, bo później jest zablokowana.
2. Pierwsza klatka na końcu: zaparkuj playhead na klatce 0 klipu, PPM w podglądzie → Grab Still (galeria) albo „Export Frame”. Wstaw still lub freeze frame (Retime Controls → Freeze Frame) na końcu osi z długością 1 klatki lub więcej.
3. Długość osi ustaw dokładnie na N klatek: w polu timecode wpisz wartość i ustaw znaczniki In/Out (I/O), np. 00:01:36:00 = 2880 klatek.
4. Fairlight: na ciągłym tle (room tone lub muzyka) przy szwie użyj crossfade między końcem a początkiem warstwy tła. W Fairlight transition domyślnie jest „cross fade” z wyborem krzywej. Dialogi: krótkie fade in/out na klipach (uchwyty fade, 5–20 ms).
5. Deliver: Custom, MP4, H.264, 1080×1920, 30 fps, Quality „Restrict to” około 12 000 kb/s, Audio AAC 48 kHz 320 kb/s. Render „Entire timeline” albo In/Out.
6. Weryfikacja ffmpeg z B1.

**Premiere Pro (2025/2026)**
1. Sequence → Sequence Settings: 1080×1920, 30 fps, audio 48 kHz.
2. Frame hold: playhead na klatce 0 → PPM → Add Frame Hold (albo Insert Frame Hold Segment) i skopiuj zatrzymaną klatkę na koniec. Alternatywa: File → Export → Frame (Ctrl+Shift+E) do PNG i import jako still o długości 1 klatki.
3. Morph Cut (Video Transitions → Dissolve → Morph Cut) przydaje się do maskowania drobnych niedopasowań przy gadających głowach. Przy animacji generowanej w kodzie lepiej mieć identyczną klatkę.
4. Audio: Effects → Audio Transitions → Crossfade → Constant Power (domyślne przejście, skrót Ctrl+Shift+D) na tle przy szwie. Na dialogu wystarczą krótkie przejścia 5–20 ms.
5. Export: H.264, Match Source lub 1080×1920, 30 fps, VBR 2-pass, target 10, max 12 Mb/s, AAC 48 kHz 320 kb/s. Ustaw In/Out na dokładne N klatek.

**CapCut (desktop/mobile)**
1. Proporcje 9:16, klatek na sekundę 30.
2. Zaznacz klip na klatce 0 → „Freeze”. Powstaje stopklatka, którą przenosisz lub kopiujesz na koniec i skracasz do potrzebnej długości.
3. „Reverse” daje pętlę ping-pong: ruch tam i z powrotem wraca do startu.
4. Unikaj przejść (transitions) na szwie, bo nie da się ich zapętlić.
5. Eksport: 1080p, 30 fps, bitrate „Higher” lub „Recommended”, codec H.264, format MP4.

### Inferences
- Przy pipeline'ie AI i kodu (Remotion, ffmpeg) edytory GUI są potrzebne głównie do miksu i korekty. Najpewniej jest wyrenderować master w kodzie z gwarantowaną identycznością klatek (B3), a pętlę i długość sprawdzić w ffmpeg.
- CapCut: ze względu na szeroką, wieczystą i sublicencjonowalną licencję oraz wykorzystanie wizerunku „in sponsored content” lepiej nie wgrywać do CapCut niepublikowanych odcinków ani materiałów z IP serialu, w tym kluczowych assetów postaci. Dostępność w USA jest niepewna regulacyjnie (PAFACA). Dla twórcy niezależnego, który chroni IP, bezpieczniejsze są Resolve, Premiere lub ffmpeg.

### Gaps
- Nie pobrałem oficjalnych manuali Blackmagic (Resolve 20) ani Adobe Help (Frame Hold, Morph Cut, Constant Power). Nazwy menu podaję z praktyki i źródeł wtórnych, trzeba je sprawdzić w posiadanej wersji.
- Nie znalazłem oficjalnych ustawień eksportu CapCut ani dokumentu, że CapCut koryguje priming AAC lub zapisuje edit listy.

---

## B3) Pipeline programistyczny (Remotion / Motion Canvas / After Effects): stan klatki N = stan klatki 0

### Takeaway
W renderingu programistycznym pętlę gwarantuje matematyka. Każdy animowany parametr ma być funkcją okresową czasu. Okres równy N−1 klatek daje identyczną pierwszą i ostatnią klatkę (wymóg twórcy, potwierdzony testem framemd5). Okres równy N daje bezszwowy ruch bez duplikatu, ale ostatnia klatka nie jest wtedy identyczna z pierwszą.

### Cited Findings
- **Remotion `<Loop>`**:
  - props: `durationInFrames` (długość jednej iteracji), `times` (domyślnie `Infinity`), `layout` (`"absolute-fill"` | `"none"`);
  - `Loop.useLoop()` zwraca `durationInFrames` i `iteration`;
  - wiele komponentów ma prop `loop`.

  — [Remotion docs: `<Loop>`](https://www.remotion.dev/docs/loop)
- **[TEST LOKALNY]** Animacja `x = 100 + 80·cos(2π·n/(N−1))` dla N = 90 dała identyczny framemd5 klatki 0 i 89 (master FFV1):
  ```bash
  ffmpeg -f lavfi -i "color=c=navy:s=270x480:r=30:d=3" -f lavfi -i "color=c=yellow:s=60x60:r=30:d=3" \
    -filter_complex "[0][1]overlay=x='100+80*cos(2*PI*n/(90-1))':y=200" -frames:v 90 -c:v ffv1 master.mkv
  ```
  Uwaga: `drawbox` nie obsługuje zmiennej `n`, dlatego użyto `overlay`. Do testu wybrano `cos` zamiast `sin`, bo `cos(2π) = 1` dokładnie w double. `sin(2π)` daje −2,4e-16, co po obcięciu do piksela może przesunąć obiekt o 1 px.

### Inferences
- **Remotion, wzorzec**: `const frame = useCurrentFrame(); const {durationInFrames: N} = useVideoConfig();`
  - wariant ścisły (pierwsza = ostatnia klatka): `const p = frame / (N - 1);`
  - wariant płynny: `const p = frame / N;`

  Każdy parametr wyrażaj przez `Math.cos(2*Math.PI*p)` / `Math.sin(...)`, ewentualnie z `Math.round`. Do ruchu „tam i z powrotem” użyj `interpolate(p, [0, 0.5, 1], [a, b, a])` (Remotion `interpolate` z extrapolate clamp). Dla sekwencji ujęć dopilnuj, by ostatnia `<Sequence>` kończyła się stanem identycznym z pierwszą (te same props). Losowość, np. drgania czy cząsteczki, opieraj na `random(seed)` z Remotion i fazie zależnej od `p`, a nie na `Math.random()`.
- **Motion Canvas**: animacje są generatorami. Na końcu sceny dodaj `yield* all(node.position(start, t), node.rotation(0, t), …)`, czyli tween powrotny do wartości z klatki 0. Wartości startowe trzymaj w jednym obiekcie `initialState` i używaj go na początku i na końcu. Długość ustaw tak, by całkowita liczba klatek była podzielna przez 16 (B1).
- **After Effects**: wyrażenie `loopOut("cycle")` na właściwościach z keyframe'ami. Pierwszy i ostatni keyframe muszą mieć identyczne wartości. Dla losowych wiggli użyj pętli wiggle z interpolacją między `wiggle(f,a,1,0.5,t)` i `wiggle(f,a,1,0.5,t-loopTime)`. To znany wzorzec, w tej sesji niezweryfikowany źródłowo.
- **Materiał AI (generowane wideo)**: modele wideo rzadko trafiają w identyczną klatkę końcową. Bezpieczniej jest:
  - (a) generować z „first frame = last frame” (keyframe conditioning, jeśli model to wspiera);
  - (b) zakończyć ujęcie cięciem do statycznej pozy wyrenderowanej w kodzie, identycznej z klatką 0;
  - (c) zrobić 6–12-klatkowy crossfade obrazu do klatki 0 na zatrzymanej pozie.

### Gaps
- Nie pobrałem dokumentacji Motion Canvas ani Adobe Expression Reference. Wzorce dla tych narzędzi pochodzą z wiedzy ogólnej.
- Nie zweryfikowano, które modele wideo AI (stan na listopad 2026) wspierają warunkowanie ostatniej klatki.

---

## C) Audio: zero-crossing, krótkie fade'y, crossfade tła przez szew, muzyka ElevenLabs

### Takeaway
Trzask na szwie pętli to skok amplitudy między ostatnią a pierwszą próbką. Najpewniejsza metoda to **tło (room tone lub muzyka) zrobione jako pętla z crossfadem constant-power „ogon → głowa”**. W teście skok na szwie spadł z 0,0488 (5,5 × maksymalny normalny krok, czyli trzask) do 0,00076 przy zachowaniu dokładnie 144 000 próbek. Dialogi i efekty dostają mikro-fade'y 5–20 ms. ElevenLabs ma opcję bezszwowej pętli tylko dla Sound Effects. Dla Music API opcji pętli nie udokumentowano, więc muzykę trzeba ciąć na granicach taktów i zapętlać samodzielnie.

### Cited Findings
- Na szwie muszą się zgadzać amplituda i nachylenie fali. Punkt pętli musi być dokładny co do próbki, inaczej powstaje przerwa lub nakładka. Padding formatów stratnych dodaje ciszę — [bugnet.io](https://bugnet.io/blog/how-to-fix-music-that-doesnt-loop-cleanly)
- **ElevenLabs Sound Effects**:
  - opis pętli: „Designed for seamless repeat playback — no audible start or end point”;
  - czas generacji 0,1–30 s;
  - format: „MP3 for all effects; WAV at 48 kHz for non-looping effects”, więc pętle są tylko w MP3;
  - model `eleven_text_to_sound_v2` jest przestarzały i zostanie usunięty 1.03.2027, następcą jest `eleven_text_to_sound_v3`.

  — [ElevenLabs docs: Sound effects](https://elevenlabs.io/docs/overview/capabilities/sound-effects)
- **ElevenLabs Music**:
  - długość od 3 s do 5 min; MP3 44,1 kHz 128–192 kb/s oraz WAV;
  - composition plans i komponowanie sekcja po sekcji (v2/v2.5), inpainting sekcji;
  - brak dokumentacji opcji pętli, BPM i stemów;
  - „cleared for nearly all commercial uses”.

  — [ElevenLabs docs: Music](https://elevenlabs.io/docs/overview/capabilities/music)
- Third-party API (Magnific) opisuje parametr `loop` (boolean) dla SFX z innym zakresem długości (0,5–22 s), niezgodnym z oficjalnym — [Magnific API reference](https://docs.magnific.com/api-reference/sound-effects/overview.md)
- **[TEST LOKALNY] Recepta „pętla tła” w ffmpeg** (L = długość odcinka w próbkach, F = długość crossfadu, np. 4800 = 100 ms; źródło musi mieć co najmniej L+F próbek):
  ```bash
  L=4608000; F=4800   # 96 s @48 kHz, crossfade 100 ms
  ffmpeg -i bed_src.wav -i bed_src.wav -filter_complex \
  "[0:a]atrim=start_sample=$F:end_sample=$((L+F)),asetpts=PTS-STARTPTS[p];\
   [1:a]atrim=end_sample=$F,asetpts=PTS-STARTPTS[q];\
   [p][q]acrossfade=ns=$F:c1=qsin:c2=qsin[out]" -map "[out]" -c:a pcm_s24le bed_loop.wav
  ```
  Mechanizm: plik zaczyna się od próbki F źródła, a kończy crossfadem, w którym wybrzmiewa naturalna kontynuacja (próbki L…L+F) i wchodzi początek źródła (0…F). Ostatnia próbka przechodzi więc płynnie w pierwszą. `qsin` + `qsin` daje crossfade równej mocy (constant power). Wynik testu: długość dokładnie L, skok na szwie 0,00076 przy naiwnym cięciu 0,0488. Wcześniejsza próba z `asplit` + `amix=duration=first` dała błędny wynik (1024 próbki), więc rekomenduję wariant z dwoma wejściami i `acrossfade`.
- **[TEST LOKALNY]** Dwuprzebiegowy `loudnorm` z `linear=true` i `-ar 48000` zachował dokładnie 144 000 próbek. Pomiar ebur128 po normalizacji: I = −14,0 LUFS.

### Inferences
- **Architektura miksu dla pętli**: 3 stemy.
  - **Tło** (room tone, ambience, muzyka) leci ciągle przez cały odcinek i jest zrobione jako pętla (recepta wyżej). Na nim ukrywa się każdy szew.
  - **Dialog**: sentence loop. Ostatnie słowo przed szwem i pierwsze po nim mają naturalną mikropauzę 40–120 ms (oddech), by nie ciąć sylaby. Na krawędziach klipów dialogu fade 5–10 ms: `afade=t=in:d=0.008` oraz `afade=t=out:st=<koniec−0.008>:d=0.008`.
  - **SFX**: żaden efekt nie przechodzi przez szew. Wyjątek to efekt celowo „rozcięty”: ogon na końcu pliku, początek na początku, z sumą dokładnie odtwarzającą efekt. Robi się to tą samą techniką rotacji co tło.
- **Zero-crossing**: przy cięciu ręcznym w Audacity/DAW użyj funkcji przyciągania do przejść przez zero (w Audacity: Select → At Zero Crossings, skrót Z). Przy stereo zero w obu kanałach rzadko wypada w tej samej próbce, dlatego mikro-fade 5–20 ms jest pewniejszy niż samo zero-crossing.
- **Muzyka z ElevenLabs Music**: w prompcie podaj tempo, np. „120 BPM, 4/4, loopable, consistent energy, no ending/outro”. Potem:
  1. Przekonwertuj na 48 kHz: `-af aresample=48000:resampler=soxr`.
  2. Utnij na granicy taktów. Przy 120 BPM takt 4/4 = 2,0 s = 60 klatek @30 fps = 96 000 próbek. Odcinek 96 s = 48 taktów = 2880 klatek = 4 608 000 próbek = 4500 × 1024, więc wszystko jest wyrównane naraz. Podobnie 64 s = 32 takty i 80 s = 40 taktów.
  3. Zastosuj crossfade 50–200 ms z recepty.

  Uwaga: AI może dryfować z tempem, więc granice taktów sprawdź na siatce, np. funkcją beat detection w DAW. Jeśli tempo dryfuje, wydłuż crossfade lub wybierz fragment o stabilnym tempie. Jeśli ElevenLabs nie trzyma tonacji na końcu, użyj inpaintingu sekcji końcowej (dostępny w v2) lub dogeneruj „outro = intro”.
- **SFX z ElevenLabs w pętli** (np. deszcz, szum miasta): opcja looping (MP3) zamiast WAV 48 kHz. MP3 też ma swój padding (opóźnienie enkodera), więc przed użyciem zdekoduj, przytnij i ponownie zapętl recepta `acrossfade`.
- **Normalizacja**: miks końcowy około −14 LUFS integrated, true peak ≤ −1,5 dBTP, zawsze **po** zbudowaniu pętli. Po normalizacji sprawdź jeszcze raz liczbę próbek i szew.

### Gaps
- Brak oficjalnej informacji, czy ElevenLabs Music API ma (stan na listopad 2026) parametr pętli, BPM lub stemów. Dokumentacja tego nie wymienia.
- Nie znalazłem oficjalnych źródeł o normalizacji głośności na TikToku i Instagramie ani aktualnego oficjalnego potwierdzenia celu −14 LUFS dla YouTube. −14 LUFS to powszechna praktyka, w tej sesji nieźródłowana oficjalnie.

---

## D1) YouTube Shorts: jak pętle liczą się do wyświetleń, retencji i monetyzacji (aktualne zasady)

### Takeaway
Od 31.03.2025 publiczne „views” Shorts liczą każde rozpoczęcie i replay (pętlę), bez minimalnego czasu. Od 24.08.2026 tę samą zasadę stosuje się do long-form i live. Monetyzację i YPP liczy się jednak z **engaged views** (zarobki) oraz **qualified views** (kwalifikacja do YPP). Engaged views według kilku źródeł **wykluczają pętle**. Pętle podbijają więc publiczny licznik i czas oglądania (APV może przekroczyć 100%), ale prawdopodobnie nie przychód. Od 01.02.2027 próg wejścia do YPP ścieżką Shorts rośnie do 20 mln qualified Shorts views w 90 dni, a do udziału w Creator Pool trzeba stale utrzymywać 10 mln w kroczącym oknie 90 dni.

### Cited Findings
- **Zmiana z 31.03.2025**: wyświetlenie Shorta liczy się za każdym razem, gdy Short zaczyna się odtwarzać lub odtwarza ponownie, bez minimalnego czasu oglądania. Stara metryka zostaje jako „engaged views” w trybie Advanced. Zmiana nie wpływa na zarobki ani kwalifikację do YPP — [TechCrunch, 26.03.2025](https://techcrunch.com/2025/03/26/youtube-is-changing-how-youtube-shorts-views-are-counted); [PPC Land](https://ppc.land/youtube-changes-how-shorts-views-are-counted-from-march-31/)
- **Zmiana z 24.08.2026** (ogłoszona 17.08.2026 w poście TeamYouTube w Help Community): „Beginning on 8/24/2026, a view will be counted the moment a video begins to play - from the very first frame”, dla Shorts, VOD i live — [YouTube Help Community thread](https://support.google.com/youtube/thread/433409976?hl=en); [PPC Land](https://ppc.land/youtube-counts-views-from-the-first-frame-across-all-formats-on-august-24/)
- **Strona pomocy YouTube** potwierdza, że od 24.08.2026 widok liczy się od startu odtwarzania we wszystkich formatach. Zarobki YPP opierają się na „engaged views” i „engaged watch hours”, a kwalifikacja do YPP na „qualified views”. „This update won't impact your YouTube Partner Program (YPP) earnings or eligibility” — [YouTube Help: How engagement metrics are counted](https://support.google.com/youtube/answer/2991785)
- **Blog YouTube (19.08.2026)**: view liczy się „from the very first frame”. Engaged view to „clicking to watch or watching past the initial seconds”, czyli dawna definicja wyświetlenia. Artykuł nie mówi o pętlach — [YouTube Official Blog: Engaged views explained](https://blog.youtube/inside-youtube/engaged-views-youtube-explained/)
- **Pętle a engaged views**:
  - według PPC Land glosariusz Help Center definiuje engaged views dla Shorts jako wyświetlenia trwające dłużej niż pierwsze sekundy, **z wyłączeniem pętli**, a dla long-form engaged views = views — [PPC Land](https://ppc.land/youtube-counts-views-from-the-first-frame-across-all-formats-on-august-24/);
  - to samo („YouTube excludes loops from this metric”) podaje [Creator Essentials glossary](https://www.creatoressentials.com/glossary/shorts-engaged-views/) oraz [vidIQ](https://vidiq.com/blog/post/double-youtube-watch-time-looping-shorts/) („replays don't count as engaged views, which exclude loops”);
  - samego wpisu glosariusza YouTube nie udało się pobrać.
- **YPP (strona oficjalna, bez daty aktualizacji)**: ścieżka Shorts to 1000 subskrybentów i 10 mln **„qualified Shorts views”** w ostatnich 90 dniach. Definicja: „Qualified views from Shorts you've set public that appear in the Shorts Feed”. Strona zapowiada zmiany YPP od 1.02.2027 i akceptację nowych warunków do 31.01.2027 — [YouTube Help: YPP overview and eligibility](https://support.google.com/youtube/answer/72851)
- **Zmiany od 01.02.2027** (ogłoszone 10.08.2026):
  - nowi kandydaci: 20 mln qualified Shorts views w 90 dni (wcześniej 10 mln) albo 8000 qualified watch hours w 365 dni (wcześniej 4000), plus 1000 subskrybentów;
  - obecni członkowie nie podlegają nowym progom wejścia;
  - **wszyscy**: do udziału w Creator Pool trzeba utrzymać 10 mln qualified Shorts views w kroczącym oknie 90 dni, sprawdzane co miesiąc. Spadek poniżej progu wstrzymuje tylko przychód z puli Shorts za dany miesiąc, bez wyrzucenia z YPP;
  - pulę dzieli się według udziału w engaged views w danym kraju.

  — [PPC Land, 12.08.2026](https://ppc.land/youtube-cuts-shorts-pay-for-channels-under-10m-views-from-february-2027/); [Shacknews](https://www.shacknews.com/article/150324/youtube-partner-program-minimum-qualified-public-watch-hours-shorts-views); [Hypebeast](https://hypebeast.com/2026/8/youtube-partner-program-doubles-watch-hours-for-2027)

  Uwaga: źródła różnią się co do tego, czy próg 10 mln dla puli dotyczy też obecnych członków — [OutlierKit](https://outlierkit.com/resources/youtube-partner-program-changes-2027/) twierdzi, że tak, [Switcher Studio](https://www.switcherstudio.com/whats-new/youtube-partner-program-changes-2027), że obecni zachowują status.
- **Podział przychodu Shorts**: Creator Pool dzieli się „based on engaged views and music usage”, z wykorzystaniem „eligible engaged views”. Twórca zachowuje 45% swojej alokacji. Muzyka zmniejsza pulę: 1 utwór → połowa przychodu z danego Shorta trafia do partnerów muzycznych — [YouTube Help: Shorts monetization policies / revenue sharing](https://support.google.com/youtube/answer/12504220); [PPC Land](https://ppc.land/youtube-cuts-shorts-pay-for-channels-under-10m-views-from-february-2027/)
- **Długość**:
  - Shorts do 3 min dla filmów kwadratowych i pionowych wgranych od 15.10.2024 (dla Official Artist Channels od 8.12.2025);
  - **Short dłuższy niż 1 min z aktywnym roszczeniem Content ID dowolnego typu jest globalnie blokowany** („not playable or recommended”) i nie jest monetyzowany;
  - strona nie wspomina o innym traktowaniu Shortsów powyżej 60 s w rekomendacjach.

  — [YouTube Help: Understand three-minute YouTube Shorts](https://support.google.com/youtube/answer/15424877?hl=en)
- Według relacji wtórnych szef Shorts mówi, że nie ma „najlepszej długości” i trzeba dobrać tyle, ile wymaga historia — [OutlierKit: Shorts algorithm in YouTube's words](https://outlierkit.com/resources/youtube-shorts-algorithm/)
- **„Viewed vs. swiped away”** to procent wyświetleń Shorta w feedzie, przy których widz został, wobec przewinięcia (Studio → Analytics → Content → Shorts). YouTube nie publikuje progów — [Creator Essentials: Viewed vs. Swiped Away](https://www.creatoressentials.com/glossary/viewed-vs-swiped-away/). Źródło wtórne, definicji z Help Center nie znalazłem.
- Jedno źródło (pojedyncze) podaje, że od 1.10.2026 rekomendacje Shorts faworyzują treści oryginalne i ograniczają reuploady — [wynik wyszukiwania: vidiq / outlierkit, 2026](https://outlierkit.com/resources/youtube-shorts-algorithm/). **Niepotwierdzone.**

### Inferences
- **Dla serialu w pętli**:
  - pętle zwiększają publiczny licznik views, bo każdy replay to wyświetlenie;
  - zwiększają też czas oglądania i APV, który przy dobrej pętli może przekroczyć 100%. Prawdopodobnie jest to pozytywny sygnał satysfakcji, ale YouTube nie publikuje wagi tego sygnału;
  - **nie zwiększają engaged views** ani przychodu z Creator Pool i najpewniej nie przybliżają do progów YPP. „Qualified views” nie są zdefiniowane względem pętli, ale opierają się na Shorts Feed i logice engaged.
- **Od 1.02.2027 monetyzacja Shorts dla małego kanału jest praktycznie nieosiągalna**: 20 mln w 90 dni na wejście i 10 mln w 90 dni na utrzymanie puli. Odcinki 60–120 s lepiej traktować jako lejek do long-form (np. kompilacje odcinków), membership lub sprzedaży. Pętla jest narzędziem retencji i zasięgu, nie przychodu.
- **Content ID**: odcinki powyżej 1 min muszą być w 100% wolne od roszczeń. Muzyka ElevenLabs („cleared for nearly all commercial uses”) jest odpowiednia, ale nie rejestruj jej w Content ID przez dystrybutorów i nie używaj bibliotek, które bywają claimowane. Jeden claim oznacza globalną blokadę odcinka.
- **Liczby w Studio**: APV powyżej 100% i krzywa retencji z „górką” na początku (replay) to oznaki, że pętla działa. Porównuj views i engaged views. Duża różnica (views ≫ engaged) oznacza dużo pętli albo dużo krótkich startów w feedzie. Interpretuj razem z „viewed vs swiped away”.

### Gaps
- Nie udało się pobrać oficjalnego wpisu glosariusza YouTube, który mówi, że engaged views „wykluczają pętle”. Potwierdzają to PPC Land, vidIQ i Creator Essentials, ale nie strona Google.
- Brak oficjalnej definicji „qualified views” względem pętli i replayów.
- Brak oficjalnego potwierdzenia, czy próg 10 mln dla Creator Pool od 2027 dotyczy wszystkich członków YPP (źródła sprzeczne).
- Brak oficjalnych danych o różnicach w rekomendacji Shortsów powyżej 60 s.

---

## D2) TikTok: replaye, completion rate i Creator Rewards Program (aktualne zasady)

### Takeaway
TikTok Creator Rewards Program (warunki US zaktualizowane 20.07.2026) wymaga filmów **co najmniej 1-minutowych** i płaci za **qualified views**:
- obejrzenie co najmniej 5 s,
- nieoznaczone jako „not interested”,
- **kilka wyświetleń z tego samego konta liczy się jako jedno**,
- według strony pomocy tylko z feedu For You, a nagrody zaczynają się od 1000 qualified views.

Pętle i replaye nie zwiększają więc wypłat. W metrykach reklamowych TikToka „video views” i „100% video views” wykluczają replaye, ale „average play time” je wlicza. Oficjalnego opisu, czy organiczny licznik w aplikacji liczy replaye, nie znalazłem.

### Cited Findings
- **Warunki US CRP**: Eligible Videos muszą mieć „a duration of at least 1 minute”. Metryki uzyskane sztucznie są wykluczone. Last updated: **July 20, 2026** — [TikTok Creator Rewards Program Terms (US)](https://www.tiktok.com/legal/page/global/creator-rewards-program-us/en)
- **Warunki EEA CRP (kwiecień 2025)**: qualified views to wyświetlenia, przy których „a user views for five seconds or more” i które nie zostały oznaczone „not interested”. Wyświetlenia z „the same user account will be counted as one view”. Film musi mieć „one minute or longer” — [TikTok Creator Rewards Program Terms (EEA)](https://www.tiktok.com/legal/page/global/tiktok-creator-rewards-program-eea/en)
- **Strona pomocy TikTok** (treść z wyniku wyszukiwania, bo strona renderuje się w JS): qualified views liczą się tylko z feedu For You, z wyłączeniem wyświetleń fałszywych, płatnych i krótszych niż 5 s. Nagrody zaczynają się po 1000 qualified For You views. Publiczny licznik może się różnić od dashboardu CRP — [TikTok Support: How rewards work](https://support.tiktok.com/en/business-and-creator/creator-rewards-program/how-rewards-work)
- **Definicje metryk reklamowych TikToka**:
  - „Video views: Number of times your video started to play” — replaye nie są liczone;
  - „100% video views” — replaye wykluczone;
  - „Average play time per video view/per user … including any time spent replaying the video”.

  — [TikTok Ads Help: Video play metrics](https://ads.tiktok.com/resources/help/article/video-play)
- **Organiczne „Watched full video”** to odsetek wyświetleń zakończonych obejrzeniem całości; „Average watch time” i „Total play time” to średni i łączny czas oglądania — [HEC Montréal digital: TikTok Analytics](https://digital.hec.ca/en/blog/tiktok-analytics-to-optimize-your-reach/); [Meltwater help](https://help.meltwater.com/en/articles/9337341-measure-tiktok-analytics). Źródła wtórne.
- Blogi twierdzą, że każdy replay lub pętla w aplikacji to nowe wyświetlenie, a wyświetlenia twórcy są filtrowane. **Brak oficjalnego potwierdzenia** — [AdManage](https://admanage.ai/blog/how-does-tiktok-count-views); [itgeared](https://www.itgeared.com/how-does-tiktok-count-views)
- Twórca na TikToku podał, że od 4 grudnia (rok niepewny) liczyć się mają wyświetlenia z wyszukiwania trwające co najmniej 30 s. **Niepotwierdzone oficjalnie**, sprzeczne z definicją „tylko For You” — [TikTok search page / creator video](https://www.tiktok.com/discover/what-are-qualified-views)

### Inferences
- **Długość pod CRP**: odcinek musi trwać co najmniej 60 s po przetworzeniu przez TikTok. Przy wymogu wyrównania do 1024 próbek najbezpieczniejsze są długości od 64 s w górę (64/72/80/96 s). Dokładne 60,0 s jest ryzykowne z powodu możliwego zaokrąglenia przy transkodowaniu.
- **Pętle na TikToku** podbijają średni czas oglądania (average play time wlicza replaye) i odsetek „watched full video”. Te sygnały prawdopodobnie pomagają w dystrybucji, ale TikTok nie publikuje wag. Nie podbijają qualified views, bo jedno konto = jedno wyświetlenie.
- Monetyzacja CRP jest dostępna tylko w wybranych krajach. Twórca z Polski powinien sprawdzić listę krajów w aplikacji (poza zakresem tej notatki).

### Gaps
- Nie udało się pobrać pełnej treści stron TikTok Support i Creator Academy (renderowanie JS). Definicję „tylko For You” znam z wyniku wyszukiwania.
- Brak oficjalnego dokumentu, czy organiczny licznik wyświetleń w aplikacji liczy replaye. Definicje reklamowe mówią, że nie, blogi, że tak.
- Brak potwierdzonych zmian CRP na 2026 poza aktualizacją warunków US z 20.07.2026. Nie analizowałem diffu treści.

---

## D3) Instagram Reels: „views” (starty + replaye), średni czas oglądania i sygnały dystrybucji (Mosseri)

### Takeaway
Instagram liczy **Views jako każde rozpoczęcie lub ponowne odtworzenie Reela**, więc replaye wchodzą do views. Osobną metrykę replays Meta usunęła przy zmianie Plays → Views (2024/2025). „Average watch time” dzieli czas oglądania (z replayami) przez **initial views**, więc pętla może dać średnią dłuższą niż Reel. Mosseri (styczeń 2025) wskazał trzy najważniejsze sygnały rankingu: **watch time, likes per reach, sends per reach**. Od stycznia 2025 Reelsy mogą trwać do 3 min.

### Cited Findings
- **Instagram Help (Reels insights)**:
  - Views to „the number of times your reel starts to play or replay”;
  - Viewers to unikalne konta, które przynajmniej raz zobaczyły Reela na ekranie;
  - average watch time liczy się względem initial views, a initial view to pierwsze odtworzenie w sesji Reela.

  Treść pochodzi z wyniku wyszukiwania, bo strona renderuje się w JS — [Instagram Help: View insights on your Instagram reels](https://help.instagram.com/202865988324236/)
- **Meta**: Plays przemianowano na Views, a sposób liczenia się nie zmienił. Views to liczba startów lub replayów Reela lub wideo — [Meta for Creators: Introducing Views](https://creators.facebook.com/introducing-views-to-simplify-content)
- **Agorapulse** (notatka o deprecjacji metryk, kwiecień 2025): Meta usunęła osobną metrykę replays przy przejściu Plays → Views. Kalkulacja Views się nie zmienia — [Agorapulse support](https://support.agorapulse.com/en/articles/10749883-instagram-metrics-deprecation-apr-2025)
- **API Insights**: `clips_replays_count` liczyło ponowne starty po pierwszym odtworzeniu (replay od 1 ms w tej samej sesji). Opis z wyniku wyszukiwania — [Meta Developers: Instagram Media Insights](https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media/insights)
- **Mosseri, styczeń 2025**: „The top three signals that matter most for ranking are watch time, likes and sends”. Liczą się likes per reach i sends per reach. Likes są nieco ważniejsze dla treści od obserwowanych kont (connected), a sends dla treści od nieobserwowanych (unconnected). Watch time obejmuje względny (procent) i bezwzględny (sekundy) czas oglądania. Wszystko to źródła wtórne relacjonujące wypowiedzi Mosseriego — [SocialPilot: Reels algorithm](https://www.socialpilot.co/de/blog/instagram-reels-algorithm); [Dataslayer](https://dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers); [Fanpage Karma](https://www.fanpagekarma.com/insights/?p=9293)
- **Reels do 3 min (styczeń 2025)**. Mosseri: „Historically, the limit was 90 seconds because we wanted to focus Instagram on short-form video” — [RouteNote](https://routenote.com/blog/instagram-expands-reels-limit-to-3-minutes/); [Lindsey Gamble](https://www.lindseygamble.com/blog/instagram-three-minute-reels)
- Pomiar 425 postów według Socialcrawl: watch time obejmuje replaye, ale mianownik nie, więc zapętlony Reel może mieć średnią dłuższą niż sam Reel — [Socialcrawl: How Instagram counts views](https://www.socialcrawl.dev/blog/how-instagram-counts-views)
- Według jednego źródła Reels dłuższe niż 90 s mogą tracić w dystrybucji. **Niepotwierdzone u Mosseriego** — [OneStream](https://onestream.live/blog/how-long-can-instagram-reels-be/)

### Inferences
- **Na Instagramie pętla działa podwójnie**: każdy replay to nowy view, a dodatkowy watch time podnosi średni czas oglądania przy niezmienionym mianowniku (initial views). Watch time jest jednym z trzech głównych sygnałów rankingu.
- **Przy serialu komediowym dla dorosłych** warto projektować momenty „do wysłania znajomemu” (sends per reach). Dla zasięgu poza obserwującymi to według relacji o Mosserim najważniejszy sygnał.
- Odcinki 60–120 s mieszczą się w limicie 3 min. Ewentualna kara za ponad 90 s jest niepotwierdzona, ale warto testować wersje 60–90 s i 90–120 s na tej samej platformie.

### Gaps
- Nie udało się pobrać pełnych stron Instagram Help i Meta Developers (JS). Definicje znam z wyników wyszukiwania.
- Brak pierwotnego źródła (post lub wideo Mosseriego) dla wypowiedzi ze stycznia 2025. Wszystkie cytaty są wtórne.
- Brak potwierdzonych informacji o zmianach w rankingu Reels w 2026 r. (oryginalność, kary za reposty). Nie znalazłem pierwotnego źródła.
