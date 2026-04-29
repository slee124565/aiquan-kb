# Ingest Workflow

**目標**

把 `快刀廣播站` 新課文穩定地從「剛看到」推進到「已納入知識庫」。外部 AI 案例也可以進入，但必須明確標示為 `external-case-study`，並服務既有主題或方法頁。

**日更流程**

1. 從現成 markdown source 選出要匯入的來源
   - 若走 browser ingest 日更模式，可直接從專用 automation Chrome profile 的 Dedao article page 擷取到 `raw/sources/YYYY/`
2. 判斷 `broadcast_id`
   - 預設取檔名開頭數字
   - 若沒有穩定數字，改用 `special-YYYYMMDD-<slug>`
   - 若是外部 AI 案例，使用 `special-YYYYMMDD-<slug>`，並標示 `source_kind: external-case-study`
3. 將來源複製到 `raw/inbox/` 或 `raw/sources/YYYY/`
4. 補最小 metadata
   - title
   - broadcast_id
   - source path
   - author / host if known
   - published date if known
   - captured date
   - series hint if known
   - theme hint if known
5. 在 `wiki/broadcasts/` 建立對應 broadcast card
6. 更新相關 `wiki/themes/`、`wiki/playbooks/` 或 `wiki/series/`
7. 在 `log.md` append 一條簡短紀錄

**第一版 browser ingest 邊界**

`tools/dedao-browser-ingest/` 目前只負責：

- raw capture
- `raw/ingest-registry.tsv` update
- state cursor update

它還不負責建立 `wiki/broadcasts/*.md` 或更高層 writeback。
它的 browser profile / cursor state / debug runs 屬於本機 operational state，應留在 repo 外。

**單獨執行的 daily ingest**

若只想做 raw capture + registry update，而不是完整 compile，請直接使用：

- [tools/dedao-browser-ingest/README.md](../tools/dedao-browser-ingest/README.md)

建議順序：

1. `npm install`
2. `node run.js --bootstrap-from-profile-directory Default --launch-only`
3. 確認 dedicated automation Chrome 已登入 Dedao
4. `node run.js --url "<seed-article-url>" --include-start --count 1`
5. 日常改成 `node run.js --count 1`

**Post-Ingest Next Action**

`tools/dedao-browser-ingest/` 跑完後，預設只完成：

- raw source 寫入
- registry update
- cursor state update

這還不等於「已完成 ingest 到知識庫」。

日更標準下一步應直接進入單篇 compile：

1. 確認新檔已進 `raw/sources/YYYY/<broadcast_id>.md`
2. 確認 `raw/ingest-registry.tsv` 已出現該筆資料
3. 立刻請 agent 針對該 raw source 做單篇 compile
4. 建立或更新 `wiki/broadcasts/<broadcast_id>.md`
5. 回寫必要的 theme / playbook / series / map
6. 補 `raw/ingest-registry.tsv` 的 `broadcast_card`
7. append `log.md`

推薦互動方式：

- 若你今天只處理一篇，優先用 `prompts/daily-broadcast-ingest-and-discuss.md`
- 若你只想做 repo-aware ingest judgment + compile，不需要 discussion output，可用 `prompts/markdown-broadcast-ingest.md`

最小指令例子：

```md
請用 `daily-broadcast-ingest-and-discuss` 處理今天這篇快刀廣播站課文。

來源：publishes/aiquan-kb/raw/sources/2026/817.md
我今天注意到它，因為 ______。
我現在特別關心的是 ______。
```

若不需要 discussion，只做 compile：

```md
請把 `publishes/aiquan-kb/raw/sources/2026/817.md` compile 進 aiquan-kb。
請建立或更新 broadcast card，並做必要 writeback。
```

預設流程應理解為：

`fetch page -> raw source -> agent compile -> writeback`

**External Case Study Convention**

`aiquan-kb` 可以收外部 AI 案例、影片、訪談、文章或本地 reading article，但它們是補充案例，不是主線日更。

收錄條件：

- 能補強既有 AI workflow、tool evaluation、workplace adoption、learning、knowledge-management 或 governance 判準
- 有清楚 provenance，例如原始 URL、workspace path、transcript package 或 captured source
- 能明確指出要回寫到哪些既有 theme / playbook / map
- 不是純剪藏、純新聞、純工具名單

命名：

- raw source: `raw/sources/YYYY/special-YYYYMMDD-<slug>.md`
- compiled card: `wiki/broadcasts/special-YYYYMMDD-<slug>.md`
- metadata 必須包含 `source_kind: external-case-study`
- `source_path` 保留本地原始路徑或外部 URL
- 若有影片、transcript package、secondary reading article，全部保留在 metadata 或 Source 區塊

編譯策略：

- 仍放在 `wiki/broadcasts/`，因為它承擔單篇 source -> compiled card 的角色
- `Relation To Existing Pages` 必須優先指向既有 theme / playbook / map
- 除非外部案例累積到多篇，否則不要為單篇外部案例新增獨立 theme
- `log.md` 要寫明這是 external case study ingest

**命名建議**

- raw source:
  `raw/sources/2026/812.md`
- broadcast card:
  `wiki/broadcasts/812.md`

**保留標準**

以下情況值得 ingest：

- 對 AI 工具、工作流、教育、產品或組織有可重用觀察
- 提供新的案例、框架或實操方法
- 對課程既有主題有增量或修正壓力
- 屬於重要欄目或長期值得追的系列

以下情況可先留在 inbox，不急著編譯：

- 純公告且缺少長期知識價值
- 與既有內容重複度很高
- 暫時看不出對 theme / playbook / series 有何影響
