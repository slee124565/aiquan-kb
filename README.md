# aiquan-kb

一個專門用來承接 `AI学习圈 / 快刀廣播站` 課文、並持續編譯成可查詢知識庫的 repo。

這個 repo 的 operating model 基於 [llm-wiki-kb](https://github.com/slee124565/llm-wiki-kb) 與 [my-llm-kb](https://github.com/slee124565/my-llm-kb) 的 agent-compiler 設計，但它不是 LLM 研究文章庫的複製版，而是針對「日更課程廣播、案例、工具玩法、課程欄目與學員實作訊號」做了專門分層。

**這個 repo 解的問題**

`快刀廣播站` 的單篇課文有幾種典型價值同時存在：

- AI 新聞與產業動態
- 工具用法與實作技巧
- 產品、教育、管理、組織等主題觀察
- 課程欄目與系列活動的上下文
- 學員應如何把內容轉成可行動方法

如果只把課文存成單篇摘要，最後會得到一堆彼此孤立的文章卡片；但如果全部直接 merge 成大主題頁，又會失去課程節奏、欄目脈絡與 provenance。

所以這個 repo 採用：

- `broadcast cards`
  承接單篇課文
- `theme pages`
  承接跨課文穩定主題
- `playbooks`
  承接可重用做法與操作框架
- `series pages`
  承接連載型欄目與專題脈絡
- `topic maps`
  承接導航入口

**為什麼不是直接照抄 my-llm-kb**

`my-llm-kb` 的主要 source 是 LLM / agent 文章，因此它把重心放在 `article -> concept -> map`。

`aiquan-kb` 的 source 是課程廣播與欄目內容，除了跨篇主題整合，還要承接：

- 課程內的 recurring series
- 工具 / 案例 / 職場場景的實戰做法
- 可回收為行動模板的 playbook

因此這裡的編譯路徑改成：

- `raw source`
- `broadcast card`
- `theme / playbook / series`
- `map`

**兩層協作模型**

- `Human Layer`
  負責判斷哪些課文值得長期保留、今天想回答什麼問題、哪些欄目或做法值得沉澱成長期資產。
- `Agent Layer`
  負責 ingest 來源、抽 metadata、整理 claims、分類為 theme / playbook / series、比較既有內容、標示不確定性，並把結果回寫成可查詢結構。

**日常最佳互動情境**

1. `快速收錄一篇課文`
   你丟一篇現成 markdown source，agent 判斷它應進哪個 year/source 路徑、建立 broadcast card，並指出應 merge 到哪些 theme / playbook / series。
2. `日更收錄並立刻討論`
   你今天只有一篇新課文，但不想只收錄。agent 應在 ingest 之後，立刻用既有 KB 回你這篇的核心觀點、它和舊內容的關係、對你可能有價值的使用方式，以及接下來最值得追問的問題。
3. `追一個課程主題`
   例如 AI 教育、AI 产品、AI 组织、AI 落地案例。agent 先回顧 `wiki/maps/` 與 `wiki/themes/`，再吸收新課文，把單篇輸入轉成主題更新。
4. `萃取可操作做法`
   當課文內含明確工具玩法、工作流或教學框架，agent 應整理到 `wiki/playbooks/`，而不是只留在單篇頁。
5. `回顧一個系列欄目`
   例如 `AI龙虾十日谈`、`年度观察`、`共读`、`周日荐书`。agent 應維護 `wiki/series/`，整理該欄目的核心論點、篇目、演化與未完議題。
6. `做一次 repo maintenance review`
   當沒有新課文要收時，請 agent 找出過厚的 broadcast page、該 merge 的 themes、該抽出的 playbooks、以及過時或太薄的 map / series 頁。

**每日標準用法**

如果你每天只想處理一篇新課文，最推薦直接使用：

- [prompts/daily-broadcast-ingest-and-discuss.md](prompts/daily-broadcast-ingest-and-discuss.md)

這個入口的預設輸出不是「已收錄」，而是：

1. `Core View`
   這篇最重要的 1 到 3 個核心觀點
2. `Compare`
   它和 repo 裡哪些 theme / playbook / series / map / 舊 broadcast 最相關
   它修正了你原本哪個判準
3. `Extend`
   如果這篇成立，接下來最值得追問的問題、最值得採取的用法與最值得推動的 writeback
4. `Taste Training Note`
   這篇最值得你練的比較能力與延伸能力
5. `Writeback Suggestion`
   哪些內容只該留在單篇，哪些值得回寫到 theme / playbook / series / map

你可以直接這樣對 agent 說：

```md
請用 `daily-broadcast-ingest-and-discuss` 處理今天這篇快刀廣播站課文。

來源：publishes/aiquan-kb/raw/sources/2026/xxx.md
我今天注意到它，因為 ______。
我現在特別關心的是 ______。
```

這樣 repo 的日更就會自然變成：

- `ingest`
- `kb-aware synthesis`
- `discussion`
- `writeback`

**Prompt Starters**

若你想直接引用可維護的 prompt asset，請看 [prompts/README.md](prompts/README.md)。

若你想讓 script 或 agent 直接選 prompt，請看 [prompts/index.json](prompts/index.json)。

若你忘了該用哪個 prompt，可用 `tools/list-prompts` 查詢。

最常用的入口：

- 日更主入口：`prompts/daily-broadcast-ingest-and-discuss.md`
- 從課文 markdown ingest：`prompts/markdown-broadcast-ingest.md`
- 今天新 ingest 回顧：`prompts/ingest-review.md`
- 單篇比對既有內容：`prompts/compare-broadcast-to-existing.md`
- 主題更新：`prompts/theme-update.md`
- 萃取可重用做法：`prompts/playbook-extraction.md`
- 回顧某個欄目：`prompts/series-review.md`
- 結構維護：`prompts/repo-maintenance-review.md`

**Repo Structure**

- `raw/`
  放 immutable source material
- `wiki/broadcasts/`
  放單篇廣播的 compiled card
- `wiki/themes/`
  放跨課文穩定主題頁
- `wiki/playbooks/`
  放可反覆重用的做法、流程與操作框架
- `wiki/series/`
  放 recurring series / 欄目累積頁
- `wiki/maps/`
  放主題導覽頁與學習入口
- `index.md`
  放少量 stable entry points
- `log.md`
  記錄 ingest、merge、review、cleanup
- `docs/`
  放穩定 workflow 與維護規則
- `prompts/`
  放可重用的 prompt assets 與 agent interaction starters
- `tools/`
  放 repo-local tools；`tools/list-prompts` 可查詢 prompt registry
  `tools/dedao-browser-ingest/` 則負責 browser raw capture + registry update

**Daily Raw Ingest**

若你想讓 `aiquan-kb` 單獨執行每日新文章 ingest，請直接看：

- [tools/dedao-browser-ingest/README.md](tools/dedao-browser-ingest/README.md)

若你今天的來源不是從瀏覽器直接抓，而是已經有現成 markdown source，可直接用 `prompts/markdown-broadcast-ingest.md`。

注意：

- browser profile、cursor state、debug artifacts 屬於本機 operational state，預設放在 `~/Library/Application Support/aiquan-kb/dedao-browser-ingest/`
- subtree repo 只版本化 raw source、registry 與工具程式本身

這代表 daily ingest 的完整路徑應是：

`tools/dedao-browser-ingest` 先抓新文章進 `raw/`

然後再由 agent 針對該 raw source 執行單篇 compile，完成：

- `wiki/broadcasts/` writeback
- theme / playbook / series / map 更新
- `log.md` 紀錄

**Canonical Naming**

這個 repo 預設用 `broadcast_id` 當單篇內容主鍵，而不是直接用中文長標題當檔名。

建議：

- raw source: `raw/sources/2026/812.md`
- broadcast card: `wiki/broadcasts/812.md`

若來源沒有固定編號，可改用：

- `special-YYYYMMDD-<slug>.md`

所有原始中文標題、來源日期、workspace path，都保留在檔案 metadata 中。

**與現有 workspace 的關係**

目前原始課文的正式落點是 `raw/sources/`。

這個 repo 的 ingest 原則不是依賴外部工作區作為 live source，而是：

1. 將外部 markdown source 匯入 `raw/sources/YYYY/`
2. 在 metadata 裡保留原始來源路徑或 provenance
3. 讓 `raw/` 成為本 repo 的 source of truth

這樣 subtree / GitHub repo 才能獨立存在，不依賴主 workspace 的路徑結構。

**這個 Repo 的邊界**

這個 repo 應聚焦在：

- `AI学习圈 / 快刀廣播站` 課文與欄目內容
- 可重用知識頁的編譯
- 可重用實作方法的萃取
- 系列欄目脈絡與主題導航
- 後續 query / synthesis / maintenance

這個 repo 不應長期承擔：

- workspace 級任務管理
- 全域 PKM inbox
- 對外發表草稿
- 其他內容域的混合整理

**最小日更流程**

1. 把課文或材料放進 `raw/inbox/` 或 `raw/sources/`
2. 建立或更新對應的 `wiki/broadcasts/*.md`
3. 把可重用觀察 merge 回 `wiki/themes/*.md`
4. 把可操作方法整理到 `wiki/playbooks/*.md`
5. 若屬於系列內容，更新 `wiki/series/*.md`
6. 必要時更新 `wiki/maps/*.md`
7. 更新 `index.md` 與 `log.md`

**建議閱讀順序**

- 若你用 Codex：先讀 [AGENTS.md](AGENTS.md)
- 若你用 Claude：先讀 [CLAUDE.md](CLAUDE.md)
- [README.md](README.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [docs/README.md](docs/README.md)
- [docs/ingest.md](docs/ingest.md)
- [docs/compile.md](docs/compile.md)
- [docs/review.md](docs/review.md)
- [docs/query.md](docs/query.md)
- [prompts/README.md](prompts/README.md)
- [raw/README.md](raw/README.md)
- [wiki/README.md](wiki/README.md)
