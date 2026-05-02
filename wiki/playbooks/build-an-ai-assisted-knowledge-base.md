# Build An AI-Assisted Knowledge Base

## Summary

這個 playbook 用來把零散輸入轉成可被 AI 檢索、引用、回寫與持續增長的知識庫。

## Use When

- 你想降低 AI 胡說八道的比例
- 你有固定內容輸入，但總是收藏後失聯
- 你想把資料庫變成 agent 可用的長期記憶層

## Workflow

1. 先界定知識庫要服務什麼任務與角色
2. 收進可信來源並保留 provenance
3. 對外部材料先做來源選材：是否有一手觀察、作者動機是否清楚、是否能看見思考證明、是否會改變實際判斷
4. 讓 AI 幫忙做摘要、標籤、初步索引，但不要放棄來源選材判斷
5. 對長訪談、長影片或大型逐字稿庫，先讓 AI 依問題檢索並生成給人讀的訪談筆記，再由人決定是否回看原始材料
6. 當文件量變大時，讓 AI 抽取 entity / concept / relationship / source summary，建立比單篇摘要更適合 agent 檢索的中間索引層
7. 用問題來測試知識庫是否真的可用，而不是只看條目數或知識圖譜是否漂亮
8. 把高價值回答、對比與彙整回寫進知識庫
9. 若知識庫服務醫療、法律、財務等高風險決策，必須額外維護時間線、原始來源、異常標記、待問專家問題與人工核驗結果；AI 的角色是整理與提醒，不是最終裁決

## Signals From Broadcasts

- [416](../broadcasts/416.md)
- [350](../broadcasts/350.md)
- [351](../broadcasts/351.md)
- [393](../broadcasts/393.md)
- [422](../broadcasts/422.md)
- [450](../broadcasts/450.md)
- [786](../broadcasts/786.md)
- [812](../broadcasts/812.md)
- [445](../broadcasts/445.md)
- [473](../broadcasts/473.md)
- [496](../broadcasts/496.md)
- [524](../broadcasts/524.md)
- [553](../broadcasts/553.md)
- [642](../broadcasts/642.md)
- [657](../broadcasts/657.md)
- [682](../broadcasts/682.md)
- [701](../broadcasts/701.md)
- [716](../broadcasts/716.md)
- [834](../broadcasts/834.md)
- [837](../broadcasts/837.md)
- [special-20260429-ai-era-reading-standards](../broadcasts/special-20260429-ai-era-reading-standards.md)
- [special-20260429-ai-knowledge-graph](../broadcasts/special-20260429-ai-knowledge-graph.md)

## Boundaries

- 這不是單一工具操作手冊
- 這也不是只談標籤命名規範的整理指南
- 高風險個人資料庫不能只追求自動化，必須保留專業人士確認與責任邊界
- 知識圖譜不是 source of truth；它是索引與研究導航，關鍵結論仍需回到原文核驗

## Related Pages

- [AI Knowledge Management](../themes/ai-knowledge-management.md)
- [AI Knowledge Management](../maps/ai-knowledge-management.md)
