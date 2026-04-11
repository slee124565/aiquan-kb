# ARCHITECTURE.md

這個 repo 以 `AI学习圈 / 快刀廣播站` 的課程編譯為核心，採六層結構：

- `raw/`
- `wiki/broadcasts/`
- `wiki/themes/`
- `wiki/playbooks/` and `wiki/series/`
- `wiki/maps/`, `index.md`, `log.md`
- `prompts/` and `tools/`

**1. Raw Layer**

`raw/` 放來源材料，預設不可變。

來源通常來自：

- `dedao/快刀廣播站/*.md`
- 手動整理的課程補充材料
- 系列活動的課程文稿

`raw/` 的目的是保留 provenance，不是把它整理成最終知識形態。

**2. Broadcast Layer**

`wiki/broadcasts/` 放單篇廣播或單篇課文的 compiled card。

每張 broadcast card 應回答：

- 這篇在說什麼
- 這篇的主要主張或案例是什麼
- 它主要屬於什麼課程類型
- 哪些內容值得留在單篇層
- 哪些內容應 merge 到 theme / playbook / series

這一層是從 source 到 knowledge 的第一層編譯。

**3. Theme Layer**

`wiki/themes/` 放跨課文穩定主題頁，例如：

- AI 工具使用
- AI 教育
- AI 组织与管理
- AI 落地案例
- AI 知识管理
- AI 风险与治理

theme page 不是課文列表，而是持續被更新的 compiled understanding。

**4. Playbook and Series Layer**

`wiki/playbooks/` 用來維護可重用做法，例如：

- 如何评估一个 AI 工具是否值得上手
- 如何把 AI 引入一个岗位工作流
- 如何组织一次团队内 AI 共学
- 如何从案例里抽出可迁移操作步骤

`wiki/series/` 用來維護 recurring series / 欄目，例如：

- AI龙虾十日谈
- 年度观察
- 周日荐书
- 共读
- 教程上新

這一層的工作是讓 repo 可以同時回答：

- 哪些做法可以反覆重用
- 哪些欄目有長期脈絡
- 單篇新課文應掛在哪條累積鏈上

**5. Navigation and History Layer**

- `wiki/maps/` 是主題入口與學習導航
- `index.md` 是 repo 入口圖
- `log.md` 是 append-only maintenance timeline

`index.md` 應維持薄而穩定，只保留少數 entry points。
`log.md` 只記錄 ingest、merge、review、cleanup，不承擔知識本體。

**6. Interaction Assets Layer**

`prompts/` 放 repo-local prompt assets。
`tools/` 放支援這些 prompt assets 或日常互動的小工具。

這一層不承擔知識本體，也不是 source facts。
它的角色是把高頻 human-agent interaction pattern 外部化，降低每次從零描述任務的成本。

**Canonical Identity Rule**

- 若課文檔名帶有穩定編號，預設以該編號作為 `broadcast_id`
- `broadcast_id` 優先作為 raw 與 broadcast card 的 canonical filename
- 原始中文標題不作為主鍵，只保留在 metadata

這樣能避免：

- 長標題 slug 不穩定
- 簡繁或標點造成 rename noise
- 未來 series / map / backlink 因題目微調而斷裂

**Source of Truth**

- source facts live in `raw/`
- per-broadcast compiled understanding lives in `wiki/broadcasts/`
- cross-broadcast synthesis lives in `wiki/themes/`
- reusable practical patterns live in `wiki/playbooks/`
- recurring column history lives in `wiki/series/`
- entry maps live in `wiki/maps/`
- navigation lives in `index.md`
- history lives in `log.md`
- reusable interaction patterns live in `prompts/`
- helper lookup utilities live in `tools/`

**Lifecycle**

1. source enters `raw/inbox/`
2. source is normalized into `raw/sources/YYYY/`
3. broadcast card is created in `wiki/broadcasts/`
4. reusable claims are merged into `wiki/themes/`
5. reusable methods are extracted into `wiki/playbooks/`
6. recurring-series context is updated in `wiki/series/`
7. topic maps are updated if needed
8. `index.md` and `log.md` are maintained

**Scaling Rule**

- 當某個訊號只屬於單篇課文時，先留在 broadcast layer
- 當某個主題累積到 3 到 5 篇以上時，建立或更新 theme page
- 當某個做法已被不同課文反覆驗證時，建立或更新 playbook
- 當某個欄目已形成穩定脈絡時，建立或更新 series page
- 當某個主題已成為查詢入口時，再建立或重寫 map page
