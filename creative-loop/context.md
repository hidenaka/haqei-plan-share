# creative-loop（生成物の品質収束ハーネス） — context

## 1 行定義
ビジュアル/サムネ/台本などの生成物を「作る→fork独立採点→直す」で threshold 90 まで詰めるループの、状態管理・採点検証・停止則・最良版追跡を機械化したCLIハーネス。

## TL;DR
1. `scripts/creative-loop.mjs` = init(元依頼を錨に)→prompt(採点プロンプトを決定論生成)→record(採点JSONを検証して記録)→best(最良版)。
2. 採点表6種（essay-script/scene-visual/thumbnail/title/long-hook/short-script）は固定breakdownキー・実事故に接地したcriteria。不正採点（キー増減・weight超過・passed水増し）は自動0点＝報酬ハッキング対策。
3. dogfood済み: ep32実サムネをforkが実際に見て78点＋具体的直し方（2行目8字超過・書体が明朝寄り・金雲と題字の焦点競合）を返した。独立採点96/100合格・指摘バグ2件（plateau到達不能・無効採点が予算消費）は修正済み。

## 主要5問
1. なぜ必要か: essay-preflightは形式（幕構成/文字数/音量）しか測れない。CTR0.9%・冒頭離脱40-45%の律速は「質そのもの」で、作った頭の自己採点では詰まらない。
2. どう回るか: init→prompt→fork Agent(制作会話を見せない)→record→continue(直し方)/passed/max/plateau/judge_error。
3. 何を機械が守るか: breakdownキー固定・passed再計算・無効採点0点＋周回予算に数えない（2連続でjudge_error）・plateau検出・最良版採用。
4. 採点表は何に接地しているか: 写実化ドリフト・顔/キャラ意匠禁止・画像内文字禁止（scene-visual）、6幕v2.2・処方箋が価値の本体・冒頭断定・AI臭（essay-script）等、全て実事故・実測から。
5. どこに配線したか: essay-episodeスキル「LLM品質ゲート」（Step2台本/Step5画像/Step8.5タイトル/Step9サムネ）・growth-harness-runbook「内側ループ」・CLAUDE.md。

## 結論
1. 生成物の品質ループに必要な4部品（採点表・独立採点者・停止則・最良版）が全部機械側に移った。
2. dogfoodの78点は「ループが甘くない」証拠＝既存Tier Aサムネでも直す余地が具体的に出る。
3. 次: 進行中エピソードの台本/サムネ/画像で実運用開始。

## 図解候補
- figure-01: creative-loopの円環フロー / メタファー: 研ぎ職人と別室の審査員 / レイアウト: 円環+ゲート
- figure-02: 報酬ハッキングを塞ぐ番人 / メタファー: 関所 / レイアウト: 中央に関所、弾かれる不正採点
- figure-03: dogfood実例（78点と直し方3点） / メタファー: 検査票 / レイアウト: サムネと採点票の対面
