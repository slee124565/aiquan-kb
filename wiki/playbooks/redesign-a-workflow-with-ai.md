# Redesign A Workflow With AI

## Summary

這個 playbook 用來把既有工作流程從「局部提速」推進到「結構性重設」。

## Use When

- 現有流程已經有 AI 參與，但仍然卡在大量切換、複製貼上與人工拼接
- 想判斷一個任務應該局部自動化，還是整條流程重畫
- 想把案例型分享萃取成可複製方法

## Workflow

1. 先完整描述現有的人肉流程
2. 找出其中高頻、重複、耗時且可明確描述的環節
3. 判斷哪些環節交給 AI，哪些保留給人
4. 若任務高度依賴專家判斷，先抽出專家會看哪些中間線索、如何拆解問題，再把這套骨架交給 AI，而不是直接要求模型端到端給答案
5. 重新設計流程，而不是把舊 SOP 原樣搬進 AI
6. 用小規模試點驗證是否真的節省時間、改善質量或提升可用性
7. 若流程卡在業務與技術彼此聽不懂，先明確指定誰負責把場景、ROI、例外條件與技術約束互相翻譯，不要把這層工作默認成零成本
8. 若場景受限或高風險，補上 rule engine、告警與人工邊界，不把所有判斷責任壓在模型上
9. 在探索型任務中，保留多樣候選與非最優方案，避免流程過早鎖死在單一路徑
10. 若流程的痛點來自一線執行不穩、偷懶或尋租，不要只優化前台介面，應把提醒、驗證、派單與異常升級一起重畫
11. 若流程涉及金流、對帳、合規或其他高問責任務，優先把工作拆成可驗證的原子任務，讓確定性規則、專屬模型與人工例外處理共同承擔責任，而不是把整題丟給通用模型自由發揮
12. 若任務已有穩定資料流、感測能力與清楚回饋，不要預設 AI 只能當助手；可以先讓 AI 做一線決策，再把人工介入收斂到模型看不見的上下文，例如天氣、政策、突發事件與現場異常
13. 若視覺或內容流程目前卡在 `生成草稿 -> 手工加字 -> 手動補版 -> 修多圖一致性` 這類碎裂交接，應專門測試新工具能否把它壓縮成 `briefing -> AI 初稿 -> human QA`，再決定是否重畫角色分工
14. 若流程是醫療照護、法律、財務等高風險個人決策，不要把 AI 放在最終決策位；先把資料匯入、時間線、異常提示、待問專家問題、第二意見與人工核驗重畫成一條可追溯流程
15. 若流程是內容生產或跨部門創作，不要只問 AI 能否直接替你完成成品；先找能把模糊意圖變成可討論中間物的節點，例如選題搜索、封面參考、分鏡影片、語音節奏稿、摳像、資料儀表盤與內部工具，再保留真人判斷、真實拍攝和最終審稿

## Signals From Broadcasts

- [399](../broadcasts/399.md)
- [405](../broadcasts/405.md)
- [414](../broadcasts/414.md)
- [427](../broadcasts/427.md)
- [358](../broadcasts/358.md)
- [367](../broadcasts/367.md)
- [368](../broadcasts/368.md)
- [372](../broadcasts/372.md)
- [409](../broadcasts/409.md)
- [450](../broadcasts/450.md)
- [543](../broadcasts/543.md)
- [573](../broadcasts/573.md)
- [603](../broadcasts/603.md)
- [783](../broadcasts/783.md)
- [802](../broadcasts/802.md)
- [816](../broadcasts/816.md)
- [817](../broadcasts/817.md)
- [821](../broadcasts/821.md)
- [377](../broadcasts/377.md)
- [462](../broadcasts/462.md)
- [484](../broadcasts/484.md)
- [503](../broadcasts/503.md)
- [504](../broadcasts/504.md)
- [515](../broadcasts/515.md)
- [517](../broadcasts/517.md)
- [521](../broadcasts/521.md)
- [528](../broadcasts/528.md)
- [568](../broadcasts/568.md)
- [569](../broadcasts/569.md)
- [592](../broadcasts/592.md)
- [599](../broadcasts/599.md)
- [617](../broadcasts/617.md)
- [632](../broadcasts/632.md)
- [634](../broadcasts/634.md)
- [640](../broadcasts/640.md)
- [645](../broadcasts/645.md)
- [652](../broadcasts/652.md)
- [666](../broadcasts/666.md)
- [687](../broadcasts/687.md)
- [694](../broadcasts/694.md)
- [699](../broadcasts/699.md)
- [704](../broadcasts/704.md)
- [820](../broadcasts/820.md)
- [823](../broadcasts/823.md)
- [825](../broadcasts/825.md)
- [826](../broadcasts/826.md)
- [829](../broadcasts/829.md)
- [834](../broadcasts/834.md)
- [special-20260428-mediastorm-ai-production-workflow](../broadcasts/special-20260428-mediastorm-ai-production-workflow.md)

## Boundaries

- 不是所有流程都適合弱約束 goal-first 設計
- 高風險、強合規環節仍可能需要明確 SOP 與驗證節點
- 若沒有明確的翻譯層角色，再好的模型與流程圖也可能卡死在導入期
- 個人高風險流程的核心不是省掉專業人士，而是讓非專業使用者更早整理問題、發現異常，並帶著可核驗材料回到專業系統
- 內容團隊不能把內部參考物和最終觀眾可見成品混為一談；AI 可以降低對齊成本，但不自動替代品牌信任與真實體驗

## Related Pages

- [AI Workplace Adoption](../themes/ai-workplace-adoption.md)
- [AI Workflows And Productivity](../maps/ai-workflows-and-productivity.md)
