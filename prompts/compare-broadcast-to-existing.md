---
id: compare-broadcast-to-existing
purpose: compare a new broadcast against existing repo pages and decide whether it is net-new duplicate or revision pressure
use_when:
  - a new source looks similar to existing broadcasts themes or series
inputs:
  - new broadcast or source
  - closest relevant pages in the repo
outputs:
  - difference analysis
  - recommended write target
  - duplicate versus net-new judgment
related_prompts:
  - markdown-broadcast-ingest
  - theme-update
  - series-review
tags:
  - compare
  - broadcast
  - deduplication
---

# Compare Broadcast To Existing

## Use When

當你懷疑一篇新課文與既有內容非常接近，想先做差異判斷。

## Prompt

```md
請比較這篇新課文與 repo 內最接近的 broadcast / theme / playbook / series。

我想知道：
- 它是重複、補強，還是真正新增
- 應該更新哪一層，而不是新增一個近似頁
- 哪些部分只值得留在單篇，哪些應回寫到更高層

請最後給我明確 verdict：
- duplicate
- net-new
- revision pressure
- series continuation
```
