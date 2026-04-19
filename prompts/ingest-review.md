---
id: ingest-review
purpose: review today's newly ingested broadcasts for net-new signal merge pressure and structural impact
use_when:
  - one or more new broadcast cards were added or updated today
inputs:
  - today's new or updated broadcast cards
  - existing themes playbooks series and maps
outputs:
  - daily ingest synthesis review
  - broadcast verdicts
  - theme playbook and series update suggestions
related_prompts:
  - theme-update
  - playbook-extraction
  - repo-maintenance-review
tags:
  - review
  - ingest
  - synthesis
---

# Ingest Review

## Use When

當今天已經收錄了多篇課文，想回顧它們的增量、重複與結構影響。

## Prompt

```md
請 review 今天新 ingest 的這批 broadcast cards。

重點不要重做摘要，而是幫我判斷：
- 哪些是淨新增訊號
- 哪些只是補強既有主題
- 哪些值得 merge 到 theme / playbook / series
- 哪些其實可以合併或不必保留太厚

引用任何單篇或高層頁面時，不要只寫 id 或頁名。
- 若是 broadcast，至少寫成：`id｜原標題`
- 並補 1 句說明它原本在講什麼
- 若是 theme / playbook / series / map，補 1 句說明它原本承接什麼問題

最後請給我：
1. 今日這批課文的總體增量
2. 最值得更新的 theme / playbook / series
3. 接下來 1 到 3 個最有價值的維護動作

若列出多個引用項目，請在文末補 `Referenced Items` 區塊。
```
