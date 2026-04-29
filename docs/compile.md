# Compile Workflow

**目標**

把單篇課文或外部 AI 案例編譯成可重用知識，而不是停在摘要。

**Broadcast Card 應包含**

- source metadata
- content type
- main claims
- why it matters
- practical takeaways
- relation to existing themes / playbooks / series
- tensions or disagreements
- open questions
- merge candidates

**編譯步驟**

1. 讀 `raw/` 原始來源
2. 查 `index.md` 找既有主題入口
3. 讀相關 `wiki/themes/`、`wiki/playbooks/`、`wiki/series/`、`wiki/maps/`
4. 建立或更新 `wiki/broadcasts/*.md`
5. 將可重用內容 merge 回對應 theme pages
6. 將可操作方法整理回對應 playbooks
7. 若屬於 recurring column，更新 series page
8. 若此來源改變某個主題的入口結構，再更新 map page

**判斷規則**

- 單篇內容只屬於自身脈絡：停留在 broadcast card
- 可跨 2 篇以上課文重用：寫進 theme page
- 可反覆執行的方法：寫進 playbook
- 屬於欄目連載脈絡：寫進 series page
- 已成為查詢入口：寫進 map page
- 外部案例必須先證明它補強既有 theme / playbook / map；單篇外部案例不應直接開新 theme

**避免事項**

- 不要把 broadcast card 寫成 raw source 的改寫版
- 不要把 theme page 寫成課文列表
- 不要把 playbook 寫成單篇案例摘要
- 不要讓 `index.md` 承擔詳細知識內容
- 不要讓 `external-case-study` 變成泛用剪藏；它必須帶來可比較、可回寫的案例訊號
