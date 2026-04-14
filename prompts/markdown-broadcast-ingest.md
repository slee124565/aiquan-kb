---
id: markdown-broadcast-ingest
purpose: classify and ingest a markdown broadcast source while preserving provenance and deciding write targets
use_when:
  - the source already exists as a markdown file
  - the source comes from an external workspace or local markdown source
inputs:
  - source path
  - why it should enter the repo
  - optional theme or series emphasis
outputs:
  - ingest verdict
  - canonical naming recommendation
  - raw and broadcast action
  - related theme playbook and series targets
related_prompts:
  - compare-broadcast-to-existing
  - theme-update
  - playbook-extraction
tags:
  - ingest
  - markdown
  - provenance
---

# Markdown Broadcast Ingest

## Use When

當來源本身已經是 markdown 檔。

## Goal

把新來源從「存在於 workspace」推進到 `raw/` + `wiki/broadcasts/`，並判斷它應該連到哪些既有 theme / playbook / series。

## Prompt

```md
幫我 ingest 這篇快刀廣播站課文到 repo。

來源 path：______
我覺得它重要，因為 ______。

請先：
- 判斷它的 `broadcast_id`
- 建議 canonical filename
- 檢查 repo 裡是否已有高度重複的 broadcast、theme、playbook 或 series

如果值得保留，請：
- 保存 source 與最小 provenance
- 建立或更新對應 broadcast card
- 指出它最應該連到哪些既有 theme / playbook / series / map
- 明確標出哪些觀察只是 broadcast-level，哪些值得 merge

不要只做摘要。請把重點放在：
1. 這篇的新增價值
2. 它與既有知識庫的關係
3. 是否值得升級成 theme / playbook / series 層的更新
```
