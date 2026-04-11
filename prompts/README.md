---
id: prompts-index
purpose: index reusable prompt assets for repo-local human-agent collaboration
use_when:
  - choosing a prompt asset for ingest, compare, theme update, playbook extraction, or maintenance
inputs:
  - current task intent
  - source type
  - desired output shape
outputs:
  - recommended prompt file
related_prompts:
  - daily-broadcast-ingest-and-discuss
  - markdown-broadcast-ingest
  - theme-update
  - playbook-extraction
  - repo-maintenance-review
tags:
  - prompts
  - index
  - workflow
---

# prompts

這裡放的是可重用的 prompt assets。

用途不是展示「漂亮提示詞」，而是把你和 agent 的高頻互動方式 externalize 成 repo-local interface，讓它們可以被：

- 直接複製使用
- 持續修訂
- 被 agent 讀取與引用
- 跟 repo workflow 一起演化

使用原則：

- 優先選最貼近當前任務的 prompt，不要每次都用萬用 prompt
- prompt 的目標應是驅動 repo-level 判斷，而不只是重做摘要
- 若來源已經是 `dedao/快刀廣播站/*.md` 或其他 markdown 檔，優先使用 ingest 類 prompt
- 若任務重點是方法萃取，優先用 playbook 類 prompt
- 若任務重點是系列回顧，優先用 series 類 prompt

frontmatter schema：

- `id`
  prompt 的穩定識別名稱
- `purpose`
  這個 prompt 要驅動什麼判斷
- `use_when`
  什麼情境下最適合使用
- `inputs`
  使用時通常要提供的資訊
- `outputs`
  預期 agent 回傳的結果類型
- `related_prompts`
  常見的下一步 prompt
- `tags`
  幫助 agent 或人類快速篩選的分類標籤

查詢方式：

- repo 入口：[root README](../README.md)
- prompt 導航：[prompts/README.md](README.md)
- machine-readable registry：[index.json](index.json)
- CLI 查詢工具：`tools/list-prompts`

建議入口：

- [daily-broadcast-ingest-and-discuss.md](daily-broadcast-ingest-and-discuss.md)
  日更模式主入口：收錄一篇新課文，並立刻用既有 KB 做 discussion-ready 回覆
- [markdown-broadcast-ingest.md](markdown-broadcast-ingest.md)
  從現有 markdown 課文 ingest
- [ingest-review.md](ingest-review.md)
  回顧今天 new ingest 的增量、重複與 merge 建議
- [compare-broadcast-to-existing.md](compare-broadcast-to-existing.md)
  比較一篇新課文和 repo 既有內容
- [theme-update.md](theme-update.md)
  以某個主題為中心更新 theme / map
- [playbook-extraction.md](playbook-extraction.md)
  專門萃取可重用做法
- [series-review.md](series-review.md)
  回顧某個欄目的累積脈絡
- [repo-maintenance-review.md](repo-maintenance-review.md)
  沒有新來源時，做 repo structure / cleanup review
