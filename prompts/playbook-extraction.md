---
id: playbook-extraction
purpose: extract reusable methods and workflows from one or more broadcasts instead of leaving them as summaries
use_when:
  - one or more broadcasts contain clear actionable steps
  - the user wants to turn course content into repeatable practice
inputs:
  - target broadcast or theme
  - intended user role or scenario
outputs:
  - extracted method
  - proposed playbook structure
  - reuse boundaries
related_prompts:
  - markdown-broadcast-ingest
  - theme-update
  - repo-maintenance-review
tags:
  - playbook
  - workflow
  - practical
---

# Playbook Extraction

## Use When

當課文裡有明確做法、流程、判斷框架，想把它提煉成可重用頁面。

## Prompt

```md
請從這篇或這批課文中抽出可重用 playbook。

不要停在摘要，請重點找：
- 可反覆執行的步驟
- 可遷移的判斷標準
- 適用場景
- 不適用場景

最後請給我：
1. 這個 playbook 的核心用途
2. 3 到 7 個步驟
3. 需要回鏈的 broadcasts / themes / maps
4. 哪些部分其實只是案例，不應寫進 playbook

引用回鏈項目時，不要只寫 id 或頁名。
- 若是 broadcast，至少寫成：`id｜原標題｜1句原內容摘要`
- 若是 theme / map，補 1 句說明它原本承接什麼問題
```
