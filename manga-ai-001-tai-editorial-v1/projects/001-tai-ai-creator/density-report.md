# SNS Manga Density

Status: FAIL
Score: 0/100

## Totals
- Pages: 8
- Total panels: 9 / minimum 24+
- Recommended panels: 28-32
- Need +15 panels to minimum
- Need +19 panels to recommended band
- Average panels/page: 1.13 / minimum 3+
- Single-panel pages: 7 / max 2

## Gate Findings
- ERROR: total panels 9 < 24
- ERROR: average panels/page 1.13 < 3
- ERROR: single-panel pages 7 > 2: P1, P2, P4, P5, P6, P7, P8
- WARN: recommended panel band 28-32: needs +19 panels
- WARN: pages missing visible_action: P1, P2, P3, P4, P5, P6, P7, P8

## Page Density
- P1: panels=1, info=5, text=9, communicates=1, hook=yes, action=no - missing visible_action; text chars 9 < 18
- P2: panels=1, info=5, text=19, communicates=1, hook=yes, action=no - needs at least 2 panels unless layout is splash; missing visible_action
- P3: panels=2, info=7, text=13, communicates=2, hook=yes, action=no - missing visible_action; text chars 13 < 18
- P4: panels=1, info=5, text=16, communicates=1, hook=yes, action=no - needs at least 2 panels unless layout is splash; missing visible_action; text chars 16 < 18
- P5: panels=1, info=4, text=0, communicates=1, hook=yes, action=no - missing visible_action; text chars 0 < 18
- P6: panels=1, info=5, text=23, communicates=1, hook=yes, action=no - missing visible_action
- P7: panels=1, info=5, text=18, communicates=1, hook=yes, action=no - needs at least 2 panels unless layout is splash; missing visible_action
- P8: panels=1, info=5, text=12, communicates=1, hook=yes, action=no - missing visible_action; text chars 12 < 18

## Page Panel Targets
- P1: 2-3 panels. Incident, who is stuck, and first hook.
- P2-P5: 3-5 panels each. Evidence, reaction, escalation, and page-turn question.
- P6: 2-4 panels. One larger reveal is fine, but it still needs setup/reaction.
- P7: 3-4 panels. Choice, cost, and irreversible action.
- P8: 2-3 panels. Resolution and changed behavior, not explanation only.

## Harness Rule
- SNSで流れてきた漫画は、雰囲気1枚絵では止まらない。8ページ短編は最低24コマ、推奨28-32コマ。各ページに「行為・物証・反応・台詞/地の文・ページ末の問い」を入れる。
- `visible_action` はそのページで絵に描く行為、`communicates` は各コマが読者へ渡す情報、`page_end_hook` は次ページへめくらせる問い。

