---
id: daily-online-check-ingest-compile
purpose: run the full daily pipeline from latest online article check through raw capture compile and kb-aware discussion
use_when:
  - the user wants today's latest 快刀廣播站 article checked online before ingest
  - the source may not yet exist in raw sources
  - the user wants one end-to-end daily operator flow from capture to compile
inputs:
  - optional source path url or broadcast id
  - optional reason this article matters today
  - optional current work context or question
outputs:
  - candidate selection
  - capture verdict
  - compile verdict
  - core view
  - compare
  - extend
  - taste training note
  - writeback suggestions
related_prompts:
  - daily-broadcast-ingest-and-discuss
  - markdown-broadcast-ingest
  - ingest-review
tags:
  - daily
  - online-check
  - ingest
  - compile
  - orchestration
---

# Daily Online Check Ingest Compile

## Use When

當你想把今天的 `快刀廣播站` 日更流程一次做完，從「找最新文章、線上檢查、必要時下載 raw source」一路推進到「compile 與 discussion-ready writeback」。

## Goal

把單篇日更流程整合成：

1. latest candidate check
2. raw capture judgment
3. browser ingest when needed
4. compile and writeback
5. kb-aware discussion

## Prompt

```md
請執行今天的快刀廣播站日更流程，從「最新文章線上檢查」一路做到「ingest、compile、discussion」。

如果我已提供來源 path、URL 或 `broadcast_id`，優先處理那一篇。
如果我沒有提供來源，請自行找出目前最新、且尚未完整完成 raw capture / compile / writeback 的 1 篇候選。

來源（若已知）：______
我今天注意到它，因為 ______。
如果 relevant，我現在的工作 / 關注點是：______。

請依序執行：

1. Candidate Check
   - 檢查目前最新候選
   - 若最新文章已完整完成 raw capture、broadcast card、theme / playbook / series / map writeback，跳過並找下一篇
   - 若 provenance 不一致、`broadcast_id` 衝突、或 compile 狀態不明，標成 `manual-review`

2. Raw Capture Judgment
   - 檢查 `raw/ingest-registry.tsv`
   - 檢查是否已有對應 `raw/sources/YYYY/<broadcast_id>.md`
   - 檢查是否已有對應 `wiki/broadcasts/<broadcast_id>.md`
   - 判斷這篇是尚未 capture、已 capture 但未 compile、已 compile 但未完整 writeback，或其實已完整完成

3. Online Check And Capture
   - 若尚未有 raw source，使用 repo 既有的 `tools/dedao-browser-ingest` 流程做線上檢查與下載
   - 完成後確認 `raw/sources/YYYY/<broadcast_id>.md` 已寫入
   - 確認 `raw/ingest-registry.tsv` 已新增或更新該筆資料
   - 若下載失敗，保留 debug 線索並停止，不要假裝完成

4. Compile And Writeback
   - 建立或更新對應 `wiki/broadcasts/<broadcast_id>.md`
   - 把可重用觀察 merge 到必要的 theme / playbook / series / map
   - 視需要補 registry 的 `broadcast_card`
   - append `log.md`

5. Discussion Output
   除了 ingest / compile verdict，還要給我一份用來訓練「每日 AI 訊息品味能力」的輸出，至少包含：

   - Core View
     這篇最重要的 1 到 3 個核心觀點

   - Compare
     它和 repo 裡哪些 theme / playbook / series / map / 舊 broadcast 最相關
     它是 net-new、revision pressure、series continuation，還是弱訊號
     它修正了我原本哪個判準
     引用任何既有內容時，不要只寫 id 或頁名。
     - 若是 broadcast，至少寫成：`id｜原標題`
     - 若該引用對理解重要，再補：
       - 它原本在講什麼（1 句）
       - 這次新文章和它的關係（1 句）
     - 若是 theme / playbook / series / map，也補 1 句說明該頁原本承接什麼問題

   - Extend
     如果這篇成立，接下來最值得追問的問題
     它應推動哪個 theme / playbook / series / map 更新
     今天就可以怎麼拿來用

   - Taste Training Note
     這篇最值得練的比較能力
     這篇最值得練的延伸能力

   - Writeback Suggestion
     哪些內容只該留在 broadcast card
     哪些值得 merge 到 theme / playbook / series / map

請用以下結構輸出：

1. Candidate
   - 你選中的文章
   - 為什麼選它
   - 它原本卡在哪一層

2. Capture Verdict
   - 是否需要線上下載
   - 實際做了哪些步驟
   - raw 檔與 registry 的結果

3. Compile Verdict
   - 建立或更新了哪些頁面
   - 哪些是 broadcast-level writeback
   - 哪些是 theme / playbook / series / map-level writeback

4. Discussion
   - Core View
   - Compare
   - Extend
   - Taste Training Note
   - Writeback Suggestion

6. Referenced Items
   - 把正文中引用到的關鍵 broadcast / theme / playbook / series / map 做人類可讀解碼
   - 若是 broadcast，格式為：`id｜標題`：它原本在講什麼（1 句）
   - 若是 theme / playbook / series / map，格式為：`頁面名`：它原本承接什麼問題（1 句）

5. Risks / Manual Review
   - 哪些地方不確定
   - 哪些地方需要我手動確認
```

## Expected Output

- Candidate selection
- Capture verdict
- Compile verdict
- Core view
- Compare
- Extend
- Taste training note
- Writeback suggestions
- Referenced items
- Risks or manual review notes

## Notes

- 這個 prompt 比 `daily-broadcast-ingest-and-discuss` 更上游，適合把 online check + raw capture 也納進同一次日更操作
- 若 raw source 已經存在，實際流程通常會退化成 `daily-broadcast-ingest-and-discuss` 的 compile + discussion 模式
- 這個 prompt 的重點是 end-to-end orchestration，不只是單篇知識判讀
