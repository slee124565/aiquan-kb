---
id: repo-maintenance-review
purpose: review repo structure for cleanup merge opportunities and navigation improvements without ingesting new sources
use_when:
  - there is no new source to ingest
  - the user wants to improve repo structure and navigability
inputs:
  - index
  - maps
  - themes
  - playbooks
  - series
  - recent broadcast cards
outputs:
  - structure issues
  - cleanup suggestions
  - top next actions
related_prompts:
  - theme-update
  - playbook-extraction
  - ingest-review
tags:
  - review
  - maintenance
  - structure
---

# Repo Maintenance Review

## Use When

當沒有新課文要收，但想讓 repo 更好查、更好維護。

## Prompt

```md
請 review 這個 repo 的結構健康度。

重點檢查：
- 哪些 broadcast cards 太厚或太孤立
- 哪些 themes 太薄或重複
- 哪些方法該抽成 playbook 但還沒抽
- 哪些 series 應建立、合併或重寫
- 哪些 maps 已經不是穩定入口

最後請給我：
1. 結構問題排序
2. 最值得做的 1 到 3 個 cleanup / merge 動作
3. 若只做一件事，應先做哪一件

引用問題頁面或代表性 broadcasts 時，不要只寫 id 或頁名。
- 若是 broadcast，至少寫成：`id｜原標題`
- 並補 1 句說明它原本在講什麼
- 若是 theme / playbook / series / map，補 1 句說明它原本承接什麼問題
```
