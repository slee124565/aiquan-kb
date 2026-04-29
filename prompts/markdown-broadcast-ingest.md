---
id: markdown-broadcast-ingest
purpose: classify and ingest a markdown broadcast or external AI case source while preserving provenance and deciding write targets
use_when:
  - the source already exists as a markdown file
  - the source comes from an external workspace or local markdown source
  - the source is an external AI case study that should supplement existing repo themes or playbooks
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

若來源不是 `快刀廣播站`，請使用 `source_kind: external-case-study`，並確認它是補強既有 AI workflow / adoption / tool-evaluation / learning / governance 主題，而不是泛用剪藏。

## Prompt

```md
幫我 ingest 這篇 markdown source 到 repo。

來源 path：______
我覺得它重要，因為 ______。

請先：
- 判斷它的 `broadcast_id`
  - 若是外部 AI 案例，用 `special-YYYYMMDD-<slug>`
- 建議 canonical filename
- 檢查 repo 裡是否已有高度重複的 broadcast、theme、playbook 或 series
  - 引用任何既有內容時，不要只寫 id 或頁名
  - 若是 broadcast，至少輸出：`id｜原標題｜1句原內容摘要`
  - 若是 theme / playbook / series / map，補 1 句說明它原本承接什麼問題

如果值得保留，請：
- 保存 source 與最小 provenance
- 建立或更新對應 broadcast card
- 指出它最應該連到哪些既有 theme / playbook / series / map
- 明確標出哪些觀察只是 broadcast-level，哪些值得 merge

不要只做摘要。請把重點放在：
1. 這篇的新增價值
2. 它與既有知識庫的關係
3. 是否值得升級成 theme / playbook / series 層的更新

若文中引用超過 2 個既有項目，請在文末補一個 `Referenced Items` 區塊，集中解碼所有關鍵引用。
```
