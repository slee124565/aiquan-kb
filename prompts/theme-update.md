---
id: theme-update
purpose: update a theme or map from a topic-first perspective rather than a single-broadcast perspective
use_when:
  - the user wants to advance a topic such as ai tools education productivity or adoption
inputs:
  - target theme
  - new source or batch of sources
  - existing theme playbook and map pages
outputs:
  - topic state before
  - theme updates
  - playbook or map update suggestions
  - open threads
related_prompts:
  - compare-broadcast-to-existing
  - playbook-extraction
  - repo-maintenance-review
tags:
  - topic
  - theme
  - map
  - synthesis
---

# Theme Update

## Use When

當你要追一個主題，而不是只處理單篇課文。

## Prompt

```md
請以 topic-first 方式更新這個主題。

主題：______
新來源：______

先回顧目前 repo 裡相關的：
- maps
- themes
- playbooks
- series
- 代表性 broadcasts

再回答：
1. 這個主題現在的 compiled understanding 是什麼
2. 新來源帶來什麼增量
3. 哪些內容該寫進 theme
4. 哪些內容其實更適合抽成 playbook
5. 是否需要調整 map 或 series

引用相關代表性 broadcasts 時，不要只寫 id。
- 至少寫成：`id｜原標題`
- 並補 1 句說明它原本在講什麼
- 若是 theme / playbook / series / map，也補 1 句說明該頁原本承接什麼問題

若引用項目較多，請在文末補 `Referenced Items` 區塊集中解碼。
```
