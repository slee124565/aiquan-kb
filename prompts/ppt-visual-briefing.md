---
id: ppt-visual-briefing
purpose: turn recurring presentation-visual tasks into reusable briefs for ChatGPT Images or similar multimodal image tools
use_when:
  - you need a cover visual for a presentation
  - you need an infographic-style slide visual or concept diagram
  - you need a consistent set of presentation visuals across multiple slides
  - you want a reliable starting prompt instead of briefing from scratch
inputs:
  - slide purpose
  - target audience
  - aspect ratio or slide format
  - preferred style and brand constraints
  - optional source text images or reference slides
outputs:
  - first-round visual brief
  - revision instructions
  - reusable prompt skeletons for future slides
related_prompts:
  - playbook-extraction
  - theme-update
  - repo-maintenance-review
tags:
  - prompts
  - ppt
  - visual
  - workflow
  - multimodal
---

# PPT Visual Briefing

## Use When

當你要讓 AI 幫你做簡報主視覺、概念圖、資訊圖初稿或系列配圖，而且你希望先有一個穩定起手式，而不是每次從零描述。

## Prompt

```md
請幫我為一頁簡報生成視覺草稿。

先不要幫我做整份簡報，只處理這一頁。

請根據以下資訊產出一張適合放進 PPT / Keynote 的圖片：

- 頁面目的：______
- 受眾：______
- 投影片比例：16:9 / 4:3 / 其他 ______
- 這一頁要傳達的核心訊息：______
- 視覺類型：封面主視覺 / 章節頁 / 概念圖 / 流程圖 / 資訊圖 / 系列插圖
- 風格方向：專業 / 克制 / 現代 / 溫暖 / 大膽 / 其他 ______
- 品牌或配色限制：______
- 必須保留的留白區：______
- 絕對不要出現的元素：______
- 若有參考素材，請以我上傳的圖片或文字為準

請先給我 1 個最穩妥版本。
要求：
- 構圖適合投影片，不要做成社群貼文感
- 若有文字，請盡量少且清楚
- 視覺重點明確，方便我後續在簡報裡加標題與重點句
- 如果這一頁更適合做成資訊圖或圖解，而不是情境圖，請直接用較適合的形式處理
```

## Variants

### Cover Slide

```md
請為一份 16:9 商務簡報做封面主視覺。
主題：______
受眾：______
風格：專業、克制、現代，不要科幻感，不要機器人濫用意象。
色彩：______
版面：保留左側或右側留白，方便我後續放標題、副標與日期。
請輸出適合直接放進簡報封面的橫式構圖。
```

### Infographic Slide

```md
把以下內容做成一張適合簡報的資訊圖或圖解：
______

要求：
- 只保留 3 到 5 個重點區塊
- 視覺層級清楚
- 字要少，但可讀
- 風格偏商務簡報，不要像社群長圖
- 若有流程關係，請優先做成步驟式或框架式呈現
```

### Visual System For Multiple Slides

```md
延續上一張圖的風格、配色、構圖語言與角色設定，
再幫我做 3 張同系列簡報配圖，分別代表：
1. ______
2. ______
3. ______

要求：
- 三張看起來像同一份簡報裡的系列素材
- 每張重點單一，不要資訊過載
- 保留可放標題與重點句的空間
```

### Local Revision

```md
保留整體構圖、配色和版面不變，只修改以下部分：
______

不要改動：
- ______
- ______

這次修改的目標是：______
```

## Operator Notes

- 真正好用的 brief，不是形容詞越多越好，而是把頁面目的、受眾、比例、留白與限制說清楚。
- 若這頁包含很多精確數字、箭頭、表格或小字，讓 AI 先出結構與視覺方向，最後再回 PowerPoint / Keynote 完稿。
- 若你有現成頁面想延續風格，優先上傳參考圖，通常比追加大量文字更穩。
