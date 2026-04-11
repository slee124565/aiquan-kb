---
id: daily-broadcast-ingest-and-discuss
purpose: ingest one daily broadcast into the repo and immediately turn it into a kb-aware discussion about core ideas personal value and next questions
use_when:
  - a new daily 快刀廣播站 article should enter the repo
  - the user wants both ingest and a discussion based on existing kb context
inputs:
  - source path or broadcast id
  - why it feels important today
  - optional current work context or question
outputs:
  - ingest verdict
  - core views
  - relation to existing kb
  - likely value to the user
  - discussion hooks
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
---

# Daily Broadcast Ingest And Discuss

## Use When

當你今天只有一篇新的 `快刀廣播站` 課文，想讓 agent 不只收錄，還要立刻結合既有 KB 跟你討論這篇內容對你有什麼用。

## Goal

把單篇日更課文變成：

1. repo-aware ingest
2. kb-aware synthesis
3. discussion-ready output
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

然後不要只回報已收錄，請再結合既有 KB 給我一份 discussion-ready output，至少回答：

1. Core View
   這篇最重要的 3 到 5 個核心觀點是什麼

2. Relation To Existing KB
   它和 repo 裡哪些 theme / playbook / series / map / 舊 broadcast 最相關

3. Why It Might Matter To Me
   如果結合我目前的關注脈絡，這篇最可能對我有價值的方向是什麼

4. Practical Use
   如果我要今天就把這篇用起來，最值得採取的 1 到 3 個用法是什麼

5. Discussion Hooks
   接下來最值得繼續問你的 3 到 5 個問題是什麼

6. Writeback Suggestion
   哪些內容只該留在 broadcast card
   哪些值得進一步 merge 到 theme / playbook / series / map

若這篇價值有限，也請照樣簡短回答上述六點，但清楚標示它應停留在哪一層。
```

## Expected Output

- Ingest verdict
- Core views
- Related kb pages
- Likely user value
- Practical uses
- Discussion hooks
- Writeback suggestions

## Notes

- 這個 prompt 的重點不是只做摘要，而是把單篇內容變成可延續討論的 KB 入口
- 若你後續想把單篇內容提升成主題更新，可接著用 `theme-update`
- 若你後續想把可操作方法抽出，可接著用 `playbook-extraction`
