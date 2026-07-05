# Production Log

## 2026-07-03

Created the first HaQei AI Manga Lab project from YouTube episode 1.

Source structure:

- 泰 is not a static full state.
- It is a crossing flow.
- Collapse starts when the protagonist tries to preserve the full state as a still image.

Making-of angle:

`易経の「泰」から、AI漫画を1本作ってみた`

Shorts angle:

`完成した瞬間に作れなくなる人の共通点`

note angle:

`泰という卦から8ページAI漫画を作るまで`

Service CTA draft:

あなたの物語・キャラ・プロットも、易経64卦で漫画化できる形に整理します。主人公の葛藤、変化、詰まり、ラストの方向性まで設計します。

Generated assets:

- P01-P08 generated with `run-ai-images` through `scripts/manga-generate-images.mjs`.
- Static preview regenerated at `preview/index.html`.
- Review portal generated at `viewer/index.html`.
- Making-of explanation manga generated at `making-of/index.html`.
- The current version is a proof asset: 8 one-panel pages with external HTML balloons/captions, not final lettering baked into the images.

Making-of proof points:

- The story uses 泰 as a state that collapses when the protagonist tries to preserve completion instead of continuing the flow.
- The visual loop separates text from generated images, which keeps typo correction and layout adjustment editable after image generation.
- The first sellable service angle is not "AI can draw manga"; it is "your stalled idea can be converted into an 8-page readable structure."
- The viewer loop now presents the finished manga first, then turns the production method itself into a second readable manga.
