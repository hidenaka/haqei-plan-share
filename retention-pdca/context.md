# 離脱ドリルダウン分析 + 台本/ビジュアルPDCAループ — 設計案

## 目的

「個別動画のどこで・なぜ視聴者が離脱したか」を1本ずつ精査し、その教訓を**次の台本・ビジュアル制作に自動で効かせる**閉ループを作る。

## 現状（既にあるもの・再利用する）

| 資産 | 何をするか | 今回の扱い |
|------|-----------|-----------|
| `scripts/yt-retention.mjs` | Analytics APIで動画別の維持率カーブ取得 → `analytics/retention-<videoId>.json` | **そのまま再利用**（認証・カーブ取得は二重実装しない） |
| `scripts/scene-retention.mjs` | カーブ×タイミング同期台本の**横断集計**（scene_type別 loss/min → 幕配分v2.3の根拠） | そのまま（横断集計担当として併存） |
| `creative-loop.mjs` の rejections 注入 | `analytics/rejections.json` → 採点プロンプトへ data_notes と同格で注入 | **同じ経路に教訓台帳を追加注入** |
| growth-tick の鮮度フラグ | scene-retention が7日超で警告 | 未分析ep検出フラグを追加 |

## 欠けているもの（＝今回作る4コンポーネント）

### 1. `scripts/retention-drilldown.mjs <ep>` — ep単位ドリルダウン

- registry で ep→dir→videoId を解決。カーブが無い/7日超なら `yt-retention.mjs <id>` を内部実行して更新
- カーブ × `essay-{dir}.json`（シーン秒範囲・台本文） × `visual_plan.json`（カットID・絵の内容）を突き合わせ
- 出力2つ:
  - **機械用**: `analytics/retention-drilldown/ep{N}.json` — シーンごとの w_start/w_end/**loss_per_min**（動画内正規化）、台本文、カットID・ビジュアル記述、動画内ワースト順位
  - **人間用**: HTMLレポート — 維持率カーブにシーン帯を重ねた図＋ワーストシーンの「台本文とその時の絵」を並置。show-pin + share-to-phone で共有
- **ノイズ規律**（現状views 12-127帯なので必須）: views<30 は「参考値」バッジ・動画内の相対損失のみ・動画間の絶対比較はしない

### 2. `analytics/retention-lessons.json` — 教訓台帳（+ `scripts/retention-lessons.mjs`）

rejections.json の実測版。1エントリ = 1教訓:

```json
{ "id": "RL-1",
  "lesson": "作品のあらすじ説明が45秒続くと離脱が加速する（説明は分割して疑問を挟む）",
  "evidence": [{"ep": 16, "scene": "S08", "loss_per_min": 21.3, "views": 127}],
  "applies_to": ["essay-script", "long-hook"],
  "status": "candidate",  // candidate(1本の実測) → active(2本以上で再現) → retired(反証)
  "created": "2026-07-30" }
```

- **昇格規律**: 1本の実測のみ=candidate（注入はされるが「単発実測」と明記）。2本以上で再現=active。以降のepで反証されたら=retired（注入から外れる）。少数viewsで単発の偶然を恒久ルール化しない
- サブコマンド: `add` / `list` / `verify <ep>`（新しいdrilldown結果と既存教訓を照合して candidate→active/retired を機械判定）

### 3. 注入経路（既存メカニズムに乗せる）

- `creative-loop.mjs`: rejections と同格で **retention-lessons（status≠retired・applies_to一致）を採点プロンプトへ注入** — 却下（本人の美意識）と離脱（視聴者の実測）の両輪が採点に効く
- `essay-episode` SKILL.md: Step 0（PDCAチェック）と Step 2（台本）・Step 4（ビジュアル計画）に「`retention-lessons.mjs list --for <工程>` を読む」を追記

### 4. スキル `.claude/skills/retention-pdca/SKILL.md` — ループの司令塔

「離脱分析」「ep N のretention」等で発動。ワークフロー:

1. **対象決定**: ep指定 or 「公開+7日以上・未分析」のepを自動走査
2. **分析**: drilldown実行 → HTMLレポートを show-pin + share-to-phone で共有
3. **教訓化**: ワーストシーンから教訓ドラフトを作成 → **本人確認（教訓は編集判断なので人間ゲート）** → 台帳へ記録
4. **検証**: 既存candidate教訓を新実測と照合 → 昇格/棄却（`verify`）
5. growth-tick に「公開+7d・drilldown未実施」フラグを追加 → 日次司令に載る

## PDCAループの全体像

```
公開+7日 → [P] drilldown分析(ep単位) → [D] 教訓化→台帳(candidate)
    ↑                                        ↓
[A] verify: 次epの実測で昇格/棄却 ← [C] 次の台本/ビジュアル制作時に
                                       creative-loop採点+執筆プロンプトへ自動注入
```

## 検討した代替案

- **A. 最小案**（scene-retention に --ep を足すだけ・教訓は手動反映）: 還流が人力頼みで漏れる。ユーザー回答（自動注入）と不一致 → 不採用
- **B. 本設計**（推奨）: 分析→台帳→注入→検証が機械経路で閉じ、教訓の質だけ人間ゲート
- **C. 全自動案**（教訓記録まで無人・cron駆動）: 少数viewsのノイズを無審査で恒久ルール化するリスク。却下学習（rejections）が人間ゲート付きなのと非対称になる → 不採用

## テスト方針

- drilldown: 実データ（ep16=127views等）でシーン境界とカーブ補間の整合を検証。views<30の参考値バッジ表示
- lessons: add→verify の昇格/棄却ロジックをユニットテスト
- 注入: creative-loop のプロンプト組立に lessons が入ることを既存テスト（test-creative-harness-*.mjs 方式）で確認

## 作らないもの（YAGNI）

- リアルタイム監視・ダッシュボード常駐（分析は公開+7dの一回で十分）
- ショート用の別実装（まず本編ロングで確立。ショートは shorts-qa/H51 系が既にある）
- 過去全epの一括自動分析（初回はワースト/ベスト数本を手で選んで教訓の種を作る）
