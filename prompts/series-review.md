---
id: series-review
purpose: review a recurring course series and compile its accumulated patterns evolution and strongest pages
use_when:
  - the user wants to review a recurring column or series
  - multiple broadcasts belong to the same named series
inputs:
  - target series
  - related broadcasts
outputs:
  - series summary
  - recurring patterns
  - strongest representative broadcasts
  - suggested theme and playbook updates
related_prompts:
  - compare-broadcast-to-existing
  - theme-update
  - repo-maintenance-review
tags:
  - series
  - review
  - synthesis
---

# Series Review

## Use When

當你要回顧某個 recurring series，例如 `AI龙虾十日谈`、`周日荐书`、`年度观察`。

## Prompt

```md
請 review 這個 series 的累積脈絡。

系列：______

請幫我回答：
- 這個系列在做什麼
- 它反覆出現哪些觀察、方法或框架
- 哪幾篇是代表作
- 哪些內容值得提升成 theme 或 playbook
- 目前 series page 還缺什麼

引用代表性 broadcasts 時，不要只寫 id。
- 至少寫成：`id｜原標題`
- 並補 1 句說明它原本在講什麼
- 若引用 theme / playbook，也補 1 句說明該頁原本承接什麼問題

若正文列出多篇代表作，請在文末補 `Referenced Items` 區塊集中解碼。
```
