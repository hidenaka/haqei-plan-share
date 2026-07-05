# SNS Manga Density

Status: FAIL
Score: 14/100

## Totals
- Pages: 8
- Total panels: 9 / target 18+
- Average panels/page: 1.13 / target 2.25+
- Single-panel pages: 7 / max 2

## Gate Findings
- ERROR: total panels 9 < 18
- ERROR: average panels/page 1.13 < 2.25
- ERROR: single-panel pages 7 > 2: P1, P2, P4, P5, P6, P7, P8
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

## Harness Rule
- SNSで流れてきた漫画は、雰囲気1枚絵では止まらない。8ページ短編は原則18-28コマ、各ページに「行為・物証・反応・台詞/地の文・ページ末の問い」を入れる。
- `visible_action` はそのページで絵に描く行為、`communicates` は各コマが読者へ渡す情報、`page_end_hook` は次ページへめくらせる問い。

