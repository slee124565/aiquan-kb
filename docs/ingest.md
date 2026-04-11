# Ingest Workflow

**目標**

把 `快刀廣播站` 新課文穩定地從「剛看到」推進到「已納入知識庫」。

**日更流程**

1. 從 `dedao/快刀廣播站/{basename}.md` 選出要匯入的來源
2. 判斷 `broadcast_id`
   - 預設取檔名開頭數字
   - 若沒有穩定數字，改用 `special-YYYYMMDD-<slug>`
3. 將來源複製到 `raw/inbox/` 或 `raw/sources/YYYY/`
4. 補最小 metadata
   - title
   - broadcast_id
   - source path
   - author / host if known
   - published date if known
   - captured date
   - series hint if known
   - theme hint if known
5. 在 `wiki/broadcasts/` 建立對應 broadcast card
6. 更新相關 `wiki/themes/`、`wiki/playbooks/` 或 `wiki/series/`
7. 在 `log.md` append 一條簡短紀錄

**命名建議**

- raw source:
  `raw/sources/2026/812.md`
- broadcast card:
  `wiki/broadcasts/812.md`

**保留標準**

以下情況值得 ingest：

- 對 AI 工具、工作流、教育、產品或組織有可重用觀察
- 提供新的案例、框架或實操方法
- 對課程既有主題有增量或修正壓力
- 屬於重要欄目或長期值得追的系列

以下情況可先留在 inbox，不急著編譯：

- 純公告且缺少長期知識價值
- 與既有內容重複度很高
- 暫時看不出對 theme / playbook / series 有何影響
