---
id: daily-broadcast-ingest-and-discuss
purpose: ingest one daily broadcast into the repo and immediately turn it into a kb-aware discussion that trains daily AI taste through comparison and extension
use_when:
  - a new daily 快刀廣播站 article should enter the repo
  - the user wants both ingest and a discussion based on existing kb context
  - the agent should auto-discover the latest unprocessed candidate when no source is provided
inputs:
  - source path or broadcast id
  - why it feels important today
  - optional current work context or question
outputs:
  - ingest verdict
  - single best candidate when source is not specified
  - core view
  - compare
  - extend
  - taste training note
  - suggested writeback targets
related_prompts:
  - markdown-broadcast-ingest
  - theme-update
  - playbook-extraction
  - series-review
tags:
  - daily
  - ingest
  - discussion
  - synthesis
  - taste
---

# Daily Broadcast Ingest And Discuss

## Use When

當你今天只有一篇新的 `快刀廣播站` 課文，想讓 agent 不只收錄，還要立刻結合既有 KB 幫你訓練「每日 AI 訊息的品味能力」。

## Goal

把單篇日更課文，或自動找到的 1 篇最新未處理候選，變成：

1. repo-aware ingest
2. kb-aware synthesis
3. comparison-ready output
4. extension-ready output
5. taste-training note
6. 後續 writeback 候選

## Prompt

```md
請處理今天這篇快刀廣播站課文。

如果我已提供來源，直接處理那一篇。
如果我沒有提供來源，請直接自行找出目前最新且尚未完整完成 ingest / compile / writeback 的 1 篇候選。

來源 path（若已知）：______
我今天注意到它，因為 ______。
如果 relevant，我現在的工作 / 關注點是：______。

請先做 repo-aware ingest judgment：
- 檢查 dedupe / registry / 既有 broadcast
- 判斷 raw / broadcast / theme / playbook / series / map 應更新到哪一層

若遇到 provenance 不一致、id 衝突、或無法確認是否已 compile / writeback，標成 manual-review 並換下一篇。
若已完整完成 ingest / compile / writeback，跳過並往下找，直到找到第一篇真正值得處理的候選。

然後不要只回報已收錄，請再結合既有 KB 給我一份用來訓練「每日 AI 訊息品味能力」的輸出，至少回答：

1. Core View
   這篇最重要的 1 到 3 個核心觀點是什麼

2. Compare
   它和 repo 裡哪些 theme / playbook / series / map / 舊 broadcast 最相關
   它是 net-new、revision pressure、series continuation，還是弱訊號
   它修正了我原本哪個判準
   引用任何既有內容時，不要只寫 id 或頁名。
   - 若是 broadcast，至少寫成：`id｜原標題`
   - 若該引用對理解重要，再補：
     - 它原本在講什麼（1 句）
     - 這次新文章和它的關係（1 句）
   - 若是 theme / playbook / series / map，也補 1 句說明該頁原本承接什麼問題

3. Extend
   如果這篇成立，接下來最值得追問的問題是什麼
   它應該推動哪個 theme / playbook / series / map 更新
   今天就可以怎麼拿來用

4. Taste Training Note
   這篇最值得我練的比較能力是什麼
   這篇最值得我練的延伸能力是什麼

5. Writeback Suggestion
   哪些內容只該留在 broadcast card
   哪些值得進一步 merge 到 theme / playbook / series / map

6. Referenced Items
   把正文中引用到的關鍵 broadcast / theme / playbook / series / map 做人類可讀解碼。
   - broadcast 格式：`id｜標題`：它原本在講什麼（1 句）
   - theme / playbook / series / map 格式：`頁面名`：它原本承接什麼問題（1 句）

若這篇價值有限，也請簡短回答上述五點，並標示應停留在哪一層。
若是自動找候選，請先給出你選中的 1 篇與理由，再進入上述五點。
```

## Expected Output

- Ingest verdict
- Single best candidate when applicable
- Core view
- Compare
- Extend
- Taste training note
- Writeback suggestions
- Referenced items

## Notes

- 這個 prompt 的重點不是只做摘要，而是把單篇內容變成可比較、可延伸、可訓練判準的 KB 入口
- 若你後續想把單篇內容提升成主題更新，可接著用 `theme-update`
- 若你後續想把可操作方法抽出，可接著用 `playbook-extraction`
