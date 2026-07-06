# ep37 ハーネス検証メモ

- Date: 2026-07-06
- Scope: 企画ブリーフ / 台本 / fact_check まで
- Status: 本人台本ゲート待ち

## 要件チェック

| 要件 | 証跡 | 判定 |
|---|---|---|
| 他エピソードと同程度の粒度 | `content/057/full_script.json` は32シーン/3180字。比較: ep35=27シーン/3085字、ep36=32シーン/3768字 | PASS |
| 幕1で作品名を出さない | `act1_hook` に `BLEACH` / `ブリーチ` / `黒崎` / `一護` なし。作品初出は `V_02_01` | PASS |
| タイトルをStep 8.5まで決めない | `title_working` は `未定（Step 8.5で台本確定後に決定）` | PASS |
| 6幕v2.2 | `act1_hook` / `act2_story` / `act2_compare` / `act3_reveal` / `act4_blade` / `act4_practice` / `act5_end` が存在 | PASS |
| 処方箋の厚み | `act4_practice` は785字。震の初九〜上六を具体行動へ翻訳 | PASS |
| 作品事実と易経DB根拠 | `fact_check.md` 14件PASS。第51卦 `震` は `db/hexagrams.json` の `kw_number: 51` を参照 | PASS |
| 台本機械ゲート | `python3 scripts/essay-preflight.py script 057` PASS | PASS |
| creative-loop | `essay-script-057-stylefix-20260706` iter1=86 → iter2=92。threshold 90を通過 | PASS |
| サブエージェント企画レビュー | Content Director subagent再レビュー: `verdict: PASS` / blocking issueなし | PASS |
| 音声・画像・投稿に進んでいない | `content/057` は企画/台本/検証メモのみ。Remotion素材・音声・画像・release成果物は未作成 | PASS |

## サブエージェント指摘と反映

- 初回企画レビューはFAIL。比較作品未記載、粒度目安が軽い、という指摘。
- 対応: `planning_brief.md` に比較作品（碇シンジ/竈門炭治郎）を追加し、目安を27〜32シーン級/約3000字前後へ修正。
- 再レビュー: PASS。
- 初回台本QAはFAIL。旧creative-loopがmax_reached、易経DB根拠不足、幕2が要約寄り、処方箋が薄い、という指摘。
- 対応: 新creative-loop `essay-script-057-stylefix-20260706` を作成。fact_checkに震51 DB根拠を追加。幕2の手触りと幕5の具体行動を増補。
- 第2周採点: score 92 / passed true。

## 停止位置

ここで止める。本人が台本OKを出すまで、音声生成・画像生成・タイトル/サムネ作成・投稿準備には進まない。
