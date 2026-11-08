# Production pipeline and tools (AI + non-AI) for a cheap, fast, repeatable 60–120 s vertical adult animated series (2026)

Prices checked 2026-11-08. Many vendor pricing pages render prices with JavaScript, so a lot of figures come from third-party aggregators. Each one is marked **[official]** (vendor's own page) or **[aggregator]** (third party, lower confidence). Where sources conflict, both figures are given.

Exchange rate for budget conversion: **1 USD = 3.9321 PLN** (NBP table A no. 217/A/NBP/2026, effective 2026-11-06, the last trading day before 2026-11-08). 1 EUR = 4.3925 PLN (same table). Between 2026-10-26 and 2026-11-06 the USD mid-rate ranged from 3.9097 to 3.9624 PLN. Source: [NBP API, USD rates 2026-10-26…11-06](https://api.nbp.pl/api/exchangerates/rates/a/usd/2026-10-26/2026-11-08/?format=json); [NBP API, EUR last](https://api.nbp.pl/api/exchangerates/rates/a/eur/last/1/?format=json)

---

## 1. Script / ideation (stage 1): LLMs, screenwriting software, content-policy limits for crude comedy

### Takeaway
Claude Pro at $20/mo (Claude Code included) covers both writing and the code-first animation pipeline, so it is the obvious anchor. ChatGPT Plus and Google AI Pro cost about the same (~$20). Dedicated screenwriting software isn't needed for 60–120 s shorts: a Markdown/Fountain or JSON script that the code pipeline can read directly works better. Anthropic's policy forbids sexually explicit content and content that "glorifies" graphic violence. It says nothing about profanity, and it explicitly allows clearly disclosed parody and satire. Crude satire is feasible, sexual content is not.

### Cited Findings
- **Claude plans [official]:** Free $0. Pro $20/mo billed monthly, or $200/yr (~$17/mo). Max $100/mo (5x Pro usage). The $200/mo tier is now called **"Ultra"** (10x Pro usage per week, no 5-hour limit for verified accounts). It does not appear as "Max 20x". Claude Code is included in Pro, Max and Ultra but not in Free. — [claude.com/pricing](https://claude.com/pricing)
  - Note: the "Ultra" naming differs from older "Max 20x" naming, so the report should use the current name.
- **Anthropic Usage Policy [official], effective date shown as Nov 12, 2026:** it prohibits generating sexually explicit content ("Depict or request sexual intercourse or sex acts", "erotic chats", fetish content) and prohibits content that would "Promote, trivialize, or glorify graphic violence, gore, sexual violence, or animal cruelty". It does **not mention profanity**. On impersonating real people: "This does not prohibit clearly disclosed parody, satire, or fiction". It separately bans undisclosed synthetic media of real candidates or officials. Hate and discrimination against protected groups are prohibited. — [anthropic.com/legal/aup](https://www.anthropic.com/legal/aup)
- User anecdotes suggest Claude will write profane and crude characters, though some writers report inconsistent policy flags. These are anecdotal and low reliability. — [Sudowrite blog (competitor, biased)](https://sudowrite.com/blog/can-claude-write-nsfw/); [claudeissues.com bug report](https://claudeissues.com/issue/2325-bug-overly-aggressive-policy-violation-flagging)
- **ChatGPT [aggregator]:** Plus $20/mo. A new ChatGPT Pro tier at $100/mo reportedly launched April 9, 2026, next to the $200 Pro (sources conflict). — [eWeek AI pricing cheat sheet 2026](https://www.eweek.com/news/ai-pricing-cheat-sheet-2026/); [krater.ai Gemini pricing](https://krater.ai/blog/gemini-pricing)
- **Google AI plans [official]:** AI Plus $4.99/mo (200 Flow credits). AI Pro $19.99/mo (1,000 Flow credits, "limited trial of Veo 3.1 Lite"). AI Ultra from $99.99/mo (10,000 credits) or $199.99/mo (25,000 credits), with Veo 3.1 video generation. — [gemini.google/subscriptions](https://gemini.google/subscriptions/)
- **Screenwriting software [aggregator]:** Final Draft 13 lists at $249.99 one-time (promo $199.99 in Aug 2026). — [techbloat review](https://www.techbloat.com/?p=1948195). WriterDuet: Plus $89.88/yr, Pro $107.88/yr, Premium $125.88/yr, plus a free tier for 3 scripts. — [Boords scriptwriting buyer's guide](https://assets.boords.com/best-scriptwriting-software). Celtx: custom/quote pricing (an older "Writer" plan was $14.99/mo). — [Toolradar Celtx](https://toolradar.com/tools/celtx/pricing)

### Inferences
- For a solo creator, the "writers' room" can be a structured Claude workflow: a series bible (characters, running gags, tone rules, banned topics), then a premise list, then a beat sheet (hook in the first 2 s, escalation, punchline that leads back into the opening for the loop), then the script, then a JSON scene list. Keeping the bible in the repo (e.g. CLAUDE.md) gives consistency across episodes.
- The same Claude Code session can turn the script directly into a scene JSON for Remotion, which removes the storyboard→animation handoff.
- Policy risk: crude language, toilet humor and political satire of fictional characters should be fine. Explicit sexual gags will be refused. Satire of real politicians is allowed if clearly parody, but AI video and image generators (section 5) are stricter than Claude.
- Estimated time per episode (inference, no source found): 0.5–1.5 h (ideation 15–30 min, script draft plus 2–3 punch-up passes 30–60 min).

### Gaps
- No official Anthropic statement found specifically on profanity or crude humor. Behavior in practice must be tested.
- No official ChatGPT or OpenAI content policy for vulgar comedy was reviewed. Gemini's text policy was not reviewed.
- Final Draft and WriterDuet official 2026 pricing pages were not fetched (aggregator figures only).

---

## 2. Storyboard / animatic (stage 2)

### Takeaway
For a code-first or rig pipeline, a separate storyboard tool is mostly optional. A JSON scene list plus quick AI frames (Nano Banana, Recraft, Midjourney) or rough sketches in free tools is enough. LTX Studio is the most complete AI storyboard tool, but it costs $15–125/mo and its free plan is personal-use only.

### Cited Findings
- **LTX Studio [aggregator, conflicting]:** Free, Lite $15/mo, Standard $35/mo, Pro $125/mo (G2, updated Apr 9, 2026). — [G2 LTX pricing](https://www.g2.com/products/ltx/pricing). Toolradar shows Lite $12, Standard $28, Pro $100 (possibly annual billing, Feb 2026). — [Toolradar LTX](https://toolradar.com/tools/ltx-studio/pricing). Standard, Pro and Enterprise include a commercial-use license. The free plan is personal-use only. — [LTX help center](https://help.ltx.io/hc/en-us/sections/29870262567314-About-Plans-and-Pricing)
- **Boords:** no official 2026 price found. One roundup says "from about $15/mo". — [Atlabs AI storyboard tools 2026](https://www.atlabs.ai/blog/5-best-ai-storyboard-generator-tools-in-2026)
- Image models usable for storyboard frames (Nano Banana, Recraft, Midjourney) are priced in section 3.

### Inferences
- **Code-first:** the "storyboard" is the scene JSON (shot, background, characters, poses, expressions, dialogue line, duration). Remotion Studio's preview acts as the animatic, so a separate animatic stage is unnecessary.
- **Rig pipeline (Character Animator / Cartoon Animator):** a 6–12-panel thumbnail sheet is enough for 60–120 s. Use pencil, Krita (free) or AI frames.
- **AI video:** a storyboard of keyframes (start and end image per shot) is mandatory, because those keyframes drive image-to-video and also give control over the loop.
- Estimated time (inference): 0.25–0.5 h code-first, 0.5–1 h rig, 1–2 h AI-video hybrid (keyframes must be generated and approved).

### Gaps
- Storyboarder (Wonder Unit, free), Krita (free) and Katalist were not re-verified this session. Their status and pricing in 2026 are unconfirmed.

---

## 3. Character assets & rigs (stage 3) and backgrounds (stage 4): rig software and AI image generation

### Takeaway
For a South Park / Kapitan Bomba look (flat cut-out, few drawings, reusable puppets), the cheapest options that suit it best are: (a) SVG/PNG layered characters animated in code (Remotion), assets made in Recraft (native vector) or Nano Banana; (b) Adobe Character Animator (live puppet performance plus auto lip-sync, but only with Creative Cloud Pro at ~$70/mo); (c) Reallusion Cartoon Animator 5 (one-time purchase, lip-sync from audio, but price not confirmed); (d) Moho Pro 14 at $399.99 one-time (bones plus Rhubarb integration). Toon Boom Harmony is overkill. Rive is excellent for state-machine puppets but aimed at interactive runtimes. South Park itself has used Maya for cut-out-looking 3D since the early days (it began with real construction paper). Midjourney's character reference situation changed in 2026: on V8, omni-reference falls back to V7.

### Cited Findings — rig / animation software
- **Adobe Character Animator [official + aggregator]:** available in the Creative Cloud Pro plan (20+ apps), with a free limited "Starter" mode. Adobe's product page advertises 50% off for the first 3 months for new subscribers. — [adobe.com/products/character-animator](https://www.adobe.com/products/character-animator). CC Pro is US$69.99/mo on an annual plan billed monthly (checked Aug 2, 2026, third party), with a promo of $34.99/mo for new subscribers. — [josephnilo.com – Character Animator price](https://josephnilo.com/blog/adobe-character-animator-price/). Character Animator has not been sold as a single app (2020 community thread, may be outdated). — [Adobe community](https://community.adobe.com/questions-571/order-character-animator-as-a-solo-program-255769)
- **Premiere Pro single app [aggregator]:** ~US$22.99/mo on an annual plan (conflicting: $20.99–34.49). — [josephnilo.com – Premiere Pro cost](https://josephnilo.com/blog/adobe-premiere-pro-cost/)
- **Reallusion Cartoon Animator 5 [official features; price unconfirmed]:** current version 5, with v5.3 "Puppet Stage and Live Camera System" and v5.2 "Motion Pilot". It "generates lip-sync animation from audio", offers instant rigging, SVG/PSD import, transparent video export, and an AE script that rebuilds projects as After Effects layers. 30-day free trial. No price on the page. — [reallusion.com/cartoon-animator](https://www.reallusion.com/cartoon-animator/). Price reports conflict: Pro and Pipeline merged into a single CTA5 at "a slightly lower price", with a user citing $129; Capterra lists $79–$299.95; the Japanese release (May 22, 2025) is ¥17,990. — [digitalproduction.com CTA5](https://digitalproduction.com/2022/11/23/cartoon-animator-5-cta5/); [Capterra pricing](https://www.capterra.com/p/140312/CrazyTalk-Animator/pricing/); [MoguraVR (JP)](https://www.moguravr.com/?p=268818); [Reallusion forum](https://forum.reallusion.com/Topic411267.aspx)
- **Moho [official]:** Moho Pro 14 costs **$399.99** one-time, Moho Debut 14 costs **$59.99**. Current installer is 14.5. Upgrade from Pro 13.x is $119.99 (limited promo, regular $199.99), from Pro 12 $349.99, from Debut 14 to Pro 14 $339.99. No subscription. — [moho.lostmarble.com/pages/buy](https://moho.lostmarble.com/pages/buy)
- **Toon Boom Harmony [official store]:** Essentials **$31/mo** or $259/yr. Advanced **$79/mo** or $606/yr. Premium **$143/mo** or $1,161/yr. Yearly billing is labeled "Save 30%". Student pricing exists. — [shop.toonboom.com Harmony](https://shop.toonboom.com/en/products/harmony). Harmony 27.1 has "Skeleton Controllers" in beta. — [toonboom.com/buy](https://www.toonboom.com/buy)
- **Rive [official]:** per seat per month: Free $0, Cadet $9 (max 3 seats), Voyager $32 (max 25), Enterprise $120 (companies with $10M+ revenue). Free exports carry a splash screen and are limited to 3 files and 1 project. Exports listed: RIV, REV, MP4, GIF, PNG sequence, WebM. Runtimes (JS, React, Flutter, Unity, Unreal, etc.) are MIT open source. State machines, listeners and data binding are listed under Interactivity. — [rive.app/pricing](https://rive.app/pricing)
- **Live2D Cubism PRO:** no current list price found. 20%-off sales ran 2026-07-17→27 and 2026-10-16→26. — [koubo.jp](https://koubo.jp/article/99033)
- **Spine (Esoteric Software) [aggregator]:** Essential $69, Professional $379 (discounted from $449), one-time per several sources. — [imitsu.jp](https://imitsu.jp/matome/movie/spine); [geekchamp](https://geekchamp.com/products/spine/)
- **South Park's own pipeline:** the show started with real construction-paper cutouts. — [Engadget 2012, Macworld South Park talk](https://www.engadget.com/2012/01/30/macworld-iworlds-south-park-talk/). It later moved to computers, with episodes made in about 6 days. The use of Autodesk Maya is the blog author's inference from the look. — [filmword blog 2012](https://filmword.blogspot.com/2012/10/making-south-park.html). Trade press reported a team of 16 technical directors/animators plus **5 dedicated lip-synchers**, with the script arriving the Thursday before air, leaving 5–6 days per episode (as quoted in search snippets; the page now redirects and was not read directly). — [BTL News](https://www.btlnews.com/?p=1794). Documentary: *Six Days to Air* (2011).
- **Kapitan Bomba (PL):** Bartosz Walaszek usually directs, writes, composes, voices and edits his productions himself (Git Produkcja / SPInka Film Studio). The style uses very simple linework and **reuses previously used character models**. Aired 2007–2013 on 4fun.tv. A new episode appeared on YouTube after 13 years. — [hdtvpolska – Elektroglina 2050](https://hdtvpolska.com/nowy-serial-canal-plus-hit-elektroglina-2050-walaszek-online/); [hdtvpolska – powrót Kapitana Bomby](https://hdtvpolska.com/wielki-powrot-kapitana-bomby-po-13-latach-juz-w-niedziele-nowy-odcinek-gdzie-ogladac/); [spidersweb](https://rozrywka.spidersweb.pl/kapitan-bomba-wraca-kiedy-nowe-odcinki-serial-walaszek); [instalki.pl](https://www.instalki.pl/news/rozrywka/kapitan-bomba-wielki-powrot-zapowiedz-bartosz-walaszek-youtube/)

### Cited Findings — AI image generation for consistent characters and backgrounds
- **Recraft [official + aggregator]:** on paid plans the user owns the images and may use them commercially. On the free plan Recraft owns the images, they are public, and they carry no commercial rights. Top-up credits never expire. — [recraft.ai/pricing](https://www.recraft.ai/pricing). Basic is ~$12/mo for 1,000 credits (~$10/mo annual). Raster costs 1 credit, **vector/SVG 2 credits**. Higher tiers are named inconsistently ($20/2,000 credits; $40/4,000; or $27/$48 depending on source). — [zsky.ai Recraft cost](https://zsky.ai/blog/how-much-does-recraft-cost); [toolsforhumans Recraft](https://www.toolsforhumans.ai/ai-tools/recraft-ai). API: V4.1 Vector ~$0.08, V4.1 Pro Vector ~$0.30 per image. — [Picsart API Recraft V4.1 Pro Vector](https://picsart.com/api-platform/models/recraftv4_1_pro_vector/pricing)
- **Google "Nano Banana" family [aggregator]:** Nano Banana 2 (Gemini 3.1 Flash Image) API costs ~$0.045 (0.5K), $0.067 (1K), $0.101 (2K), $0.151 (4K) per image, about half in batch. — [benchlm.ai](https://benchlm.ai/media-pricing/nano-banana). Nano Banana 2.1 reportedly launched 2026-10-06 at ~$0.0336 per 1K image, with the NB2 model ID deprecated. — [origami.sa](https://origami.sa/en/blog/nano-banana-2-1-price-per-image/). Consumer access comes through Google AI plans ("Highest access to Nano Banana" on Ultra). — [gemini.google/subscriptions](https://gemini.google/subscriptions/). Runway also offers "Nano Banana Pro". — [runway.com/pricing](https://runway.com/pricing)
- **Midjourney [aggregator; official docs blocked (403)]:** V8.1 was released 2026-04-30 and became default 2026-06-11. V8.2 became default 2026-07-24. On V8, adding an omni-reference image **routes the job to V7**. A V8.2 "Edit Model" (open to all 2026-08-27) replaces Omni/Character Reference on V8. — [blakecrosley.com Midjourney guide](https://www.blakecrosley.com/guides/midjourney); [seedance2.so](https://seedance2.so/blog/midjourney-v8-character-consistency). Other blogs claim V8.1 supports `--oref`, which conflicts. — [ud.hk](https://www.ud.hk/blogs/insight/article/2026-05-13-midjourney-v81-power-guide)

### Inferences
- **Best fit for a South Park-style cut-out:** build each character as a **layered SVG puppet** (body, head, eyes, brows, 9 mouth shapes for Rhubarb, 2–3 arm poses) and animate it in code or in Cartoon Animator / Character Animator. South Park's look relies on a small library of reusable parts and minimal in-betweening, and Kapitan Bomba reuses models too. Both are low-frame-rate, asset-reuse aesthetics where "cheap" is part of the style.
- **Recraft vector output** is the most useful AI asset source for a code pipeline: SVG layers can be imported as React components and tinted or animated via props. Raster models (Nano Banana, Midjourney) need background removal and splitting into layers by hand or with a script.
- **Consistency:** with a fixed puppet you draw the character once and reuse it forever, so consistency is perfect. Generative models drift. That is a strong argument for rigs over per-shot image generation.
- **Backgrounds (stage 4):** for the vertical format, 1080×1920 static plates (or slightly wider for camera pans) generated with Nano Banana or Recraft and reused across episodes (school, flat, street, bar). Estimated 0.25–0.5 h per episode for 0–2 new backgrounds, after a one-time library of 10–20.
- **One-time setup (inference):** 1–3 days to design 3–5 main characters plus a rig library in any variant. Per-episode new props or guest characters take 0.5–1.5 h.
- **Rig software ranking for this use case** (inference): Cartoon Animator 5 (cheap one-time, audio lip-sync, built-in motion library) ≈ Character Animator (fastest via live performance, but subscription) > Moho Pro (more control, Rhubarb-compatible, steeper learning) > Harmony (studio-grade, expensive) > Live2D/Spine/Rive (game/VTuber/interactive focus). Free options: OpenToonz, Synfig, Blender Grease Pencil. These were not re-verified this session (background knowledge: all free/open source).

### Gaps
- Official Cartoon Animator 5 USD price (store page did not render). Official Midjourney 2026 plan prices: docs returned 403 (background knowledge, not verified: Basic $10, Standard $30, Pro $60, Mega $120; must be confirmed). Ideogram character reference, Flux Kontext, GPT-image and Adobe Firefly 2026 prices were not researched in this session.
- Character Animator's audio-based auto lip-sync ("Compute Lip Sync from Scene Audio") is background knowledge, not re-verified this session.
- No authoritative confirmation of which software South Park uses today. The Maya claim is an inference by a blogger.

---

## 4. Animation via code (stage 5a): Remotion, Motion Canvas, Revideo, Rive/Lottie, LLM-agent workflows

### Takeaway
Remotion is the most mature code-to-video option and is **free for individuals and companies with up to 3 employees**. Above that, a Creators seat is $25/mo. In January 2026 Remotion published official **Agent Skills for Claude Code** (`npx skills add remotion-dev/skills`), which makes the script → JSON → React composition → MP4 loop a supported workflow. Many tutorials exist, but no documented *episodic cartoon series* made this way was found. Deterministic, frame-indexed rendering makes "last frame = first frame" trivial.

### Cited Findings
- **Remotion license [official, via search of remotion.dev pages]:** free for individuals, non-profits and for-profit businesses with up to 3 employees. Companies above that need a Company License. "Remotion for Creators" costs **$25 per seat per month**, no minimum seats, intended for low-volume videos for your own company. "Remotion for Automators" costs **$0.01 per render, minimum $100/month**. Enterprise has a minimum spend of $500/month per the terms (one pricing page shows $100, which conflicts). — [remotion.dev/docs/license/faq](https://www.remotion.dev/docs/license/faq.md); [remotion.dev/docs/terms](https://www.remotion.dev/docs/terms); [remotion.dev/docs/license/pricing](https://www.remotion.dev/docs/license/pricing); [wireflow summary](https://www.wireflow.ai/blog/remotion-pricing)
- **Remotion Agent Skills (Jan 2026):** 28+ modular rule files teach Claude Code Remotion's API. Install with `npx skills add remotion-dev/skills`. Claude plans scenes, computes frame timings and writes React compositions. Because output is code, small changes (e.g. slowing a transition) re-render in seconds. Examples: an official demo (2026-01-20) reached 6M+ views; a creator made 20-s promos in under 20 minutes; a user made a Polymarket video in 30 minutes with 4–5 prompts; 25,000+ installs in days. Limitations: vague prompts give weak designs, human oversight is needed, and cloud rendering costs add up at volume. — [StartupHub.ai](https://www.startuphub.ai/news/remotion-ai-video-makes-production-code-from-plain-prompts)
- Tutorials exist on Claude Code + Remotion "vibe-creating", including an animated YouTube Short made without camera or actors, but no episodic cartoon series case study was found. — [recapio – Claude Code x Remotion tutorial](https://recapio.com/digest/vibecreating-videos-just-became-a-reality-claude-code-x-remotion-tutorial-for-non-coders-by-robonugg); [apidog – Claude Code as video director](https://apidog.com/blog/claude-code-remotion); [rivoklabs tutorial](https://rivoklabs.com/tutorials/claude-code-remotion.html)
- **Motion Canvas / Revideo:** Motion Canvas is MIT open source, procedural TypeScript rendering to a single `<canvas>`. Remotion is source-available and requires a company license above 3 people. — [remotion.dev compare: Motion Canvas](https://www.remotion.dev/docs/compare/motion-canvas). Revideo is described as a fork of Motion Canvas that adds headless rendering, audio support and a library-first API. Rough weekly npm downloads: Remotion ~60K, Motion Canvas ~8K, Revideo ~3K (unverified). — [pkgpulse comparison 2026](https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026); [autoae Revideo vs Remotion](https://autoae.online/blog/revideo-vs-remotion-2026)
- **Rive** as an alternative puppet runtime (state machines, MIT runtimes incl. React; MP4/WebM export): see section 3. — [rive.app/pricing](https://rive.app/pricing)

### Inferences
- **Recommended code-first architecture:**
  1. `bible/` with character sheets and an SVG part library (mouths A–H/X, eyes, poses).
  2. Claude writes `episode.json`: shots[] with bg, characters (position, pose, expression), audio file, duration, camera move, captions.
  3. ElevenLabs produces the audio.
  4. Rhubarb produces a mouth-cue JSON per line.
  5. A generic `<Episode>` Remotion composition maps JSON to React (mouth shape = cue at `frame/fps`).
  6. `npx remotion render` outputs a 1080×1920 MP4.
  
  After the one-time template build, each new episode is mostly data, which is what makes it repeatable.
- **Perfect loop in code:** every pose and camera value is a pure function of `frame`. Force `state(lastFrame) == state(0)` by ending on the opening shot or pose (or by literally rendering the shot-0 composition at the last frame). Also make the audio loop: the closing line or SFX tail should lead naturally into the opening hook.
- **Remotion vs alternatives:** Remotion has the best LLM support (official skills) and React ecosystem. Motion Canvas or Revideo avoid licensing if the team grows above 3, but have smaller communities. Manim targets math explainers. Lottie/GSAP/PixiJS can be embedded inside Remotion. Blender Python (bpy) suits a 3D-cut-out look like South Park's Maya approach but is heavier. After Effects plus ExtendScript is an Adobe-locked equivalent. These alternatives were not individually re-verified this session.
- Estimated time per episode once the template exists (inference): animation via Claude Code 1–3 h (generate JSON, preview, 3–6 fix iterations), render 2–10 min locally. One-time template build: roughly 2–5 days.

### Gaps
- GitHub metadata (stars, latest releases) could not be fetched (GitHub access blocked in this session).
- No reliable published case study with hours per episode for an LLM-generated episodic cartoon in 2025–2026. Hacker News threads were not found in searches.
- Manim, Lottie/lottie-web, GSAP and PixiJS licenses and 2026 status were not re-verified.

---

## 5. AI video generation (stage 5b): Veo, Sora, Kling, Runway, Hailuo, Wan, Higgsfield, Hedra

### Takeaway
**OpenAI Sora is discontinued** (app closed 2026-04-26, API ended 2026-09-24), so it should be removed from the plan. Viable options in Nov 2026 are Google Veo 3.1 (via Flow and Google AI plans; first/last-frame interpolation), Kling (start/end frame; Kling 4.0 with up to 10 keyframes and 3–30 s clips), Runway (Gen-4.5, Aleph 2.0, plus hosted Kling 4.0 and Seedance), Hailuo, Higgsfield (aggregator), and open-source Wan 2.2 (Apache 2.0, first-last-frame, local GPU). All charge per second via credits, which gets expensive at 60–120 s per episode with rerolls. All moderate vulgar or violent prompts, and Kling reportedly blocks political satire. Start=end keyframes make loops *possible* but not guaranteed pixel-identical, and character consistency remains the weak point.

### Cited Findings
- **Sora shutdown:** OpenAI announced the discontinuation on 2026-03-24. Web and app closed 2026-04-26, API discontinued 2026-09-24. Reasons: shifting compute to coding and enterprise tools; Sora continues only as world-model research. — [The Decoder (2026-03-28)](https://the-decoder.com/openai-sets-two-stage-sora-shutdown-with-app-closing-april-2026-and-api-following-in-september/); [Engadget](https://engadget.com/ai/openai-is-shutting-down-its-sora-video-generation-app-211023358.html)
- **Google Veo 3.1 / Flow:** plans and credits as in section 1 [official]. — [gemini.google/subscriptions](https://gemini.google/subscriptions/). Per-generation credit costs [aggregator]: Veo 3.1 Lite 10 credits (5 on Ultra), Fast 20 (10 on Ultra), Quality 100, per 8-s clip. Monthly credits don't roll over. 50 free daily credits reported. This conflicts with the official page, which says Pro gets only a "limited trial of Veo 3.1 Lite". — [MindStudio Flow pricing](https://www.mindstudio.ai/blog/google-flow-pricing-credits-tiers-explained); [diyai Veo pricing](https://diyai.io/ai-tools/video-generation/google-veo-pricing/). Veo 3.1 supports **first + last frame → video interpolation** (`lastFrame` config in the API), optionally with audio. — [Replicate blog Veo 3.1](https://replicate.com/blog/veo-3-1); [Eachlabs Veo 3.1 first-last-frame](https://www.eachlabs.ai/google/veo3-1/veo3-1-first-last-frame-to-video)
- **Veo safety filters [official Google Cloud docs]:** prompts are checked against categories including **Violence** and **Vulgar** ("Detects vulgar topics or content from the text"). — [Vertex AI Veo responsible AI guidelines](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/responsible-ai-and-usage-guidelines)
- **Runway [official]:** Free gets 125 one-time credits. Standard $15/mo ($12 annual), 625 credits. Pro $35/mo ($28 annual), 2,250 credits. Max $95/mo ($76 annual), 9,500 credits. Model costs: Gen-4.5 60 credits/5 s (12/s), Gen-4 Turbo ~6/s, Aleph 2.0 140/5 s (28/s), Kling 4.0 1080p 118/5 s, Seedance 2.0 Pro 160/4 s. No "Unlimited" plan is listed now, and keyframes are not mentioned on the pricing page. — [runway.com/pricing](https://runway.com/pricing)
- **Kling:** the official guide says the Start/End Frames feature ("Add End Frame" in Image to Video) lets you upload two images as first and last frame, and recommends they be visually similar to avoid a cut. — [Kling quickstart: start-end frames](https://home.kling.ai/quickstart/ai-video-start-end-frames). **Kling 4.0** (blog 2026-09-30): native 3–30 s clips, up to 10 keyframes per generation, Omni Reference with up to 15 references (character identity, face, clothing, voice). Kling 4.0 Flash entered early access 2026-09-28, full launch October 2026. — [kling.ai blog – Kling 4.0 multiple keyframes](https://kling.ai/blog/kling-4-multiple-keyframes-guide?tab=all). Prices [aggregator, conflicting]: free 66 credits/day. Standard $6.99 first month then $8.80. Pro $25.99 or $37. Premier $64.99–$181.99. Ultra $180. Kling 3.0 ~6–12 credits/s. — [eesel Kling pricing](https://eesel.ai/blog/kling-ai-pricing); [fluxnote Kling pricing 2026](https://fluxnote.io/guides/kling-ai-pricing-2026). Kling's NSFW filter is described as strict, and political figures and satire are reportedly blocked (vendor blog with a commercial interest). — [PiAPI blog](https://piapi.ai/blogs/is-kling-too-restrictive-why-developers-prefer-piapi-s-unified-model-access-for-ai-video-gen)
- **Wan (Alibaba):** Wan 2.2 is Apache 2.0, with an open first-last-frame model runnable locally (Docker/Cog). — [Replicate wan-2.2-first-last-frame](https://replicate.com/lucataco/wan-2.2-first-last-frame). Wan 2.6 supports first-and-last-frame via paid API. — [Segmind Wan 2.6](https://www.segmind.com/models/all/wan-2.6). Whether Wan 2.6 has open weights is disputed (commercial variant API-only per Cliprise). — [Cliprise](https://www.cliprise.app/news/alibaba-wan-2-2-2-6). Hardware: 24 GB VRAM (RTX 4090, FP8) is a practical consumer minimum per one source.
- **Hailuo / MiniMax [aggregator, conflicting]:** Standard $7.99–9.99/mo, Pro $34.99/mo, Max $216 list. API Hailuo 03 costs ~$0.13/s at 2K. — [Scopeful](https://www.scopeful.org/tools/minimax-hailuo); [Wireflow Hailuo pricing (2026-10-30)](https://www.wireflow.ai/blog/hailuo-pricing)
- **Higgsfield [aggregator, conflicting]:** individual plans $9–59/mo (Luma guide, Sept 2026), or $19/$59/$129 (CostBench). Credits per clip vary hugely by model. — [Luma – Higgsfield pricing](https://lumalabs.ai/news/higgsfield-pricing); [CostBench](https://www.costbench.com/compare/hailuo-ai-vs-higgsfield/). It hosts Kling Turbo start/end frame. — [Higgsfield blog](https://higgsfield.ai/blog/A-Guide-to-Kling-Turbo-Start-End-Frame)
- **Hedra (talking characters) [aggregator, conflicting]:** Basic $15/mo for 1,500 credits, Creator $30 for 5,400, Professional $75 for 14,400 (Aug 2026 review). Character-3 reportedly 6 credits/s. — [dailyaifixs Hedra pricing 2026](https://dailyaifixs.com/blog/hedra-pricing-2026-credits-burn-by-the-second); [hedra.com/plans](https://www.hedra.com/plans)

### Inferences
- **Cost math (inference from the figures above):** Runway Pro gives 2,250 credits ÷ 12 credits/s (Gen-4.5) ≈ 187 s of output per month, about 2 episodes of 90 s *with zero rerolls*. Realistic 3–4x rerolls mean under one episode per month on Pro. Google AI Ultra $99.99 gives 10,000 credits ÷ 10 (Veo 3.1 Fast on Ultra) ≈ 1,000 8-s clips ≈ 8,000 s, which is the only "volume" option if the aggregator credit table is right. AI Pro ($19.99) gives ~50 Fast clips (400 s), but the official page suggests only a limited Lite trial on Pro.
- **Loops with generative video:** set the final shot's end frame to the episode's first frame (Kling "Add End Frame", Veo `lastFrame`, Wan 2.2 FLF). Models converge toward the end frame but may not reproduce it pixel-identically. The robust fix is in the editor: replace the last frame with a freeze of frame 0, or crossfade the last 2–4 frames into it. Pure generative video will *not* guarantee a perfect loop on its own.
- **Consistency:** a 60–120 s episode needs 8–20 shots, and per-shot generation drifts in character design. Using start frames rendered from fixed puppet art (image-to-video only, never text-to-video) gives the best consistency. Kling 4.0 Omni Reference helps but is new.
- **Best role for AI video:** occasional "money shots" (an explosion, a crowd scene) in an otherwise rig- or code-based episode, not the whole episode.
- Estimated time (inference): 4–8 h per 90-s episode (12–20 clips × 2–5 rerolls × 1–3 min waiting each, plus selection and fixing).

### Gaps
- Official Kling, Hailuo, Higgsfield and Hedra price pages could not be read (JS-rendered or not fetched). Figures are from conflicting aggregators.
- Luma Ray and Pika 2026 prices were not researched.
- Commercial-rights clauses per tool were not reviewed in detail (Recraft's are covered; Runway, Kling and Google were not).
- Official Kling and Runway content-policy pages were not reviewed (only third-party claims).
- Whether Veo or Kling start=end produces a pixel-identical last frame is unconfirmed (no source).

---

## 6. Lip sync (stage 6)

### Takeaway
For 2D cut-out, **Rhubarb Lip Sync** (free, CLI, Win/macOS/Linux) is the standard. It turns a voice WAV into timed mouth shapes (A–F plus G, H, X) as TSV/XML/JSON, or DAT for Moho/OpenToonz, so it is ideal for a Remotion pipeline. Its precise recognizer is English-only, and a "Phonetic" mode works for other languages. Rig apps (Cartoon Animator, Character Animator) have built-in audio lip-sync. AI lip-sync on video (sync.so ~$2.40–3.00 per minute; Hedra) is only needed for the generative-video variant.

### Cited Findings
- **Rhubarb Lip Sync:** a command-line tool that creates 2D mouth animation from voice recordings. Six basic mouth shapes A–F plus three optional extended shapes G, H, X (X = idle/rest, A = closed for P/B/M). Outputs TSV, XML, JSON, plus DAT for Moho and OpenToonz. Recognizers: PocketSphinx (default, **English only**) and Phonetic (language-independent, less precise). Integrations: After Effects, Moho, OpenToonz, Spine, Vegas Pro, Visionaire Studio. Platforms: Windows, macOS, Linux. — [github.com/DanielSWolf/rhubarb-lip-sync](https://github.com/DanielSWolf/rhubarb-lip-sync)
- **Cartoon Animator 5** generates lip-sync animation from audio. — [reallusion.com/cartoon-animator](https://www.reallusion.com/cartoon-animator/)
- **sync.so [official docs]:** lipsync-2 $0.04–0.05/s, lipsync-2-pro $0.067–0.083/s, sync-3 $0.107–0.133/s (25 fps). Free account gets 3 generations per month. — [sync.so billing docs](https://sync.so/docs/product/billing). fal.ai lists $3 per minute for lipsync v2. — [fal.ai sync-lipsync v2](https://fal.ai/models/fal-ai/sync-lipsync/v2)
- **Hedra:** see section 5.
- **South Park** used 5 dedicated lip-synchers in a 16+ person animation team (as reported). — [BTL News](https://www.btlnews.com/?p=1794)

### Inferences
- **Code pipeline:** for each ElevenLabs line, run `rhubarb -f json line.wav -d line.txt` (passing the dialogue text improves accuracy). Remotion picks the mouth SVG for the current time. This is fully automatic, costs zero, and takes about 1–2 min per episode of compute plus 5–10 min of spot-checks.
- English dialogue (global audience) suits Rhubarb's PocketSphinx mode. Polish-language versions would need Phonetic mode.
- Estimated time: code-first ~0.1–0.25 h; rig apps 0.25–0.5 h (auto plus manual fixes); AI video 0.5–1 h (upload, render, re-render).

### Gaps
- Rhubarb's license and latest version number could not be confirmed (GitHub API blocked; background knowledge says MIT, v1.13/1.14, which needs verification). Papagayo's status in 2026 was not checked.
- Adobe Character Animator lip-sync details were not re-verified this session.

---

## 7. Editing / compositing (stage 7) and loop finishing (stage 8)

### Takeaway
DaVinci Resolve 21 (free; Studio $295 one-time) is the best free editor. CapCut is convenient, but its 2025 terms grant a perpetual, sublicensable license over uploaded content, which is a risk for an original IP series. In the code-first variant, Remotion itself does the compositing (layers, captions, audio mix), so a separate editor is optional. Loop finishing is trivial in code. In the other variants it is done in the editor by matching the last frame to frame 0.

### Cited Findings
- **DaVinci Resolve 21:** the free edition is $0 (standalone, not a trial). Studio is **$295 one-time**. Resolve 21 became the stable release on 2026-06-03. A sale price of $236 was seen in Oct 2026. Major upgrades have been free so far, but the CEO has said future upgrades may be charged. — [PetaPixel](https://petapixel.com/2026/06/03/davinci-resolve-21-officially-released-with-new-photo-editing-ai-tools-and-much-more/); [davinciresolveclub price 2026](https://davinciresolveclub.com/davinci-resolve-price-and-studio-cost-2026/); [RedShark News](https://www.redsharknews.com/davinci-resolve-studio-free-updates-grant-petty-nab-2026)
- **CapCut [aggregator]:** Standard ~$9.99/mo. Pro ~$19.99/mo or $179.99/yr (the old Pro was renamed Standard and a new pricier Pro added). — [eesel CapCut pricing](https://eesel.ai/blog/capcut-pricing). The June 2025 ToS update granted CapCut an "unconditional, irrevocable, non-exclusive, royalty-free, fully transferable (including sub-licensable), perpetual, worldwide license" over user content. Terms were last updated 2026-04-15 per one guide. — [Digital Camera World](https://www.digitalcameraworld.com/tech/social-media/capcuts-new-terms-of-service-are-angering-the-internet-and-so-confusing-that-video-editors-are-asking-chatgpt-to-decipher-them); [fluxnote CapCut FAQ (June 2026)](https://fluxnote.io/guides/capcut-questions-answered)
- **Premiere Pro** ~$22.99/mo single app, or included in CC Pro $69.99/mo (section 3).

### Inferences
- **Loop finishing techniques:**
  - Code: guaranteed by construction (last frame state = frame 0 state), ~0 min.
  - Rig software: copy the first keyframe or pose to the end and end on the opening shot, 10–20 min.
  - AI video: use an end-frame keyframe, then in Resolve replace or crossfade the last frames with a still of frame 0, 15–30 min.
  - Audio: the end should lead into the opening line (crossfade 100–300 ms, or end on silence and start on silence).
  - Verification: a script can extract the first and last frame with ffmpeg and compare them (pixel diff / SSIM). Claude Code can automate this check.
- Descript was not researched, but it is mainly a podcast/talking-head tool and probably not needed here.
- Estimated time (inference): code-first 0–0.5 h (compositing is done in Remotion); rig variant 0.5–1 h in Resolve or Premiere; AI hybrid 1–2 h (many clips, color matching, transitions).

### Gaps
- No verified Descript pricing. Official Blackmagic page not fetched (secondary sources only).
- No source found confirming that ffmpeg SSIM checks are used by others for loop QA (this is a suggestion, not a cited practice).

---

## 8. Captions / subtitles (stage 9)

### Takeaway
Since ElevenLabs produces the audio and Claude writes the script, the exact dialogue text and timing are already known. In code-first, captions can be rendered directly in Remotion from the script plus word timings (Whisper/whisperX or ElevenLabs timestamps), at zero cost. Submagic ($19/mo Starter, 15 videos ≤2 min) and CapCut auto-captions are paid or convenience alternatives.

### Cited Findings
- **Submagic [aggregator]:** Starter ~$19/mo ($12/mo yearly), 15 videos/month up to 2 min, no watermark. Pro ~$39/mo ($23 yearly), 40 videos up to 5 min. Business + API ~$69/member/mo. The free trial is limited to ~3 videos with watermark. — [hooked.so Submagic pricing](https://www.hooked.so/compare/submagic-pricing); [Toolradar Submagic](https://toolradar.com/tools/submagic/pricing)
- **CapCut** auto-captions are included in the app (pricing and ToS caveats in section 7). — [eesel CapCut pricing](https://eesel.ai/blog/capcut-pricing)

### Inferences
- **Code-first:** Remotion renders burned-in, styled, word-by-word captions from JSON. Whisper or whisperX (open source, local) can align words, or the known script can be force-aligned. Cost $0, ~10–15 min per episode including proofreading.
- Burned-in captions suit Shorts, TikTok and Reels (much viewing is muted). Optional extra .srt uploads to YouTube help translations for a global audience.
- Estimated time: 0.1–0.25 h code-first; 0.25–0.5 h with Submagic or CapCut (style tweaks, typo fixes).

### Gaps
- Whisper/whisperX current versions and licenses were not re-verified this session (background knowledge: open source, MIT/BSD-style).
- ElevenLabs timestamp/alignment output was excluded by the brief.

---

## 9. Publishing / scheduling (stage 10)

### Takeaway
Native scheduling is free and sufficient: YouTube Studio (Shorts up to 3 min), TikTok Studio desktop (~10 days ahead), and Meta Business Suite for Reels. For one-click cross-posting, Buffer (free for 3 channels, 10 scheduled posts each; $5/channel/mo Essentials) or Metricool (free: 1 brand, 20 posts/month) are the cheapest. Upload a clean master to each platform separately. Never repost a TikTok-watermarked export to Reels or Shorts.

### Cited Findings
- **YouTube Shorts length:** up to 3 minutes for uploads from 2024-10-15 (9:16 or 1:1). Longer videos publish as regular videos. Scheduling in YouTube Studio is free (bulk upload up to 15 at once per one guide). — [Wondershare – how long can Shorts be](https://videoconverter.wondershare.com/more-tips/how-long-can-youtube-shorts-be.html); [schedpilot – schedule Shorts 2026](https://schedpilot.com/how-to-schedule-youtube-shorts/)
- **TikTok native scheduler:** TikTok Studio on desktop, up to ~10 days ahead (third-party summary; not verified on TikTok's help center). — [shortsync – schedule Shorts 2026](https://shortsync.app/resources/how-to-schedule-youtube-shorts-2026)
- **Buffer [official]:** Free covers up to 3 channels, 10 scheduled posts per channel, 1 user. Essentials $5/channel/mo. Team $10/channel/mo. YouTube Shorts auto-publish is supported. TikTok auto-publish works for business profiles. Instagram auto-publish works for business/creator accounts (personal profiles get reminders only). — [buffer.com/pricing](https://buffer.com/pricing)
- **Metricool [official]:** Free covers 1 brand, up to 20 scheduled posts/month, including TikTok, YouTube and Instagram (1 account each). Starter from €16/$20/mo (annual) or €20/$25 (monthly) for up to 5 brands. Advanced from €43/$53 (annual). Prices exclude VAT. — [metricool.com/pricing](https://metricool.com/pricing/)
- **Repurpose.io [aggregator, conflicting]:** entry ~$25–35/mo, higher tiers $49–179/mo, 14-day trial. — [socialrails](https://socialrails.com/blog/repurpose-io-pricing); [shortsync](https://shortsync.app/resources/repurpose-io-pricing-vs-alternatives)
- **Watermarks:** in 2021 Meta said Reels with TikTok watermarks are made "less discoverable in places like the Reels tab". — [Social Media Today 2021](https://www.socialmediatoday.com/news/instagram-will-now-limit-the-reach-of-re-posts-from-tiktok-within-its-reels/594803). Mosseri clarified that your own logo on a Reel is fine. — [Social Media Today](https://www.socialmediatoday.com/news/instagram-clarifies-including-your-own-logo-on-a-reel-is-ok/730852). An April 30, 2026 Instagram "originality" update favoring original content over reposts is claimed by a third party (unverified). — [mwm.ai](https://mwm.ai/articles/instagram-algorithm-update-in-april-2026-prioritizes-original-content)

### Inferences
- Upload the same clean MP4 master (without platform watermark) natively to each platform. Your own small series logo is OK.
- For 1 episode per day across 3 platforms (~90 posts/month), Buffer Free (10 queued per channel) or Metricool Free (20/month) will run out. Buffer Essentials for 3 channels = $15/mo, or use native schedulers for free.
- Estimated time: 0.25–0.5 h per episode (titles, hashtags, thumbnails, scheduling on 3 platforms). Batching 7 episodes per week reduces this.
- Meta Business Suite (free Reels scheduling) was not re-verified this session.

### Gaps
- Later's 2026 pricing was not found. Official TikTok and YouTube help pages were not fetched (scheduling window and 15-min lead time come from third parties).
- Unverified claim: YouTube "watermark detection AI" excluding repost channels from YPP.

---

## 10. Realistic time per episode and creator benchmarks

### Takeaway
Hardly any reliable published hours-per-episode figures exist for solo short-form cartoon creators. One vendor guide estimates **4–8 h per Short** for simple 2D character animation and 8–12 h for motion graphics. Remotion+Claude users report 20–30 min for simple 20-s promos. South Park makes 22-min episodes in 5–6 days with ~20+ animation staff. Kapitan Bomba was essentially a one-man show with reused models. My per-stage estimates for the variants are inferences and are labeled as such.

### Cited Findings
- 4–8 h per Short for simple 2D character animation (simple movements, expressions, gestures); 8–12 h for motion graphics. Batching cuts time: 5 whiteboard Shorts take ~12–13 h instead of 15. 3–5 animated Shorts per week is suggested as optimal for animation channels. Vendor guide, low reliability. — [fluxnote – YouTube Shorts animation strategy](https://fluxnote.io/guides/youtube-shorts-animation-strategy); [fluxnote – Shorts animation format 2026](https://fluxnote.io/guides/youtube-shorts-animation-format-2026)
- Claude Code + Remotion: 20-s promos in under 20 min; a Polymarket video in 30 min with 4–5 prompts. — [StartupHub.ai](https://www.startuphub.ai/news/remotion-ai-video-makes-production-code-from-plain-prompts)
- South Park: 5–6 days per episode, 16 TDs/animators plus 5 lip-synchers. — [BTL News](https://www.btlnews.com/?p=1794)
- Upwork demand for "8 episodes/month" short-form character series animators shows the market expects a high cadence. — [Upwork posting](https://www.upwork.com/freelance-jobs/apply/Long-Term-Animator-for-Short-Form-Character-Series-Episodes-Month_~022099185116827462477/)

### Inferences — estimated hours per 60–120 s episode (after one-time setup; my estimates)

| Stage | A: Code-first (Claude Code + Remotion + Rhubarb) | B: Cut-out rig software (Cartoon Animator 5 / Character Animator) | C: AI-video hybrid (Veo/Kling + start=end frames) |
|---|---|---|---|
| 1 Script | 0.5–1 h | 0.5–1 h | 0.5–1 h |
| 2 Storyboard/animatic | 0.25–0.5 h (scene JSON) | 0.5–1 h | 1–2 h (keyframes) |
| 3 Characters/rigs (per ep.) | 0–0.5 h (reuse library) | 0–0.5 h | 0.5–1 h (ref images) |
| 4 Backgrounds | 0.25–0.5 h | 0.25–0.5 h | 0.25–0.5 h |
| 5 Animation | 1–3 h | 2–4 h | 3–6 h (generations + rerolls) |
| 6 Lip sync | 0.1–0.25 h (auto) | 0.25–0.5 h | 0.5–1 h |
| 7 Edit/composite | 0–0.5 h (in Remotion) | 0.5–1 h | 1–2 h |
| 8 Loop finishing | ~0 h (by design) | 0.15–0.3 h | 0.25–0.5 h |
| 9 Captions | 0.1–0.25 h | 0.25–0.5 h | 0.25–0.5 h |
| 10 Publishing | 0.25–0.5 h | 0.25–0.5 h | 0.25–0.5 h |
| **Total / episode** | **~2.5–7 h** | **~4.5–10 h** | **~7.5–15 h** |
| One-time setup | 3–7 days (template + puppet library) | 2–5 days (rigs, learning software) | 1–2 days (style refs), but ongoing drift fixes |

- Code-first gets faster with every episode, because each new gesture, prop or shot type becomes a reusable component. Rig software is fast but needs manual performance per episode. AI video stays slow because every shot is regenerated.

### Gaps
- No verified public diary from a solo creator posting daily cut-out episodes with exact hours.
- No data on Character Animator live-performance throughput per minute of finished animation.

---

## 11. Complete pipeline variants with monthly cost (USD → PLN at 3.9321)

### Takeaway
**Variant A (code-first)** is the cheapest and most repeatable (~$32–132/mo, 126–519 PLN) and the only one where the perfect loop is guaranteed by construction. **Variant B (rig software)** is the most artist-friendly (~$55–90/mo with Adobe, 216–354 PLN; or ~$20/mo plus a one-time Moho or CTA purchase). **Variant C (AI-video hybrid)** is the most expensive and least consistent (~$120–190/mo, 472–747 PLN). It works best as an add-on for special shots, not as the main engine.

### Cited Findings (price inputs; see sections above for URLs)
- Claude Pro $20, Max $100, Ultra $200. — [claude.com/pricing](https://claude.com/pricing)
- Remotion free for ≤3 people; $25/seat above. — [remotion.dev license FAQ](https://www.remotion.dev/docs/license/faq.md)
- Rhubarb free. — [GitHub](https://github.com/DanielSWolf/rhubarb-lip-sync)
- Recraft Basic ~$12/mo. — [zsky.ai](https://zsky.ai/blog/how-much-does-recraft-cost)
- Google AI Pro $19.99 / Ultra $99.99. — [gemini.google/subscriptions](https://gemini.google/subscriptions/)
- Adobe CC Pro $69.99 (promo $34.99 for the first 3 months). — [josephnilo.com](https://josephnilo.com/blog/adobe-character-animator-price/); [adobe.com](https://www.adobe.com/products/character-animator)
- Moho Pro 14 $399.99 one-time. — [lostmarble](https://moho.lostmarble.com/pages/buy)
- DaVinci Resolve free / Studio $295. — [davinciresolveclub](https://davinciresolveclub.com/davinci-resolve-price-and-studio-cost-2026/)
- Runway Standard $15, Pro $35. — [runway.com/pricing](https://runway.com/pricing)
- sync.so ~$0.04–0.05/s. — [sync.so docs](https://sync.so/docs/product/billing)
- Buffer free / $5 per channel; Metricool free. — [buffer.com/pricing](https://buffer.com/pricing); [metricool.com/pricing](https://metricool.com/pricing/)
- NBP USD 3.9321 (2026-11-06). — [NBP API](https://api.nbp.pl/api/exchangerates/rates/a/usd/2026-10-26/2026-11-08/?format=json)

### Inferences — variant definitions (my synthesis)

**Variant A — "Code-first" (recommended main pipeline)**
- Script and code: Claude Pro $20 (upgrade to Max $100 when Claude Code limits bite during heavy template work).
- Assets: Recraft Basic $12 (SVG puppets/backgrounds). Optionally Nano Banana via Google AI Pro $19.99 or the API (~$0.03–0.07/image).
- Animation and compositing: Remotion (free ≤3 people) plus Remotion Agent Skills.
- Lip sync: Rhubarb (free). Captions: Whisper/whisperX or script timings, rendered in Remotion (free).
- Edit: none, or DaVinci Resolve free. Loop check: ffmpeg frame-diff script (free).
- Publishing: native schedulers / Buffer Free / Metricool Free.
- **Monthly: $32 (125.83 PLN) minimum; ~$131.99 (519.00 PLN) comfortable** (Claude Max $100 + Recraft $12 + Google AI Pro $19.99). Plus ElevenLabs (researched separately).
- **Hours/episode: ~2.5–7 h** after a 3–7 day setup.
- Pros: deterministic, perfect loop guaranteed, consistent characters, cheapest marginal cost, versionable (git), batchable.
- Cons: upfront engineering, stiff "motion-graphics" feel unless the puppet library is rich, needs comfort with code review.

**Variant B — "Cut-out rig software"**
- B1 Adobe: Claude Pro $20 + Creative Cloud Pro $69.99 (Character Animator, Photoshop/Illustrator for puppets, Premiere/After Effects for editing and captions). **$89.99/mo = 353.85 PLN** (first 3 months with promo: $54.99 = 216.23 PLN).
- B2 one-time purchase: Claude Pro $20/mo + Cartoon Animator 5 (one-time, ~$129–199, unconfirmed) or Moho Pro 14 $399.99 (1,572.80 PLN one-time) + DaVinci Resolve free + Recraft $12 (optional). **~$20–32/mo (78.64–125.83 PLN) plus one-time license.**
- **Hours/episode: ~4.5–10 h.**
- Pros: expressive performance (Character Animator: act it out with webcam and mic), built-in audio lip-sync, artist-friendly GUI, proven for cut-out shows.
- Cons: manual per-episode work, subscription lock-in (Adobe), harder to automate with Claude Code (CTA has an AE script; Moho supports Lua scripting; Character Animator is mostly manual), loop needs manual matching.

**Variant C — "AI-video hybrid"**
- Claude Pro $20 + Google AI Ultra $99.99 (Veo 3.1, Nano Banana, Flow; first/last frame) **= $119.99/mo (471.81 PLN)**. Add Runway Standard $15 or Kling Pro (~$26–37) for start/end-frame or multi-keyframe shots, plus sync.so lip sync (~$3/min) → **~$150–190/mo (590–747 PLN)**.
- Alternative low-cost route: Wan 2.2 FLF locally (free, Apache 2.0) if you own a ≥24 GB VRAM GPU.
- **Hours/episode: ~7.5–15 h.**
- Pros: richest visuals and camera moves, minimal drawing skill needed.
- Cons: per-second credit cost, rerolls, character drift, moderation blocks on vulgar or violent prompts (Veo "Vulgar" filter; Kling strict and reportedly blocks political satire), loop not pixel-guaranteed, Sora gone (vendor risk).

**Hybrid recommendation (inference):** A as the backbone. Puppets drawn once (Recraft/Nano Banana, then cleaned up as SVG), so they stay on-model. Use C sparingly (1–2 AI shots per episode, start frame = puppet render) for spectacle. Use B only if the creator prefers performing to coding.

### Gaps
- Totals exclude ElevenLabs (separately researched), hardware, VAT, and possible Remotion fees if the team grows above 3 people.
- Hour estimates are not backed by a measured case study. They should be validated on a pilot of 3 episodes.
