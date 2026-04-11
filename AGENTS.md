# AGENTS.md

## Repo Purpose

這是一個用來承接 `AI学习圈 / 快刀廣播站` 日更課文、並由 agent 持續編譯與維護的知識庫 repo。

它的核心不是收藏課文，而是把課文逐步編譯成：

- broadcast cards
- theme pages
- playbooks
- series pages
- topic maps

## Start Here

1. 先讀 `AGENTS.md`
2. 再讀 `README.md`
3. 再讀 `ARCHITECTURE.md`
4. 再讀 `docs/README.md`
5. 開始工作前，先看 `index.md`

若任務是 ingest 新課文，再讀：

- `docs/ingest.md`
- `docs/compile.md`
- `prompts/daily-broadcast-ingest-and-discuss.md`

若任務是整理結構或做維護，再讀：

- `docs/review.md`
- `docs/query.md`

## Top-Level Map

- `raw/`
  immutable source material
- `wiki/broadcasts/`
  單篇廣播或單篇課文的 compiled card
- `wiki/themes/`
  跨課文穩定主題頁
- `wiki/playbooks/`
  可反覆重用的實作方法、流程或操作框架
- `wiki/series/`
  連載型欄目、共讀系列、活動系列的累積頁
- `wiki/maps/`
  主題入口與學習導航
- `index.md`
  repo-level navigation
- `log.md`
  append-only maintenance timeline
- `docs/`
  穩定 workflow 與 operating rules
- `prompts/`
  repo-local prompt assets
- `tools/`
  repo-local helper tools，例如 prompt registry lookup

## Canonical Key Rule

- 預設以 `broadcast_id` 作為課文的 canonical key。
- `broadcast_id` 可直接來自課文檔名開頭的數字，例如 `812`。
- 若是加餐、特刊或無固定編號內容，可使用 `special-YYYYMMDD-<slug>`。
- 不要把中文長標題直接當成 canonical filename。

## Source-of-Truth Rules

- 來源事實以 `raw/` 為準。
- 單篇課文的編譯理解以 `wiki/broadcasts/` 為準。
- 跨課文穩定理解以 `wiki/themes/` 為準。
- 可操作方法與實戰框架以 `wiki/playbooks/` 為準。
- 連載與欄目脈絡以 `wiki/series/` 為準。
- 導航入口以 `wiki/maps/` 與 `index.md` 為準。
- 維護歷史只寫進 `log.md`，不要把知識內容塞進 log。

## Shared Operating Rules

- 預設先更新既有頁面，不要急著新增近似重複頁。
- 不要把 raw source 大段改寫後直接搬進 wiki。
- 單篇摘要不等於知識編譯；應補上定位、適用場景、可重用做法與 merge candidates。
- 若某個觀察可跨兩篇以上課文重用，優先 merge 到 `wiki/themes/`。
- 若某個做法可在不同工作場景反覆重用，優先整理到 `wiki/playbooks/`。
- 若某個欄目已形成穩定連載脈絡，更新或建立 `wiki/series/`。
- 若某個主題已經成為查詢入口，更新或建立 `wiki/maps/`。
- `index.md` 應保持薄，只列 stable entry points。
- `log.md` 每次只 append 簡短 maintenance note，不回寫長段分析。
- 若 claim 不確定，明確標示不確定性，並指回對應 `raw/` 檔案。

## Default Codex Workflow

1. 讀 `index.md`，找現有入口與相關頁
2. 讀相關 `wiki/maps/`、`wiki/themes/`、`wiki/playbooks/`、`wiki/series/`、`wiki/broadcasts/`
3. 必要時回看對應 `raw/` 來源
4. 先決定是更新既有頁，還是新增頁面
5. 更新 broadcast page
6. 將可重用內容 merge 回 theme / playbook / series / map page
7. 視需要調整 `index.md`
8. append 一條 `log.md`

## Daily Interaction Rule

若使用者今天只帶來一篇新的 `快刀廣播站` 課文，預設優先採用：

- `prompts/daily-broadcast-ingest-and-discuss.md`

這表示 agent 不應只做收錄，而應在 ingest 後固定提供一份 discussion-ready output，至少包含：

1. `Core View`
   這篇最重要的核心觀點
2. `Relation To Existing KB`
   它和既有 theme / playbook / series / map / 舊 broadcast 的關係
3. `Why It Might Matter To Me`
   如果結合使用者當前關注脈絡，這篇最可能的價值
4. `Practical Use`
   今天就可以採取的具體使用方式
5. `Discussion Hooks`
   最值得繼續追問的問題
6. `Writeback Suggestion`
   哪些內容只留在 broadcast card，哪些值得 merge 到更高層

若使用者沒有明確指定 prompt，但語意上是在做「日更 ingest + 討論」，也應自動採用這個互動模式。

## Ingest Rule

當新課文進 repo 時：

1. 先放到 `raw/inbox/` 或 `raw/sources/YYYY/`
2. 補最小 metadata
3. 建立或更新對應 broadcast card
4. 把可重用觀察 merge 到 themes / playbooks / series
5. 必要時更新 maps、index、log

若是日更單篇 ingest，除了上述動作外，預設還要立刻用既有 KB 回答：

- 這篇的核心觀點
- 它與既有 KB 的關係
- 對使用者最可能有價值的使用方式
- 接下來值得追問的問題

若來源是從 workspace 其他位置匯入：

- 將內容複製到 `raw/sources/YYYY/`，讓 `raw/` 成為此 repo 的 source of truth
- 在 broadcast card 的 source metadata 裡保留原始 workspace path，避免 provenance 斷裂

## Query Rule

回答問題時，優先使用：

1. `wiki/maps/`
2. `wiki/themes/`
3. `wiki/playbooks/`
4. `wiki/series/`
5. `wiki/broadcasts/`
6. `raw/`

若查詢結果具有可重用性，應回寫為：

- theme update
- playbook update
- series update
- map update
- 新 broadcast-level synthesis

## File Responsibilities

- `README.md`
  repo overview 與邊界
- `ARCHITECTURE.md`
  結構分層與 source-of-truth
- `docs/README.md`
  workflow doc 入口
- `docs/ingest.md`
  新課文進 repo 的規則
- `docs/compile.md`
  broadcast -> theme / playbook / series / map 的編譯規則
- `docs/review.md`
  review / cleanup 規則
- `docs/query.md`
  查詢與回寫規則
- `prompts/README.md`
  prompt assets 的人類可讀入口與使用原則
- `prompts/index.json`
  prompt assets 的 machine-readable registry
- `tools/list-prompts`
  prompt registry 的最小查詢工具

## Biases

- prefer synthesis over accumulation
- prefer merge over duplication
- prefer practical reuse over one-off summary
- prefer course-native structure over generic PKM taxonomy
- prefer explicit provenance over confident guessing
