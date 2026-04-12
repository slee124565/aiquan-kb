# raw

`raw/` 放 immutable source material。

結構：

- `raw/inbox/`
  剛收進來、尚未正式編譯的來源
- `raw/sources/`
  已決定保留的來源材料
- `raw/ingest-registry.tsv`
  記錄已 handoff 到 `aiquan-kb` 的來源與去重狀態
- `tools/scan-dedao-ingest`
  掃描 `dedao/快刀廣播站/` 並對照 registry 的批次去重 helper
- `tools/dedao-browser-ingest/`
  用專用 automation Chrome profile 做 daily raw capture + registry update 的第一版工具

原則：

- 不在原地改寫來源內容
- 保留最小 provenance
- 來源若來自 `dedao/快刀廣播站/`，要保留原始 workspace path
- 若來源是直接從 Dedao 網頁擷取，`source_path` 可使用 article URL 作為 canonical source pointer
- `source_path` 是 provenance pointer，不是跨所有 ingest 模式都必須完全相同的唯一鍵
- 單篇課文若有穩定編號，優先使用 `broadcast_id` 作為 canonical filename
- 批次 ingest 前，先檢查 `raw/ingest-registry.tsv`
- 正式匯入後，單檔 source 應帶最小 frontmatter，避免 provenance 只存在 registry

`raw/inbox/` 的 markdown source 建議使用簡易版 frontmatter：

```yaml
---
source_path:
broadcast_id:
captured:
status: inbox
series_hint: []
theme_hint: []
why_it_matters:
---
```

欄位說明：

- `source_path`
  原始 workspace path；若為 direct browser capture，使用 article URL。這是最重要的 provenance。
- `broadcast_id`
  預設取課文檔名開頭的數字。
- `captured`
  匯入到 inbox 的日期，使用 `YYYY-MM-DD`。
- `status`
  預設固定為 `inbox`。
- `series_hint`
  給 agent 的欄目提示，例如 `["周日荐文"]`。
- `theme_hint`
  給 agent 的主題提示，例如 `["ai-products", "workflow"]`。
- `why_it_matters`
  你的一句話判斷，說明這份材料為什麼值得進 repo。

範例：

```yaml
---
source_path: dedao/快刀廣播站/812｜AI大神卡帕西的知识管理方法刷屏，用Get笔记六步抄作业-2026年4月7日.md
broadcast_id: "812"
captured: 2026-04-11
status: inbox
series_hint: []
theme_hint: ["knowledge-management", "ai-tools"]
why_it_matters: 可直接連到知識管理、課程實操與產品化用法三條編譯鏈
---
```

`raw/ingest-registry.tsv` 建議欄位：

- `broadcast_id`
- `source_path`
- `raw_file`
- `broadcast_card`
- `year`
- `imported_at`
- `source_hash`
- `status`

去重規則：

- 同一 `broadcast_id` 且 `source_hash` 相同：預設 `skip`
- 同一 `broadcast_id` 但 `source_hash` 不同：走 `update-if-changed`
- 主鍵衝突或來源不一致：走 `manual-review`

補充：

- 若同一 `broadcast_id` 只是來自不同 provenance 類型，例如 `dedao/快刀廣播站/*.md` 與 Dedao article URL，預設不視為主鍵衝突
- 真正需要 `manual-review` 的情況，是同一 provenance 類型下仍指向不同來源

常用檢查方式：

- `tools/scan-dedao-ingest`
- `tools/scan-dedao-ingest --only new`
- `tools/scan-dedao-ingest --only update-if-changed`
- `tools/scan-dedao-ingest --id 812`
- `tools/dedao-browser-ingest/README.md`
