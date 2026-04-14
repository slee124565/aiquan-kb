# dedao-browser-ingest

這是 `aiquan-kb` 的第一版日更 ingest 工具。

目前只做兩件事：

- 從專用 automation Chrome profile 抓取 Dedao 單篇文章內容
- 寫入 `raw/sources/YYYY/<broadcast_id>.md` 並更新 `raw/ingest-registry.tsv`

這一版**不負責**：

- 建立 `wiki/broadcasts/*.md`
- 更新 themes / playbooks / series / maps
- 做 prompt-driven compile

**設計原則**

- 使用專用 `user-data-dir` 的 automation Chrome profile
- 不依賴你平常正在使用的預設 Chrome
- 工具會自行啟動或重用 dedicated automation Chrome
- 用 `raw/ingest-registry.tsv` 當正式 dedupe / update registry
- 用 repo 外的 app state 當日常 cursor 與 last-run operational memory
- 預設導航方向是「下一篇 / 下一页」，用來做 daily incremental ingest
- mutable browser profile / state 不進 subtree repo

**前置條件**

1. 第一次先啟動 dedicated automation Chrome
2. 用那個專用 profile 手動登入 `dedao.cn`
3. 之後日更流程都重用同一個 automation profile

**安裝**

```bash
cd publishes/aiquan-kb/tools/dedao-browser-ingest
npm run bootstrap
```

**用法**

若你想沿用目前 `Default` profile 的登入態與環境，先 bootstrap 一份 clone：

```bash
node run.js --bootstrap-from-profile-directory Default --launch-only
```

說明：

- 這會把 `~/Library/Application Support/Google/Chrome/Default` 複製到工具自己的 dedicated automation profile
- 之後 ingest 只會使用那份 clone，不會碰你真正日常在用的 `Default`

若你不需要從既有 profile 複製，也可以直接建立 / 打開空白 automation profile：

```bash
node run.js --launch-only
```

首次登入後，用 seed article 收錄當前頁：

```bash
node run.js --url "https://www.dedao.cn/course/article?id=..." --include-start --count 1
```

日更增量模式：

```bash
node run.js --count 3
```

**Daily Ingest User Guide**

若你是第一次在這台機器上使用：

1. 安裝依賴

```bash
cd publishes/aiquan-kb/tools/dedao-browser-ingest
npm run bootstrap
```

2. 從你日常 Chrome 的 `Default` profile bootstrap 一份 dedicated automation profile

```bash
node run.js --bootstrap-from-profile-directory Default --launch-only
```

3. 在剛打開的專用 Chrome 裡確認 Dedao 已登入

第一次 seed 某篇文章時：

```bash
node run.js --url "https://www.dedao.cn/course/article?id=..." --include-start --count 1
```

之後的日更增量模式通常只要：

```bash
node run.js --count 1
```

若你想一次抓多篇：

```bash
node run.js --count 3
```

這個 daily guide 的核心原則是：

- 日常瀏覽 Dedao 仍用你自己的正常 Chrome
- automation ingest 只用 dedicated clone profile
- 工具會從本機 app state 的 `state.json` 讀 `last_ingested_url`
- 再往「下一篇 / 下一页」前進，直到遇到已收錄邊界

說明：

- automation profile 預設在 `~/Library/Application Support/aiquan-kb/dedao-browser-ingest/chrome-user-data/`
- app state 預設在 `~/Library/Application Support/aiquan-kb/dedao-browser-ingest/state.json`
- debug artifacts 預設在 `~/Library/Application Support/aiquan-kb/dedao-browser-ingest/runs/`
- 若 app state 裡已有 `last_ingested_url`，預設會先打開那篇，再往「下一篇」前進後開始收錄
- 若沒有新文章，腳本會正常結束，不會重複寫入已收錄內容
- 若同一 `broadcast_id` 內容 hash 改變，腳本會覆蓋既有 raw source 並把 registry status 更新為 `updated`

**常用參數**

- `--url`
  首次 seed URL，或配合 `--force-url` 強制從指定文章重新起跑
- `--count`
  本次最多處理幾篇，預設 `5`
- `--port`
  Chrome remote debugging port，預設 `9222`
- `--session-key`
  state key，預設 `automation-default`
- `--chrome-user-data-dir`
  覆蓋 dedicated automation Chrome profile 路徑
- `--launch-only`
  只啟動 / 重用 dedicated automation Chrome，不做 ingest；用來手動登入 Dedao
- `--bootstrap-from-profile-directory`
  先從本機 Chrome profile 複製一份 dedicated automation profile，例如 `Default`
- `--automation-profile-directory`
  dedicated user-data-dir 內的 profile 目錄名，預設 `Default`
- `--include-start`
  連 seed article 本身也一起處理
- `--force-url`
  忽略既有 state，直接從 `--url` 起跑

**輸出**

- raw source:
  `raw/sources/YYYY/<broadcast_id>.md`
- registry:
  `raw/ingest-registry.tsv`
- state:
  `~/Library/Application Support/aiquan-kb/dedao-browser-ingest/state.json`

**What To Do Next**

這個工具完成後，代表「新文章已進 raw layer」，不代表知識庫 compile 已完成。

日更標準下一步：

1. 確認新檔已寫進 `raw/sources/YYYY/<broadcast_id>.md`
2. 確認 `raw/ingest-registry.tsv` 已新增或更新該筆資料
3. 立刻請 agent 對這篇 raw source 做單篇 compile

推薦用法：

- 日更主入口：`prompts/daily-broadcast-ingest-and-discuss.md`
- 單純 compile 入口：`prompts/markdown-broadcast-ingest.md`

最小例子：

```md
請把 `publishes/aiquan-kb/raw/sources/2026/817.md` compile 進 aiquan-kb。
請建立或更新 broadcast card，並做必要 writeback。
```

compile 這一步預設應完成：

- 建立或更新 `wiki/broadcasts/<broadcast_id>.md`
- 回寫必要的 theme / playbook / series / map
- 補 registry 的 `broadcast_card`
- append `log.md`

**Repo Boundary**

- `raw/sources/` 與 `raw/ingest-registry.tsv` 是 repo content，應進版本控制
- Chrome clone profile、cursor state、debug artifacts 都是 local operational state，不應進 repo
- 若要重置本機狀態，可直接刪除 `~/Library/Application Support/aiquan-kb/dedao-browser-ingest/`

**驗證建議**

- 若想承接現有登入態，第一次先跑 `--bootstrap-from-profile-directory Default --launch-only`
- 確認專用 Chrome profile 內 Dedao 可正常打開
- 再用 `--include-start --count 1` 做單篇 smoke test
- 再跑一次不帶 `--url` 的增量模式，確認沒有新文章時會乾淨退出

目前已驗證通過：

- `Default` profile bootstrap 成 dedicated automation profile
- `--launch-only`
- single article capture
- next-article incremental capture
- `今天 / 昨天 / 前天` 相對日期正規化
