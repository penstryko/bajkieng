# Dr. Beige: biblia serialu (v1.1)

> **Tagline:** *Every thing has trauma.*
> Pionowy (9:16) serial animowany dla dorosłych, odcinki 64 s (maks. 120 s), idealna pętla, produkcja code-first: Claude Code + Remotion + lalki SVG + ElevenLabs + Rhubarb.
>
> Stan na 8 listopada 2026 r. Dokument roboczy produkcji. Fakty i liczby z raportu `reports/Serial animowany Shorts dla dorosłych.md` (dalej: **Raport**) podaję z nazwą sekcji w nawiasie kwadratowym. Wartości oznaczone jako **szacunek** albo **założenie** to wyliczenia tej biblii, do zmierzenia w pilocie. Wszystkie imiona i tytuły są robocze do czasu clearance (sekcja 12).

**Skróty sekcji Raportu:**
[R-Wzorce] „Cztery wzorce uczą jednego…” · [R-Humor] „Bez słów, z bełkotem albo z dubbingiem…” · [R-Postać] „Postać rozpoznawalna po sylwetce…” · [R-Pętla] „Idealną pętlę gwarantuje matematyka klatek i próbek…” · [R-Eleven] „ElevenLabs kosztuje 2,6–7,2 zł…” · [R-Pipeline] „Pipeline code-first…” · [R-Regulaminy] „Przekleństwo w dialogu zarabia…” (z podsekcjami „made for kids”, „Inauthentic content”, „Oznaczanie AI”) · [R-Strategia] „Trzy do pięciu samodzielnych odcinków tygodniowo…” · [R-Szablon] „Szablon scenariusza 60 s…” · [R-Koncepcje] „Pięć oryginalnych koncepcji…” · [R-Checklista] · [R-30dni] · [R-Ryzyka].

## Spis treści

1. Decyzja
2. Logline, ton, zasady świata
3. Stała obsada
4. Generator pacjentów (postaci gościnnych)
5. Plan zdjęciowy 9:16
6. Silnik odcinka
7. Running gagi i sygnatury dźwiękowe
8. 30 zalążków odcinków (sezon 1)
9. Specyfikacja techniczna dla Claude'a
10. Zasady treści
11. Rozwój długoterminowy
12. Oryginalność i clearance

---

## 1. Decyzja

**Wybrany temat: „Dr. Beige”** (w konkursie koncepcji jako „Dr. Mm-hm”; tytuł zmieniony 8.11.2026 z powodu rejestracji znaku „MMHMM”, sekcja 12.3). Najtańsza terapeutka we wszechświecie przyjmuje pacjentów, których nikt nigdy nie wysłuchał: przedmioty, pojęcia, dni tygodnia i zjawiska. Z drugiego miejsca („Factory Reset”) przejmuję najlepsze elementy produkcyjne, bo oba koncepty mają ten sam silnik.

| Koncepcja | Wynik | Niewyczerpywalność | Łatwość rozwoju | Łatwość generowania | Globalność | Pętla | Niskie ryzyko |
|---|---|---|---|---|---|---|---|
| **Dr. Beige** (w konkursie: „Dr. Mm-hm”) | **8.83** | 10 | 8.7 | 8.7 | 8.7 | 9.3 | 6.3 |
| Factory Reset (robocza nazwa; alternatywa: „Last Call for Things”) | 8.82 | 9 | 8.7 | 10 | 7 | 9 | 7.3 |
| Double or Dead (robocza nazwa; catchphrase „Step into the light!”) | 8.08 | 9 | 9 | 7.3 | 8 | 8.7 | 5.3 |
| Breaking Crumbs (robocza nazwa; podtytuł „the pigeon news”) | 8.08 | 9.7 | 9 | 8 | 5 | 7.7 | 6 |
| Planet Sitter | 7.9 | 8.7 | 8 | 7.3 | 8.3 | 9.3 | 5.3 |
| Flight 404 | 7.5 | 7.7 | 7.3 | 7 | 8.7 | 8.7 | 6.3 |
| Gas & Souls | 7.23 | 7 | 7.3 | 7.7 | 6.7 | 8.3 | 6 |
| Permit Pending | 5.9 | 3.7 | 4 | 8.3 | 8.3 | 8.3 | 4.3 |
| Hey, Doris | 5.28 | 5.3 | 5.3 | 5 | 4 | 7.3 | 5 |
| Chad Dies for Content | 5.13 | 6.3 | 5 | 3 | 7.3 | 7.3 | 3.3 |
| Gym Bros vs. the Apocalypse | 4.08 | 3.7 | 4 | 2.7 | 6.3 | 6.7 | 4 |

Wagi: niewyczerpywalność 25%, łatwość rozwoju 20%, łatwość generowania 25%, globalność 10%, pętla 10%, niskie ryzyko polityk i IP 10%.

**Dlaczego ten temat spełnia trzy kryteria:**

1. **Niewyczerpywalny przez lata.** Silnik „każdy rzeczownik ma traumę” obejmuje przedmioty, technologie, kalendarz, pojęcia, instytucje i narzędzia zawodów. Każde święto, news i komentarz widza da się zamienić w pacjenta bez realnych nazwisk, a 30 rad i 17 typów wyjść mnoży się z każdym pacjentem.
2. **Łatwy do rozwoju.** Terapia par, grupowa, nawroty pacjentów, turnieje i kompilacje używają tej samej scenografii i tych samych lalek. Ciągłość (usychająca roślina, dyplom, licznik pacjentów, bateria Chirpa) buduje „lore” bez kosztu.
3. **Łatwy do wygenerowania przez Claude'a.** Jest jedno tło na zawsze, a cała obsada siedzi lub leży i jest schowana od pasa w dół, więc nikt nie chodzi. Doktor ma 15 intonacji „Mm-hm” nagranych raz, pacjenci mówią efektami SFX, a jedynym nowym assetem odcinka jest lalka pacjenta z generatora plus statyczna winieta w dymku.
4. **Remis z „Factory Reset” (8.82) rozstrzyga szerszy zbiór pacjentów.** U Dr. Beige pacjentem może być też pojęcie, dzień czy zjawisko, nie tylko przedmiot. Do tego łańcuch „rada → dosłowne zastosowanie → zwrot” sam generuje różne wyniki, co jest najlepszą obroną przed zarzutem „inauthentic content” [R-Regulaminy].

### Co poprawiłem względem zwycięskiej koncepcji

| Problem w wersji z konkursu | Poprawka w biblii | Podstawa |
|---|---|---|
| Miętowa kanapa i pastele grożą klasyfikacją „made for kids” | Kanapa w butelkowej zieleni, wytarta skóra, wieczorna, ciemna paleta, brud i zacieki | [R-Regulaminy], „made for kids” |
| Klatka 0 to pusta kanapa, a Raport każe pokazać w klatce 0 środek akcji | Klatka 0 = pacjent odcinka zawieszony w locie nad kanapą (kreskówkowe zawiśnięcie, linie ruchu), jego wyraźny cień na siedzisku, Chester z oczami w górze w przerażeniu, ikona pacjenta w okularach doktor, napis „PATIENT #001: …”. Każda klatka 0 pokazuje więc innego gościa | [R-Strategia], „Pierwsza sekunda” |
| Tyknięcie minutnika wypadało dokładnie na szwie, a Raport wymaga 100–200 ms bez uderzeń wokół szwu | Siatka tyknięć przesunięta o 0,25 s: tyk na 0,25 s, 0,75 s… 63,75 s, czyli 250 ms od szwu z obu stron | [R-Pętla] |
| Okrągłe okulary i siwy bob są blisko Edny Mode („Iniemamocni”) | Szkła jako zaokrąglone kwadraty-ekrany CRT, szersze niż głowa, wysoka sylwetka-linijka | sekcja 12 |
| Bob, grube czarne kwadratowe okulary i golf to trzy cechy Velmy („Scooby-Doo”, także serial dla dorosłych „Velma”, HBO Max 2023–2024), a bordowy sweter, czarne okulary i siwe włosy zbliżały doktor do Roz („Potwory i spółka”) | Okulary-ekrany zostają jedyną sygnaturą. Zamiast boba wysoka siwa trwała, zamiast bordowego golfu petrolowy kardigan na koszuli z kołnierzykiem i smycz z identyfikatorem „DR.” | sekcja 12 |
| Guziki zamiast oczu przypominają „Koralinę” | Oczy Chestera to pikowania skóry, które otwierają się jak powieki | sekcja 12 |
| Sprzątanie po katastrofie pochłaniało dużo animacji | Reset przez cięcie na zbliżenie okularów: doktor przeciera szkła, a plan ogólny wraca już czysty | sekcja 6.2 |
| Ryzyko puent bliskich samobójstwu (świeczka, która „żyje, by się wypalić”) | Zasada świata nr 11: pacjent nigdy nie chce przestać istnieć; finały są kreskówkowe i odwracalne | [R-Regulaminy] |
| Brak twardego bezpiecznika na „tę samą sytuację z tym samym wynikiem” | Rejestr wyników (`ledger`) i reguły lint sprawdzane przed renderem | [R-Regulaminy], „Inauthentic content” |
| Wulgaryzmy tylko jako piknięcia, bez ostrza | Piknięcia i grawlixy plus Chirp, który cenzuruje z opóźnieniem, więc czasem przecieka jedno prawdziwe przekleństwo | [R-Humor], [R-Regulaminy] |

**Wszczepione elementy innych koncepcji:** z „Factory Reset” Chirp jako uniwersalny cenzor, generator przedmiotów, tabele ziaren i rywal po drugiej stronie ulicy (tu: kiosk Nod-O-Matic 99¢); z „Double or Dead” rejestr wyników, ankiety „zgadnij finał” i turniej powracających pacjentów; z „Breaking Crumbs” mikrożarty do wyłapania przy powtórce (dyplom, notatki); z pozostałych koncepcji konkursu okno z konsekwencjami za plecami doktor, mnożnik terapii par A×B, zagrożenie spoza kadru (tu: pukanie właściciela) i przewijanie VHS jako gwarantowany szew. Do tego numer pacjenta budujący nawyk [R-Strategia].

---

## 2. Logline, ton, zasady świata

**Logline (PL).** Najtańsza terapeutka we wszechświecie przyjmuje pacjentów, których nikt nigdy nie wysłuchał: drukarkę z wypaleniem zawodowym, poniedziałek, którego wszyscy nienawidzą, algorytm z poczuciem winy i ostatni kawałek pizzy z lękiem przed porzuceniem. Mówi tylko „Mm-hm.”, a jej rady, brane dosłownie, zawsze kończą się katastrofą. Tyle że za każdym razem inną.

**Logline (EN, do opisu kanału).** *The world's cheapest therapist treats everything humanity has ever abused: printers, Mondays, passwords, the last slice of pizza. She only says "Mm-hm." Her advice always backfires. Differently every time.*

**Ton.**
- **Deadpan kontra histeria.** Doktor jest płaska jak jej głos, pacjenci wybuchają, a kanapa cierpi w milczeniu.
- **Satyra kultury terapii i self-care.** „Postaw granice”, „pozwól odejść” i „celebruj siebie” wzięte dosłownie przez przedmiot.
- **Satyra ludzkości widzianej oczami rzeczy.** Ludzie to szare, bezimienne sylwetki, które kopią, wyrzucają i przeklinają (sekcja 4.7).
- **Czarny humor egzystencjalny przedmiotów, ale bez śmierci z wyboru.** Pacjent może wybuchnąć, zostać połknięty albo przerobiony, nigdy nie chce przestać istnieć.
- **Rdzeń gagu zawsze jest wizualny:** rysunek w notesie, treść okularów, reakcja kanapy, konsekwencja w oknie. Tak każe hierarchia humoru przenośnego globalnie [R-Humor].
- **Sygnały dorosłości:** czynsz, wypalenie, długi, biurokracja, wulgaryzmy (piknięte i czasem nie), ciemna paleta, brud. Nigdy przez seks ani gore.

### Zasady świata (generują historie)

1. **Każdy rzeczownik ma traumę.** Przedmiot, pojęcie, dzień, instytucja albo zjawisko może przyjść na terapię. Przyczyną traumy są prawie zawsze ludzie.
2. **Sesja trwa jeden obrót minutnika.** DING kończy sesję bez względu na to, co się dzieje. Minutnik jest jedynym prawem fizyki, któremu podlega gabinet.
3. **Doktor mówi tylko „Mm-hm.”** w kilkunastu intonacjach. Pełne zdanie pada najwyżej raz na ok. 10 odcinków i jest wydarzeniem.
4. **Rada zawsze ma postać jednego, prymitywnego rysunku w notesie,** bez słów. Pacjent rozumie ją dosłownie.
5. **Dosłowne zastosowanie rady eskaluje na zewnątrz.** Konsekwencje widać w oknie za doktor, a w kulminacji wchodzą do gabinetu.
6. **Okulary pokazują, co doktor naprawdę myśli.** Kłamie twarzą, nigdy szkłami.
7. **Chester pamięta wszystko.** Połyka małych pacjentów i czasem wykasłuje rekwizyt z dawnego odcinka (easter egg).
8. **Chirp ma zdechłą baterię i nikt jej nie wymienia.** Ćwierka w najgorszym momencie i cenzuruje przekleństwa, zwykle z opóźnieniem.
9. **Czynsz jest zawsze zaległy.** Dlatego doktor przyjmuje pacjentów bez przerwy, a właściciel puka (nigdy go nie widać, najwyżej jego owłosione ramię).
10. **Ciągłość płynie między odcinkami, nigdy wewnątrz.** Roślina usycha, dyplom zmienia napis, licznik pacjentów rośnie. W obrębie odcinka wszystko wraca do stanu z klatki 0.
11. **Nikt nie chce przestać istnieć.** Finały są kreskówkowe i odwracalne (konfetti, pierze, połknięcie, odlot). Żadnych realnych zaburzeń, samookaleczeń ani samobójstw.
12. **Świat bez nazwisk i marek.** Instytucje i zjawiska występują wyłącznie jako przedmioty-symbole (inflacja to balon z „%”, obietnica wyborcza to dziurawy zwój). Żadnych realnych osób, partii ani logo.
13. **Wynik nigdy się nie powtarza.** Ten sam typ wyjścia nie wraca przez 6 odcinków, a ten sam zwycięzca nie wygrywa trzy razy z rzędu (sekcja 6.3).

---

## 3. Stała obsada

Trzy stałe postacie plus trzy stałe motywy spoza obsady. Każdą główną postać trzeba **najpierw narysować ręcznie i datować** (skan do `bible/sketches/`), a dopiero potem przenieść do SVG [R-Postać]. Każda ma 2–4 własne kolory, unikalny kształt, jeden rekwizyt i test sylwetki oraz ikony [R-Postać].

### 3.1 Dr. Beige (terapeutka)

**Rola.** Deadpan, chciwa, zmęczona, nieprzejmująca się niczym. Licencja z niczego, za to czynsz z wszystkiego.

**Nazwisko.** „Beige” (beżowy) to najnudniejszy kolor świata: kolor ścian taniego gabinetu, poczekalni i biurowych drukarek. Nazwisko streszcza jej płaskość i brak reakcji, a kontrast z histerią pacjentów jest żartem samym w sobie. Identyfikator na smyczy nadal pokazuje tylko „DR.”, a jej kwestią pozostaje „Mm-hm.”.

**Sylwetka z prostych kształtów** (współrzędne w kadrze 1080×1920):
- **Ciało i głowa to jeden wysoki, wąski prostokąt** („linijka”) o szerokości 180 px. Głowa jest tej samej szerokości co tułów. Twarz y 600–860, kardigan od y 860 w dół.
- **Siwa trwała:** zwarty, wysoki blok drobnych loków (rząd nakładających się kółek r 14–18 px), x 655–865, y 525–660, szerszy od twarzy o 15 px z każdej strony. Przedłuża sylwetkę-linijkę w górę i kończy się pod dyplomem (y ≥ 525).
- **Ubranie:** petrolowy rozpinany kardigan z dwoma dużymi guzikami na koszuli z białym kołnierzykiem; na szyi smycz z identyfikatorem „DR.” (prostokąt 60×40 px, środek ok. (760, 955), nad podkładką).
- **Okulary-ekrany (sygnatura sylwetki):** dwa zaokrąglone kwadraty 112×96 px z mostkiem 22 px, łącznie 246 px, czyli **szersze niż głowa i włosy**. Grube czarne oprawki, szkła to małe ekrany CRT z liniami skanowania.
- **Nos** to mały trójkąt pod mostkiem, **usta** to krótka pozioma kreska.
- **Ręce:** cienkie rurki z rękawiczkowymi dłońmi, obrót z barku. Prawa trzyma długopis, lewa podkładkę.
- **Od pasa w dół** zasłaniają ją podkładka (x 650–830, y 1010–1210) i fotel.

**Paleta HEX**

| Element | HEX |
|---|---|
| Kardigan (petrol) | `#1F5E66` |
| Kardigan, cień | `#15454B` |
| Koszula (kołnierzyk) | `#E8E2D4` |
| Smycz / identyfikator | `#161616` / `#F2ECDD` |
| Włosy (siwa trwała) | `#B7B2AB` |
| Włosy, cień | `#8D8882` |
| Skóra | `#E3BE9E` |
| Skóra, cień | `#C99D7C` |
| Oprawki | `#161616` |
| Szkło-ekran wyłączone | `#1F2B2F` |
| Treść ekranu (fosfor zielony) | `#8EF0C9` |
| Treść ekranu (fosfor bursztynowy, alarm) | `#FFC857` |
| Podkładka / kartka | `#8A5A2E` / `#F2ECDD` |
| Długopis | `#2448A8` |
| Fotel za nią | `#3A2418` |

**Rekwizyt-sygnatura.** Podkładka z notatkami i długopis z klikiem. Notatki to prymitywne rysunki czerwonym markerem, które widz dostaje jako puenty dla dorosłych (pacjent z rogami, „$” w kółku, wulgarny gest), nigdy jako rysunek „diagnozy” pacjenta (sekcja 12.1, „Doc McStuffins”). Drugi rekwizyt to szuflada stolika z zapasowymi minutnikami i okularami (running gag).

**Poza-sygnatura („werdykt”).** Doktor zsuwa okulary palcem na czubek nosa, widać jej malutkie, zmęczone oczy-kropki, mówi „Mm-hm.” i klika długopisem. Poza w klatce 0: długopis uniesiony 20 px nad kartką, głowa prosto, w szkłach ikona akt pacjenta.

**Catchphrase.** „Mm-hm.” (Rzadkie wydarzenie, najwyżej raz na ok. 10 odcinków: „Same time next week.”)

**Sposób mówienia.** Wyłącznie „Mm-hm.” w 15 intonacjach nagranych raz i używanych bez końca (biblioteka MM01–MM15, sekcja 7.3), plus klik długopisu i chrząknięcie. Zero dubbingu, Rhubarb potrzebny tylko przy rzadkim pełnym zdaniu.

**Prompt ElevenLabs Voice Design** (struktura trzech linii według dokumentacji [R-Eleven]; bez słów-efektów typu „reverb”, „echo”, „phone”):

```
Native English. Female, late 60s. Studio quality.
Persona: underpaid, deadpan therapist. Emotion: flat, bored, unshockable.
A very low, slow, monotone voice with a dry, slightly nasal hum and a lazy closed-mouth delivery; long pauses and very little pitch movement, usually flat, but capable of rare sudden sharp reactions.
```

Tekst podglądu (150–300 znaków normalnej mowy w charakterze postaci, „Mm-hm” dopiero na końcu). Referencja API Voice Design podaje dla tekstu zakres 100–1000 znaków (notatki `elevenlabs_i_dubbing.md` mają ten zakres tylko ze źródła wtórnego, więc sprawdzić przy pierwszej generacji), a dokumentacja mówi, że dłuższy tekst pasujący do osobowości daje stabilniejszy głos. Z samych mruknięć model nie ma z czego zbudować barwy:
`Mm-hm. Go on. So the toaster left you, and now you feel like crumbs. I see. And how does that make you feel? Interesting. That will be ninety dollars. Time is up. Same time next week. Mm-hm. Mm-hm?`

Ustawienia: guidance scale 30–40%, stability 45–50 dla linii płaskich (płaskość ważniejsza niż ekspresja) i 30–35 dla linii ekspresyjnych (sekcja 7.3). Jeden model na cały sezon, wybrany po teście A/B tej samej sceny i wszystkich tagów z 7.3 na v3 i v4 [R-Eleven].

**Zakres min (wymiana elementów SVG)**

| Emocja | Brwi (nad oprawkami) | Usta | Okulary | Treść szkieł | Dodatkowo |
|---|---|---|---|---|---|
| Neutralna (klatka 0) | poziome | kreska | na nosie | ikona akt pacjenta | długopis w górze |
| Znudzona | nisko, płasko | kreska lekko w dół | na nosie | ZZZ / burger | głowa −4° |
| Zainteresowana | jedna w górę | małe „o” | na nosie | „?” | pochylenie (skala 1,03) |
| Sceptyczna | jedna w górę, druga w dół | krzywa kreska | zsunięte o 20 px | „…” | — |
| Groźna | ściągnięte w V | zaciśnięta | zsunięte o 40 px (widać oczy) | czaszka | — |
| Przerażona | wysoko | „O” | podskok o 12 px | syrena / „!!!” | kropla potu |
| Sarkastyczna | jedna w górę | półuśmiech | na nosie | przewracające się oczy | — |
| Zachwycona (rzadko) | łuki wysoko | uśmiech | na nosie | $$$ / gwiazdki | — |
| Zdegustowana | V | falista | na nosie | sedes | — |
| Rozczarowana | ukośne w dół | w dół | na nosie | płaska linia | westchnienie |
| Rozkojarzona | — | — | na nosie | pizza / kotek / plaża | — |
| Wściekła | mocne V | prostokąt zębów | na nosie | płomień | para nad trwałą |

### 3.2 Chester (kanapa)

**Rola.** Najbardziej straumatyzowana postać serialu. Widział wszystko, nie może uciec, wszystko pamięta. Połyka małych pacjentów jak każda kanapa połyka pilota i drobne.

**Sylwetka z prostych kształtów:**
- Kanapa Chesterfield w ujęciu frontalnym, x 40–620. Oparcie to zaokrąglony prostokąt y 840–1090 z rzędem pikowań. Siedzisko y 1090–1190, przednia falbana y 1190–1380. Lewy zwinięty podłokietnik x 40–170, y 1010–1340.
- **Twarz na lewym końcu oparcia** (x 60–250, y 860–1010), poza zasięgiem pacjenta. **Oczy:** dwa pikowania (115, 905) i (200, 905), które otwierają się jak skórzane powieki i odsłaniają białka r = 28 px ze źrenicami. **Usta:** pozioma fałda skóry y ≈ 985, x 105–205, która przy połykaniu rozwiera się w ciemny otwór do 90 px wysokości.
- Łata z taśmy na siedzisku i jedna sprężyna, która wyskakuje w panice.

**Paleta HEX**

| Element | HEX |
|---|---|
| Skóra kanapy (butelkowa zieleń) | `#1E4A37` |
| Cień, pikowania | `#123024` |
| Połysk | `#2D6650` |
| Białka oczu | `#EEE8DA` |
| Źrenice | `#101010` |
| Szwy | `#0B2016` |
| Wnętrze ust | `#0A0F0C` |
| Sprężyna | `#9AA0A6` |
| Wypełnienie (pierze, gąbka) | `#E8E0CC` |
| Łata z taśmy | `#A8A8A0` |

**Rekwizyt-sygnatura.** Szczelina-usta i „zawartość”: pilot, monety, rekwizyty z poprzednich odcinków.

**Poza-sygnatura („brace”).** Oczy wywrócone do góry w przerażeniu, usta zaciśnięte, siedzisko lekko ugięte. To także poza Chestera w klatce 0, bo z góry spada pacjent.

**Catchphrase.** Dźwięk zamiast słów: długie skrzypnięcie-westchnienie sprężyn (zapis w napisach: `*creeeak*`).

**Sposób mówienia.** Nie mówi. Westchnienia, stęknięcia, przełknięcia, czkawka i chrapanie z głosu Voice Design (tagi `[sighs]`, `[exhales]`), zmiksowane ze sprężynami z biblioteki SFX. Przy podłączaniu, wkładaniu albo wciskaniu czegoś w kanapę (kable, porty, szczeliny; poza połknięciem E03) Chester nie wydaje żadnych wokaliz, tylko skrzypi sprężynami i robi minę (sekcja 10, `lint/blocklist.json`).

**Prompt ElevenLabs Voice Design** (głos projektujemy na mówionym tekście, a w odcinkach używamy go tylko do dźwięków niewerbalnych generowanych tagami):

```
Native English. Male, 60s. Studio quality.
Persona: weary, long-suffering old man. Emotion: anxious, mournful, exhausted.
A very deep, gravelly, breathy voice that speaks slowly and wearily, with heavy exhalations, tired sighs and creaky, strained groans between words.
```

Tekst podglądu (mowa, nie same tagi, bo głos zbudowany wyłącznie z `[sighs]` i `[exhales]` wychodzi losowo):
`Oh no... not again. Please, not the heavy ones. [sighs] I have been here since nineteen seventy-nine. Every coin, every remote, every crumb. Nobody ever asks how the couch is doing. [exhales] Fine. Sit. Everybody always sits.`

Alternatywa bez Voice Design: westchnienia i stęknięcia z SFX v3, np. `old leather sofa groaning like a tired old man, deep breathy sigh, no words`.

**Zakres min**

| Emocja | Powieki / oczy | Usta (fałda) | Ciało |
|---|---|---|---|
| Neutralna | półprzymknięte, źrenice na środku | prosta | — |
| Przerażona (klatka 0) | szeroko, źrenice w górę | zaciśnięta | siedzisko ugięte o 2% |
| Ból | zmrużone | falista | ugięcie 4% przy lądowaniu (squash) |
| Smutna | opadnięte | łuk w dół | westchnienie: skala Y 0,97 i powrót |
| Ulga | zamknięte | lekko otwarta | „wypuszczenie powietrza” |
| Czujna | jedno oko otwarte, źrenica na pacjencie | prosta | — (bez ślinki i bez pochylenia w stronę pacjenta) |
| Zdegustowana | jedno zmrużone | krzywa | — |
| Zadowolona z siebie | półprzymknięte, w bok | uśmieszek | — |
| Śpiąca | zamknięte | otwarta, chrapanie | oddech skala Y ±1% |
| Panika | szeroko, drżące źrenice | otwarta | wyskakuje sprężyna, pierze |

### 3.3 Chirp (czujnik dymu)

**Rola.** Biały krążek przyklejony do sufitu, z wyczerpaną baterią. Cenzor serii i jej najdłuższy łuk: nikt nie wymienia mu baterii (finał sezonu 1).

**Sylwetka.** Płaski krążek r = 46 px w punkcie (170, 300), widziany lekko od dołu. Koncentryczne szczeliny wentylacyjne i jedna dioda-oko (r = 7 px). Nie ma twarzy: emocje gra dioda i drgania.

**Paleta HEX:** obudowa `#E9E7E1`, obrzeże i cień `#C2BFB6`, szczeliny `#9F9B91`, dioda zgaszona `#4A1414`, dioda zapalona `#FF2B2B`, poświata diody `#FF6B6B` (krycie 40%).

**Rekwizyt.** Brak, sam jest rekwizytem. W finale sezonu pojawia się bateria 9V.

**Poza-sygnatura.** Przechył o 10° i błysk diody przy ćwierknięciu.

**Catchphrase.** `*chirp*`. Rzadko, jako wydarzenie, jedno słowo: „Battery…”.

**Sposób mówienia.** Ćwierknięcia (SFX10). Cenzuruje przekleństwa pacjentów, ale z powodu słabej baterii **czasem spóźnia się o pół sylaby**: jedno prawdziwe przekleństwo przecieka, co jest gagiem dla dorosłych.

**Prompt ElevenLabs Voice Design** (tylko do „Battery…”):

```
Native English. Gender-neutral, adult. Studio quality.
Persona: tiny, fading little gadget. Emotion: weak, pleading, sleepy.
A very small, thin, high-pitched voice in short breathy fragments, getting quieter and slower at the end of each word as if running out of power.
```

**Zakres min:** spoczynek (dioda zgaszona), ćwierknięcie (błysk diody przez 3 klatki i drżenie ±2 px), błaganie (wolne pulsowanie diody), alarm (finał: stroboskop i drżenie ±6 px), „omdlenie” (dioda gaśnie z opadającą poświatą).

### 3.4 Stałe motywy spoza obsady (zero kosztu animacji)

| Motyw | Jak wygląda | Funkcja |
|---|---|---|
| **The Landlord** | Nigdy nie widać go w całości: trzy ciężkie puknięcia (SFX15), czasem owłosione ramię wsuwające się zza krawędzi kadru | zagrożenie spoza kadru, uzasadnienie pętli (czynsz), typ wyjścia E13 |
| **Nod-O-Matic 99¢** | Neonowy kiosk z kiwającą głową robota i ceną „99¢” w oknie po drugiej stronie ulicy. Nazwa jest całkowicie wymyślona, bez członu „Thera-”, żeby nie kojarzyła się z realnym chatbotem terapeutycznym (sekcja 12) | tani rywal-chatbot, mikro-łuk satyry na terapię AI |
| **The Humans** | Szare, bezimienne sylwetki bez twarzy w dymkach-wspomnieniach (sekcja 4.7) | sprawcy traum, satyra ludzkości bez realnych osób |

---

## 4. Generator pacjentów (postaci gościnnych)

### 4.1 Zasada

Jeden pacjent na odcinek, składany z biblioteki parametrów funkcją `makePatient(spec, seed)`. Claude zapisuje `patient.json`, generator składa SVG, a autor poprawia jeden lub dwa szczegóły ręcznie (ludzki wkład). Pacjenci **nie mają rąk ani nóg**: działają funkcją (drukarka strzela papierem, toster wyrzuca grzankę) i rekwizytami, które pojawiają się z „pop”. To rozwiązanie najtańsze w animacji i najmocniej odróżniające serial od „object shows” (sekcja 12).

### 4.2 Parametry

| Parametr | Wartości | Uwagi |
|---|---|---|
| `category` | object, digital, calendar, concept, institution, tool, nature, food | rotacja w rejestrze (sekcja 6.3) |
| `size` | S (≤ 160 × 160 px, „połykalny”), M (≤ 300 × 300 px), L (≤ 330 px szerokości × 380 px wysokości, czyli całe pudełko x 245–575, y 770–1150) | tylko S może być połknięty (E03); szerszy pacjent zasłoniłby twarz Chestera (lint 16) |
| `shape` | 1 z 20 brył (4.3) | bryła = sylwetka do testu ikony |
| `palette` | `base`, `shade`, `accent` z palety pacjentów (4.3) | kolor realnego przedmiotu + 1 akcent |
| `functionMarker` | 1 znacznik funkcji (tacka z papierem, szczeliny tostera, pęknięty ekran z plakietką powiadomień, kartka „MON”) | najważniejszy element rozpoznania |
| `eyes` | 1 z 20 par (4.3) | duże, ale nie dziecięce: 22–30% szerokości bryły, w górnej 1/3 „twarzy” |
| `brows` | brak / 6 kształtów | emocja bez animowania oczu |
| `mouth` | `none` / `slot` (otwór funkcji) / `rhubarb` (A–H, X) | sterowanie: `rms` albo `rhubarb` (4.4) |
| `wear` | 1–3 z: rysy, taśma, naklejki, pęknięcie, rdza, plama kawy, przypalenie, metka z ceną, kurz, wgniecenie | wymagane ≥ 1; kodowanie dorosłości i historii (lint 13) |
| `accessories` | 0–2 z: kabel z wtyczką, antenka, wyświetlacz z liczbą („1%”, „ERR 49”), kartka „OUT OF ORDER”, żółta karteczka „URGENT”, taśma ostrzegawcza, kłódka | nigdy więcej niż 2; zakazane: kokardki, czapeczki urodzinowe, plastry, bandaże, stetoskopy (R8, sekcja 12) |
| `idle` | bob, jitter, vibrate, sway, pulse, flicker, drip, spin | ruch spoczynkowy, wygaszany przed szwem |
| `landing` | heavy (squash 0,7), bouncy (2 odbicia), splat (spłaszczenie i powolny powrót), float (miękkie), clatter (grzechot) | zdarzenie w klatce 15 |
| `soundLanguage` | 5 klipów: TALK, RANT, CRY, CURSE, EXIT | ElevenLabs SFX (4.4) |
| `voicePreset` | `null` albo VP1–VP6 | gdy samo SFX nie niesie emocji (pojęcia); wymagany, jeśli pacjent mówi jedno wyraźne słowo (lint 15) |
| `captionName` | do 4 słów EN, WIELKIMI | do napisu „PATIENT #nnn: …” |
| `adultCoding` | 1–2 z: worki pod oczami, ciężkie powieki, „zarost” z rdzy lub kurzu, zmęczone spojrzenie | wymagane ≥ 1; reguła R8, lint 13 |

### 4.3 Biblioteki

**20 brył:** 1 prostokąt pionowy (lodówka, kasa); 2 prostokąt poziomy (drukarka, pilot); 3 płytka z zaokrągleniem (telefon); 4 walec (świeczka, bateria, puszka); 5 krążek (robot sprzątający, ciastko); 6 kula (Pluton, Księżyc, balon); 7 klin (kawałek pizzy, ser); 8 stożek (pachołek); 9 arkusz (regulamin, kartka kalendarza); 10 kwadratowa karteczka (Password123); 11 dymek (small talk, pojęcia mówione); 12 chmura (algorytm, chmura danych); 13 worek (reklamówka); 14 butelka (szampon hotelowy); 15 pudełko z wiekiem (karton pizzy, prezent); 16 łuki (Wi-Fi); 17 kabel z wtyczką (ładowarka); 18 domek (rynek mieszkaniowy); 19 trójkątne drzewko (choinka); 20 spłaszczona kula z żebrowaniem (dynia).

**20 par oczu:** okrągłe wyłupiaste; zmęczone z workami; przekrwione; skośne wściekłe; opadające smutne; kropki; spirale (oszołomienie); łzawiące z kroplą; niedopasowane (duże i małe); cyklop; diody LED; pikselowe ekranowe; półprzymknięte znudzone; przerażone z małymi źrenicami; zezowate; gwiazdki (zachwyt); serduszka (zakochanie, bez podtekstu); krzaczaste brwi nad małymi oczkami; mrugające nerwowo (tik); monokl.

Ograniczenia oczu (ochrona przed „młodo wyglądającym pacjentem w cierpieniu”, R8): „gwiazdki” i „serduszka” to wyłącznie chwilowa podmiana (≤ 1 s, reakcja zachwytu lub zakochania), nigdy bazowa para pacjenta. Żadna z par „okrągłe wyłupiaste”, „gwiazdki” i „serduszka” nie występuje w ujęciu z klipem CRY ani w odcinku z wyjściem E03 (lint 13).

**Usta:** zestaw Rhubarba A–F oraz G, H, X w trzech stylach (cienkie, mięsiste, z zębami) [R-Pipeline]; „slot” jako naturalny otwór przedmiotu (szczelina tostera, tacka drukarki, klapka skrzynki).

**Paleta pacjentów (16 kolorów, kontrast z kanapą `#1E4A37` i ścianą `#4A4237`):** `#E9E4D8` beż biurowy, `#C0C4C8` srebro, `#F2B33D` musztarda, `#E4572E` pomarańcz, `#3D7DD8` niebieski, `#8E5CC9` fiolet, `#F0E14A` żółty, `#D94A64` malina, `#7FB069` zgniła zieleń jabłka, `#F4F1EA` złamana biel, `#B5651D` rdza, `#2E9CCA` turkus, `#CFA15A` karton, `#FF8C42` dyniowy, `#9B2335` wiśnia, `#5C6B73` grafit (tylko z jasnym obrysem). Każdy pacjent ma obrys 6 px `#121212` i jasny refleks u góry, żeby odcinał się od ciemnego tła.

### 4.4 Język dźwięków („Thingish”)

**Domyślnie pacjent mówi efektami SFX swojej funkcji.** Toster mówi dzwonkami i klikaniem, smartfon wibracją i powiadomieniami, Księżyc niskim buczeniem, algorytm piskiem modemu. To rozwiązanie działa w każdym kraju i nie wymaga dubbingu [R-Humor].

Pięć klipów na pacjenta z ElevenLabs Sound Effects, model SFX v3: v2 zniknie 1.03.2027 [R-Eleven], a v3 według dokumentacji lepiej trzyma się wieloczęściowych promptów i lepiej generuje dźwięki „wokalne” (notatki: `elevenlabs_i_dubbing.md`, sekcja 4). Ustawiona długość: 40 kredytów za sekundę [R-Eleven]. Szablon promptu:

```
{object} {emotion}: {sound palette of the object}, in a rhythm like a person {talking|ranting|sobbing|swearing}, {N} seconds, no music, no human voice
```

Przykład dla drukarki:
- TALK: `Office printer talking: short bursts of motor whirring, paper-feed clicks and soft beeps in a rhythm like a nervous person explaining something, 2.5 seconds, no music, no human voice`
- CURSE: `Office printer swearing: one harsh loud error buzz with a grinding paper jam crunch, 0.8 seconds, no music, no human voice`

**Przekleństwa** to klip CURSE i grawlix w dymku (`#$%&!`). Raz na odcinek pacjent może „przełączyć się” na jedno wyraźne angielskie słowo w szczycie emocji (np. „NO.”). Jeśli to przekleństwo, Chirp ćwierka z opóźnieniem.

**Presety głosu (opcjonalne, dla pojęć bez naturalnego dźwięku).** Głos czyta pseudojęzyk złożony z onomatopei przedmiotu (np. dla Poniedziałku: `Brrring-gah, mon-mon? BRRRING!`) i jest miksowany pod SFX. Testy są konieczne, bo czytanie bełkotu przez TTS bywa nieprzewidywalne.

```
VP1 Squeak
Native English. Male, 30s. Studio quality.
Persona: tiny, jittery nervous wreck. Emotion: anxious, frantic, apologetic.
A thin, high, fast voice that rushes words together and cracks upward when stressed.

VP2 Boom
Native English. Male, 50s. Studio quality.
Persona: huge, slow, gloomy giant. Emotion: heavy, sulky, wounded.
A very deep, booming, slow voice with long vowels and a rumbling chest tone.

VP3 Whine
Native English. Female, 40s. Studio quality.
Persona: entitled chronic complainer. Emotion: aggrieved, petulant, dramatic.
A nasal, whiny mid-pitched voice that stretches vowels and rises at the end of every phrase.

VP4 Crackle
Native English. Male, 80s. Studio quality.
Persona: ancient, forgotten grump. Emotion: bitter, confused, nostalgic.
A thin, crackly, trembling voice, slow and halting, with dry breaths between words.

VP5 Hype
Native English. Female, 20s. Studio quality.
Persona: overcaffeinated hype machine. Emotion: manic, eager, desperate.
A bright, fast, punchy voice with exaggerated emphasis, like an over-enthusiastic presenter.

VP6 Drone
Native English. Male, 40s. Studio quality.
Persona: dead-eyed office drone. Emotion: numb, resigned, tired.
A flat, mumbling, mid-low voice with no energy, words trailing off at the end.
```

**Usta pacjenta.** Dla mowy-SFX i bełkotu usta steruje obwiednia głośności (RMS) policzona raz do JSON-a i zmapowana na trzy kształty z zestawu Rhubarba: X (zamknięte), B (półotwarte), D (otwarte). Rhubarb uruchamia się tylko dla rzadkich angielskich słów, bo jego precyzyjny rozpoznawacz działa wyłącznie po angielsku, a tryb Phonetic jest mniej dokładny [R-Pipeline].

### 4.5 Reguły rozpoznawalności w 1 sekundę

- **R1 Test ikony.** Czarna sylwetka pacjenta w wysokości 160 px musi być rozpoznawalna [R-Postać]. Generator renderuje ją do `episodes/*/qa/icon.png` do oceny przez autora.
- **R2 Jeden znacznik funkcji, maksymalnie dwa akcesoria.** Jeśli bez napisu nie wiadomo, co to jest, zmień znacznik, nie dokładaj szczegółów.
- **R3 Realny kolor bazowy i jeden nasycony akcent.** W skali szarości jasność pacjenta różni się od kanapy i ściany o co najmniej 25 punktów procentowych (założenie produkcyjne).
- **R4 Oczy duże, ale nie dziecięce:** 22–30% szerokości bryły, w górnej 1/3 strony „twarzowej” (górny limit sprawdza lint 13).
- **R5 Dźwięk-sygnatura w ciągu 15 klatek od lądowania.** Ucho rozpoznaje szybciej niż oko.
- **R6 Napis „PATIENT #nnn: NAME” jest zawsze,** bo i tak przechodzi przez szew (sekcja 6.2). Nazwa ma do 4 słów, cały napis do 6 [R-Strategia].
- **R7 Bez kończyn.** Akcja wynika z funkcji przedmiotu.
- **R8 Kodowanie dorosłości (obowiązkowe).** Każdy pacjent ma co najmniej 1 element `adultCoding` (worki pod oczami, ciężkie powieki, „zarost” z rdzy lub kurzu, zmęczone spojrzenie) i co najmniej 1 element `wear`; sprawdza to lint 13. Bez dziecięcych proporcji, bez kokardek, czapeczek urodzinowych i plastrów, bez zabawek i przedmiotów dziecięcych jako pacjentów. Każdy odcinek pokazuje pacjenta w cierpieniu, a od marca 2026 r. YouTube odbiera reklamy za młodo wyglądające postacie, „human or non-human”, w cierpieniu [R-Regulaminy]. Połknięcie (E03) gramy jako szybki gag (gulp i beknięcie, do 1 s), bez zbliżenia na przerażonego małego pacjenta tuż przed nim i bez „głodnego” Chestera.
- **R9 Zero marek, logo i charakterystycznych designów produktów** (generyczny telefon, generyczna kasa).
- **R10 Pojęcie zawsze przez uniwersalny przedmiot-symbol:** kartka kalendarza, balon z „%”, dymek, zwój, ikona Wi-Fi, nigdy alegoryczny człowiek. Emocji jako takich („Smutek”, „Radość”) nie personifikujemy (sekcja 12).

### 4.6 Przykład `patient.json`

```json
{
  "name": "Office Printer",
  "captionName": "OFFICE PRINTER",
  "category": "object",
  "size": "L",
  "shape": "rect_horizontal",
  "palette": { "base": "#E9E4D8", "shade": "#BDB6A6", "accent": "#E4572E" },
  "functionMarker": "paper_tray_tongue",
  "eyes": "tired_bags",
  "brows": "flat_heavy",
  "mouth": { "type": "slot", "driver": "rms" },
  "wear": ["coffee_stain", "tape_patch", "toner_smudge"],
  "accessories": ["display:ERR 49"],
  "idle": "vibrate",
  "landing": "heavy",
  "soundLanguage": {
    "talk": "sfx/printer_talk.wav",
    "rant": "sfx/printer_rant.wav",
    "cry": "sfx/printer_cry.wav",
    "curse": "sfx/printer_curse.wav",
    "exit": "sfx/printer_exit.wav"
  },
  "voicePreset": "VP6",
  "adultCoding": ["eye_bags", "toner_stubble"],
  "seed": 1001
}
```

`voicePreset` to VP6, bo drukarka w kulminacji mówi jedno wyraźne słowo („NO.”, sekcja 9.3). Pacjent bez słowa może mieć `null`.

### 4.7 Ludzie w dymkach: „The Humans”

Ludzie występują wyłącznie jako **szare, bezimienne sylwetki bez twarzy** (`#7B7E86`, cień `#5F626A`): zaokrąglony prostokąt tułowia, koło głowy, rękawiczkowe dłonie. Biblioteka ma 8 statycznych póz (trzyma telefon, wrzeszczy, kopie, wskazuje, śpi, pisze na klawiaturze, śmieje się, wyrzuca coś do kosza) i neutralne akcesoria (krawat, czapka, fartuch, słuchawki). Emocje grają poza, linie ruchu i grawlixy. Daje to satyrę na ludzkość bez wizerunku realnych osób i bez stereotypów, a winieta jest zawsze statyczna, z 1–2 ruchomymi elementami.

---

## 5. Plan zdjęciowy 9:16

### 5.1 Lokacja

**Jedna lokacja na zawsze: zapuszczony gabinet terapeutyczny wieczorem**, w ujęciu frontalnym, bez perspektywy. Ściana w brudnej oliwkowo-brązowej tapecie z zaciekiem, za doktor okno z panoramą miasta, nad doktor dyplom w złotej ramie, po lewej półka z usychającą rośliną, na suficie Chirp. Kanapa Chester po lewej, fotel doktor po prawej, między nimi niski stolik z minutnikiem w kształcie pomidora (generyczny kuchenny minutnik, nigdy „Pomodoro”).

**Paleta scenografii**

| Element | HEX |
|---|---|
| Ściana / pasy tapety / zaciek | `#4A4237` / `#52493D` / `#3A3329` |
| Sufit | `#39332B` |
| Dywan / wzór | `#3B2828` / `#4B3333` |
| Okno: niebo wieczorne / miasto / światła w oknach | `#2B3A57` / `#1C2436` / `#F2C14E` |
| Neon rywala | `#3FE0FF` |
| Rama okna / żaluzje | `#26221E` / `#8C8578` |
| Dyplom: rama / papier | `#B8962E` / `#EDE3CA` |
| Doniczka / liście (etap 0 → etap 12) | `#9C4F2A` / `#5E8A2E` → `#7E6036` |
| Stolik | `#2C1F16` |
| Minutnik: pomidor / listek / tarcza | `#D3263A` / `#3A7D44` / `#F2ECDD` |
| Winieta (nakładka) | `#000000`, krycie 35% |

### 5.2 Mapa kadru 1080×1920 (współrzędne w pikselach)

```
x:    0        270        540        810      1080
y:0   +-------------------------------------------+
      | STREFA UI GÓRA (0–200)                    |
 200  +-------------------------------------------+
      |  (o) Chirp (170,300)        sufit         |
 330  |  [roślina]   [dymek-wspomnienie 140–640 ×  |
      |  x60–200      330–690, nad pacjentem]      |
 360  |  y470–720     [okno 390–690 × 360–640]  [dyplom 740–900 × 380–520]
 525  |                               _trwała__   |
 690  |                              [▢]==[▢]     |  okulary 637–883 × 690–786
 860  |  (◉ ◉) Chester               |kard.|      |
 985  |   ‿   (twarz x60–250)  PACJENT |"DR."|   ‖ |  pacjent: box 245–575 × 770–1150
1090  | ======== kanapa ======== | podkładka |  ‖ |  przyciski platformy
1135  |  ‖podł.‖      [minutnik 540–630 × 1130–1215]  ‖ |  x 940–1080, y 700–1600
1200  |  ‖     ‖   [stolik 430–700 × 1200–1310]        ‖ |
1235  |   NAPIS: PATIENT #001: OFFICE PRINTER (1235–1320) |
1420  +-------------------------------------------+
      | STREFA UI DÓŁ (1420–1920): tylko dywan    |
1920  +-------------------------------------------+
```

Schemat jest poglądowy. Wiążące są współrzędne w tabeli poniżej.

| Element | Pozycja | Warstwa (z) |
|---|---|---|
| Tło: ściana, sufit, dywan | cały kadr | 0 |
| Okno z warstwą „na zewnątrz” i żaluzjami | x 390–690, y 360–640 | 1 |
| Dyplom, roślina, Chirp | jak w tabeli powyżej | 2 |
| Fotel doktor | x 610–920, y 820–1280 | 3 |
| Dr. Beige (tułów, głowa, trwała, okulary) | x 637–883, y 525–1210 | 4–5 |
| Oparcie Chestera i jego twarz | x 40–620, y 840–1090 | 6 |
| Cień pacjenta (S0 i spadanie) | elipsa na górnej płaszczyźnie siedziska: środek (410, 1078), rx 130, ry 18 (y 1060–1096, czyli nad krawędzią z warstwy 9), `#000` krycie 60% | 7 |
| Pacjent (solo) | kotwica dół-środek (410, 1150); pudełko x 245–575, y 770–1150 | 8 |
| Para pacjentów (terapia par) | kotwice (330, 1150) i (495, 1150); każdy maks. 165 px szerokości i 300 px wysokości | 8 |
| Pacjent w fotelu doktor (`patient_in_chair`, 5.5) | kotwica dół-środek (765, 1010); dół zasłania nakładka podkładki (warstwa 11) | 8 |
| Przednia krawędź siedziska i podłokietnik (zasłaniają ok. 15% wysokości pacjenta) | y 1100–1380 | 9 |
| Stolik i minutnik | x 430–700, y 1130–1310 | 10 |
| Podkładka i ręce doktor | x 650–830, y 1010–1210 | 11 |
| Dymek-wspomnienie | x 140–640, y 330–690 | 12 |
| Cząsteczki | dowolnie w strefie akcji | 13 |
| Napis kontekstowy | pas y 1235–1320, x 80–920 | 14 |
| Winieta | cały kadr | 15 |

Obrys pacjenta (każdego aktora) nigdy nie wchodzi w strefę twarzy Chestera: x < 250, y 860–1010. Sprawdza to lint 16.

### 5.3 Strefy bezpieczne na UI platform

Raport podaje regułę jakościową: napisy w środku lub tuż pod środkiem, nad dolnym interfejsem, i nic kluczowego przy górnej krawędzi [R-Postać]. Konkretne marginesy poniżej to **założenie produkcyjne (konserwatywne)**, do sprawdzenia przy teście na telefonie w każdej aplikacji [R-Checklista]:

- **Góra 0–200 px:** nic istotnego (pasek stanu, nagłówek „Shorts” i wyszukiwarka).
- **Dół 1420–1920 px:** nic istotnego (nazwa konta, opis, dźwięk). Tu leży tylko dywan.
- **Prawa kolumna x 940–1080, y 700–1600:** przyciski polubień, komentarzy i udostępnień. Doktor kończy się na x 883 (okulary), fotel na x 920.
- **Strefa akcji:** x 60–920, y 220–1420. **Strefa napisu:** y 1235–1320.
- W repozytorium trzymamy trzy nakładki PNG z UI (YouTube, TikTok, Instagram) do podglądu w Remotion Studio, przełączane flagą `--overlay` i nigdy nierenderowane do mastera.

### 5.4 Ujęcia: 3 stałe plus 2 wycinki z mastera

Wszystkie ujęcia to skala i przesunięcie tego samego mastera SVG (wektor, więc bez utraty jakości) albo osobna płaska karta. Nie ma perspektywy ani ruchu 3D. Domyślne przejście to twarde cięcie (najtańsze i najbardziej komediowe), a zoom z wygładzeniem trwa 8–12 klatek.

| Ujęcie | Skala | Punkt ogniskowy (scena) → pozycja na ekranie | Użycie |
|---|---|---|---|
| **A. WIDE** (plan ogólny) | 1,0 | — | ok. 65–75% czasu; klatka 0 i ostatnia |
| **B. GLASSES** (zbliżenie okularów) | 3,2 | (760, 738) → (540, 820); szkła zajmują ok. x 146–934 | gagi z okularami, reset przed szwem |
| **C. NOTEPAD** (insert notesu) | osobna karta | podkładka 900×1300, środek (540, 900); pole rysunku 760×900 | rady i notatki-puenty |
| D. PATIENT (wycinek) | 1,9 | (410, 960) → (540, 900); pacjent L zajmuje ok. x 227–853, y 539–1261 | reakcje pacjenta, płacz, przekleństwo |
| E. BUBBLE (wycinek) | 1,6 | (390, 510) → (540, 760); dymek zajmuje x 140–940, y 472–1048 | winieta-wspomnienie |

### 5.5 Co jest zasłonięte (zero chodzenia)

- **Doktor:** od pasa w dół podkładka, stolik i fotel. Rusza tylko głową (±6°), brwiami, ustami, okularami i rękami z barku. Gdy fabuła zabiera ją z fotela (E04, E10, E17, nawroty i finały), używamy wyłącznie trzech wariantów `doctor.placement` (sekcja 9.2) i nigdy nie dorysowujemy nóg:
  - **(a) `sunk_in_couch`:** doktor zapada się w poduchę Chestera po pierś, linię pasa zakrywa przednia krawędź siedziska (warstwa 9, y ≥ 1100). Widać tylko tułów, głowę i okulary. Służy też do „doktor kładzie się na Chesterze”.
  - **(b) `drop_out`:** pionowy spadek za podkładkę i stolik z maską przycinającą na y 1010. Wystaje czubek trwałej albo długopis. Tak gramy rozpadający się fotel i każde „zniknięcie” doktor.
  - **(c) `patient_in_chair`:** pacjent siedzi w fotelu doktor, kotwica ok. (765, 1010), z nakładką podkładki (5.2). Doktor jest wtedy w wariancie (a) albo (b) albo tylko jako mała sylwetka w oknie.
  - Wyrzucenie z pozy (E17) zawsze odbywa się w górę, przez górną krawędź kadru, nigdy w bok.
- **Chester:** jest meblem. Rusza powiekami, źrenicami i fałdą-ustami, ugina się (squash), wyskakuje mu sprężyna.
- **Pacjent:** dolne ok. 15% zasłania przednia krawędź siedziska. Wchodzi i wychodzi wyłącznie przez spadanie z góry, wyrzucenie, odlot, połknięcie, przemianę albo wyciągnięcie przez krawędź kadru. Nigdy nie chodzi. Każde przemieszczenie zapisuje tor `motion` (9.2): wyjście przez okno to lot do środka okna (540, 500) ze skalą do 0,25 i przełączeniem na warstwę 1 w połowie toru, wyjście przez sufit to lot przez górną krawędź kadru.
- **Ludzie:** tylko statyczne sylwetki w dymku albo ramię właściciela zza krawędzi kadru.

---

## 6. Silnik odcinka

### 6.1 Formuła 64 s zmapowana na szablon z Raportu

Szablon Raportu ma 60 s i każe przy renderze rozciągnąć go do **64 s**, dodając 4 s w eskalacji (23–27 s). Daje to 1 920 klatek przy 30 fps, 3 072 000 próbek przy 48 kHz i równe 32 takty przy 120 BPM [R-Szablon], [R-Pętla]. Poniżej wszystkie bloki po 23 s są przesunięte o +4 s.

| Sekundy (64 s) | Klatki | Beat Raportu | Co dzieje się w Dr. Beige | Dźwięk | Reguła |
|---|---|---|---|---|---|
| 0,0–0,5 | 0–14 | Klatka startowa = końcowa | **0–5:** stan S0 (6.2): pacjent zawieszony w locie nad kanapą. **6–14:** pacjent spada z pozycji S0 na siedzisko, cień rośnie | tło (tik 120 BPM, room tone, muzyka) trwa przez szew; gwizd spadania 0,2–0,5 s | zero SFX w klatkach 0–5 |
| 0,5–2,0 | 15–59 | Hook | lądowanie ze squashem (0,7 → 1,15 → 1), Chester się ugina, pierwsza „wypowiedź” pacjenta w jego języku; ok. 1,0 s doktor: „Mm-hm.” (MM01) | SFX06 lądowanie, TALK pacjenta, MM01 | cel YouTube: viewed ≥70% [R-Strategia] |
| 2–5 | 60–149 | Stawka | dymek-wspomnienie: co robią mu ludzie (winieta, 1–2 ruchome elementy) | SFX14, RANT pacjenta | jedna informacja |
| 5–8 | 150–239 | Gag 1 (wizualny) | cięcie na GLASSES: w szkłach to, co doktor naprawdę myśli (burger, $$$, kotek) | SFX11, MM02 | rdzeń gagu czytelny bez dźwięku |
| 8–12 | 240–359 | Reakcja | WIDE: pacjent wybucha przekleństwem po swojemu, grawlix w dymku, Chester skrzypi | CURSE, SFX07 | wulgaryzm tylko w dialogu |
| 12–15 | 360–449 | Gag 2 | NOTEPAD: „notatka” doktor to prymitywny rysunek-puenta (pacjent z rogami, „$” w kółku) | SFX13, SFX12 | — |
| 15–19 | 450–569 | Komplikacja | prawdziwa rana: druga winieta w dymku albo pacjent widzi notatkę i płacze | CRY pacjenta | — |
| 19–23 | 570–689 | Gag 3 (dźwiękowy) | rotacja, za każdym razem inny niż running gag odcinka: Chirp ćwierka w najgorszym momencie albo cenzuruje za późno / Chester skrzypi albo czka / trzy puknięcia właściciela / neon Nod-O-Matic bzyczy i gaśnie; do tego MM07 sarkastyczne | SFX10 / SFX07 / SFX15 / SFX19, MM07 | dźwięk działa w każdym języku |
| 23–31 | 690–929 | Eskalacja (+4 s) | **RADA:** doktor odwraca notes, NOTEPAD z jednym rysunkiem rady (6.4); WIDE: pacjent stosuje ją dosłownie, w oknie pierwsze konsekwencje | SFX13, SFX12, TALK pacjenta (zapał), dźwięki z okna | tu są dodane 4 s |
| 31–35 | 930–1049 | Running gag | jeden z: Chester połyka lub wykasłuje rekwizyt, spada liść, puka właściciel, mruga Nod-O-Matic w oknie | SFX09 / SFX15 | nagroda dla stałych widzów |
| 35–39 | 1050–1169 | Catchphrase | poza-werdykt: doktor zsuwa okulary, „Mm-hm.” (MM15) i klik długopisu | MM15, SFX04 | nigdy jako plansza |
| 39–44 | 1170–1319 | Zwrot | 0,5 s ciszy (muzyka cichnie, tik zostaje), potem zwrot z tabeli T (6.4) | — | moment „wyślij to szefowi” |
| 44–51 | 1320–1529 | Przygotowanie puenty | widz widzi, co nadchodzi (okno, okulary, Chester zerkający jednym okiem) | MM06 / MM13 | ironia dramatyczna |
| 51–58 | 1530–1739 | Kulminacja | katastrofa albo zwycięstwo w pełnej skali: shake, cząsteczki, konsekwencje wchodzą przez okno | SFX17 itd., muzyka w szczycie | bez krwi i gore |
| 58,0–61,5 | 1740–1844 | Puenta z powodem resetu | **DING** (klatka 1740) → wyjście pacjenta według macierzy (6.3) → reakcja-tag (szkła, Chester) | SFX02 | puenta kończy się 2,5 s przed szwem [R-Pętla] |
| 61,5–63,0 | 1845–1889 | Powrót, część 1 | cięcie na GLASSES: klik długopisu → minutnik sam się nakręca; ściereczka przeciera szkła; blip: ikona następnego pacjenta | SFX04, SFX03, SFX11 (koniec ≤ 63,1 s) | sprzątanie planu ogólnego poza kadrem |
| 63,0–63,5 | 1890–1904 | Powrót, część 2 | cięcie na WIDE, plan już czysty: pacjent wpada z góry kadru do pozycji S0 (ease-out) i zawisa w powietrzu, cień rośnie (0,6 → 1,0), oczy Chestera skaczą w górę, napis wskakuje (1890–1898) | brak SFX (ostatni efekt kończy się ok. 63,1 s) | żadnego efektu w ostatnich 200 ms |
| 63,5–64,0 | 1905–1919 | Domknięcie | **S0, poza zatrzymana przez 15 klatek** | tylko tło | framemd5 klatek 0–5 i 1905–1919 identyczny (21 klatek) [R-Pętla] |

Środek odcinka (2–58 s) to szablon, nie więzienie: kolejność gagów może się zmieniać, byle żart padał co 5–8 s [R-Szablon]. Lint sprawdza tylko rzeczy twarde: S0, szew, rejestr wyników i napisy (9.5).

**Wersje 96–120 s na TikToka** [R-Strategia]: długość z listy 96, 104, 112 albo 120 s (wielokrotności 8 s). Dodatkowe sekundy to drugi cykl „rada → zastosowanie” albo druga winieta. Stan S0 i rytuał końca pozostają identyczne, ale ich klatki liczymy od końca. Numery klatek w tabeli wyżej dotyczą 64 s; wiążące są stałe względem N = `durationInFrames`:

| Stała | Wzór | 64 s (N = 1920) | 120 s (N = 3600) |
|---|---|---|---|
| `DING` | N − 180 | 1740 | 3420 |
| `GLASSES` (powrót, część 1) | N − 75 | 1845 | 3525 |
| `S0_IN` (cięcie na WIDE, wejście w S0) | N − 30 | 1890 | 3570 |
| `HOLD` (zatrzymana poza S0) | N − 15 | 1905 | 3585 |
| Napis wskakuje | N − 30 … N − 22 | 1890–1898 | 3570–3578 |
| Ostatni efekt kończy się najpóźniej | N/30 − 0,9 s | 63,1 s | 119,1 s |

Muzyka i room tone mają osobną pętlę dla każdej długości (32, 48, 52, 56 albo 60 taktów, czyli dokładnie N × 1 600 próbek), budowaną poleceniem 5 z Raportu [R-Pętla]. Każdą wersję renderujemy i sprawdzamy framemd5 osobno.

**Wariant końcówki E16 (przewinięcie VHS):** zamiast cięcia GLASSES od `DING` + 5 do `HOLD` − 1 gra tor `rewind` (9.2), który odtwarza wstecz klatki od `DING` − 1 do 6 (przy 64 s ok. 11× szybciej, z nakładką VHS). Pacjent wraca w górę do pozycji S0, a od `HOLD` obraz jest już w S0. Efekt przewijania kończy się najpóźniej N/30 − 0,9 s.

### 6.2 Rytuał pętli: klatka 0 = ostatnia

**Powód fabularny.** Doktor ledwo starcza pieniędzy na czynsz, więc przyjmuje pacjentów jednego po drugim, bez przerwy. Sesja trwa jeden obrót minutnika. Po DINGu nakręca minutnik, przeciera okulary i w szkłach widzi akta następnego pacjenta, a z góry już coś spada. Ponieważ odcinek jest pętlą, „następnym pacjentem” jest… ten sam pacjent. Stali widzowie dostają gratis żart o nawrocie.

**Stan S0 (identyczny w klatkach 0–5 i od `HOLD` = N − 15 do N − 1; dla 64 s: 1905–1919):**

| Element | Wartość w S0 |
|---|---|
| Kamera | WIDE, skala 1,0, shake 0 |
| Pacjent | pacjent odcinka zawieszony w locie nad kanapą (kreskówkowe zawiśnięcie): górna krawędź lalki na y ≈ 230, czyli cała lalka z oczami i znacznikiem funkcji w strefie akcji; x z kotwicy aktora (5.2), skala 1,0, 3 linie ruchu nad nim, ruch spoczynkowy wyłączony. Fabularnie to „następny pacjent”, czyli ten sam pacjent |
| Kanapa | siedzisko puste; cień pacjenta na górnej płaszczyźnie siedziska w skali 1,0, krycie 60% (5.2) |
| Chester | oczy szeroko otwarte, źrenice w górę (na cień), usta zaciśnięte, ugięcie 2% |
| Doktor | długopis uniesiony 20 px nad kartką, głowa 0°, brwi poziome, usta kreska, okulary na nosie |
| Szkła okularów | ikona akt pacjenta (monochromatyczny fosfor `#8EF0C9`), bez szumu |
| Minutnik | nakręcony do pełna, tarcza nieruchoma |
| Chirp | dioda zgaszona |
| Okno | warstwa „calm”: wieczorne miasto, mrugający neon Nod-O-Matic 99¢ **w fazie stałej (włączony)**, żaluzje podniesione |
| Roślina i dyplom | etap i napis odcinka (stałe w całym odcinku) |
| Napis | `PATIENT #nnn: NAME`, w pełni widoczny, bez animacji |
| Ruchy spoczynkowe | wszystkie periodyczne ruchy (oddech Chestera, kołysanie głowy doktor, ruch spoczynkowy pacjenta) wygaszone do zera |
| Mrugnięcia i szum szkieł | brak |

**Reguły obrazu:**
- Poza zatrzymana jest na obu końcach: 6 klatek na początku i 15 na końcu. Ukrywa to mikrozatrzymanie 66,7 ms przy 30 fps, które powstaje, gdy ta sama klatka gra dwa razy z rzędu [R-Pętla].
- **Twarde nadpisanie w `Episode.tsx`:** dla f ≤ 5 i f ≥ N − 15 renderujemy wyłącznie `<State0/>`, bez żadnych torów odcinka. Harmonogram losowych mrugnięć pomija f < 15 i f ≥ N − 75, a `lensSwap` nie startuje w tych zakresach. Dzięki temu żadne mrugnięcie, szum szkieł ani ruch spoczynkowy nie rozbije zatrzymanej pozy.
- Reset odbywa się **poza kadrem**: od `GLASSES` (N − 75) widz patrzy na zbliżenie okularów, a plan ogólny wraca w `S0_IN` (N − 30) już czysty. Każda zmiana stanu z odcinka (sadza, pierze, dziura w suficie, chaos w oknie) znika „za cięciem”. Wyjątek: typ E16 (przewinięcie VHS) wraca do S0 na ekranie, w wariancie końcówki bez cięcia GLASSES (6.1).
- Napis wskakuje w klatkach N − 30 … N − 22, jest nieruchomy od N − 21 do 45, znika w klatkach 46–59.
- Każdy parametr animacji jest funkcją numeru klatki, a losowość pochodzi wyłącznie z `random(seed)` Remotion, nigdy z `Math.random()` [R-Pętla].

**Szew audio (warstwy według Raportu):**
- **Tło** gra przez cały odcinek: tik minutnika, room tone i muzyka. Tik ma okres 0,5 s, czyli 24 000 próbek (128 tyknięć na 64 s), z **przesunięciem 0,25 s (12 000 próbek)**, więc najbliższe tyknięcia leżą 250 ms przed szwem i 250 ms po nim. Tik jest generowany w kodzie z jednego sampla, więc jest idealnie okresowy. Room tone i muzykę zapętla crossfade równej mocy (qsin, 100 ms) według polecenia 5 z Raportu [R-Pętla].
- **Efekty i głosy nie przecinają szwu:** żadne zdarzenie nie zaczyna się w klatkach 0–5 i żadne nie wybrzmiewa w ostatnich 200 ms (dla 64 s: po 63,8 s). Daje to strefę ≥ 200 ms z obu stron [R-Pętla]. Tyknięcie tła to jedyny dźwięk blisko szwu: jego transjent leży 250 ms od szwu, a sampel jest przycięty do 80 ms.
- Siatka rytmu muzyki ma to samo przesunięcie: mocne części taktu wypadają na 0,25 s + 2k s.
- Kontrola: dekodowanie, sklejenie dwóch kopii i spektrogram okolicy 64 s (polecenie 4 z Raportu) [R-Pętla].

### 6.3 Macierz wyników i rotacja

Stały jest tylko rytuał minutnika, nigdy wynik. To odpowiada wprost polityce YouTube, która odmawia monetyzacji serii, w której postacie są „put in the same situation over and over again with the same outcome”, i ocenia kanał jako całość [R-Regulaminy].

| Kod | Typ wyjścia | Co się dzieje po DINGu | Zwycięzca (domyślny; alternatywy dla `roll_seed`) | Wymaga (sprawdza lint 14) |
|---|---|---|---|---|
| E01 | WYLECZONY, PRZEKAZANIE | pacjent wychodzi uleczony, a jego problem przejmuje doktor | pacjent (alt. ludzie, nikt) | tor `motion` wyjścia |
| E02 | BUM | pacjent eksploduje w konfetti, pierze albo monety (nigdy części ciała) | nikt / doktor | cząsteczki |
| E03 | POŁKNIĘTY | Chester połyka pacjenta szczeliną-ustami, beknięcie; szybki gag do 1 s, bez zbliżenia na przerażonego pacjenta tuż przed | kanapa | rozmiar S, tor `motion` z `swallow` |
| E04 | ZAMIANA RÓL | pacjent zostaje terapeutą (`patient_in_chair`), doktor ląduje na kanapie (`sunk_in_couch`) | pacjent (alt. kanapa, nikt) | `doctor.placement` (5.5) |
| E05 | KRADZIEŻ MINUTNIKA | pacjent ucieka z minutnikiem (odlot przez okno), doktor wyjmuje zapasowy z szuflady | pacjent | `timer` w trybie `stolen` i `spare`, `spareTimers` − 1 |
| E06 | PRZEZ SUFIT | pacjent wystrzeliwuje przez sufit, płytka spada z powrotem z obłoczkiem kurzu | nikt / doktor | tor `motion` przez górną krawędź |
| E07 | NAPRAWDĘ WYLECZONY | pacjent jest szczęśliwy, a w szkłach doktor pojawia się „?!” (rzadkie) | oboje | maks. 1 na 15 odcinków |
| E08 | PARA | pacjent wychodzi z kimś: drugą połówką, rośliną albo okularami doktor | pacjent | drugi aktor albo rekwizyt-partner (okulary: `spareGlasses` − 1) |
| E09 | ODWOŁANY | ludzie przywołują pacjenta w pół przełomu (budzik, telefon, „recall”) i wyciągają go przez okno | ludzie | tor `motion` do okna, z = 1 |
| E10 | DOKTOR PRZEGRYWA | rada uderza w doktor: toner, waga, rozpadający się fotel (`drop_out`) | pacjent (alt. nikt, ludzie) | — |
| E11 | KANAPA WYGRYWA | Chester interweniuje i przejmuje sytuację albo nagrodę | kanapa | — |
| E12 | PRZEMIANA | pacjent zostaje przerobiony na coś absurdalnego i dumnie odchodzi | pacjent (alt. ludzie) | 2. wersja lalki |
| E13 | CZYNSZ | owłosione ramię właściciela zabiera pacjenta na poczet czynszu | właściciel | tor `motion` przez krawędź kadru |
| E14 | ROZMNOŻENIE | pacjent się klonuje i zasypuje kadr; DING wymiata kopie | nikt | `instances` |
| E15 | TO TY | okazuje się, że to doktor jest przyczyną problemu | pacjent (alt. nikt, kanapa) | — |
| E16 | PRZEWINIĘCIE VHS | minutnik kręci się do tyłu, cały chaos przewija się do S0 | nikt | `rewind`, `timer` w trybie `reverse`, wariant końcówki bez GLASSES (6.1); maks. 1 na 10 odcinków |
| E17 | ALARM | Chirp dostaje baterię i alarm wydmuchuje wszystkich z póz, zawsze w górę przez górną krawędź kadru | Chirp | finały sezonów |

**Rejestr wyników.** Każdy `episode.json` ma blok `ledger` (typ wyjścia, zwycięzca, kategoria pacjenta, rada, rana, zwrot), a `ledger/series_ledger.json` trzyma historię. Lint odrzuca odcinek, jeśli:

1. typ wyjścia wystąpił w ostatnich 6 odcinkach;
2. ten sam zwycięzca wygrałby trzeci raz z rzędu;
3. w kroczącym oknie 10 ostatnich odcinków (z bieżącym) jest mniej niż 4 różnych zwycięzców albo któryś zwycięzca ma więcej niż 50% okna; powyżej 40% lint tylko ostrzega;
4. ta sama rada wystąpiła w ostatnich 10 odcinkach;
5. ta sama kategoria pacjenta wystąpiłaby trzeci raz z rzędu;
6. E16 występuje więcej niż raz na 10 odcinków albo E07 częściej niż raz na 15;
7. kombinacja (pacjent, rana, rada) powtarza się kiedykolwiek, także przy nawrotach pacjenta, które muszą mieć nową ranę;
8. ten sam zwrot (`twistId`) wystąpił w ostatnich 4 odcinkach albo zwrot dubluje stały bit odcinka (T06, gdy running gagiem są puknięcia właściciela; T07, gdy w Gagu 3 albo w running gagu gra Chirp).

Zwycięzca to osobna oś od typu wyjścia: E06 może wygrać doktor (inflacja odlatuje, czynsz zapłacony) albo nikt (Księżyc wraca na niebo). Siedem typów ma domyślnie zwycięzcę „pacjent”, więc `roll_seed` losuje zwycięzcę także z kolumny alternatyw, żeby pacjent nie dominował okna.

### 6.4 Tabele ziaren

Claude losuje 3 kombinacje zgodne z rejestrem (`tools/roll_seed.ts`), a autor wybiera jedną i redaguje ją w `notes.md`. Ten krok to ludzki wkład autorski i obrona przed zarzutem masowej produkcji [R-Regulaminy], [R-Wzorce]. Historia musi mieć łańcuch przyczynowy: rana → rada → dosłowne zastosowanie → zwrot → wyjście.

**Rany (W)**

| Kod | Rana | Kod | Rana |
|---|---|---|---|
| W01 | używany i wyrzucany | W14 | wie i widzi za dużo |
| W02 | obwiniany o wszystko | W15 | zdegradowany, odebrano mu status |
| W03 | ignorowany, niewidzialny | W16 | porzucony w połowie |
| W04 | wymieniony na nowszy model | W17 | musi być miły bez przerwy |
| W05 | przepracowany 24/7 | W18 | odłożony „na później” na zawsze |
| W06 | pamiętany tylko, gdy zawodzi | W19 | przygnieciony oczekiwaniami („wszyscy na mnie czekają”) |
| W07 | nikt go nie czyta ani nie słucha | W20 | przekazywany dalej jak niechciany prezent |
| W08 | wszyscy udają, że go lubią | W21 | oceniany na jedną gwiazdkę |
| W09 | stracił partnera lub parę | W22 | łatany byle jak zamiast naprawy |
| W10 | kryzys tożsamości | W23 | używany niezgodnie z przeznaczeniem |
| W11 | lęk przed przestarzałością | W24 | wiecznie pożyczany i nieoddawany |
| W12 | maltretowany o 3 w nocy | W25 | wyśmiewany jako mem |
| W13 | kochany tylko sezonowo | | |

Pula ran rośnie o 5–10 na sezon (źródła jak w 6.5).

**Rady (A): rysunek w notesie i dosłowne zastosowanie**

| Kod | Rada | Rysunek | Dosłownie |
|---|---|---|---|
| A01 | postaw granice | płotek | odmawia swojej funkcji |
| A02 | zmień wizerunek | strzałka od krzywej buźki do ładnej | przemalowuje się na coś innego |
| A03 | wyjdź ze strefy komfortu | ludzik wyskakujący z pudełka | wyskakuje z opakowania |
| A04 | bądź sobą, tylko bardziej | „+” obok ludzika | przesadza ze swoją cechą |
| A05 | naucz się mówić „nie” | przekreślone kółko | blokuje wszystko i wszystkich |
| A06 | oddychaj głęboko | płuca z trzema strzałkami powietrza | nadmuchuje się |
| A07 | wyraź gniew | wulkan | wybucha na otoczenie |
| A08 | pozwól odejść | odlatujący balonik | puszcza coś ważnego |
| A09 | otwórz się | otwarte drzwi | dosłownie się otwiera (klapka, pokrywa) |
| A10 | odłącz się | wyjęta wtyczka | odłącza innych albo świat (router, prąd w budynku za oknem, telefony ludzi w dymku), nigdy własnego kabla zasilania |
| A11 | wymyśl się na nowo | gąsienica → motyl | przerabia się w coś innego |
| A12 | wróć do ludzi | ludzik z sercem | rwie się do ludzi |
| A13 | odzyskaj swój czas | zegar ze strzałką do siebie | zabiera czas sesji |
| A14 | zaakceptuj, kim jesteś | lustro z ✓ | przyjmuje etykietę od ludzi dosłownie i nosi ją jak tytuł (np. „KING OF DWARFS”) |
| A15 | znajdź cel | tarcza strzelnicza | szuka, gdzie się „wbić” |
| A16 | wyraź siebie | megafon | głośny popis |
| A17 | poznaj siebie | lupa nad ludzikiem | bada się w pętli |
| A18 | celebruj siebie | korona i konfetti | świętuje do przesady |
| A19 | pokaż łagodną stronę | serduszko | przesadna czułość |
| A20 | bądź skromny | mały ludzik obok dużego | dosłownie się zmniejsza (zrzuca części, kurczy się do rozmiaru S) |
| A21 | ćwicz bliskość | dwa przytulone ludziki | paruje się ze wszystkim |
| A22 | domagaj się uwagi | wykrzyknik | zalewa sobą pokój |
| A23 | zrób sobie wolne | palma | porzuca obowiązki, świat staje |
| A24 | wróć do korzeni | drzewo z korzeniami | cofa się do pierwszej wersji |
| A25 | udawaj, aż ci się uda | maska | podszywa się pod kogoś |
| A26 | żyj chwilą | przekreślony zegar | ignoruje przyszłość |
| A27 | mów swoją prawdę | dymek z ✓ | brutalna szczerość |
| A28 | weź się w garść | pięść i taśma | skleja się taśmą |
| A29 | komunikuj potrzeby | dwa dymki | wysyła żądania |
| A30 | znajdź swoje miejsce | puzzel | wciska się tam, gdzie pasuje |

**Test rysunków rad.** Każdy rysunek z kolumny „Rysunek” pokazujemy 5 osobom bez kontekstu przez ok. 2 s; przechodzi przy ≥ 4/5 trafień. Rysunek, który nie przejdzie (kandydaci: A13, A17, A20, A26, A29), dostaje opcjonalne pole `adviceLabel`: do 3 słów EN w pasie napisów, tłumaczone jak `captionName`.

**Zwroty (T):** T01 odwrócenie ról; T02 interwencja Chestera; T03 doktor „łapie” problem; T04 to doktor jest problemem; T05 konsekwencje wchodzą przez okno; T06 puka właściciel (tylko gdy puknięcia nie są running gagiem odcinka); T07 Chirp w najgorszym momencie (tylko gdy Chirp nie gra w Gagu 3 ani w running gagu); T08 pojawia się druga połówka pacjenta; T09 ludzie przywołują pacjenta; T10 rada działa za dobrze; T11 pomyłka w aktach: to nie ten pacjent; T12 w gabinecie jest krewny pacjenta (w szufladzie, w kubku, w fotelu); T13 Chester ma tę samą traumę; T14 radę stosuje ktoś inny, w oknie; T15 za oknem czeka kolejka takich samych pacjentów; T16 rywal z naprzeciwka kusi pacjenta przez okno; T17 ofiara okazuje się sprawcą; T18 pacjent czyta, co jest w okularach doktor; T19 ludzie przepraszają, ale za późno; T20 pacjent dostaje „aktualizację” i zapomina całą sesję; T21 pacjent przekupuje doktor. Ten sam zwrot nie wraca przez 4 odcinki (reguła rejestru 8).

**Kombinatoryka.** Przy 300 pacjentach, 30 radach i 17 typach wyjść jest 300 × 30 × 17 = 153 000 kombinacji, zanim policzy się 25 ran, 21 zwrotów, pary i grupy. Pula rad rośnie o 10–15 na sezon (6.5), więc ta sama rada z tym samym rysunkiem nie wraca co kilka tygodni.

### 6.5 Źródła tematów na lata (bez realnych osób)

| Kategoria | Przykłady | Skąd biorą się nowe |
|---|---|---|
| Przedmioty codzienne | drukarka, skarpetka bez pary, pilot w kanapie, kasa samoobsługowa, bieżnia-wieszak, parasol zostawiany wszędzie, śrubka „zbędna” po skręceniu mebla, szampon hotelowy, wózek z krzywym kółkiem, tabliczka „mokra podłoga” | każdy pokój domu, biuro, siłownia, auto, sklep |
| Technologia i internet | Password123, algorytm, CAPTCHA, baner cookies, autokorekta, pasek ładowania na 99%, ikona baterii 1%, pełna chmura, kod 2FA, mail „odpowiedz wszystkim”, chatbot, który chce być człowiekiem | każda aktualizacja, funkcja i trend |
| Kalendarz i rytuały | poniedziałek, 17 stycznia (porzucone postanowienie), choinka 2 stycznia, dynia 1 listopada, godzina „ukradziona” przy zmianie czasu, świeczka urodzinowa, walentynkowa czekoladka z nadzieniem, którego nikt nie lubi, telewizor z Black Friday | 365 dni, pory roku i święta: gotowy kalendarz odcinków specjalnych |
| Pojęcia i sytuacje | small talk, niezręczna cisza, prokrastynacja, deadline, motywacja, weekend, „seen” bez odpowiedzi, drzemka „jeszcze 5 minut” | „humor in the lows”, czyli żart z codziennych porażek (TikTok Next 2026) [R-Humor] |
| Instytucje i zjawiska bez nazw | inflacja, rynek mieszkaniowy, muzyczka z infolinii, regulamin, open space, kolejka, formularz, obietnica wyborcza | nagłówki gospodarcze zamieniane na przedmiot-symbol |
| Narzędzia zawodów | wiertło dentystyczne, mikrofon ze stand-upu, gwizdek sędziego, pachołek drogowy, skalpel, młotek | każdy zawód świata |
| Natura i kosmos | Pluton, Księżyc, ostatni bałwan w marcu, chmura, która pada tylko na wesela | astronomia, pogoda, pory roku |
| Jedzenie (oszczędnie) | ostatni kawałek pizzy, przeterminowany jogurt, keks świąteczny | — |
| Formaty-mnożniki | terapia par (A×B), grupowa, nawroty, turniej nawrotów | kombinatoryka istniejącej biblioteki |
| Nowe rady (A31+) | język wellness, self-help i HR: „manifest it”, „protect your peace”, „touch grass”, „dopamine detox”, „quiet quitting”, „growth mindset”, „circle back”, „inner child”, „cold plunge” | +10–15 rad na sezon, każda z jednym rysunkiem, dosłownym zastosowaniem i testem 5 osób (6.4); trendy self-help zmieniają się co sezon |
| Newsjacking przez abstrakcję | upał → klimatyzator; boom AI → chatbot; wybory → obietnica wyborcza; strajk → kartka „OUT OF ORDER” | każdy news bez nazwiska |
| Widzowie | „Who should be next on the couch?” | najwięcej komentarzy ma TikTok, więc to najlepszy poligon pomysłów [R-Strategia] |

### 6.6 Workflow jednego odcinka

1. **Losowanie:** `roll_seed` daje 3 kombinacje (pacjent, rana, rada, zwrot, wyjście) zgodne z rejestrem.
2. **Wybór i redakcja autora:** decyzja i zmiany zapisane w `notes.md` (wkład autorski, dowód dla praw i dla polityki „inauthentic content”).
3. **Beat sheet 64 s:** Claude rozpisuje tabelę 6.1 dla tego pacjenta.
4. **Pacjent:** `patient.json`, generator SVG, test ikony 160 px, ewentualnie ręczna poprawka.
5. **Assety odcinka:** jedna statyczna winieta w dymku (sylwetki ludzi, 1–2 ruchome elementy), 0–2 rekwizyty, 2–4 rysunki do notesu, wariant okna z konsekwencjami.
6. **Audio:** 5 klipów SFX pacjenta, opcjonalnie preset głosu. Reszta pochodzi z biblioteki.
7. **`episode.json`** (Claude), potem lint (9.5).
8. **Podgląd w Remotion Studio** i 3–6 iteracji poprawek [R-Pipeline].
9. **Render mastera bezstratnego,** kontrola framemd5 wszystkich 21 klatek S0 i liczby klatek, eksport ffmpeg (polecenia 1–4 z Raportu) [R-Pętla]. Każdą długość (64–120 s) renderujemy i sprawdzamy osobno.
10. **Brama jakości wzorem Larvy:** publikujemy tylko świadomie zaakceptowane odcinki, a przy odrzucaniu co trzeciego liczymy ok. 1,5× czasu i kredytów na opublikowany odcinek [R-30dni]. Ręczny **brand check** każdego kadru z rekwizytem z realnego świata (kubek, pole formularza, interfejs, logo-podobny kształt): bez cudzych logo, kolorystyki i trade dress, bo lint czyta tylko tekst, nie obraz. Przed publikacją czekamy na wynik kontroli praw autorskich w YouTube Studio (Checks).
11. **Metadane:** tytuł EN do 60 znaków (zalecane 40–60) w formacie „Dr. Beige #001: …”, 1–3 hashtagi (`#DrBeige #adultanimation #animation`; bez hashtagów trendu „#sadbeige”, który należy do innej twórczyni), handle `@DrBeigeShow` na wszystkich platformach (`@DrBeige` na YouTube jest zajęty), opis „Adult animated satire. Not a real doctor. Not real advice.” [R-Strategia].
12. **Commit do Git:** scenariusz, JSON, assety i notatka. Historia commitów jest dowodem autorstwa [R-Postać].

Czas na odcinek: Raport szacuje pipeline code-first na 2,5–7 h [R-Pipeline]. Ten format powinien trafiać w dolną część widełek, bo głos doktor, muzyka, scenografia i rigi są wielokrotnego użytku (szacunek; zmierzyć w pilocie, dni 13–16 planu z [R-30dni]). Koszt audio na odcinek to głównie 5 klipów SFX pacjenta: 5 × ok. 2 s × 40 kredytów × 2 podejścia ≈ 800 kredytów (szacunek). To znacznie poniżej scenariusza oszczędnego z Raportu (ok. 3 920 kredytów na minutę) [R-Eleven].

---

## 7. Running gagi i sygnatury dźwiękowe

### 7.1 Running gagi

| Gag | Mechanika | Ciągłość |
|---|---|---|
| Okulary-ekrany | w szkłach to, co doktor naprawdę myśli: burger, $$$, czaszka, kotek, ZZZ, płomień, syrena, sedes, plaża, płaska linia, „?!”, spinner ładowania | biblioteka ok. 24 ikon, jedna warstwa SVG |
| Notatki-puenty | prymitywne rysunki czerwonym markerem, bez słów | archiwum rysunków jako merch i karuzele (11) |
| „Mm-hm” | 15 intonacji, widz uczy się je czytać jak zdania | biblioteka MM01–MM15 |
| Chester połyka i wykasłuje | małych pacjentów połyka, a czasem wykasłuje rekwizyt z dawnego odcinka | easter egg: „z którego odcinka to jest?” |
| Usychająca roślina | 12 etapów usychania w sezonie 1, ostatni liść spada w finale | etap zapisany w `continuity` |
| Dyplom | napis zmienia się co odcinek: „Doctor of Nodding”, „Certified Listener (Partially)”, „PhD in Mm-hm, University of Somewhere Online”, „Licensed to Hum”, „Participation Award”, „Diploma (Printed at Home)” | mikrożart dla powtórek |
| Chirp | ćwierka w najgorszym momencie i cenzuruje z opóźnieniem | łuk baterii, finał sezonu E17 |
| Puknięcia właściciela | trzy ciężkie puknięcia, czasem ramię | dług rośnie; typ E13 |
| Szuflada zapasów | zapasowe minutniki i okulary po E05 i E08 | licznik w `continuity`; pusta szuflada to odcinek specjalny |
| Nod-O-Matic 99¢ | neon rywala w oknie mruga, gdy doktor zawodzi | mikro-łuk, S1E25 |
| Numer pacjenta | „PATIENT #001…” rośnie z każdym odcinkiem | numeracja buduje nawyk [R-Strategia] |
| Rzadkie zdanie doktor | „Same time next week.” najwyżej raz na ok. 10 odcinków | wydarzenie dla fanów |
| Jedno wyraźne słowo pacjenta | raz na odcinek, w szczycie emocji; Chirp spóźnia się z cenzurą | dorosły gag bez wulgaryzmu w metadanych |

### 7.2 Biblioteka SFX (ElevenLabs Sound Effects)

Biblioteka powstaje raz na sezon, w WAV 48 kHz dla efektów bez pętli [R-Eleven]. Ustawiona długość kosztuje 40 kredytów za sekundę, więc cała biblioteka (ok. 44 s audio × 40 kredytów × 3 podejścia) to ok. 5 300 kredytów jednorazowo, a motyw muzyczny (900 kredytów za minutę, 2 podejścia) ok. 1 900 kredytów (szacunek). Powtarzalne efekty to największa dźwignia oszczędności [R-Eleven].

| ID | Nazwa | Prompt (EN) | Długość | Pętla |
|---|---|---|---|---|
| SFX01 | Tik minutnika | `Single dry mechanical tick of a cheap plastic kitchen timer, close and crisp, no room sound` | 0,1 s (przyciąć do 80 ms) | nie (powielany w kodzie co 0,5 s) |
| SFX02 | DING | `Single bright ring of a small kitchen timer bell, metallic, short natural decay` | 1,5 s | nie |
| SFX03 | Nakręcanie | `Kitchen timer dial twisted quickly, fast ratcheting plastic clicks` | 0,8 s | nie |
| SFX04 | Klik długopisu | `One crisp ballpoint pen click, close` | 0,3 s | nie |
| SFX05 | Gwizd spadania | `Very short cartoon falling whistle, quick descending pitch` | 0,3 s | nie |
| SFX06 | Lądowanie | `Heavy object dropping onto an old sprung sofa, soft thump followed by a springy boing` | 0,8 s | nie |
| SFX07 | Jęk sprężyn | `Old sofa springs creaking and groaning slowly under weight` | 1,5 s | nie |
| SFX08 | Połknięcie | `Big cartoon gulp, deep and muffled, like something swallowed by thick cushions` | 0,7 s | nie |
| SFX09 | Wykasłanie | `Muffled cartoon cough ending with a small object popping out` | 1,2 s | nie |
| SFX10 | Chirp | `Single high-pitched chirp of a smoke detector with a low battery` | 0,4 s | nie |
| SFX11 | Przełączenie szkieł | `Tiny old television switching channel, short static blip` | 0,3 s | nie |
| SFX12 | Rysowanie | `Fast marker scribbling and squeaking on paper` | 0,8 s | nie |
| SFX13 | Kartka | `One sharp paper page flip on a clipboard` | 0,4 s | nie |
| SFX14 | Dymek | `Soft cartoon bubble appearing with a gentle airy whoosh` | 0,6 s | nie |
| SFX15 | Puknięcia | `Three slow, heavy knocks on a wooden door` | 1,6 s | nie |
| SFX16 | Żaluzje | `Window blinds dropping quickly with a plastic rattle` | 0,7 s | nie |
| SFX17 | Kreskówkowy wybuch | `Comedic cartoon explosion, soft puff and a pop, not realistic, short` | 1,2 s | nie |
| SFX18 | Room tone | `Quiet small office at night, faint distant city traffic, steady, no voices` | 30 s | tak |
| SFX19 | Bzyczenie neonu | `Faulty neon sign buzzing and flickering off and on, short electrical hum` | 1,0 s | nie |

Pętle ElevenLabs eksportuje tylko jako MP3, więc SFX18 trzeba zdekodować do WAV 48 kHz, przyciąć i zapętlić crossfade'em qsin osobno na każdą dopuszczalną długość odcinka (64, 96, 104, 112 i 120 s, czyli N × 1 600 próbek; polecenie 5 z Raportu) [R-Pętla]. Pliki: `SFX18_roomtone_loop{64|96|104|112|120}.wav`. Bleep cenzury (1 kHz, sinus) generuje kod, bez ElevenLabs.

### 7.3 Biblioteka intonacji doktor (TTS, nagrana raz)

Tagi audio z dokumentacji v4/v3 to m.in. `[curious]`, `[happy]`, `[sad]`, `[angry]`, `[whispers]`, `[shouts]`, `[laughs]`, `[clears throat]`, `[sighs]`, `[exhales]` [R-Eleven]. Dopiski w nawiasach („wolno”, „przeciągle”) są dla ludzi: TTS ich nie widzi, a jednowyrazowe żądania są w v3/v4 najmniej stabilne. Dlatego:

- **Całą bibliotekę nagrywamy dwoma dłuższymi żądaniami** (albo w Text to Dialogue), z liniami rozdzielonymi pauzami (`...`) i tagami, np. `[flatly] Mm-hm. ... [slowly, with finality] Mm... hm. ... [sarcastic] Mmm-hmmm.`, a potem tniemy je na pliki `ffmpeg -af silencedetect`. Pierwsze żądanie zawiera linie płaskie (stability 45–50), drugie linie ekspresyjne (stability 30–35), bo stability ustawia się dla całego żądania.
- Każde żądanie generujemy 3–5 razy (2 darmowe regeneracje na www przy tym samym tekście, głosie i modelu [R-Eleven]), wybieramy najlepsze wykonanie każdej linii i zamrażamy jako WAV.
- Tagi spoza listy z dokumentacji (`[flatly]`, `[bored]`, `[sarcastic]`, `[skeptical]`, `[firmly]`, `[slowly, with finality]`) i wszystkie 15 intonacji sprawdzamy w teście A/B na v3 i v4, zanim wybierzemy model sezonu.

| ID | Intonacja | Tekst TTS | Stability |
|---|---|---|---|
| MM01 | neutralne potwierdzenie | `[flatly] Mm-hm.` | 45–50 |
| MM02 | znudzone | `[bored] Mmm-hm.` | 45–50 |
| MM03 | zaciekawione | `[curious] Mm-hm?` | 45–50 |
| MM04 | sceptyczne | `[skeptical] Mm... hm.` | 45–50 |
| MM05 | groźne | `[angry] Mm. HM.` | 30–35 |
| MM06 | zaalarmowane | `[shouts] MM-HM?!` | 30–35 |
| MM07 | sarkastyczne | `[sarcastic] Mmm-hmmm.` | 45–50 |
| MM08 | senne | `[exhales] Mm... hm...` | 45–50 |
| MM09 | zachwycone (rzadko) | `[happy] Mm-hm!` | 30–35 |
| MM10 | rozczarowane | `[sighs] Mm-hm.` | 45–50 |
| MM11 | konspiracyjne | `[whispers] Mm-hm.` | 45–50 |
| MM12 | diagnoza (stanowczo) | `[firmly] Mm. Hm.` | 45–50 |
| MM13 | przerażone (cicho) | `[whispers] ...mm-hm?` | 30–35 |
| MM14 | tłumiony śmiech | `[laughs] Mm-hm.` | 30–35 |
| MM15 | werdykt (catchphrase) | `[slowly, with finality] Mm-hm.`; zapasowo wyprowadzone w kodzie z MM01 (atempo 0,8 i obniżenie o ok. 1 półton) | 45–50 |
| MM16 / MM17 | chrząknięcie / rzadkie zdanie | `[clears throat]` / `Same time next week.` | 45–50 |

### 7.4 Motyw muzyczny (Eleven Music)

Eleven Music nie ma udokumentowanej opcji pętli. Prompt prosi więc o stałą energię bez zakończenia, a utwór tnie się na granicach taktów: przy 120 BPM takt 4/4 trwa 2 s (60 klatek, 96 000 próbek). Z jednego utworu budujemy pętle dla każdej długości odcinka (32, 48, 52, 56 i 60 taktów, czyli 64, 96, 104, 112 i 120 s), sklejając sekcje na granicach taktów i domykając je crossfade'em qsin (polecenie 5 z Raportu). Pliki: `theme_loop{64|96|104|112|120}.wav`. Tempo AI potrafi dryfować, więc siatkę sprawdza się w DAW [R-Pętla]. Warunki zakazują w promptach nazwisk artystów i tytułów utworów [R-Eleven]. Muzyka musi być własna lub z ElevenLabs, bo Short dłuższy niż minuta z aktywnym roszczeniem Content ID jest globalnie blokowany [R-Regulaminy].

**Motyw główny (podkład pod cały odcinek):**

```
Instrumental, 120 BPM, 4/4, D minor, loopable, consistent energy, no intro, no ending, no outro.
Deadpan waiting-room lounge jazz: muted upright bass walking line, brushed snare, dry electric piano chords,
occasional soft vibraphone notes. Cheap, slightly worn and melancholic but quietly comedic. Sparse, leaves room
for sound effects and a ticking clock. 64 seconds, steady dynamics throughout.
```

**Krótkie cue (generowane raz, 3–5 s):**
- „Catastrophe sting”: `Short comedic orchestral hit with a descending trombone wah, 3 seconds, ends abruptly`
- „Cured!”: `Short cheesy celebratory fanfare on cheap electric organ, 3 seconds, slightly out of tune`

Miks: podkład ok. 18 dB pod głosem i efektami. Głośność normalizuje się dopiero po zbudowaniu pętli, zwykle do ok. −14 LUFS i −1,5 dBTP, co jest powszechną praktyką, a nie oficjalnym celem platform [R-Pętla].

---

## 8. 30 zalążków odcinków (sezon 1)

Kolejność spełnia reguły rejestru z 6.3: typ wyjścia nie powtarza się w 6 kolejnych odcinkach, nikt nie wygrywa trzy razy z rzędu, w każdym kroczącym oknie 10 odcinków jest 5–7 różnych zwycięzców, a pacjent wygrywa w nim najwyżej 5 razy (łącznie 11 z 30), rada nie wraca przez 10 odcinków, a E16 pojawia się raz (sprawdzone skryptem). Zwycięzcy w skrócie: P = pacjent, D = doktor, K = kanapa (Chester), L = ludzie, N = nikt, W = właściciel, O = oboje, C = Chirp.

| # | Tytuł roboczy (EN) | Kat. | Zalążek (jedno zdanie) | Wyjście | Wygrywa |
|---|---|---|---|---|---|
| 1 | The Printer Who Said No | przedmiot | Drukarka biurowa z wypaleniem dostaje radę „postaw granice” (płotek), przestaje drukować cokolwiek, w oknach biurowca za oknem ludzie walą głowami w klawiatury, a nad budynkiem rośnie dymek „PRINT QUEUE: 99 999”; gdy drukarka wychodzi wyleczona, to doktor zaczyna wypluwać zacięty papier. | E01 | P |
| 2 | Monday Wants to Be Liked | kalendarz | Poniedziałek (kartka z kalendarza z dzwonkami budzika) po radzie „zmień wizerunek” przemalowuje się na „FRIDAY” i przez chwilę jest kochany, aż wszystkie budziki świata o 6:00 wywlekają go przez okno z powrotem do roboty. | E09 | L |
| 3 | The Last Slice | jedzenie | Ostatni kawałek pizzy z lękiem przed porzuceniem słyszy „wyjdź ze strefy komfortu”, wyskakuje z kartonu i ląduje prosto w szczelinie-ustach Chestera, który od lat zbiera okruszki (szybkie „gulp” i beknięcie). | E03 | K |
| 4 | Password123 Wants Respect | cyfrowe | Najpopularniejsze hasło świata po radzie „bądź sobą, tylko bardziej” dopisuje sobie wykrzyknik, a cały świat natychmiast je kopiuje, aż kadr zasypuje dwieście identycznych karteczek. | E14 | N |
| 5 | Snooze | przedmiot | Przycisk drzemki z poczuciem winy za spóźnienia ludzkości ćwiczy „mówienie nie”, ale to doktor uderza w niego w połowie sesji, zasypia zapadnięta w Chestera (`sunk_in_couch`), a pacjent przejmuje notes i fotel (`patient_in_chair`). | E04 | P |
| 6 | Inflation Can't Stop Growing | instytucja | Inflacja (balon z „%”) dostaje radę „oddychaj głęboko”, puchnie z każdym wdechem razem z cennikiem doktor i odlatuje przez sufit, zostawiając ją z pierwszym w historii zapłaconym czynszem. | E06 | D |
| 7 | Unexpected Item | przedmiot | Kasa samoobsługowa po latach wrzasków klientów słyszy „wyraź gniew”, skanuje Chestera, waży doktor, wycenia ją na 0,99 i pakuje do reklamówki. | E10 | P |
| 8 | Sock, Single | przedmiot | Skarpetka bez pary w żałobie dostaje radę „pozwól odejść” (balonik), ale w szczycie wzruszenia Chester wykasłuje jej zaginioną połówkę sprzed lat i para wychodzi razem. | E08 | P |
| 9 | Small Talk, Big Feelings | pojęcie | Small talk („nice weather, huh?”) po radzie „otwórz się” żąda głębokiej rozmowy, ale milcząca doktor wygrywa pojedynek na niezręczną ciszę, aż napięcie dosłownie wybucha. | E02 | D |
| 10 | The Algorithm Feels Bad | cyfrowe | Algorytm z poczuciem winy za uzależnienie ludzi dostaje radę „odłącz się” i odcina ludziom feed (nie siebie), a gdy ludzie w dymku podnoszą wzrok znad telefonów, okulary zdradzają, że to doktor scrolluje najdłużej i błaga go o powrót. | E15 | P |
| 11 | Pumpkin, November 1st | kalendarz | Dynia porzucona dzień po Halloween słyszy „wymyśl się na nowo” i wychodzi jako sezonowa kawa dyniowa, a ludzie z kolejki za oknem wypijają ją do dna. Generycznie: kubek bez logo, rękaw z napisem „PUMPKIN”, bez nazw „PSL” i „Pumpkin Spice Latte”. | E12 | L |
| 12 | The Remote in the Cushions | przedmiot | Pilot zgubiony w kanapie tak dawno, że nikt go już nie szuka, ćwiczy „powrót do ludzi”, ale Chester przełącza nim okulary doktor na kanał sportowy i zatrzymuje go jako najlepszego przyjaciela. | E11 | K |
| 13 | The Lost Hour | kalendarz | Godzina „ukradziona” przy zmianie czasu po radzie „odzyskaj swój czas” wciska się w sesję, minutnik zaczyna kręcić się do tyłu, a cały odcinek przewija się jak kaseta VHS do klatki 0. | E16 | N |
| 14 | Pluto Is Still a Planet | natura | Zdegradowany Pluton słyszy „zaakceptuj, kim jesteś”, ogłasza się królem planet karłowatych, kradnie minutnik jako własny księżyc i odlatuje przez okno, a doktor wyjmuje z szuflady zapasowy pomidor. | E05 | P |
| 15 | The Leftover Screw | przedmiot | Śrubka, która zawsze zostaje po skręceniu mebla, szuka celu w życiu, odkrywa, że wypadła z fotela doktor, a gdy dumnie odmawia powrotu, fotel rozpada się pod terapeutką (`drop_out`), a śrubka ląduje w stercie identycznych śrubek. | E10 | N |
| 16 | Please Hold | instytucja | Muzyczka z infolinii, grana w pętli od 40 minut, po radzie „wyraź siebie” zaczyna solówkę życia, a wtedy ktoś po drugiej stronie wreszcie odbiera i wywołuje ją w pół taktu. Melodia jest w 100% wymyślona (Eleven Music, bez odniesień do realnych melodii oczekiwania). | E09 | L |
| 17 | I Am Not a Robot | cyfrowe | CAPTCHA (rozmiar S) w kryzysie tożsamości po radzie „poznaj siebie” każe doktor udowodnić, że jest człowiekiem; doktor oblewa test „zaznacz wszystkie sygnalizatory”, a Chester jednym szybkim „gulp” połyka CAPTCHA. Generycznie: szare pole z ptaszkiem bez logo i siatka 3×3 z własnymi rysunkami. | E03 | K |
| 18 | Make a Wish | kalendarz | Świeczka urodzinowa, której wielki moment zawsze trwa trzy sekundy, uczy się „celebrować siebie”, płonie tak dumnie, że Chirp prawie zaczyna działać, i wychodzi jako świeczka-sztuczka, której nie da się zdmuchnąć. | E07 | O |
| 19 | Open Wide | narzędzie | Wiertło dentystyczne, na którego widok wszyscy krzyczą, ćwiczy „łagodną stronę” na zębach doktor i zostaje przerobione na spieniacz do mleka w kawiarni za oknem. | E12 | P |
| 20 | Market Correction | instytucja | Rynek mieszkaniowy, narcystyczny domek z kart (bryła 18) z metką ceny, po radzie „bądź skromny” próbuje się zmniejszyć, wyciąga kartę z samego dołu i zawala się w deszcz monet prosto do kubka doktor. | E02 | D |
| 21 | Weak Signal | cyfrowe | Sygnał Wi-Fi, który słabnie, gdy ktoś się zbliża, ćwiczy „bliskość” i paruje się z okularami doktor tak skutecznie, że odlatują razem przez okno, a ona sięga po zapasowe. | E08 | P |
| 22 | I Have Read and Agree | instytucja | Regulamin, którego nikt nigdy nie przeczytał, „domaga się uwagi” i rozwija na czterdzieści metrów, a doktor odruchowo klika „Akceptuję”: jej okulary bez końca instalują aktualizacje, a w szkłach wyskakuje „YOUR DATA HAS BEEN SOLD”. | E10 | L |
| 23 | The Moon Takes a Day Off | natura | Księżyc, obwiniany o każdą zwariowaną noc, bierze radę „zrób sobie wolne”, za oknem stają pływy i panikują ludzie, aż grawitacja wciąga go z powrotem przez sufit. | E06 | N |
| 24 | The Dance Is Dead | cyfrowe | Umierający trend taneczny po radzie „wróć do korzeni” wychodzi wyleczony jako klasyk, a doktor nie może przestać tańczyć go w fotelu, od pasa w górę. Taniec to 2–3 własne pozy górnej połowy ciała, zaprojektowane przez autora, z muzyką z Eleven Music; bez nazw realnych trendów, piosenek i dźwięków w tytule, opisie i tagach. | E01 | P |
| 25 | The Chatbot Who Wanted Legs | cyfrowe | Chatbot, który marzy o byciu człowiekiem, słyszy „udawaj, aż ci się uda”, idealnie podrabia „Mm-hm” doktor i przejmuje fotel (`patient_in_chair`), a ona ląduje w kiosku Nod-O-Matic 99¢ po drugiej stronie ulicy (mała sylwetka w oknie). Generycznie: dymek z diodą, bez sękatego węzła, iskry ani gwiazdki z logo realnych asystentów AI. | E04 | P |
| 26 | Tree, January 2nd | kalendarz | Choinka wyrzucona dzień po świętach ćwiczy „życie chwilą” i sama się przystraja, aż zza krawędzi kadru wsuwa się owłosione ramię właściciela i zabiera ją na poczet czynszu. | E13 | W |
| 27 | Tough Crowd | narzędzie | Mikrofon ze stand-upu, zniszczony przez heklerów, po radzie „mów swoją prawdę” robi roast całego gabinetu i odkrywa, że jego karierę zabiło beznamiętne „Mm-hm” doktor z pierwszego rzędu. | E15 | P |
| 28 | The Campaign Promise | instytucja | Obietnica wyborcza (dziurawy zwój z pieczęcią, bez partii i barw) po radzie „weź się w garść” skleja się taśmą; w środku odcinka z sufitu sypie się deszcz identycznych obietnic, a tuż przed przełomem ludzie, już po wyborach, „wycofują” ją przez okno. | E09 | L |
| 29 | Couples Therapy: Phone & Charger | przedmiot ×2 | Telefon i ładowarka z postrzępionym kablem przychodzą na terapię par („on tylko bierze, ja tylko daję”), ćwiczą „komunikowanie potrzeb”, aż telefon odkrywa w podłokietniku Chestera port USB i porzuca ładowarkę dla kanapy. Ładowanie pokazuje wyłącznie zapełniająca się ikona baterii i „ding”; Chester reaguje skrzypnięciem sprężyn i miną, bez wokalizy. | E11 | K |
| 30 | The Battery (finał) | przedmiot | Nowiutka bateria 9V z lękiem „wszyscy na mnie czekają” po radzie „znajdź swoje miejsce” wskakuje do Chirpa, alarm wydmuchuje wszystkich z póz w górę, przez górną krawędź kadru, i spada ostatni liść rośliny, a przy DINGu bateria wyskakuje z radości i Chirp znów tylko ćwierka. | E17 | C |

**Pilot (3 odcinki do testu czasu, kosztu i szwu, dni 13–16 z [R-30dni]):** #1 (wygrywa pacjent), #3 (kanapa), #9 (doktor). Trzy różne finały pokazują od razu, że format nie jest „tą samą sytuacją z tym samym wynikiem”.

---

## 9. Specyfikacja techniczna dla Claude'a

### 9.1 Struktura repozytorium

```
seria/
  biblia_serialu.md            # ten dokument (źródło prawdy, zob. też CLAUDE.md)
  bible/                       # model sheety, karty głosów, datowane szkice ręczne
  assets/
    set/                       # master SVG scenografii (warstwy z 5.2), warianty okna
    cast/doctor/ chester/ chirp/
    patients/lib/              # shapes/ eyes/ mouths/ wear/ accessories/
    humans/                    # 8 póz sylwetek
    glasses/                   # ok. 24 ikony treści szkieł
    notepad/doodles/           # rysunki rad A01–A30 i notatek
    sfx/ vo/doctor/ vo/chester/ music/
  episodes/S01E01/             # episode.json, patient.json, notes.md, sfx/, qa/
  ledger/series_ledger.json
  src/                         # Remotion: Episode.tsx, components/, primitives/, lint/
  tools/                       # roll_seed.ts, gen_enums.ts, rms_envelope.py, check_loop.sh
```

Biblię warto streścić w `CLAUDE.md` (postacie, ton, zakazy, reguły rejestru), tak jak radzi Raport [R-Pipeline]. Remotion Agent Skills instaluje się poleceniem `npx skills add remotion-dev/skills` [R-Pipeline].

### 9.2 Schemat sceny (TypeScript)

```ts
type Frame = number;                       // 0 .. N-1, N = durationInFrames, 30 fps
type Camera = "WIDE" | "GLASSES" | "NOTEPAD" | "PATIENT" | "BUBBLE";
type Winner = "patient" | "doctor" | "couch" | "humans" | "nobody" | "landlord" | "both" | "chirp";
type ActorId = "patient" | "patient2" | "patient3";
type CharId = "doctor" | "chester" | "chirp" | ActorId;
type XY = [number, number];
type Ease = "linear" | "in" | "out" | "inOut" | "spring";

// Enumy generuje tools/gen_enums.ts z tabel min w sekcji 3 i z nazw plików assets/glasses/*.svg.
// Lint odrzuca każdą wartość spoza enumu (lint 15), więc Claude nie wymyśla nowych kluczy.
type Brows = "neutral" | "low_flat" | "one_up" | "skeptic" | "v" | "high" | "arched" | "slant_down" | "v_strong";
type DoctorMouth = "flat" | "flat_down" | "o_small" | "crooked" | "tight" | "O" | "half_smile" | "smile" | "wavy" | "down" | "teeth";
type LensIcon = "patient_file_icon" | "zzz" | "burger" | "question" | "dots" | "skull" | "siren" | "eyeroll"
  | "dollars" | "stars" | "toilet" | "flatline" | "pizza" | "kitten" | "beach" | "flame" | "interrobang" | "spinner"; // + reszta z assets/glasses/
type DoctorPlacement = "chair" | "sunk_in_couch" | "drop_out";          // 5.5
type ChesterEyes = "half" | "wide_up" | "squint" | "droop" | "closed" | "one_open" | "one_squint" | "side_half" | "wide_shake";
type ChesterMouth = "flat" | "tight" | "wavy" | "arc_down" | "slightly_open" | "crooked" | "smirk" | "open";

interface Tween { dur?: number; ease?: Ease }                          // dur w klatkach; brak dur = podmiana w jednej klatce
interface DoctorPose extends Tween { brows?: Brows; mouth?: DoctorMouth; lens?: LensIcon; glassesY?: 0 | 20 | 40;
  headTilt?: number /* −6..6 */; pen?: "raised" | "writing" | "click"; placement?: DoctorPlacement }
interface ChesterPose extends Tween { eyes?: ChesterEyes; mouth?: ChesterMouth; sag?: number /* 0..0.05 */; spring?: boolean }
interface ChirpPose extends Tween { led?: "off" | "chirp" | "plead" | "alarm" | "faint" }
interface PatientPose extends Tween { brows?: string /* z biblioteki 4.3, sprawdzane względem patient.json */;
  enter?: "fall_from_top"; land?: "heavy" | "bouncy" | "splat" | "float" | "clatter"; variant?: "base" | "transformed"; eyesSwap?: string }
type PoseEvent =
  | { char: "doctor"; at: Frame; set: DoctorPose }
  | { char: "chester"; at: Frame; set: ChesterPose }
  | { char: "chirp"; at: Frame; set: ChirpPose }
  | { char: ActorId; at: Frame; set: PatientPose };

interface Episode {
  id: string;                              // "S01E01"
  patientNo: number;                       // do napisu PATIENT #nnn
  title: string;                           // EN, ≤ 60 znaków (zalecane 40–60), bez wulgaryzmów
  fps: 30; width: 1080; height: 1920;
  durationInFrames: 1920 | 2880 | 3120 | 3360 | 3600; // 64 s albo 96–120 s (wielokrotności 8 s); rytuał liczony od N (6.1)
  seed: number;                            // jedyne źródło losowości
  ledger: {
    exitType: string;                      // "E01".."E17"
    winner: Winner;
    patientCategory: string;
    woundId: string; adviceId: string; twistId: string;
  };
  continuity: { plantStage: number; diplomaText: string; spareTimers: number; spareGlasses: number };
  actors: { id: ActorId; ref: string; anchor: XY; maxSize: { w: number; h: number } }[];
    // solo: [{ id: "patient", ref: "patient.json", anchor: [410, 1150], maxSize: { w: 330, h: 380 } }]
    // para: kotwice (330, 1150) i (495, 1150), każdy maks. { w: 165, h: 300 } (5.2)
  state0: State0;                          // klatki 0–5 i N−15..N−1
  shots: { from: Frame; to: Frame; camera: Camera; ease?: "cut" | "zoom8" | "zoom12" }[];
  poses: PoseEvent[];
  motion: { char: ActorId | "doctor"; from: Frame; to: Frame; path: XY[]; scale?: [number, number];
    rotate?: [number, number]; z?: number; zAt?: Frame; swallow?: boolean; ease: Ease }[];
    // wyjście przez okno: path do (540, 500), scale [1, 0.25], z: 1, zAt w połowie toru
    // połknięcie (E03): swallow: true, path do ust Chestera (155, 985), czas ≤ 30 klatek
  instances: { ref: string; from: Frame; to: Frame; n: number; seed: number; area: [number, number, number, number] }[]; // E14
  rewind?: { from: Frame; to: Frame; sourceFrom: Frame; sourceTo: Frame }; // E16, np. { from: N−175, to: N−16, sourceFrom: N−181, sourceTo: 6 }
  timer: { at: Frame; dial: number; mode: "run" | "reverse" | "stolen" | "spare" }[];
    // domyślnie [{ at: 15, dial: 1.0, mode: "run" }]: tarcza schodzi liniowo do 0 przy DING (N−180)
  dialogue: { char: CharId; at: Frame; clip: string; mouth: "none" | "rms" | "rhubarb"; mouthData?: string; text?: string }[];
    // mouthData: JSON Rhubarba albo obwiednia RMS z tools/rms_envelope.py; wymagane, gdy mouth ≠ "none"
  sfx: { at: Frame; clip: string; gainDb?: number }[];
  bed: { tickClip: string; tickPeriodSamples: 24000; tickOffsetSamples: 12000; roomTone: string; music: string }; // pętle *_loop{S}.wav dla danej długości
  props: { id: string; svg: string; from: Frame; to: Frame; anim: "pop" | "fly" | "drop" | "launch"; path?: XY[] }[];
  bubbles: { from: Frame; to: Frame; vignette: string; moving: string[] }[];
  notepad: { from: Frame; to: Frame; doodle: string; drawOnFrames: number; adviceLabel?: string }[];
  windowLayer: { from: Frame; to: Frame; layer: string }[];   // "calm" w S0
  particles: { from: Frame; to: Frame; type: "smoke" | "sparks" | "feathers" | "confetti" | "paper" | "coins" | "dust"; origin: XY; count: number }[];
  captions: { from: Frame; to: Frame; text: string }[];        // ≤ 6 słów
  shakes: { at: Frame; amp: number; decayFrames: number }[];
}

interface State0 {
  camera: "WIDE";
  doctor: { pen: "raised"; brows: "neutral"; mouth: "flat"; headTilt: 0; glassesY: 0; lens: "patient_file_icon"; placement: "chair" };
  chester: { eyes: "wide_up"; mouth: "tight"; sag: 0.02 };
  chirp: { led: "off" };
  patient: { topY: number; scale: 1.0; motionLines: true };  // topY = górna krawędź lalki, domyślnie 230; x z kotwicy aktora
  timer: { dial: 1.0 };
  window: "calm";
  couchShadow: { scale: 1.0; opacity: 0.6 };
  caption: string;                         // "PATIENT #001: OFFICE PRINTER"
}
```

### 9.3 Przykład `episode.json` (S01E01, skrót)

```json
{
  "id": "S01E01",
  "patientNo": 1,
  "title": "Dr. Beige #001: The Printer Who Said No",
  "fps": 30, "width": 1080, "height": 1920, "durationInFrames": 1920,
  "seed": 1001,
  "ledger": { "exitType": "E01", "winner": "patient", "patientCategory": "object",
              "woundId": "W05", "adviceId": "A01", "twistId": "T03" },
  "continuity": { "plantStage": 0, "diplomaText": "Doctor of Nodding", "spareTimers": 6, "spareGlasses": 2 },
  "actors": [ { "id": "patient", "ref": "patient.json", "anchor": [410, 1150], "maxSize": { "w": 330, "h": 380 } } ],
  "state0": {
    "camera": "WIDE",
    "doctor": { "pen": "raised", "brows": "neutral", "mouth": "flat", "headTilt": 0, "glassesY": 0, "lens": "patient_file_icon", "placement": "chair" },
    "chester": { "eyes": "wide_up", "mouth": "tight", "sag": 0.02 },
    "chirp": { "led": "off" },
    "patient": { "topY": 230, "scale": 1.0, "motionLines": true },
    "timer": { "dial": 1.0 },
    "window": "calm",
    "couchShadow": { "scale": 1.0, "opacity": 0.6 },
    "caption": "PATIENT #001: OFFICE PRINTER"
  },
  "shots": [
    { "from": 0, "to": 149, "camera": "WIDE" },
    { "from": 150, "to": 239, "camera": "GLASSES", "ease": "cut" },
    { "from": 240, "to": 359, "camera": "WIDE", "ease": "cut" },
    { "from": 360, "to": 449, "camera": "NOTEPAD", "ease": "cut" },
    { "from": 450, "to": 749, "camera": "WIDE", "ease": "cut" },
    { "from": 750, "to": 809, "camera": "NOTEPAD", "ease": "cut" },
    { "from": 810, "to": 1844, "camera": "WIDE", "ease": "cut" },
    { "from": 1845, "to": 1889, "camera": "GLASSES", "ease": "cut" },
    { "from": 1890, "to": 1919, "camera": "WIDE", "ease": "cut" }
  ],
  "poses": [
    { "char": "patient", "at": 6, "set": { "enter": "fall_from_top" } },
    { "char": "patient", "at": 15, "set": { "land": "heavy" } },
    { "char": "chester", "at": 15, "set": { "eyes": "squint", "mouth": "wavy", "sag": 0.04 } },
    { "char": "doctor", "at": 150, "set": { "lens": "burger" } },
    { "char": "doctor", "at": 1050, "set": { "glassesY": 40, "brows": "one_up" } },
    { "char": "doctor", "at": 1740, "set": { "mouth": "O", "lens": "siren" } },
    { "char": "doctor", "at": 1890, "set": { "pen": "raised", "brows": "neutral", "mouth": "flat", "glassesY": 0, "lens": "patient_file_icon" } },
    { "char": "chester", "at": 1890, "set": { "eyes": "wide_up", "mouth": "tight", "sag": 0.02 } }
  ],
  "motion": [
    { "char": "patient", "from": 6, "to": 14, "path": [[410, 610], [410, 1150]], "ease": "in" },
    { "char": "patient", "from": 1760, "to": 1830, "path": [[410, 1150], [470, 760], [540, 500]], "scale": [1, 0.25], "z": 1, "zAt": 1795, "ease": "inOut" },
    { "char": "patient", "from": 1890, "to": 1904, "path": [[410, 0], [410, 610]], "ease": "out" }
  ],
  "instances": [],
  "timer": [ { "at": 15, "dial": 1.0, "mode": "run" } ],
  "dialogue": [
    { "char": "patient", "at": 18, "clip": "sfx/printer_talk.wav", "mouth": "rms", "mouthData": "sfx/printer_talk.rms.json" },
    { "char": "doctor", "at": 30, "clip": "vo/doctor/MM01.wav", "mouth": "none" },
    { "char": "patient", "at": 250, "clip": "sfx/printer_curse.wav", "mouth": "rms", "mouthData": "sfx/printer_curse.rms.json" },
    { "char": "doctor", "at": 1060, "clip": "vo/doctor/MM15.wav", "mouth": "none" },
    { "char": "patient", "at": 1560, "clip": "vo/patient/printer_no_VP6.wav", "mouth": "rhubarb", "mouthData": "vo/patient/printer_no_VP6.rhubarb.json", "text": "NO." }
  ],
  "sfx": [
    { "at": 6, "clip": "assets/sfx/SFX05_fall.wav" },
    { "at": 15, "clip": "assets/sfx/SFX06_land.wav" },
    { "at": 60, "clip": "assets/sfx/SFX14_bubble.wav" },
    { "at": 150, "clip": "assets/sfx/SFX11_lens.wav" },
    { "at": 640, "clip": "assets/sfx/SFX10_chirp.wav" },
    { "at": 1740, "clip": "assets/sfx/SFX02_ding.wav" },
    { "at": 1846, "clip": "assets/sfx/SFX04_click.wav" },
    { "at": 1852, "clip": "assets/sfx/SFX03_wind.wav", "gainDb": -3 },
    { "at": 1884, "clip": "assets/sfx/SFX11_lens.wav" }
  ],
  "bed": { "tickClip": "assets/sfx/SFX01_tick.wav", "tickPeriodSamples": 24000, "tickOffsetSamples": 12000,
           "roomTone": "assets/sfx/SFX18_roomtone_loop64.wav", "music": "assets/music/theme_loop64.wav" },
  "props": [ { "id": "paper_jam", "svg": "props/paper_strip.svg", "from": 1745, "to": 1844, "anim": "fly" } ],
  "bubbles": [ { "from": 60, "to": 149, "vignette": "vignettes/office_kick.svg", "moving": ["human_leg"] } ],
  "notepad": [
    { "from": 360, "to": 449, "doodle": "doodles/printer_with_horns.svg", "drawOnFrames": 15 },
    { "from": 750, "to": 809, "doodle": "doodles/A01_fence.svg", "drawOnFrames": 18 }
  ],
  "windowLayer": [ { "from": 0, "to": 899, "layer": "calm" }, { "from": 900, "to": 1844, "layer": "office_print_queue" },
                   { "from": 1845, "to": 1919, "layer": "calm" } ],
  "particles": [ { "from": 1530, "to": 1739, "type": "paper", "origin": [410, 950], "count": 60 } ],
  "captions": [ { "from": 1890, "to": 59, "text": "PATIENT #001: OFFICE PRINTER" } ],
  "shakes": [ { "at": 1560, "amp": 14, "decayFrames": 18 } ]
}
```

Napis z `from` > `to` oznacza przejście przez szew (klatki 1890–1919 i 0–59). Renderer traktuje taki zakres modulo `durationInFrames`. Pozycje w `motion` to kotwica dół-środek aktora: w S0 górna krawędź drukarki (wys. 380 px) leży na y 230, więc kotwica na y 610. Warstwa okna `office_print_queue` to ludzie walący głowami w klawiatury i dymek „PRINT QUEUE: 99 999” nad biurowcem, bez ognia i zagrożenia życia.

### 9.4 Prymitywy animacji

| Prymityw | Parametry | Implementacja (funkcja klatki) |
|---|---|---|
| `blink` | postać, klatka, 2–4 klatki | podmiana powiek; losowe mrugnięcia co 2–5 s z `random(seed)`, pomijane dla f < 15 i f ≥ N − 75 |
| `headTilt` | ±6°, wygładzenie | obrót wokół punktu szyi |
| `idleBob` / `breath` | amplituda 2–6 px / ±1% | sinus z obwiednią: 0 przed klatką 15 i od `S0_IN` = N − 30 |
| `squashLand` | szczyt 0,7 / 1,15 | `spring()` Remotion na skali Y i X z zachowaniem objętości |
| `popIn` | przestrzelenie 1,15 | `spring()` skali 0 → 1 |
| `fly` / `drop` / `launch` | ścieżka, wygładzenie | `interpolate()` x, y, obrót; linie ruchu przy `launch`; dla postaci czytane z toru `motion` (skala, obrót, zmiana z w `zAt`) |
| `swallow` | cel: usta Chestera (155, 985) | tor `motion` z `swallow: true`; maska plus skala Y → 0 w szczelinie, SFX08; całość ≤ 30 klatek |
| `mouthSwap` | `dialogue.mouthData` (JSON Rhubarba albo RMS) | kształt = wpis dla `(frame − at) / fps` |
| `lensSwap` | id ikony | 3 klatki szumu, potem nowa ikona z poświatą (feGaussianBlur) |
| `glassesSlide` | 0–40 px | przesunięcie Y okularów, odsłania oczy-kropki |
| `browAngle` | stopnie | obrót brwi |
| `couchSag` | 0–0,05 | skala Y oparcia i siedziska |
| `springPoke` | klatka | sprężyna wyskakuje (`popIn` i chybotanie) |
| `drawOn` | ścieżka, 12–20 klatek | `stroke-dashoffset` i drżenie punktów z `random(seed)` |
| `bubbleInflate` | skala 0 → 1 | dymek z ogonkiem z kropek |
| `grawlix` | `#$%&!` | `popIn` w dymku |
| `shake` | amplituda 6–24 px, wygasanie | szum z `random("shake-"+frame)` |
| `zoom` | preset kamery | transformacja mastera, 8–12 klatek wygładzenia |
| `particles` | typ, liczba, seed | deterministyczne trajektorie z grawitacją |
| `multiply` | `instances` (ref, n, seed, area) | instancje lalki w losowych (z seeda) pozycjach w prostokącie `area` |
| `dialRotate` | tor `timer` | obrót tarczy minutnika: `run` liniowo do 0 przy DING, `reverse` do tyłu, `stolen` minutnik znika z lalką, `spare` nowy z szuflady |
| `blindsDrop` | klatki | przesunięcie prostokąta żaluzji |
| `rewind` | `rewind` (from, to, sourceFrom, sourceTo) | klatka f renderuje scenę z klatki źródłowej `interpolate(f, [from, to], [sourceFrom, sourceTo])` plus nakładka VHS (linie, przesunięcie kolorów) |
| `typeOn` | tekst | rzadko; napisy zwykle wskakują `popIn` |

### 9.5 Lint (przed każdym renderem)

1. `durationInFrames` ∈ {1920, 2880, 3120, 3360, 3600}, fps = 30, audio = sekundy × 48 000 próbek [R-Pętla].
2. Klatki 0–5 i N − 15…N − 1 renderują wyłącznie `state0` (twarde nadpisanie w `Episode.tsx`, 6.2). Po renderze bezstratnym wszystkie 21 klatek (0–5 i N − 15…N − 1) mają identyczny framemd5 (polecenie 1 z Raportu, rozszerzone z 2 na 21 klatek) [R-Pętla]. Mrugnięcia i `lensSwap` nie startują dla f < 15 i f ≥ N − 75.
3. Żadne zdarzenie `sfx` ani `dialogue` nie zaczyna się w klatkach 0–5 i nie wybrzmiewa w ostatnich 200 ms pliku (dla 64 s: po 63,8 s; długość klipu liczona z pliku).
4. Siatka tyknięć: okres 24 000 próbek, przesunięcie 12 000; room tone i muzyka mają dokładnie N × 1 600 próbek.
5. Wszystkie periodyczne ruchy mają obwiednię zerową od `S0_IN` = N − 30, a stałe rytuału (`DING` = N − 180, `GLASSES` = N − 75, `S0_IN`, `HOLD` = N − 15) są liczone od N, nigdy wpisane na sztywno (6.1).
6. Napisy: ≤ 6 słów, bez wulgaryzmów, w pasie y 1235–1320.
7. Tytuł: maks. 60 znaków, zalecane 40–60 (poniżej 40 tylko ostrzeżenie), format „Dr. Beige #nnn: …”, filtr wulgaryzmów (także opis i tagi) [R-Strategia], [R-Regulaminy].
8. Reguły rejestru 1–8 z sekcji 6.3.
9. W kodzie brak `Math.random`, `Date.now` i animacji CSS opartych na czasie (tylko funkcje klatki).
10. Wszystkie ścieżki assetów istnieją; jest `qa/icon.png` pacjenta zaakceptowany przez autora.
11. Angielskie słowa pacjenta: maks. 1 na odcinek, ≤ 6 słów; rzadkie zdanie doktor: maks. 1 na 10 odcinków.
12. Brak zakazanych elementów z sekcji 10 w scenariuszu, JSON-ach i metadanych odcinka (lista słów i tagów w `lint/blocklist.json`), w tym: pacjent odłączający lub wyłączający samego siebie („patient unplugs/switches off itself”), wokalizy Chestera przy podłączaniu, wkładaniu lub wciskaniu czegoś w kanapę oraz nazwy realnych marek i produktów („Pumpkin Spice Latte”, „PSL”, „Starbucks”, „reCAPTCHA”, „ChatGPT”, „Gemini”, „Claude”, „Therabot” i kolejne dopisywane przy brand checku).
13. Każdy pacjent ma ≥ 1 element `adultCoding` i ≥ 1 element `wear`; oczy mają 22–30% szerokości bryły; brak akcesoriów z listy zakazanej (4.2); pary oczu „okrągłe wyłupiaste”, „gwiazdki” i „serduszka” nie występują w ujęciu z klipem CRY ani w odcinku E03, a „gwiazdki” i „serduszka” tylko jako podmiana ≤ 30 klatek; przy E03 tor `swallow` trwa ≤ 30 klatek i w 60 klatkach przed nim nie ma ujęcia PATIENT.
14. Każdy `exitType` ma wymagane tory (kolumna „Wymaga” w 6.3): E03 rozmiar S i `motion.swallow`; E05 `timer` w trybie `stolen` i `spare` oraz `spareTimers` mniejsze o 1 niż w poprzednim odcinku; E08 drugi aktor albo rekwizyt-partner; E14 `instances`; E16 `rewind`, `timer.reverse` i brak cięcia GLASSES; wyjścia przez okno, sufit i krawędź kadru tor `motion`; E04 i E17 `doctor.placement` inny niż `chair` (przy E10 tylko wtedy, gdy doktor opuszcza fotel), a E17 wyrzucenie tylko w górę.
15. Każda wartość w `poses.set` istnieje w enumie danej postaci albo w assetach (`assets/glasses/*.svg`, biblioteki pacjenta); każde `dialogue` z `mouth` ≠ "none" ma `mouthData`; jeśli pacjent ma `dialogue` z `text`, jego `voicePreset` nie jest `null`.
16. Obrys każdego aktora mieści się w `maxSize` i nie wchodzi w strefę twarzy Chestera (x < 250, y 860–1010) w żadnej klatce.

Render i kontrola: `npx remotion render` do mastera bezstratnego, potem polecenia 1–4 z Raportu (framemd5, ffprobe, eksport H.264 + AAC 48 kHz z `-frames:v N`, test szwu audio) i test na telefonie w każdej aplikacji [R-Pętla], [R-Checklista].

### 9.6 Czego unikać

- **Chodzenia, biegania, cykli kroków** i jakiejkolwiek postaci od pasa w dół.
- **Nowych lokacji.** Wspomnienia to płaskie winiety w dymku, nie nowe tła.
- **Perspektywy, ruchu kamery 3D, obrotów postaci w głąb** (tylko przód albo profil).
- **Chwytania i złożonej interakcji fizycznej.** Rzeczy wskakują, odlatują albo są połykane.
- **Animowanych tłumów.** Najwyżej 5 statycznych sylwetek w dymku albo instancje jednej lalki (E14).
- **Długich dialogów** wymagających lip-syncu i dubbingu.
- **Realistycznego cieniowania i gradientów** poza poświatą ekranów.
- **Gęstego tekstu w kadrze:** notes jest bez słów, okno bez napisów (poza neonem rywala).
- **Niedeterminizmu:** `Math.random()`, czas systemowy, zewnętrzne dane w trakcie renderu.
- **Efektów lub sylab przecinających szew** i jakiejkolwiek planszy końcowej czy CTA na szwie [R-Pętla].
- **Promptów z nazwami cudzych postaci, studiów i twórców** („in the style of…”) w jakimkolwiek narzędziu AI [R-Postać].

---

## 10. Zasady treści

**Wulgaryzmy**
- Wyłącznie w dialogu: klip CURSE, grawlixy, jedno wyraźne słowo pacjenta, które Chirp cenzuruje z opóźnieniem. Od lipca 2025 r. mocne przekleństwo w dialogu, także w pierwszych 7 sekundach, nie odbiera reklam na YouTube, byle nie trafiło do tytułu ani miniatury i nie dominowało przez większość filmu [R-Regulaminy].
- **Nigdy w tytule, miniaturze, opisie ani tagach.** Mocne przekleństwo w tytule lub miniaturze odbiera reklamy i grozi ograniczeniem wiekowym [R-Regulaminy].
- Wulgarny gest (środkowy palec w rysunku z notesu) tylko w treści odcinka, nigdy w klatce 0 ani w miniaturze, bo klatka 0 to pierwsze wrażenie w feedzie [R-Strategia].

**Seks**
- Bez treści seksualnych wprost: zero aktów, także sugerowanych i zamazanych [R-Regulaminy]. Claude i tak odrzuca treści seksualnie eksplicytne [R-Pipeline].
- Romans przedmiotów tylko jako niewinna aluzja (serduszka w oczach, wspólne wyjście w E08). Bez seksualizowanych tytułów i miniatur.
- Bez dwuznaczności typu wtyczka–gniazdko i bez jęków: ładowanie pokazuje ikona baterii i „ding”, a Chester przy podłączaniu, wkładaniu lub wciskaniu czegoś w kanapę nie wydaje wokaliz, tylko skrzypi sprężynami (jęki to w tabeli Raportu kategoria ograniczonych reklam) [R-Regulaminy].

**Przemoc i gore**
- Przemoc wyłącznie kreskówkowa: wybuch to konfetti, pierze, monety albo pył. Przedmioty nie mają krwi ani części ciała. Animację YouTube traktuje jako „dramatized”, ale treść, której celem jest szokować, nie ma reklam [R-Regulaminy].
- Żadnych młodo wyglądających postaci, także nieludzkich, w cierpieniu (zaostrzenie YouTube z marca 2026) [R-Regulaminy]. Pacjenci są „dorośli” (reguła R8, lint 13).
- Połknięcie przez Chestera to szybki gag (do 1 s), bez zbliżenia na przerażonego małego pacjenta tuż przed nim, bez ślinki i „głodnego” spojrzenia, żeby nie kojarzyło się z niszą fetyszową.
- Konsekwencje w oknie bez zagrożenia życia ludzi: żadnych płonących ani walących się budynków z ludźmi w środku, które przypominają realne katastrofy (YouTube odbiera reklamy za „sensacyjne animowane przedstawienia tematów kontrowersyjnych”) [R-Regulaminy]. Ogień najwyżej jako jeden dymiący kosz na śmieci.

**Realne osoby, marki i grupy**
- **Sezon 1 bez realnych osób:** polityków, celebrytów, influencerów. Bez klonów głosu i wizerunku [R-Regulaminy], [R-Eleven].
- Bez marek, logo i rozpoznawalnych designów produktów. Bez realnych firm, partii i flag. Przedmioty z silnym brandingiem pokazujemy w wersjach generycznych (kubek bez logo, szare pole z ptaszkiem, dymek z diodą zamiast logo asystenta AI), a ich nazwy są w `lint/blocklist.json`; obraz sprawdza ręczny brand check w bramie jakości (6.6, krok 10).
- Melodie i tańce wyłącznie w 100% wymyślone: muzyka z Eleven Music bez odniesień do realnych utworów (także melodii oczekiwania infolinii), taniec z 2–3 własnych póz górnej połowy ciała. Bez nazw realnych trendów, piosenek i dźwięków w tytule, opisie i tagach. Short dłuższy niż minuta z aktywnym roszczeniem Content ID jest blokowany globalnie [R-Regulaminy].
- **Bez obelg i slurów wobec grup chronionych.** Deklarowana intencja komediowa nie wystarcza [R-Regulaminy]. Ludzie w dymkach są szarzy i bezimienni właśnie po to, żeby nie budować stereotypów.
- Bez religii jako pacjenta w sezonie 1 (żadnych bóstw, świętych ani symboli wyznaniowych).

**Zdrowie psychiczne (temat formatu)**
- Doktor **nie udziela żadnych prawdziwych porad.** Rady są absurdalne i rysunkowe, dyplom jest gagiem. YouTube wyklucza z monetyzacji kanały z personami AI udającymi ekspertów od zdrowia [R-Regulaminy]. Dr. Beige jest wyraźnie fikcyjną kreskówką, a opis brzmi: „Adult animated satire. Not a real doctor. Not real advice.”
- Bez nazw i żartów z realnych zaburzeń. Zmyślone diagnozy pokazujemy rzadko i jako biurokratyczne kody w szkłach albo na pieczątce (np. „CODE 404-MON”, „FORM 7B: PENDING”), nie jako dziecięce kalambury.
- Żadnych atrybutów lekarza ciała: bez stetoskopu, torby lekarskiej, bandaży i plastrów. To terapia dla dorosłych, nie leczenie zabawek (sekcja 12.1, „Doc McStuffins”).
- **Bez samookaleczeń i samobójstwa,** także w aluzji: pacjent nigdy nie chce przestać istnieć, „zgniatarka” czy „wypalenie” nie są puentą o śmierci z wyboru (zasada świata nr 11). Pacjent-urządzenie nigdy nie odłącza ani nie wyłącza samego siebie, bo „pull the plug” to po angielsku idiom odłączenia aparatury podtrzymującej życie; rada A10 odłącza innych albo świat (6.4).
- Bez nazw leków i substancji.

**Platformy i klasyfikacja**
- „Nie, nie jest przeznaczony dla dzieci” na kanale i przy każdym filmie. Ciemna paleta, bez pasteli, rymowanek i zabawek [R-Regulaminy].
- Bez tytoniu i e-papierosów jako rekwizytów (rekomendacje Instagrama) [R-Postać]. Doktor pije kawę z kubka.
- Oznaczanie AI: YouTube zwalnia treści „clearly fantastical or animated”. Na Instagramie i Facebooku zaznaczamy „AI info”, jeśli głos AI brzmi realistycznie. Nie usuwamy znaków wodnych ani metadanych pochodzenia [R-Regulaminy].
- Polityka „inauthentic content”: rejestr wyników, autorska redakcja każdego zalążka, brama jakości, 3–5 odcinków tygodniowo zamiast codziennego taśmociągu, zero hurtowych wariacji szablonu [R-Regulaminy], [R-Strategia].
- Muzyka wyłącznie z ElevenLabs na płatnym planie (Creator lub wyższy dla streamingu) albo własna [R-Eleven], [R-Regulaminy].

---

## 11. Rozwój długoterminowy

**Zasada kosztu.** Każde rozszerzenie używa tej samej scenografii, tych samych rigów i tej samej biblioteki dźwięków. Nowa stała postać pojawia się najwyżej raz na sezon i kosztuje jeden plik SVG plus jedną kartę głosu.

**Łuki sezonu 1 (zero dodatkowej animacji):**
- usychająca roślina (12 etapów, ostatni liść w finale);
- bateria Chirpa (finał E17);
- zaległy czynsz i puknięcia właściciela;
- rywal Nod-O-Matic 99¢ (S1E25);
- szuflada zapasowych minutników i okularów;
- licznik pacjentów, zmieniający się dyplom.

**Sezon 2 i dalej:**

| Rozszerzenie | Na czym polega | Koszt |
|---|---|---|
| Nawroty | drukarka, poniedziałek i inni wracają z **nową raną** (np. „The Printer Relapses”) | zero, lalka już istnieje |
| Turniej nawrotów | widzowie w komentarzach wybierają, kto wraca | zero |
| Terapia par (A×B) | sól i pieprz, lewa i prawa słuchawka, szampon i odżywka, widelec i nóż | druga lalka z generatora |
| Terapia grupowa świąteczna | 3 pacjentów naraz: choinka, nietrafiony prezent, świąteczny sweter (rząd aktorów w pudełku x 245–575, każdy ≤ 110 px szerokości; układ dopisać do 5.2 przed produkcją) | lalki z biblioteki, ta sama scena |
| Odcinki kalendarzowe | 17 stycznia, walentynki, Halloween, Black Friday | gotowy plan publikacji |
| Nowa plastikowa roślina | po śmierci rośliny w finale S1 stoi sztuczna, która… też usycha | 1 SVG |
| Odwrócenie w finale S2 | doktor kładzie się na Chesterze (`sunk_in_couch`, 5.5), Chester prowadzi sesję samymi skrzypnięciami | zero |
| Stała postać S2 | kiosk Nod-O-Matic 99¢ wchodzi do gabinetu jako „asystent” | 1 SVG, 1 karta głosu |

**Kompilacje long-form „A Whole Day of Appointments” (10–20 min co 2–4 tygodnie).** Raport każe dać im wartość dodaną: sceny łączące, rozdziały i 1–2 premierowe sceny tylko w kompilacji, żeby nie wyglądały na szablonowy recykling [R-Strategia]. Tanie przerywniki to ta sama scena w nocnej palecie (Chester sam w ciemności, doktor na przerwie obiadowej, Chirp ćwierkający do pustego pokoju). Wezwanie do obejrzenia długiej formy wplatamy przed puentą, nigdy na szwie [R-Strategia].

**Spin-offy przy zerowym koszcie animacji:**
- **„Doctor's Notes”:** karuzele obrazków z notesu (Instagram, tryb zdjęć TikToka), a te same rysunki jako merch (kubki, koszulki).
- **„Found in Chester”:** 15-sekundowe mikro-shorty z tym, co wypada z kanapy.
- **„Nod-O-Matic 99¢”:** bezsłowne skecze rywala w oknie.

**Lokalizacja.** Do przetłumaczenia jest tylko napis „PATIENT #nnn: …” i tytuł, więc wersja językowa to zmiana jednego pola w JSON-ie. Nie potrzeba dubbingu ani ścieżek wielojęzycznych, które Raport wycenia jako znaczny koszt [R-Humor]. Zasada publikacji: na YouTube tłumaczymy wyłącznie tytuł i opis przez wbudowane tłumaczenia metadanych, bez ponownych uploadów, a wypalony napis „PATIENT #nnn” zostaje po angielsku. Wersje z przetłumaczonym napisem publikujemy tylko na osobnych lokalnych kontach TikToka i Instagrama, nigdy jako duplikaty na kanale głównym. Wiele niemal identycznych wersji na jednym kanale to wzorzec „mass production” i „template-based” z polityki inauthentic content, a YouTube ocenia kanał jako całość [R-Regulaminy].

**Udział widzów:** „Who's next on the couch?” (pacjenci z komentarzy), ankiety „zgadnij finał”, „znajdź easter egg Chestera”. Udostępnienia są ważniejsze dla zasięgu u nieobserwujących, więc odcinki projektujemy pod „wyślij to szefowi” [R-Strategia].

**IP i merch.** Najpierw słowny znak tytułu „DR. BEIGE” w klasie 41; klasy 9 i 38 dopiero po potwierdzeniu w urzędowych bazach, że nie ma w nich kolizji (12.2, krok 3). Bez merchu kosmetycznego (klasa 3), bo tam działa aktywny znak „BEIGE” firmy Chanel (12.3). Imiona postaci zgłaszamy dopiero przy potencjale merchowym (klasy 25, 16, 28) [R-Postać].

**Kadencja.** 3–5 odcinków tygodniowo na platformę, zero tygodni bez publikacji, bufor 2–3 tygodni [R-Strategia].

---

## 12. Oryginalność i clearance

### 12.1 Najbliższe istniejące dzieła i różnice

| Dzieło | Co jest podobne | Czym się różnimy (i czego unikamy) |
|---|---|---|
| „Dr. Katz, Professional Therapist” (Comedy Central, od 1995 r., technika Squigglevision) | terapeuta i goście co odcinek | u nas terapeutka nie mówi (tylko „Mm-hm”), pacjenci to przedmioty i pojęcia bez kończyn, puenty są wizualne, odcinek trwa 64 s i jest pętlą, kanapa jest postacią |
| „HouseBroken” (Fox, od 2021 r.) | animowana terapia grupowa | tam zwierzęta domowe i dialog; u nas przedmioty, bez zwierząt, bez słów |
| Object shows: „Battle for Dream Island” (od 2010), „Inanimate Insanity” | przedmioty z twarzami | tam przedmioty z rękami i nogami rywalizują w konkursach dla młodej widowni; u nas bez kończyn, jedna sesja, satyra dla dorosłych, ciemna paleta |
| „Annoying Orange” (od 2009) | gadający przedmiot z oczami i ustami | tam zdjęcie owocu z doklejoną ludzką twarzą i ciągła gadanina; u nas płaska wycinanka i mowa efektami |
| „Dzielny mały toster” (1987), „Toy Story” | czujące przedmioty i sprzęty | nie robimy zabawek ani scen złomowiska; tonacja satyryczna dla dorosłych |
| „Sausage Party” (2016) | jedzenie z twarzami, dla dorosłych | jedzenie jako pacjent rzadko, zero seksu |
| „W głowie się nie mieści” (2015) | personifikacja wewnętrznych stanów | nie personifikujemy emocji (reguła R10); pojęcia to przedmioty-symbole |
| „Don't Hug Me I'm Scared” (od 2011) | gadające przedmioty, notes z rysunkami | u nas notes nie mówi i nie śpiewa; to rekwizyt doktor |
| Edna Mode („Iniemamocni”, 2004) | kobieca postać z bobem i wielkimi okularami | wysoka sylwetka-linijka, wysoka siwa trwała zamiast boba, kwadratowe szkła-ekrany szersze niż głowa, petrolowy kardigan, bez cygarniczki |
| Velma Dinkley („Scooby-Doo”, Warner Bros.; także serial dla dorosłych „Velma”, HBO Max 2023–2024) | bob, grube czarne kwadratowe okulary, golf; ta sama kategoria (animacja dla dorosłych) | okulary-ekrany CRT szersze niż głowa są jedyną wspólną cechą; zamiast boba wysoka siwa trwała, zamiast golfu petrolowy kardigan na koszuli z kołnierzykiem i smycz „DR.”; inny wiek, sylwetka-linijka, zero dialogu |
| Roz („Potwory i spółka”, 2001) | deadpan, czarne okulary, siwe włosy, bordowy sweter, zmęczona urzędniczka | inny kształt i głos, petrolowy kardigan zamiast bordowego swetra, szkła-ekrany zamiast oprawek z łańcuszkiem; nie używamy motywu „always watching” |
| „Koralina i tajemnicze drzwi” (2009) | guziki jako oczy | oczy Chestera to pikowania, które otwierają się jak powieki, nie przyszyte guziki |
| „Doc McStuffins” (Disney Junior, 2012–2020) | „lekarka” przyjmuje ożywione przedmioty (zabawki), stawia zmyślone diagnozy i rysuje je w książce | u nas terapia, nie leczenie ciała; widownia dorosła; żadnych zabawek jako pacjentów; bez stetoskopu, torby lekarskiej, bandaży i plastrów; notes ma puenty dla dorosłych, nie rysunki diagnoz; diagnozy rzadko i tylko jako biurokratyczne kody |
| „Therapy Gecko” (YouTube/TikTok) | komediowy, nielicencjonowany „terapeuta”, który daje absurdalne rady; te same platformy | u nas animowana pętla zamiast rozmów na żywo z ludźmi, pacjenci-przedmioty, terapeutka nie mówi (tylko „Mm-hm”) i nie daje słownych rad |
| Chairry („Pee-wee's Playhouse”) | gadający mebel z twarzą | Chester jest kanapą Chesterfield, nie mówi, jest straumatyzowany i połyka; nie przytula |
| „Smiling Friends” (Adult Swim, 2022) | serwis pomagający klientom co odcinek | tam wyjazdy do klientów i dialog; u nas jeden gabinet i zero dialogu |
| Kenny („South Park”) | śmierć i powrót jako pętla | u nas wraca rytuał minutnika, a wynik jest za każdym razem inny |
| Skecze TikToka „if objects went to therapy” | „przedmioty na terapii” to wysycony motyw | wyróżnia nas stała, rozpoznawalna obsada, okulary-ekrany, Chester, rytuał minutnika, ciągłość i numer pacjenta |
| Scena z drukarką w „Office Space” (1999) | drukarka jako ofiara biura | nie odtwarzamy kija bejsbolowego na polu ani komunikatu „PC LOAD LETTER” |
| „Garfield” | nienawiść do poniedziałków | zero kotów i lazanii w odcinku „Monday” |

### 12.2 Procedura clearance (z Raportu)

Dla każdej głównej postaci i tytułu przed premierą wykonujemy pięć kroków i archiwizujemy wyniki w folderze `clearance/` ze zrzutami i datami [R-Postać], [R-Checklista]:

1. **Odwrotne wyszukiwanie obrazem** w Google Lens, TinEye i Bing Visual Search: 3–5 ujęć Dr. Beige, Chestera, Chirpa i logo (całość, sylwetka, twarz).
2. **Znaki graficzne:** WIPO Global Brand Database (wyszukiwanie obrazem: Concept, Shape, Color, Composite), Vienna Classification Assistant, DPMAregister dla logo tytułu i ikonicznej głowy doktor z okularami.
3. **Znaki słowne:** TMview, EUIPO eSearch, e-UPRP, USPTO w klasach 9, 16, 25, 28, 35, 38, 41, a potem wyszukiwanie na YouTube, TikToku, Instagramie, Fandomie i w Google. Do sprawdzenia: „Dr. Beige”, „Doctor Beige”, „DrBeige” (także jako handle i hashtag), tagline „Every thing has trauma”, „Chester”, „Chirp”, „Nod-O-Matic”. Sprawdzić też, czy „Mm-hmm” nie jest catchphrase'em znanej postaci (to nadal kwestia doktor, ale już nie nazwa). **Osobno potwierdzić w USPTO (TSDR) i EUIPO** znaki „BEIGE” (aktywny znak Chanel w klasie 3, nr rej. 3628223) i ewentualne nowe zgłoszenia „DR. BEIGE”. Poprzedni tytuł „Dr. Mm-hm” odpadł przez rejestrację USPTO „MMHMM” (klasa 9, nr 6686694, mmhmm inc., aplikacja wideo); szczegóły i lista wyszukiwań w 12.3. Ostateczne potwierdzenie w urzędowych bazach zapada **przed pierwszym uploadem**, bo nazwa trafia do każdego tytułu „Dr. Beige #nnn”.
4. **Porównanie z najbliższymi:** tabela 12.1 (w tym Velma, także serial „Velma” HBO Max, Roz, Edna Mode, „Doc McStuffins” i „Therapy Gecko”) plus lista z Raportu (South Park, Kapitan Bomba, Family Guy, Rick and Morty, Big Mouth, Simpsonowie). Projekt doktor szkicujemy ręcznie dopiero po tej weryfikacji. Zmieniamy cechy, gdy pokrywa się więcej niż jeden wymiar: sylwetka, kolor, rekwizyt, imię, maniera głosu.
5. **Higiena promptów:** w żadnym narzędziu AI nie używamy nazw cudzych postaci, studiów ani twórców i każdy output porównujemy z kanonem. Pozew WBD przeciw Midjourney twierdzi, że nawet ogólny prompt potrafi zwrócić cudze postacie [R-Postać].

**Dowody autorstwa.** Bazowy projekt każdej głównej postaci trzeba narysować ręcznie, nawet prymitywnie, i datować przed animacją w kodzie. Prompty z samego AI nie dają ochrony w USA, UE ani w Polsce, a chroniony jest ludzki wkład [R-Postać]. Repozytorium Git z historią commitów, logi promptów, model sheety z datami i karty głosów to ubezpieczenie. Czeski powód przegrał m.in. dlatego, że nie udowodnił autorstwa promptu [R-Postać]. Prompty Voice Design nigdy nie opisują głosu przez odniesienie do realnej osoby ani znanej postaci [R-Postać].

**Znak towarowy.** Słowny znak tytułu domyślnie tylko w klasie 41 (800 zł minimalnie w UPRP) [R-Postać]; klasy 9 i 38 (razem z 41: 1 840 zł w UPRP, 1 050 EUR w EUIPO [R-Postać]) dokładamy wyłącznie wtedy, gdy krok 3 nie wykaże w tych klasach kolizji z „DR. BEIGE”. Zgłaszamy go po czystym clearance, w dniach 28–30 planu [R-30dni], a urzędowe potwierdzenie tytułu uzyskujemy przed pierwszym uploadem.

### 12.3 Zmiana tytułu: „Dr. Mm-hm” → „Dr. Beige” (8.11.2026)

**Powód.** Roboczy tytuł i imię terapeutki „Dr. Mm-hm” zderzały się z zarejestrowanym znakiem USPTO „MMHMM” (klasa 9, nr rej. 6686694, właściciel mmhmm inc., aplikacja do wideo i wirtualnej kamery). Znak nie obejmuje klasy 41, ale tytuł byłby fonetycznie identyczny z marką technologiczną działającą w tej samej przestrzeni wideo, co utrudnia wyszukiwanie, merch w klasach 9 i 38 oraz grozi sprzeciwem. Nowy tytuł i nazwisko nie opierają się na „Mm-hm” ani „Hmm”. Catchphrase „Mm-hm.” zostaje jako zwykły wykrzyknik w ustach doktor (biblioteka MM01–MM15).

**Kandydaci (burza mózgów, 18):** Dr. Beige, Dr. Taupe, Dr. Drab, Dr. Copay, Dr. Dime, Dr. Nod, Dr. Dull, Thingapy, Thing Therapy, Every Thing Therapy, Trauma Couch, Couch Things, Patient Things, Thing Shrink, Shrink Rap, Object Lessons, Object Therapy, Cheap Couch.

**Wyszukiwania z 8.11.2026 (wyszukiwarka internetowa i bezpośrednie sprawdzenie handli):**

| Kandydat | Co sprawdziliśmy | Wynik | Decyzja |
|---|---|---|---|
| **Dr. Beige** | „Dr. Beige” i „Doctor Beige”: znak, serial, podcast, zespół, gra, aplikacja, kanał YouTube/TikTok/Instagram, postać z fandomu | brak serialu, filmu, gry, aplikacji, podcastu i postaci o tej nazwie; brak znaku „DR. BEIGE”; znak „BEIGE” Chanel tylko w klasie 3 (kosmetyki); `youtube.com/@drbeige` to uśpiony kanał prywatny (1 subskrybent, 2 filmy); `@DrBeigeShow` na YouTube wolny (404); niezależny trend „sad beige” (@sadbeige, ok. 295 tys. obserwujących na TikToku) to inne hasło | **wybrany** |
| Thing Therapy | znak, serial, podcast, YouTube/TikTok | zgłoszenie USPTO „THING THERAPY” w klasie 41 (nr 98932076, w toku) | odrzucony |
| Thingapy | znak, aplikacja, podcast, YouTube/TikTok | czysto, `@Thingapy` na YouTube wolny, ale niejasna wymowa („thing-a-pee” czy „thin-gapy”) | rezerwowy |
| Dr. Copay | znak, YouTube/TikTok, podcast, show | czysto, ale „copay” to amerykańskie pojęcie ubezpieczeniowe, niezrozumiałe globalnie i medyczne w wydźwięku (sekcja 10, zakaz porad zdrowotnych) | rezerwowy |
| Dr. Drab | znak, postacie, osoby | czysto w mediach, ale istnieją realni lekarze o nazwisku Drab (m.in. w Polsce i na Słowacji), a po polsku „drab” znaczy „łobuz” | odrzucony |
| Dr. Taupe | postacie, osoby | czysto, ale trudna wymowa | odrzucony |
| Trauma Couch | podcast, serial, YouTube | brak dokładnej nazwy, ale gęsto od podcastów terapeutycznych („Breaking the Couch” i inne), słabo wyszukiwalny | odrzucony |

**Urzędowe bazy nie zadziałały z naszego środowiska** i trzeba je powtórzyć ręcznie w przeglądarce: tmsearch.uspto.gov (aplikacja JavaScript, brak wyników bez renderowania, a API odrzuca zapytania), EUIPO eSearch (HTTP 503), TMview / tmdn.org (żądanie odrzucone przez zaporę), agregator markinton.com (błąd tunelu 502). Wyniki o znakach pochodzą więc z agregatorów (markinton.com, trademarkdir.com) i trzeba je potwierdzić w TSDR, EUIPO eSearch, TMview i e-UPRP (klasy 9, 16, 25, 28, 35, 38, 41) przed pierwszym uploadem. Zrzuty i daty archiwizujemy w `clearance/`.
