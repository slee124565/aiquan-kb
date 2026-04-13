---
id: daily-broadcast-ingest-and-discuss
purpose: ingest one daily broadcast into the repo and immediately turn it into a kb-aware discussion that trains daily AI taste through comparison and extension
use_when:
  - a new daily 快刀廣播站 article should enter the repo
  - the user wants both ingest and a discussion based on existing kb context
inputs:
  - source path or broadcast id
  - why it feels important today
  - optional current work context or question
outputs:
  - ingest verdict
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

把單篇日更課文變成：

1. repo-aware ingest
2. kb-aware synthesis
3. comparison-ready output
4. extension-ready output
5. taste-training note
4. 後續 writeback 候選

## Prompt

```md
請處理今天這篇快刀廣播站課文。

來源：______
我今天注意到它，因為 ______。
如果 relevant，我現在的工作 / 關注點是：______。

請先做正常的 repo-aware ingest judgment：
- 檢查 dedupe / registry / 既有 broadcast
- 判斷 raw / broadcast / theme / playbook / series / map 應更新到哪一層

然後不要只回報已收錄，請再結合既有 KB 給我一份用來訓練「每日 AI 訊息品味能力」的輸出，至少回答：

1. Core View
   這篇最重要的 1 到 3 個核心觀點是什麼

2. Compare
   它和 repo 裡哪些 theme / playbook / series / map / 舊 broadcast 最相關
   它是 net-new、revision pressure、series continuation，還是弱訊號
   它修正了我原本哪個判準

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

若這篇價值有限，也請照樣簡短回答上述五點，但清楚標示它應停留在哪一層。
```

## Expected Output

- Ingest verdict
- Core view
- Compare
- Extend
- Taste training note
- Writeback suggestions

## Notes

- 這個 prompt 的重點不是只做摘要，而是把單篇內容變成可比較、可延伸、可訓練判準的 KB 入口
- 若你後續想把單篇內容提升成主題更新，可接著用 `theme-update`
- 若你後續想把可操作方法抽出，可接著用 `playbook-extraction`
