# ElevenLabs (stan na 2026-11-08) dla serialu animowanego dla dorosłych (Shorts/TikTok/Reels) oraz dubbing i wielojęzyczne ścieżki audio

Wszystkie ceny i strony sprawdzono 2026-11-08 (data obserwacji), chyba że zaznaczono inaczej. Ceny ElevenLabs podane są bez podatków ("Prices exclude all taxes, levies, and duties", [Pricing](https://elevenlabs.io/pricing)). Kilka stron pobrano przez narzędzie streszczające, więc tabele z cennika (dokładne przypisanie wartości do kolumn) warto sprawdzić wzrokowo przed publikacją. Takie miejsca oznaczono.

## 1. Plany, ceny, kredyty, prawa komercyjne ElevenLabs (oraz zmiany 2025–2026)

### Takeaway
Obecnie jest 7 planów: Free, Starter ($6), Creator ($22), Pro ($99), Scale ($299), Business ($990), Enterprise. Licencja komercyjna przysługuje od Startera, a plan Free jej nie ma (wymaga też atrybucji). Najważniejsza zmiana 2026: **Eleven v4** (premiera 28–29.09.2026) jest teraz flagowym modelem, a v3 to „previous generation”. API jest rozliczane w USD (v4: $0,08 / 1 000 znaków), a w aplikacji obowiązują kredyty (TTS: 1 kredyt = 1 znak dla v3/Multilingual v2).

### Cited Findings
**Plany (obserwacja 2026-11-08), [elevenlabs.io/pricing](https://elevenlabs.io/pricing):**

| Plan | Cena miesięczna | Rocznie (ekwiwalent/mies.) | Kredyty/mies. | ~min TTS | Dodatkowa minuta (overage) | Sloty na własne głosy* | PVC* | Jakość audio* |
|---|---|---|---|---|---|---|---|---|
| Free | $0 | – | 10 000 | ~10 | (~$0,36 wg strony) | 3 | brak | 128 kbps, 44,1 kHz |
| Starter | $6 (promo: $1 za 1. miesiąc) | $60/rok ($5/mies.) | 30 000 | ~30 | ~$0,20 | 10 | brak | 128 kbps, 44,1 kHz |
| Creator | $22 (promo: $11 za 1. miesiąc) | $220/rok ($18,33/mies.) | 121 000 | ~121 | ~$0,18 | 30 | 1 | 128 i 192 kbps, 44,1 kHz |
| Pro | $99 | $990/rok ($82,50/mies.) | 600 000 | ~600 | ~$0,17 | 160 | 1 | 128 i 192 kbps; 44,1 kHz PCM przez API |
| Scale | $299 (3 miejsca) | $2 990/rok ($249,17/mies.) | 1 800 000 | ~1 800 | ~$0,17 | 660 | 3 | 128 i 192 kbps |
| Business | $990 (10 miejsc) | $9 900/rok ($825/mies.) | 6 000 000 | ~6 000 | ~$0,17 | 2 200 | 10 | 128 i 192 kbps |
| Enterprise | indywidualnie | indywidualnie | indywidualnie | – | – | – | – | – |

\*Narzędzie streszczające zaznaczyło, że tabela porównawcza na stronie nie ma nagłówków kolumn, a przypisanie slotów głosowych i PVC do planów jest wnioskowane. Do tego lista funkcji przypisuje „192 kbps” do Pro („Pro: adds 44.1kHz PCM audio output via API and 192kbps audio quality”), a tabela pokazuje 192 kbps już od Creatora. To sprzeczność do ręcznej weryfikacji. — [Pricing](https://elevenlabs.io/pricing)

- Funkcje według planów: Free obejmuje TTS, STT, Sound Effects, Voice Design, Music i 3 projekty Studio. **Starter dodaje Commercial License**, Instant Voice Cloning, 20 projektów Studio, „music commercial use” i Dubbing Studio. Creator dodaje Professional Voice Cloning, Pro dodaje 44,1 kHz PCM przez API i 192 kbps, Scale dodaje 3 miejsca, a Business dodaje 10 miejsc i 10 PVC. — [Pricing](https://elevenlabs.io/pricing)
- Koszty kredytowe w aplikacji według cennika: TTS 1 kredyt/znak; Multilingual v2 1 kredyt/znak; Flash/Turbo 0,5–1 kredytu/znak; Speech to Text 330 kredytów/min; **Eleven Music 900 kredytów/min**; **Sound Effects 200 kredytów/generację**; Voice Changer i Voice Isolator 1 000 kredytów/min; **Dubbing: 2 000 kr/min (automatyczny, ze znakiem wodnym), 3 000 kr/min (automatyczny, bez znaku wodnego), 5 000 kr/min (Dubbing Studio, ze znakiem wodnym), 10 000 kr/min (Dubbing Studio, bez znaku wodnego)**. Cennik ma wiersze dla v3 i v4, ale w pobranej treści nie było przy nich liczby kredytów. — [Pricing](https://elevenlabs.io/pricing)
- Rollover: niewykorzystane kredyty przechodzą maksymalnie przez 2 miesiące, z limitem 2× miesięcznej puli (nie dotyczy Free). Przy downgrade lub anulowaniu niewykorzystane kredyty przepadają z końcem cyklu. — [Pricing](https://elevenlabs.io/pricing); [Help: What are credits](https://elevenlabs.io/docs/help-center/account/general/what-are-credits/llms.txt)
- Eleven v3 kosztuje w aplikacji 1 kredyt za znak, a generacje przez API są tańsze. — [Help Center: koszt Eleven v3](https://help.elevenlabs.io/hc/en-us/articles/35869113958801-How-much-does-it-cost-to-generate-using-Eleven-v3)
- Help center: v3 i Multilingual v2 to 1 kredyt/znak, a Turbo v2.5 to 0,5 kredytu/znak (cytowane w wynikach wyszukiwania). — [Help Center](https://help.elevenlabs.io/hc/en-us/articles/27562116787345-Have-characters-changed)
- **API rozliczane w USD (nie kredytach)**. Na 1 000 znaków: Eleven v4 $0,08; v4 Turbo $0,04; v3 $0,08; v3 Conversational $0,04; Multilingual v2 $0,08; Flash/Turbo $0,04. Music kosztuje $0,15/min, Sound Effects $0,12/min, Dubbing v1 $0,33/min (ze znakiem wodnym) lub $0,50/min (bez), Dubbing v2 $2,20/min. Strona API wymienia „included” znaki v4 per plan: Free 10 000, Starter 75 000, Creator 275 000, Pro 1 238 000, Scale 3 738 000, Business 12 375 000 (przypisanie do kolumn wnioskowane). — [API Pricing](https://elevenlabs.io/pricing/api)
- **Eleven v4 / v4 Turbo** zostały ogłoszone 28.09.2026 (wpis zaktualizowany 19.10.2026), z dostępem w ElevenAgents, ElevenCreative i API. Model ma inline audio tags (np. [laughs]), instrukcje w języku naturalnym, dialog wielu mówców reagujących na scenę, spójność tożsamości mówcy między generacjami i regeneracjami („Speaker identity is kept consistent across generations, dialogue, narration, and regenerated lines”), 90+ języków i wsparcie PVC. — [ElevenLabs blog: Eleven v4](https://elevenlabs.io/blog/eleven-v4)
- Według The Decoder (29.09.2026) standardowa cena API to $80/M znaków (v4) i $40/M (Turbo), a do 12.10.2026 obowiązywała promocja $22/$11. Użytkownicy planu Creator i wyższych mogli przez 2 tygodnie używać v4 w ElevenCreative „at no extra cost”, z limitem 2× miesięcznych kredytów. Obie promocje już wygasły. — [The Decoder](https://the-decoder.com/elevenlabs-new-v4-speech-model-makes-ai-voices-more-expressive-and-consistent/)
- Dokumentacja modeli opisuje v4 jako flagowy model (limit 10 000 znaków, 90+ języków), a v3 jako „previous generation” (limit 5 000 znaków, 70+ języków). Turbo v2.5 jest deprecated (zastępuje go Flash v2.5). Flash v2.5 ma „50% lower price per character for API”. — [Docs: Models](https://elevenlabs.io/docs/models)
- Plan Free: „The free plan does not include a commercial license and cannot be used for any commercial purpose.” Treści z Free trzeba oznaczyć, wpisując „elevenlabs.io” lub „11.ai” w tytule (dla Eleven Music: „Eleven Music”). „All paid plans include a commercial license, provided you're not using Beta Services.” „Content created outside of a paid subscription (before or after) cannot be used commercially.” — [Help Center: Can I publish the content](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform/llms.txt)
- Prohibited Use Policy wprost zakazuje komercyjnego użycia planów darmowych („commercial use on free plans”). — [Use Policy](https://elevenlabs.io/use-policy)

### Inferences
- Komercyjny serial monetyzowany wymaga co najmniej Startera. Starter ma jednak tylko 30 000 kredytów, czyli ok. 3 gotowe minuty w modelu bazowym (sekcja 7), więc realnie w grę wchodzi Creator albo Pro.
- Licencja komercyjna obejmuje tylko materiał wygenerowany w okresie płatnej subskrypcji. Nie należy więc robić „testowych” scen na Free z myślą o późniejszej publikacji.
- „Provided you're not using Beta Services”: Dubbing v2 jest oznaczony jako Alpha (sekcja 6). Trzeba sprawdzić, czy wyjścia z funkcji alpha/beta mają pełną licencję komercyjną.
- Ceny API (USD) są w praktyce tańsze dla TTS niż kredyty w aplikacji ($0,08/1k znaków przy ok. $0,165/1k kredytów na Pro). Dla pozostałych produktów ceny API odpowiadają przeliczeniu kredytów po stawce Pro (np. 3 000 kr × $0,000165 = $0,495 ≈ $0,50/min dubbingu v1; 900 kr × $0,000165 ≈ $0,15/min muzyki).

### Gaps
- Nie znalazłem oficjalnego przelicznika **kredytów na znak dla Eleven v4 w aplikacji**. Założenie robocze: 1 kredyt/znak, bo cena API v4 jest równa v3 ($0,08/1k), a v3 kosztuje 1 kredyt/znak w aplikacji. Do weryfikacji w aplikacji.
- Nie wiadomo jednoznacznie, czy „included characters” na stronie API to ta sama subskrypcja co kredyty w aplikacji, czy osobna pula.
- Overage dla Free ($0,36) wygląda na artefakt tabeli. Free nie ma płatnego dokupowania, a usage-based billing obejmuje Creator i wyższe plany.

## 2. Voice Design: tworzenie oryginalnych głosów postaci i spójność między odcinkami

### Takeaway
Voice Design tworzy głos z opisu tekstowego. Każde kliknięcie daje 3 propozycje, a płaci się raz, za znaki tekstu podglądu. Wybrany głos zapisuje się w slocie (dostaje voice ID) i używa we wszystkich odcinkach. Spójność zapewnia stały voice ID, stałe ustawienia (stability), ten sam model i dialog multi-speaker. Eleven v4 deklaruje lepszą spójność przy regeneracjach, ale głosy z Voice Design mogą na v4 brzmieć „mniej aktorsko” niż na v3.

### Cited Findings
- Każda generacja daje 3 opcje głosu. Płaci się tylko za znaki tekstu podglądu i tylko raz, mimo że powstają 3 próbki. Przycisk Auto-generate tworzy tekst podglądu z audio tagami. Wybraną opcję można zapisać, co zajmuje 1 slot głosowy. Dostęp: Voices → My Voices → Add a new voice → Voice Design, lub API. — [Docs: Voice Design](https://elevenlabs.io/docs/eleven-creative/voices/voice-design.md); potwierdzenie: [Help Center: How much does Voice Design cost](https://help.elevenlabs.io/hc/en-us/articles/29315418701073-How-much-does-Voice-Design-cost)
- Zalecana struktura promptu: linia 1 „Native <Language>. <Gender>, <Age range>. <Quality level>.”, linia 2 „Persona: <2–5 words>. Emotion: <2–3 adjectives>.”, linia 3 to 1–2 zdania o barwie, tempie i sposobie podania. Inne wskazówki: nie używać słowa „accent”, gdy chodzi o intonację; unikać słów FX („reverb”, „echo”, „phone”, „tape”); „thick” działa lepiej niż „strong”. Przykłady postaci z dokumentacji: drill sergeant, evil ogre, angry pirate, squeaky mouse. — [Docs: Voice Design](https://elevenlabs.io/docs/eleven-creative/voices/voice-design.md)
- Ustawienia: Loudness oraz Guidance scale (wyższy = ściślej według promptu, ale może obniżyć jakość przy niszowych promptach; przykłady 20–40%). Dokumentacja nie wspomina o seedzie. Dłuższy tekst podglądu daje stabilniejszy wynik, a tekst powinien pasować do osobowości głosu. — [Docs: Voice Design](https://elevenlabs.io/docs/eleven-creative/voices/voice-design.md)
- Kompatybilność: głosy z Voice Design działają z Eleven v4 i starszymi (w tym v3) oraz obsługują audio tags, ale „On v4, they may be less performative than on earlier models”. Wedle dokumentacji Voice Design jest „best for quick exploration, and output quality can vary”, a dla najbardziej spójnej jakości zaleca PVC z Voice Library. — [Docs: Voice Design](https://elevenlabs.io/docs/eleven-creative/voices/voice-design.md)
- Ustawienia TTS: Stability (domyślnie 50; niższa daje szerszy zakres emocji i większą zmienność); Similarity (~75; niedostępne w v3); Style exaggeration (domyślnie 0, zalecane 0); Speaker Boost i Speed (0,7–1,2) są niedostępne w v3. Strona sama sobie przeczy co do Speed w v4. „The AI is non-deterministic”: suwaki ustalają zakres losowości, nie gwarantują identycznego wyniku. — [Docs: Text to Speech (ElevenCreative)](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech/llms.txt)
- **Darmowe regeneracje (tylko strona www, nie API):** 2 darmowe regeneracje, jeśli tekst, głos i model są te same (suwaki można zmieniać), pierwsza generacja ma mniej niż 2 godziny i strona nie została odświeżona. — [Docs: Text to Speech](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech/llms.txt)
- Audio tags (v4, v3, v4 Turbo): emocje [curious], [crying], [mischievously], [happy], [sad], [angry]; podanie [whispers], [shouts]; reakcje [laughs], [clears throat], [sighs], [exhales]. Multilingual v2 i Flash v2.5 nie obsługują tagów. — [Docs: Text to Speech](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech/llms.txt)
- Tryb dialogu multi-speaker (v4 i v3) obsługuje przerwania, zmiany tonu i kontekst emocjonalny. Na www włącza się przy wielu mówcach, w API przez endpointy Create dialogue / Stream dialogue (Text to Dialogue; `audio_effects` w Text to Dialogue API). Limity znaków na żądanie: v4 10 000 (~10 min), v3 5 000 (~5 min). Do dłuższych form służy Studio. — [Docs: Text to Speech](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech/llms.txt); [Docs: Models](https://elevenlabs.io/docs/models)
- Według ElevenLabs v4 utrzymuje tożsamość mówcy między generacjami i regeneracjami, a „request stitching” jest „significantly more reliable”. — [Blog: Eleven v4](https://elevenlabs.io/blog/eleven-v4)
- The Decoder: w v4 narratorzy i postacie mają zachowywać ten sam głos w całej produkcji, nawet przy wielokrotnej regeneracji linii, a tagi są wykonywane dokładniej niż w v3. — [The Decoder](https://the-decoder.com/elevenlabs-new-v4-speech-model-makes-ai-voices-more-expressive-and-consistent/)
- Głosy użytkowników (źródło niskiej wiarygodności, snapshot Reddit z 03.2026): v3 jest mniej spójny niż v2, ma „accent drift” przy regeneracjach i nie ma pewnego „seed pinning”. Porada: generować kilka wersji i składać najlepsze fragmenty w DAW. — [Reddit snapshot](https://reddit.sentinel-team.org/posts/1rua838/snapshots/2026-03-17T02%3A15%3A53.957463Z)

### Inferences
- Praktyczny workflow: (1) zaprojektować każdą postać w Voice Design, zapisać ją i zanotować voice ID; (2) spisać „kartę głosu” (prompt, guidance scale, loudness, stability, model); (3) nagrywać sceny w trybie Text to Dialogue / multi-speaker na v4 (spójność) albo na v3, jeśli głos na v4 jest za płaski; (4) wybierać jeden model na cały sezon, bo zmiana modelu zmienia brzmienie.
- Darmowe regeneracje na www pozwalają obniżyć koszt „retake ×3” nawet do ×1, pod warunkiem że nie zmienia się tekstu (także tagów).
- Ze słowami dokumentacji („less performative” na v4) przed decyzją warto zrobić test A/B tej samej sceny komediowej na v3 i v4.

### Gaps
- Brak oficjalnych informacji o parametrze `seed` w aplikacji (nie sprawdziłem referencji API).
- Brak oficjalnego limitu długości promptu i tekstu podglądu Voice Design (reseller Picsart podaje 100–1 000 znaków podglądu, ale to nie jest źródło pierwotne).
- Nie znalazłem niezależnych testów spójności v4 (model ma ok. 6 tygodni).

## 3. Polityka treści: czy ElevenLabs pozwala na wulgaryzmy i czarny humor?

### Takeaway
Prohibited Use Policy (aktualizacja 09.10.2026) **nie wspomina o wulgaryzmach, profanity, satyrze ani komedii**, więc przekleństwa same w sobie nie są zakazane. Zakazane są natomiast: mowa nienawiści i obelgi (slurs) wobec grup chronionych, nękanie konkretnych osób, groźby, podszywanie się pod realne osoby (w tym polityków), treści seksualne z udziałem nieletnich i część treści seksualnych. Automatyczna moderacja potrafi błędnie flagować wulgaryzmy (znany przypadek bana za „arse” w 2025).

### Cited Findings
- Polityka (Last updated 09.10.2026) obejmuje Input, Output i sposób użycia, w tym nieudane próby naruszeń. — [Use Policy](https://elevenlabs.io/use-policy)
- Mowa nienawiści i nękanie: zakaz „hateful or discriminatory attacks based on protected characteristics, including dehumanizing content and slurs”, „Targeted harassment or bullying of any individual”, „Threats of violence against any individual or group”. — [Use Policy](https://elevenlabs.io/use-policy)
- Treści seksualne i drastyczne: zakaz „Visual depictions of explicit sexual acts”, erotyki z kazirodztwem, zoofilią lub nekrofilią, treści intymnych bez zgody oraz „Gratuitous graphic or gory content that revels in serious injury, death, or abuse”. Bezwzględny zakaz seksualizacji osób poniżej 18 lat. — [Use Policy](https://elevenlabs.io/use-policy)
- Podszywanie się: zakaz klonowania lub naśladowania głosu, tożsamości lub wizerunku żyjącej osoby „without their explicit and informed consent”; „Impersonating political candidates or elected officials without authorization”; „Political campaigning without our prior written consent”. — [Use Policy](https://elevenlabs.io/use-policy)
- Przejrzystość AI: obowiązek ujawniania AI tam, gdzie wymagane, oraz zakaz usuwania znaków wodnych i sygnałów pochodzenia. — [Use Policy](https://elevenlabs.io/use-policy)
- Narzędzie streszczające stwierdziło, że polityka „does not mention profanity, vulgar language, satire, comedy, or parody”. — [Use Policy](https://elevenlabs.io/use-policy)
- Incydent z lutego 2025: kobieta z MND dostała ostrzeżenie, a następnie bana od moderatora za wygenerowanie żartobliwej frazy z „arse”. Przedstawiciel firmy (cytowany przez MIT Technology Review) stwierdził, że system prawdopodobnie zinterpretował ją jako „threat”. Po odwołaniu konto przywrócono, a firma przeprosiła. — [Boing Boing](https://boingboing.net/2025/02/19/woman-banned-from-assistive-ai-app-after-teaching-it-to-say-arse.html)
- Egzekwowanie: kontekstowa ocena naruszeń, możliwe usunięcie treści, ograniczenie, zawieszenie lub zamknięcie konta, z procedurą odwołania. — [Use Policy](https://elevenlabs.io/use-policy)

### Inferences
- Wulgarna satyra z oryginalnymi postaciami jest zgodna z polityką, o ile nie zawiera obelg wobec grup chronionych (np. rasowych lub homofobicznych slurów), gróźb wobec realnych osób ani podszywania się pod realne osoby głosem. Parodia realnego polityka „jego” głosem jest zakazana, nawet jako satyra.
- Ryzyko praktyczne: fałszywe flagi moderacji przy dużym natężeniu przekleństw i przemocy słownej. Warto trzymać kopie projektów i nie publikować w ElevenLabs treści, które mogłyby wyglądać na groźby wobec realnych osób.
- Żarty z elementami seksualnymi w dialogu nie są wprost zakazane w audio (zakaz dotyczy „visual depictions”), ale skrajne kategorie (kazirodztwo itp.) są zakazane niezależnie od formy.

### Gaps
- Brak oficjalnej informacji, czy ElevenLabs automatycznie blokuje lub cenzuruje (wycisza) konkretne słowa w TTS. Nie znalazłem też aktualnych (2026) relacji użytkowników o blokowaniu przekleństw w v3/v4.
- Nie zweryfikowano treści Terms of Service pod kątem dodatkowych ograniczeń (przeanalizowano tylko Prohibited Use Policy).

## 4. Sound Effects (text-to-SFX)

### Takeaway
SFX kosztuje 200 kredytów za generację przy automatycznej długości albo 40 kredytów za sekundę przy ustawionej długości. Maksymalna długość to 30 s na generację, z opcją pętli (loop). Nowy model SFX v3 lepiej wykonuje złożone prompty, a SFX v2 zostanie wycofany 1.03.2027. Prawa komercyjne wynikają z płatnego planu.

### Cited Findings
- Długość 0,1–30 s na generację; domyślnie dobierana automatycznie z promptu. Koszt: 40 kredytów/s przy podanej długości. Parametr `loop` daje płynne pętle (ambient). Prompt influence: wyższy = dosłowniej, niższy = kreatywniej. Formaty: MP3, a dla efektów bez pętli WAV 48 kHz. — [Docs: Sound Effects](https://elevenlabs.io/docs/capabilities/sound-effects)
- Cennik aplikacji: Sound Effects 200 kredytów za generację. — [Pricing](https://elevenlabs.io/pricing)
- Cennik API: Sound Effects $0,12 za minutę (bez stawki za generację lub sekundę). — [API Pricing](https://elevenlabs.io/pricing/api)
- Modele: `eleven_text_to_sound_v3` (SFX v3: lepiej trzyma się wieloczęściowych promptów, lepiej generuje dźwięki wokalne i muzyczne); `eleven_text_to_sound_v2` jest wciąż domyślny, ale deprecated, z usunięciem 1.03.2027. Współbieżność SFX: Creator i Pro po 6. — [Docs: Models](https://elevenlabs.io/docs/models); [Docs: Sound Effects](https://elevenlabs.io/docs/capabilities/sound-effects)
- Prawa komercyjne: wszystkie płatne plany mają licencję komercyjną (dotyczy wszystkich wyjść, bez osobnych warunków dla SFX). — [Help Center: Can I publish](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform/llms.txt)

### Inferences
- Krótkie efekty (1–3 s) z ustawioną długością kosztują 40–120 kredytów, czyli taniej niż 200 kredytów przy auto-długości.
- Duża oszczędność: budować własną bibliotekę powtarzalnych efektów (drzwi, kroki, „pierdnięcia”, uderzenia, ambient) i używać jej w wielu odcinkach. Wtedy koszt SFX na minutę spada wielokrotnie.
- Stawka API ($0,12/min) jest niespójna z 40 kr/s (2 400 kr/min) i z 200 kr/generację. Do wyjaśnienia.

### Gaps
- Nie potwierdzono, ile wariantów zwraca jedna generacja SFX w aplikacji ani czy płaci się za każdy wariant.
- Brak informacji, czy maksymalne 30 s dotyczy także trybu loop (dokumentacja sugeruje pętle dla dłuższych efektów, ale nie podaje limitu).

## 5. Eleven Music (licencje, koszty, ograniczenia)

### Takeaway
Eleven Music (start 5.08.2025, licencje z Merlin i Kobalt) kosztuje 900 kredytów/min w aplikacji ($0,15/min w API). Utwory mają od 3 s do 5 min. Komercyjne użycie online i offline jest dozwolone na płatnych planach (z wyjątkiem filmu, TV, radia i gier studyjnych; one wymagają Enterprise Music). Starter ma limit 30 min pobrań miesięcznie i zakaz dystrybucji streamingowej, a Creator i wyższe pozwalają na streaming. Warunki nie wspominają o Content ID.

### Cited Findings
- Długość utworu 3 s – 5 min; inpainting (regeneracja wybranej sekcji); formaty MP3 (44,1 kHz, 128–192 kbps) i WAV; „cleared for nearly all commercial uses”. Music API tylko dla płatnych subskrybentów. Modele: Music v2.5 (najnowszy), v2, a v1 jest deprecated (usunięcie 31.01.2027). — [Docs: Music](https://elevenlabs.io/docs/capabilities/music); [Docs: Models](https://elevenlabs.io/docs/models)
- Koszt: 900 kredytów/min (aplikacja) — [Pricing](https://elevenlabs.io/pricing); $0,15/min (API) — [API Pricing](https://elevenlabs.io/pricing/api)
- Music Terms (Last updated 09.10.2026), Exhibit A według planów (narzędzie streszczające wskazało niejasności, np. „Individual use only” przy Free/Starter wobec wiersza Media Rights):
  - Free: „Individual use only”; pobieranie niedozwolone; streaming zabroniony; atrybucja wymagana („Created in collaboration with ElevenLabs” lub podobnie).
  - Starter: individual only; **30 min pobrań/mies.**; streaming zabroniony; bez atrybucji.
  - Creator: individual only; **250 min pobrań/mies.**; **streaming dozwolony**; bez atrybucji.
  - Pro: individual only; **500 min/mies.**; streaming dozwolony.
  - Scale: osoby lub firmy **poniżej 10 pracowników**; 1 500 min/mies.
  - Business: firmy **poniżej 50 pracowników**; 4 000 min/mies.
  - Enterprise Music Lite / Enterprise Music: limity custom; tylko Enterprise Music ma pełne prawa medialne.
  - Media rights (Free do Enterprise Music Lite): „All online and offline commercial use permitted, except film, TV, radio, and Studio Games.”
  — [Music Terms](https://elevenlabs.io/music-terms)
- Zakazane prompty (sekcja 2.1): nazwisko lub pseudonim artysty albo autora piosenek, tytuł utworu lub albumu, nazwa wydawcy lub wytwórni, rozpoznawalne fragmenty tekstów. Sekcja 2.2: użytkownik „retain[s] any and all rights in and to your Input and Output”. Sekcja 4.4: obowiązek stosowania się do zasad platform dotyczących oznaczania treści AI. — [Music Terms](https://elevenlabs.io/music-terms)
- Warunki muzyczne nie wspominają o YouTube, TikToku, Content ID ani o rejestrowaniu wyjść w systemach roszczeń. — [Music Terms](https://elevenlabs.io/music-terms)
- Start 5.08.2025 we współpracy z Merlin (niezależne wytwórnie) i Kobalt (niezależny wydawca). Udział artystów jest opt-in. — [Music Business Worldwide](https://musicbusinessworldwide.com/eleven-music-new-ai-rival-to-suno-launches-with-merlin-kobalt-licensing-deals-in-the-bag); [Business Wire, 5.08.2025](https://www.businesswire.com/news/home/20250805333301/en)
- Tom's Guide przy premierze opisywał muzykę jako mającą „full commercial rights”, w tym do filmów na YouTube. — [Tom's Guide](https://tomsguide.com/ai/elevenlabs-reveals-ai-music-generator-and-it-has-full-commercial-rights)

### Inferences
- Do Shorts/TikTok/Reels wystarcza Creator: „online commercial use”, streaming dozwolony, 250 min pobrań. Starter (30 min pobrań, bez streamingu) też wystarcza na krótkie podkłady, ale bez możliwości wydania soundtracku na Spotify.
- **Uwaga na formę działalności:** Free–Pro mają kryterium „Individual use only”. Jeśli twórca działa przez spółkę z pracownikami, warunki wskazują Scale (<10 pracowników) lub Business (<50). Do weryfikacji prawnej.
- Content ID: ElevenLabs nie rejestruje wyjść w Content ID (brak wzmianki), więc roszczenia są mało prawdopodobne, ale nie wykluczone (np. jeśli ktoś zarejestruje podobny utwór AI). Nie należy samemu rejestrować muzyki w Content ID ani w dystrybutorach, bo może to blokować własne kanały na innych platformach. To wniosek, nie fakt ze źródła.
- Opłaca się wygenerować raz motyw przewodni (intro/outro) i kilka „cue” na cały sezon zamiast nowej minuty muzyki do każdego odcinka.

### Gaps
- Nie znalazłem oficjalnych informacji o stemach ani natywnym trybie pętli (loop) w Eleven Music (dokumentacja o nich nie wspomina).
- Brak źródła o doświadczeniach z Content ID przy muzyce z Eleven Music na monetyzowanych kanałach YouTube.

## 6. Dubbing w ElevenLabs (Automatic Dubbing, Dubbing Studio, API)

### Takeaway
W aplikacji automatyczny dubbing bez znaku wodnego kosztuje **3 000 kredytów za minutę na język**, a edytowalny Dubbing Studio bez znaku wodnego **10 000 kr/min**. W API: v1 $0,50/min (bez znaku wodnego), nowy Dubbing v2 (Alpha) $2,20/min. Obsługa 90+ języków i do 32 mówców. Dubbing klonuje głosy z oryginału (suwak speaker similarity), a nie używa wprost zapisanych głosów z Voice Design. Dubbing Studio jest w trybie utrzymaniowym.

### Cited Findings
- Kredyty: 2 000 (automatyczny ze znakiem wodnym), 3 000 (automatyczny bez znaku wodnego), 5 000 (Studio ze znakiem wodnym), 10 000 (Studio bez znaku wodnego) kredytów/min. — [Pricing](https://elevenlabs.io/pricing)
- API: Dubbing v1 $0,33/min ze znakiem wodnym, $0,50/min bez; Dubbing v2 $2,20/min. — [API Pricing](https://elevenlabs.io/pricing/api)
- Dokumentacja: „90+ languages”. v2 obsługuje dialekty (es-MX, en-GB, fr-CA, pt-BR, zh-TW, ar-EG), a v1 nie. Limity: Automatic Dubbing (app) 1 GB / 180 min, API 3 GB, Dubbing Studio 1 GB / 45 min. Automatyczne wykrywanie mówców (także nakładającej się mowy), do 32 mówców. Speaker similarity 0–10 (domyślnie 7). — [Docs: Dubbing](https://elevenlabs.io/docs/capabilities/dubbing)
- Znaki wodne: dubbing na Free ma znak wodny automatycznie, na płatnych planach nie. Dubbing v2 nie ma przełącznika znaku wodnego ani zniżki za znak wodny (była tylko w v1 i Dubbing Studio). Dubbing v2 w Automatic Dubbing jest wyceniany za minutę w USD. — [Docs: Dubbing](https://elevenlabs.io/docs/capabilities/dubbing)
- Dubbing v2 jest w fazie **Alpha** i jest domyślny w Automatic Dubbing (stereo, dialekty; edycja transkryptu i regeneracja przez API tylko dla Enterprise). v1 obsługuje te same języki co Eleven v3, mono, i tylko v1 działa w Dubbing Studio. **Dubbing Studio** (edycja transkryptu, zmiana przypisania mówców, regeneracja klipów) jest „in maintenance mode” (tylko krytyczne poprawki). — [Docs: Dubbing](https://elevenlabs.io/docs/capabilities/dubbing)
- Plany self-serve: 3 równoległe zadania dubbingu; tworzenie i pobieranie dubbingu v2 na wszystkich planach. Dokumentacja nie wspomina o lip sync. — [Docs: Dubbing](https://elevenlabs.io/docs/capabilities/dubbing)
- Eleven v4 obsługuje 90+ języków, a głos nagrany w jednym języku może mówić w innych z lepszym trzymaniem akcentu. — [Blog: Eleven v4](https://elevenlabs.io/blog/eleven-v4)

### Inferences
- Przy produkcji „wszystko w ElevenLabs” są dwie drogi lokalizacji:
  1. **Dubbing** gotowego miksu albo samej ścieżki dialogowej: szybko, ale głosy postaci są klonowane z audio (nie są to zapisane voice ID), a komiczny timing zależy od automatu. Najlepiej podawać czysty stem dialogowy, a muzykę i SFX domiksować z oryginału.
  2. **Re-voicing TTS**: przetłumaczony scenariusz (np. LLM plus korekta native speakera, bo wulgaryzmy i slang trzeba lokalizować) czyta ten sam voice ID na v4 (90+ języków), z audio tagami, a muzykę i SFX używa się ponownie. Daje pełną kontrolę nad spójnością postaci, pointami i tagami, a kosztuje mniej więcej tyle co TTS (~1 kredyt/znak), czyli często mniej niż 3 000 kr/min dubbingu.
- Ryzyko licencyjne: Dubbing v2 to „Alpha”, a help center zastrzega licencję komercyjną dla „Beta Services”. Warto potwierdzić w supporcie.

### Gaps
- Nie znalazłem rzetelnych źródeł (testów, recenzji) o jakości dubbingu ElevenLabs dla komedii (timing puent, wulgaryzmy, slang) ani o tym, jak automat tłumaczy przekleństwa.
- Nie potwierdzono, czy w obecnym Dubbing Studio można przypisać mówcy własny zapisany głos z biblioteki (dokumentacja wspomina tylko „speaker reassignment”).
- Nie znaleziono kredytowej (aplikacyjnej) ceny Dubbingu v2. Cennik aplikacji podaje stawki odpowiadające v1 i Studio.

## 7. Model kosztów: 1 gotowa minuta odcinka (kredyty i USD, Creator vs Pro, pojemność miesięczna)

### Takeaway
Bazowy scenariusz (EN, ~1 100 znaków dialogu ×3 retake, ~12,5 SFX ×2 próby, 1 min muzyki ×2) to **~10 100 kredytów na gotową minutę**, czyli **~$1,84 na Creatorze (miesięcznie) i ~$1,67 na Pro**. Pojemność: Creator ok. 12 gotowych minut miesięcznie (~8 odcinków 90 s), Pro ok. 59 minut (~39 odcinków 90 s). Dubbing automatyczny na 3 języki podnosi koszt do ~19 100 kr/min (~$3,47 Creator / ~$3,15 Pro), na 5 języków do ~25 100 kr/min (~$4,56 / ~$4,14).

### Cited Findings (dane wejściowe)
- TTS 1 kredyt/znak (v3/Multilingual v2); ~1 000 kredytów ≈ 1 min TTS (Creator 121 000 kredytów ≈ ~121 min). — [Pricing](https://elevenlabs.io/pricing); [Help Center v3](https://help.elevenlabs.io/hc/en-us/articles/35869113958801-How-much-does-it-cost-to-generate-using-Eleven-v3)
- 2 darmowe regeneracje na www przy tym samym tekście, głosie i modelu (<2 h, bez odświeżenia strony). — [Docs: TTS](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech/llms.txt)
- SFX: 200 kr/generację (auto) — [Pricing](https://elevenlabs.io/pricing); 40 kr/s przy ustawionej długości — [Docs: SFX](https://elevenlabs.io/docs/capabilities/sound-effects)
- Muzyka: 900 kr/min — [Pricing](https://elevenlabs.io/pricing)
- Dubbing: 3 000 kr/min/język (auto, bez znaku wodnego); 10 000 kr/min/język (Studio, bez znaku wodnego) — [Pricing](https://elevenlabs.io/pricing)
- Ceny planów i kredyty: Creator $22 / 121 000 (rocznie $18,33/mies.), Pro $99 / 600 000 (rocznie $82,50/mies.); overage ~$0,18 (Creator) i ~$0,17 (Pro) za dodatkową „minutę” (~1 000 kredytów); rollover do 2 miesięcy. — [Pricing](https://elevenlabs.io/pricing)
- Voice Design: płatne raz za znaki tekstu podglądu (3 warianty na generację). — [Docs: Voice Design](https://elevenlabs.io/docs/eleven-creative/voices/voice-design.md)

### Założenia (moje, do weryfikacji)
- 150–180 słów EN ≈ 930–1 120 znaków (ok. 6,2 znaku na słowo ze spacjami i interpunkcją) plus ok. 50–100 znaków audio tagów (zakładam, że tagi są liczone jak znaki). **Przyjęto 1 100 znaków na minutę.**
- Eleven v4 w aplikacji: 1 kredyt/znak (brak oficjalnego potwierdzenia, patrz sekcja 1).
- Jednorazowo (nie na minutę): Voice Design dla 3 postaci, np. 10 generacji × ~300 znaków podglądu × 3 postacie ≈ 9 000 kredytów (≈ $1,64 na Creatorze).

### Koszt jednostkowy kredytu (USD za 1 000 kredytów, z ceny planu)
| Plan | Miesięcznie | Rocznie |
|---|---|---|
| Starter | $0,200 | $0,167 |
| Creator | $0,182 | $0,152 |
| Pro | $0,165 | $0,138 |
| Scale | $0,166 | $0,138 |
| Business | $0,165 | $0,138 |

### Scenariusze na 1 gotową minutę (tylko wersja oryginalna EN)
| Składnik | A: oszczędny | B: bazowy | C: intensywny |
|---|---|---|---|
| Dialog (2–3 głosy) | 1 100 zn. ×1 (retake'i w darmowych regeneracjach) = 1 100 | 1 100 ×3 = 3 300 | 1 200 ×3 = 3 600 |
| SFX | 12 × 80 kr (2 s, ustawiona długość) ×2 = 1 920 | 12,5 × 200 ×2 = 5 000 | 15 × 200 ×3 = 9 000 |
| Muzyka (1 min) | 900 ×1 = 900 | 900 ×2 = 1 800 | 900 ×3 = 2 700 |
| **Razem kredyty** | **~3 920** | **~10 100** | **~15 300** |
| Creator, miesięcznie ($0,182/1k) | $0,71 | $1,84 | $2,78 |
| Creator, rocznie ($0,152/1k) | $0,59 | $1,53 | $2,32 |
| Pro, miesięcznie ($0,165/1k) | $0,65 | $1,67 | $2,52 |
| Pro, rocznie ($0,138/1k) | $0,54 | $1,39 | $2,10 |

### Dubbing / lokalizacja (dopłata na 1 minutę, na język)
- D1 Automatic Dubbing bez znaku wodnego: 3 000 kr. 3 języki = 9 000, 5 języków = 15 000.
- D2 Dubbing Studio bez znaku wodnego: 10 000 kr. 3 języki = 30 000, 5 języków = 50 000.
- D3 Re-voicing TTS tym samym voice ID (założenie: ~1 250 znaków po tłumaczeniu, bo ES/DE/PT bywają dłuższe, ×2 próby ≈ 2 500 kr/język; muzyka i SFX użyte ponownie; tłumaczenie poza ElevenLabs). 3 języki ≈ 7 500, 5 języków ≈ 12 500.

| Wariant (B + lokalizacja) | Kredyty/min | Creator mies. | Pro mies. | Creator rocznie | Pro rocznie |
|---|---|---|---|---|---|
| B (tylko EN) | 10 100 | $1,84 | $1,67 | $1,53 | $1,39 |
| B + D1 ×3 języki | 19 100 | $3,47 | $3,15 | $2,89 | $2,63 |
| B + D1 ×5 języków | 25 100 | $4,56 | $4,14 | $3,80 | $3,45 |
| B + D2 ×3 języki | 40 100 | $7,29 | $6,62 | $6,08 | $5,51 |
| B + D2 ×5 języków | 60 100 | $10,93 | $9,92 | $9,11 | $8,26 |
| B + D3 ×3 języki | 17 600 | $3,20 | $2,90 | $2,67 | $2,42 |
| B + D3 ×5 języków | 22 600 | $4,11 | $3,73 | $3,42 | $3,11 |

### Pojemność miesięczna (bez rolloveru i overage)
| Wariant | Creator (121 000 kr): gotowe minuty | odcinki 60 s / 90 s / 120 s | Pro (600 000 kr): gotowe minuty | odcinki 60 s / 90 s / 120 s |
|---|---|---|---|---|
| A (oszczędny, EN) | ~30,9 | 30 / 20 / 15 | ~153 | 153 / 102 / 76 |
| B (bazowy, EN) | ~12,0 | 12 / 8 / 6 | ~59,4 | 59 / 39 / 29 |
| C (intensywny, EN) | ~7,9 | 7 / 5 / 3 | ~39,2 | 39 / 26 / 19 |
| B + D1 ×3 | ~6,3 | 6 / 4 / 3 | ~31,4 | 31 / 20 / 15 |
| B + D1 ×5 | ~4,8 | 4 / 3 / 2 | ~23,9 | 23 / 15 / 11 |
| B + D3 ×5 | ~5,4 | 5 / 3 / 2 | ~26,5 | 26 / 17 / 13 |

(Odcinki zaokrąglono w dół.) Przekroczenie puli na Creatorze kosztuje ~$0,18 za każde ~1 000 kredytów, na Pro ~$0,17 ([Pricing](https://elevenlabs.io/pricing)). Przykład: odcinek 90 s w wariancie B + D1 ×5 to ~37 650 kredytów, czyli ~$6,8 overage na Creatorze.

### Inferences
- Dla regularnej produkcji (np. 3–5 odcinków tygodniowo, czyli 12–20 miesięcznie, 90 s, EN) Creator jest za mały (~8 odcinków), a **Pro wystarcza z zapasem** (~39 odcinków EN albo ~15–20 z dubbingiem na 3–5 języków).
- Największą pozycją w wariancie bazowym są **SFX** (~50% kredytów). Biblioteka powtarzalnych efektów i ustawianie krótkich długości (40 kr/s) mocno obniżają koszt. Drugą dźwignią są darmowe regeneracje dialogu na www.
- Lokalizacja przez re-voicing TTS (D3) jest porównywalna lub tańsza od auto-dubbingu (D1) i daje spójność postaci. Dubbing Studio (D2) jest najdroższy.
- Generowanie TTS przez API ($0,08/1k znaków v4) jest ~2× tańsze niż kredyty w aplikacji na Pro. Ma to sens przy zautomatyzowanym pipeline (patrz luka w sekcji 1).

### Gaps
- Model opiera się na założeniach (liczba znaków, liczba prób, 1 kr/znak dla v4). Realny koszt należy zmierzyć na pilotażowym odcinku w zakładce Usage.
- Koszty nie obejmują tłumaczenia scenariuszy (LLM lub tłumacz), animacji ani montażu.

## 8. YouTube: wielojęzyczne ścieżki audio (multi-language audio) i auto-dubbing

### Takeaway
Multi-language audio (własne ścieżki dubbingowe) zostało 10.09.2025 rozszerzone na „miliony twórców” (TechCrunch: „all creators”). Obecnie wymaga dostępu do „Advanced features” i **działa także dla Shorts**. YouTube podaje, że twórcy z takimi ścieżkami mają średnio **ponad 25% czasu oglądania z widzów w innym niż główny języku** (dane z lipca 2025), a kanał Jamie Olivera zanotował **3× więcej wyświetleń**. Auto-dubbing YouTube jest darmowy, od lutego 2026 obejmuje 27 języków (8 z „expressive speech”), a lip sync to wciąż pilotaż.

### Cited Findings
- Help YouTube: „Multi-language audio is currently available to creators with access to Advanced features.” „The Multi-language audio feature allows you to upload audio tracks in different languages to a single video or Short.” Pliki mają być audio-only, w obsługiwanym formacie i „roughly the same length as your video”. Jeśli w danym języku istnieje auto-dub, trzeba go najpierw usunąć. Jeśli treści objęte prawami autorskimi w dodanej ścieżce różnią się od oryginału, plik może zostać usunięty. — [YouTube Help: Multi-language audio](https://support.google.com/youtube/answer/13338784)
- Blog YouTube (10.09.2025): „expansion of multi-language audio to millions of creators over the coming weeks”. Twórcy z ścieżkami wielojęzycznymi mają średnio „over 25% of their watch time come from views in the video's non-primary language” (dane z lipca 2025). Jamie Oliver: ścieżki „amplified views by 3x”. Mark Rober ma średnio ponad 30 języków na film. MrBeast jest wymieniony jako przykład dotarcia do „millions more viewers”. Trwa pilotaż wielojęzycznych miniatur. — [YouTube Official Blog](https://blog.youtube/news-and-events/multi-language-audio/)
- TechCrunch (10.09.2025): „YouTube's multi-language audio feature for dubbing videos rolls out to all creators”. — [TechCrunch](https://techcrunch.com/2025/09/10/youtubes-multi-language-audio-feature-for-dubbing-videos-rolls-out-to-all-creators/)
- Auto-dubbing (Help): „enabled by default for eligible creators”. Wykluczenia: filmy powyżej 120 min, filmy z małą ilością mowy lub bez mowy, zbyt szybka mowa, filmy z roszczeniami copyright. Języki **z angielskiego** (20): arabski, bengalski, niderlandzki, francuski*, niemiecki*, hebrajski, hindi*, indonezyjski*, włoski*, japoński, koreański, malajalam, **polski**, portugalski*, pendżabski, rosyjski, hiszpański*, tamilski, telugu, ukraiński. **Na angielski** z 29 języków (w tym polski). *Gwiazdka = expressive speech. Lip sync jest eksperymentalny („Early access ... available to select channels”). Dubbingi oznaczane są jako „auto-dubbed” w opisie. Można wybrać „Publish manually”, żeby przejrzeć dubbing przed publikacją. — [YouTube Help: Automatic dubbing](https://support.google.com/youtube/answer/15569972)
- Luty 2026: auto-dubbing dostępny „for everyone”, 27 języków, z możliwością wgrania własnego dubbingu lub wyłączenia funkcji. — [India TV News, 5.02.2026](https://www.indiatvnews.com/technology/news/youtube-auto-dubbing-feature-expands-to-all-users-now-supports-27-languages-2026-02-05-1029070)
- Blog YouTube (15.05.2026): 27 języków, expressive speech w 8. „As of December 2025, over 6 million viewers per day watched 10+ minutes of auto dubbed content.” Twórcy mogą wgrać własne dubbingi lub wyłączyć auto-dubbing. Statystyki per język są w filtrze „audio track” w Studio. — [YouTube Blog: auto dubbing explained](https://blog.youtube/creator-and-artist-stories/youtube-auto-dubbing-explained/)
- PPC Land (relacja z Creator Insider, 18.05.2026): auto-dubbingowane wersje mają średnio ~75% czasu oglądania oryginału. Expressive speech działa dla EN, ES, PT, FR, DE, IT, HI, ID. PM Buddhika Kottahachchi o slangu: „YouTube is in the bleeding edge of culture, our models are usually playing catch-up.” — [PPC Land](https://ppc.land/youtube-auto-dubbing-tops-6m-daily-viewers-expands-to-27-languages)

### Inferences
- Do serialu z wieloma oryginalnymi głosami postaci **własne ścieżki z ElevenLabs** (multi-language audio) są lepsze od auto-dubbingu YouTube. Auto-dub zastąpiłby charakterystyczne głosy generycznymi głosami AI, a według PM modele „nadrabiają” slang, co przy wulgarnej satyrze grozi utratą puent. Należy wyłączyć auto-dubbing dla języków, w których wgrywa się własną ścieżkę (albo usunąć auto-dub przed uploadem).
- Ścieżki dubbingowe powinny mieć ten sam podkład muzyczny i SFX co oryginał (inna zawartość chroniona prawem może skutkować usunięciem pliku) oraz identyczną długość. To sprzyja workflow „stem dialogu + wspólny bed SFX/muzyki”.
- Wzrosty typu „3×” (Jamie Oliver) i „>25% watch time” pochodzą z długich formatów dużych kanałów. Brak danych dla Shorts, więc nie należy ich bezpośrednio przenosić na Shorts.

### Gaps
- Brak oficjalnych danych o skuteczności multi-language audio i auto-dubbingu **dla Shorts** (pomoc YouTube potwierdza tylko, że funkcja działa dla Shorts).
- Nie znalazłem w źródłach pierwotnych potwierdzenia „tripled views” dla MrBeasta. Źródło YouTube wymienia go tylko ogólnie, a „3×” dotyczy Jamie Olivera.
- Brak informacji o Google'owym dubbingu opartym na Gemini jako osobnej, płatnej usłudze. Expressive speech w YouTube powstało z Google DeepMind ([PPC Land](https://ppc.land/youtube-auto-dubbing-tops-6m-daily-viewers-expands-to-27-languages)), ale nie badałem osobnych cen Google.

## 9. TikTok i Instagram/Facebook: tłumaczenia i dubbing

### Takeaway
Meta AI Translations (od sierpnia 2025, aktualizacja 14.07.2026) za darmo dubbinguje Reelsy głosem twórcy, z opcjonalnym lip sync. Na Instagramie obsługuje 14 języków (EN, ES, HI, PT, BN, TA, TE, MR, KN, FR, DE, IT, JA, KO), a tłumaczenia są oznaczane „Translated with Meta AI”. Facebook pozwala też wgrać do 20 własnych ścieżek dubbingowych na Reel. TikTok nie ma (według znalezionych źródeł) natywnych wielojęzycznych ścieżek audio dla treści organicznych. Jego AI dubbing (Symphony, od 06.2024) to narzędzie kreatywne w Creative Center, głównie dla reklam.

### Cited Findings
- Meta (pierwotnie 9.10.2025, aktualizacje 16.01, 20.01, 4.06 i 14.07.2026). Facebook: EN, ES, HI, PT, BN, TA, TE, MR, KN, a AR, ID, FR, TH, VI „soon” (4.06.2026). Instagram: te same 9 plus FR, DE, IT, JA, KO (14.07.2026). Lip sync opcjonalny. Uprawnieni: twórcy na Facebooku z 1 000+ obserwujących, wszystkie publiczne konta na Instagramie, w krajach z Meta AI. „Translating reels with Meta AI is free.” Etykieta „Translated with Meta AI”. Widz może wybrać „Don't translate”. Brak statystyk zasięgu. — [Meta Newsroom](https://about.fb.com/news/2025/10/discover-reels-around-world-meta-ai-translation/)
- Start w sierpniu 2025 (EN↔ES): Meta AI tłumaczy i dubbinguje głosem twórcy, z opcjonalnym lip sync. Twórcy stron na Facebooku mogą wgrać do 20 własnych ścieżek dubbingowych na Reel (Meta Business Suite / kompozytor Reels: „Upload your own translated audio tracks”). — [9to5Mac, 19.08.2025](https://9to5mac.com/2025/08/19/facebook-and-instagram-now-offer-ai-powered-dubbing-for-video-creators); [Meta for Creators blog](https://creators.facebook.com/blog/meta-ai-translations)
- TikTok Symphony (17.06.2024): AI dubbing w ok. 10+ językach i dialektach, avatary AI, w becie z listą oczekujących; narzędzie przeznaczone do reklam i treści markowych. — [TikTok Newsroom](https://newsroom.tiktok.com/announcing-symphony-avatars); [TechCrunch](https://techcrunch.com/2024/06/17/tiktok-ads-and-branded-content-will-now-include-ai-avatars-of-creators-and-stock-actors)
- Poradnik agencji Kurve: AI dubbing jest dostępny w TikTok Creative Center (Creative Tools → AI dubbing), z opcją lip sync i czasem generacji 15–25 min. Aktualności nie potwierdzono. — [Kurve](https://kurve.co.uk/how-to-boost-your-reach-with-tiktoks-ai-dubbing)
- Wbudowane tłumaczenia TikToka są głównie tekstowe (napisy i opisy, 15+ języków według poradnika Murf, czyli źródła drugorzędnego). — [Murf](https://murf.ai/blog/how-to-translate-tiktok-videos)

### Inferences
- **Instagram:** auto-tłumaczenie Meta AI jest projektowane pod głos twórcy. Przy wielu animowanych postaciach rezultat jest niepewny (może ujednolicić głosy). Instagram (według znalezionych źródeł) nie pozwala wgrać własnych ścieżek, więc pozostaje osobny upload wersji językowych albo zgoda na Meta AI. Na Facebooku można wgrać do 20 własnych ścieżek z ElevenLabs.
- **TikTok:** w praktyce lokalizacja oznacza osobne konta lub osobne wersje filmów (np. konto ES, konto PT) z dubbingiem z ElevenLabs oraz napisy. To wniosek z braku natywnej funkcji ścieżek.

### Gaps
- Nie znalazłem oficjalnego ogłoszenia TikToka z 2025–2026 o wielojęzycznych ścieżkach audio lub dubbingu dla organicznych filmów twórców ani aktualnej listy języków Symphony AI dubbing.
- Brak potwierdzenia, czy Instagram (nie Facebook) pozwala na wgrywanie własnych ścieżek dubbingowych.
- Brak danych o skuteczności Meta AI Translations (wzrost zasięgu).

## 10. Alternatywy (krótko): Rask AI, HeyGen, auto-dub YouTube, Meta AI

### Takeaway
Do samego dubbingu: YouTube auto-dub i Meta AI Translations są darmowe (głosy generyczne lub głos twórcy, ograniczone języki). Rask AI kosztuje $39–249/mies. (25–250 min), lip sync zużywa dodatkowe 3 min na minutę wideo, a ponad limit płaci się $3/min. HeyGen ma plany od $29/mies. (600 kredytów), ale strona nie podaje kosztu tłumaczenia w kredytach. ElevenLabs auto-dubbing (~$0,50/min w API v1 bez znaku wodnego, 3 000 kr/min w aplikacji ≈ $0,50–0,55) jest wyraźnie tańszy od Rask.

### Cited Findings
- Rask AI: Free trial 3 min; Creator $39/mies. ($329/rok, ~$28/mies.), 25 min/mies.; Creator Pro $99/mies. ($799/rok), 100 min/mies., $3 za dodatkową minutę; Business $249/mies. ($1 999/rok), 250 min/mies.; Enterprise custom. Enhanced lip-sync zużywa 3 min na każdą minutę wideo (plus 1 min tłumaczenia; cena beta), od Creator Pro. 135+ języków tłumaczenia, klonowanie głosu w 57 językach. — [Rask AI Pricing](https://www.rask.ai/pricing)
- HeyGen: Free $0 (3 filmy/mies., do 1 min); Creator $29/mies. ($24 rocznie), 600 kredytów; Pro $49/mies. (1 000 kredytów); Business $149/mies. + $20/miejsce (1 500 kredytów); 175+ języków i dialektów. Strona nie podaje kosztu tłumaczenia wideo w kredytach na minutę. — [HeyGen Pricing](https://www.heygen.com/pricing)
- Źródła trzecie (sprzeczne): HeyGen 5 kredytów/min z lip sync i 2 kredyty/min bez lip sync, czyli ok. $0,24/min na planie Creator. Rask ~$2,40/min. — [Perso.ai (konkurent, niska wiarygodność)](https://perso.ai/blog/ai-dubbing-pricing-2026-cost-breakdown-for-every-major-tool)
- YouTube auto-dub: darmowy, 27 języków, dostępny dla wszystkich od 02.2026. — [India TV News](https://www.indiatvnews.com/technology/news/youtube-auto-dubbing-feature-expands-to-all-users-now-supports-27-languages-2026-02-05-1029070); [YouTube Help](https://support.google.com/youtube/answer/15569972)
- Meta AI Translations: darmowe. — [Meta Newsroom](https://about.fb.com/news/2025/10/discover-reels-around-world-meta-ai-translation/)

### Inferences
- Lip sync (Rask, HeyGen, Meta, pilotaż YouTube) ma ograniczone znaczenie dla animacji 2D. Prościej i taniej jest animować usta pod każdą wersję językową albo stosować stylizowany „flap” bez dopasowania.
- Przy założeniu „wszystko w ElevenLabs” alternatywy służą głównie jako punkt odniesienia cenowego. ElevenLabs auto-dubbing (~$0,50/min/język) lub re-voicing TTS są najtańsze spośród płatnych opcji z zachowaniem kontroli.

### Gaps
- Brak oficjalnej ceny HeyGen za minutę tłumaczenia wideo (strona cennika nie podaje przeliczników).
- Nie badałem cen Google Cloud / Gemini do dubbingu (np. Gemini TTS lub Chirp) jako osobnej usługi.
