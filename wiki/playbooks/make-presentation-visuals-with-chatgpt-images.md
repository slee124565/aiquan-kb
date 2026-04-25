# Make Presentation Visuals With ChatGPT Images

## Summary

這個 playbook 用來把 `ChatGPT Images` 這類多模態生圖能力，穩定接進日常 `PPT` 製作流程，讓它主要負責主視覺、概念圖、資訊圖初稿與系列配圖，而把最後完稿留在 PowerPoint / Keynote。

## Use When

- 你要做簡報封面、章節頁、概念圖、流程圖、資訊圖或系列插圖
- 你希望把 `找圖 -> 修圖 -> 手工補版 -> 反覆改風格` 壓縮成 `briefing -> AI 初稿 -> human QA`
- 你已經有簡報內容，但不想從零畫每一頁的視覺
- 你想把一組零散需求先變成可比較的 2 到 3 個視覺方向

## Workflow

1. 先界定這一頁真正要承擔的任務：是封面吸引注意、解釋概念、呈現流程，還是幫觀眾建立情境。
2. 每次只 brief 一種頁型，不要一開始就要求模型做整份簡報。
3. 先提供任務目的、受眾、頁面比例、風格方向、品牌色與必須保留的留白區，再要求它做第一版。
4. 若你要做成套頁面，盡量在同一個對話裡延續風格，讓模型沿用同一組配色、構圖語言與角色設定。
5. 若你有現成照片、截圖、草圖或前一頁樣式，直接上傳當 reference，不要只靠文字描述。
6. 對資訊圖、流程圖與重文字頁，先讓 AI 做結構與視覺草稿，再回到 PowerPoint / Keynote 補精確文字、數字、對齊與公司字型。
7. 第二輪修改時，只改一到兩個變數，例如 `改成更專業`、`保留構圖但換成深藍配色`，避免一次重寫所有要求。
8. 若只是局部有問題，優先做局部修圖，不要整張重生。
9. 把最終角色收斂成人類的 `選版本 + 校文字 + 對齊品牌 + 檢查數字`，不要把最後責任交給模型。
10. 若某個頁型會反覆出現，例如封面頁、三段式資訊圖、章節分隔頁，就把這次成功 brief 抽成 prompt asset，下次直接重用。

## Signals From Broadcasts

- [414](../broadcasts/414.md)
- [829](../broadcasts/829.md)

## Boundaries

- 不要把它當成最終排版工具；很多小字、精準表格、複雜箭頭標註與公司模板細節，仍應回到 PowerPoint / Keynote 處理。
- 若頁面包含財務數字、法務用語、醫療資訊或高風險對外內容，AI 只能先出草稿，不能直接當最終版。
- 若品牌規範極嚴格，先把它用在探索方向與初稿產出，不要預設它能一次命中所有企業模板細節。
- 若素材涉及機密文件、未公開產品畫面或敏感客戶資料，先確認你的工作環境與資料使用規範允許這種上傳方式。
- 這個 playbook 吸收了 repo 內 `414｜直播分享：手把手教你用“DeepSeek+飞书”高效生产文案、PPT` 與 `829｜ChatGPT最新生图模型三大发现：AI第一次从包工头变成建筑设计师` 的 workflow 訊號，也包含針對 OpenAI 當前產品能力的操作性判斷；若產品能力改版，應重新驗證再沿用。

## Related Pages

- [Evaluate A New AI Tool](evaluate-a-new-ai-tool.md)
- [Redesign A Workflow With AI](redesign-a-workflow-with-ai.md)
- [AI Workflows And Productivity](../maps/ai-workflows-and-productivity.md)
- [AI Workplace Adoption](../themes/ai-workplace-adoption.md)
