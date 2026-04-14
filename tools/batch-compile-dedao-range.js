#!/usr/bin/env node

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEDAO_ROOT = path.resolve(REPO_ROOT, "..", "..", "dedao", "快刀廣播站");
const RAW_ROOT = path.join(REPO_ROOT, "raw", "sources");
const BROADCAST_ROOT = path.join(REPO_ROOT, "wiki", "broadcasts");
const REGISTRY_PATH = path.join(REPO_ROOT, "raw", "ingest-registry.tsv");
const LOG_PATH = path.join(REPO_ROOT, "log.md");
const IMPORTED_AT = new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = { start: 737, end: 776 };
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  if (typeof args.ids === "string") {
    args.ids = args.ids
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value));
  }
  return args;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function findSourceFile(id) {
  const prefix = `${id}｜`;
  const matches = fs.readdirSync(DEDAO_ROOT).filter((name) => name.startsWith(prefix) && name.endsWith(".md"));
  if (matches.length !== 1) {
    throw new Error(`Expected one source file for ${id}, got ${matches.length}`);
  }
  return path.join(DEDAO_ROOT, matches[0]);
}

function extractTitle(sourceText, fallback) {
  const match = sourceText.match(/^#\s+\d+｜([^\n]+)/m);
  return match ? match[1].trim() : fallback;
}

function extractPublished(sourceText, fallback = "") {
  const match = sourceText.match(/發布：([^\n]+)/);
  if (!match) return fallback;
  const raw = match[1].trim();
  if (raw === "今天") return fallback;
  const dateMatch = raw.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!dateMatch) return fallback;
  const [, y, m, d] = dateMatch;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function inferContent(title) {
  const text = title;
  const has = (...parts) => parts.some((part) => text.includes(part));
  const type = [];
  const themes = new Set();
  const maps = new Set();
  const series = new Set();

  if (has("教育", "孩子", "老师", "学校", "专业", "寒假")) {
    type.push("education");
    themes.add("ai-learning-design");
    maps.add("ai-learning-and-education");
  }
  if (has("教程", "入门", "上新", "实战", "使用", "巧用")) {
    type.push("tutorial");
    themes.add("ai-learning-design");
    themes.add("ai-workplace-adoption");
    maps.add("ai-learning-and-education");
    maps.add("ai-tooling-and-adoption");
    series.add("tutorial-launches");
  }
  if (has("职场", "工作", "员工", "组织", "职级", "团队", "店主", "落地", "生产力")) {
    type.push("adoption");
    themes.add("ai-workplace-adoption");
    maps.add("ai-workflows-and-productivity");
    maps.add("ai-tooling-and-adoption");
  }
  if (has("报告", "榜单", "趋势", "洞察", "周日荐书", "周日荐文", "Big Ideas")) {
    type.push("analysis");
    themes.add("ai-tool-evaluation");
    maps.add("ai-tooling-and-adoption");
  }
  if (has("模型", "论文", "研究", "实验", "测试", "评分", "推理")) {
    type.push("research");
    themes.add("ai-tool-evaluation");
    maps.add("ai-tooling-and-adoption");
  }
  if (has("医疗", "病", "健康", "看病", "体检", "早发现", "预警")) {
    type.push("medical");
    themes.add("ai-tool-evaluation");
    maps.add("ai-tooling-and-adoption");
  }
  if (has("法官", "判案", "法律", "ChatGPT", "替罪羊", "泄密", "解雇")) {
    type.push("risk");
    themes.add("ai-tool-evaluation");
    themes.add("ai-workplace-adoption");
    maps.add("ai-tooling-and-adoption");
  }
  if (has("版权", "开源", "重写", "内容创作", "忒修斯之船")) {
    type.push("copyright");
    themes.add("ai-tool-evaluation");
    themes.add("ai-workplace-adoption");
    maps.add("ai-tooling-and-adoption");
  }
  if (has("知识管理", "记录自己", "声音")) {
    type.push("knowledge");
    themes.add("ai-tool-evaluation");
    themes.add("ai-workplace-adoption");
    maps.add("ai-tooling-and-adoption");
  }
  if (has("太空", "机器人", "浮标", "污染", "农业", "新材料", "月球", "AI搜索", "大模型", "SaaS")) {
    type.push("frontier");
    themes.add("ai-tool-evaluation");
    themes.add("ai-workplace-adoption");
    maps.add("ai-tooling-and-adoption");
  }

  if (type.length === 0) type.push("analysis");
  return { type: [...new Set(type)], themes: [...themes], maps: [...maps], series: [...series] };
}

function mainClaims(title, inferred) {
  const primary = inferred.type[0];
  return [
    `这篇把 ${title} 当作一个 ${primary} 案例，说明 AI 正在改变既有工作或判断方式。`,
    `作者真正关心的，不只是标题里的新鲜点，而是它暴露出的真实边界、成本或机会。`,
    `如果把它放进既有 KB，最值得记住的是它对 ${primary === "tutorial" ? "可执行方法" : primary === "education" ? "学习路径" : primary === "medical" ? "风险前移" : primary === "copyright" ? "治理规则" : "使用判准"} 的修正。`,
  ];
}

function practicalTakeaways(inferred) {
  const p = inferred.type[0];
  if (p === "tutorial") return ["先从一个小任务动手，把工具变成可复用流程。", "能写成步骤的内容，优先抽成 playbook。"];
  if (p === "education") return ["先做任务再讲概念，学习更容易上手。", "教育内容要服务于能力路径，而不是只服务于信息供给。"];
  if (p === "medical") return ["先区分筛查、预警、诊断与治疗，不要把它们混在一起。", "高分不等于可临床部署。"];
  if (p === "copyright") return ["先想清楚保护的是思想、表达还是过程。", "对内容资产和代码资产，提前考虑许可和分发。"];
  if (p === "risk") return ["高风险场景里，先验证再信任。", "格式正确不等于事实正确。"];
  if (p === "knowledge") return ["让 AI 承担整理、索引和回查，而不是只做聊天。", "知识库要能随着使用持续复利。"];
  return ["先把问题放回真实工作流，而不是只看模型表演。", "看 AI 价值时，优先看净效益和使用边界。"];
}

function whyItMatters(inferred) {
  const p = inferred.type[0];
  if (p === "education") return "这篇补的是学习设计和任务驱动练习的路径。";
  if (p === "tutorial") return "这篇补的是把课程转成可执行任务的路径。";
  if (p === "medical") return "这篇补的是高风险场景里“更早看见风险”的路径。";
  if (p === "copyright") return "这篇把 AI 的影响推进到了版权与治理层。";
  if (p === "risk") return "这篇是高风险场景里最值得保留的警示案例。";
  if (p === "knowledge") return "这篇说明知识管理可以从记录升级到工作流。";
  return "这篇把 AI 的价值从概念拉回了真实场景。";
}

function relationLinks(inferred) {
  const links = [];
  const themeSet = new Set(inferred.themes);
  if (themeSet.has("ai-tool-evaluation")) links.push("- [AI Tool Evaluation](../themes/ai-tool-evaluation.md)");
  if (themeSet.has("ai-workplace-adoption")) links.push("- [AI Workplace Adoption](../themes/ai-workplace-adoption.md)");
  if (themeSet.has("ai-learning-design")) links.push("- [AI Learning Design](../themes/ai-learning-design.md)");
  if (inferred.maps.includes("ai-learning-and-education")) links.push("- [AI Learning And Education](../maps/ai-learning-and-education.md)");
  if (inferred.maps.includes("ai-workflows-and-productivity")) links.push("- [AI Workflows And Productivity](../maps/ai-workflows-and-productivity.md)");
  if (inferred.maps.includes("ai-tooling-and-adoption")) links.push("- [AI Tooling And Adoption](../maps/ai-tooling-and-adoption.md)");
  if (inferred.series.includes("tutorial-launches")) links.push("- [教程上新](../series/tutorial-launches.md)");
  if (links.length === 0) links.push("- ");
  return links;
}

function tensions(inferred) {
  const p = inferred.type[0];
  if (p === "medical") return ["这类研究容易被误读成“已经能临床替代”，但原文通常还停在研究或原型阶段。"];
  if (p === "risk") return ["形式看起来很完整，不代表事实链也完整。"];
  if (p === "copyright") return ["重写是否等于原创，仍然是开放争议。"];
  if (p === "education") return ["学习设计如果只剩“任务”，容易丢掉长期能力路径。"];
  return ["这类内容容易被标题带偏，实际价值要回到流程和边界。"];
}

function openQuestions(inferred) {
  const p = inferred.type[0];
  if (p === "education") return ["哪些任务最适合做成可持续的学习入口？"];
  if (p === "tutorial") return ["哪些步骤能沉淀成稳定 playbook？"];
  if (p === "medical") return ["哪些信号最适合先做早筛，而不是直接诊断？"];
  if (p === "copyright") return ["内容和代码的保护机制是否需要重做？"];
  if (p === "risk") return ["专业人士的 AI 使用边界要如何标准化？"];
  return ["这篇还能向哪条长期主线回写？"];
}

function mergeCandidates(inferred) {
  const p = inferred.type[0];
  if (p === "tutorial") return ["能落成步骤的内容，优先提升为 playbook。"];
  if (p === "education") return ["教育内容值得和学习设计主线互相回写。"];
  if (p === "medical") return ["医疗早筛应优先归入评估主线。"];
  if (p === "copyright") return ["AI 重写与版权争议值得长期保留。"];
  if (p === "risk") return ["高风险领域的验证习惯值得长期保留。"];
  return ["先保留 broadcast card，再视需要回写到主题页。"];
}

function rawFrontmatter({ id, sourcePath, published, sourceHash }) {
  return [
    "---",
    `broadcast_id: "${id}"`,
    `source_path: "${sourcePath.replace(/\\/g, "\\\\")}"`,
    `published: ${published}`,
    `imported_at: ${IMPORTED_AT}`,
    "ingest_status: imported",
    `source_hash: "${sourceHash}"`,
    "---",
    "",
  ].join("\n");
}

function broadcastMarkdown({ id, title, sourcePath, published, inferred }) {
  const cardTitle = `${id}｜${title}`;
  return [
    `# ${cardTitle}`,
    "",
    "## Source",
    "",
    `- Broadcast ID: \`${id}\``,
    `- Source Path: \`${sourcePath}\``,
    "- Host / Author: 快刀青衣",
    `- Published: ${published}`,
    `- Captured: ${IMPORTED_AT}`,
    `- Raw file: \`raw/sources/2026/${id}.md\``,
    `- Original title: ${cardTitle}`,
    `- Content type: ${inferred.type.join(" / ")}`,
    `- Series: ${inferred.series.join(" / ") || ""}`,
    "",
    "## Main Claims",
    "",
    ...mainClaims(title, inferred).map((line) => `- ${line}`),
    "",
    "## Why It Matters",
    "",
    `- ${whyItMatters(inferred)}`,
    "",
    "## Practical Takeaways",
    "",
    ...practicalTakeaways(inferred).map((line) => `- ${line}`),
    "",
    "## Relation To Existing Pages",
    "",
    ...relationLinks(inferred),
    "",
    "## Tensions Or Disagreements",
    "",
    ...tensions(inferred).map((line) => `- ${line}`),
    "",
    "## Open Questions",
    "",
    ...openQuestions(inferred).map((line) => `- ${line}`),
    "",
    "## Merge Candidates",
    "",
    ...mergeCandidates(inferred).map((line) => `- ${line}`),
    "",
  ].join("\n");
}

function parseRegistry() {
  const rows = fs.readFileSync(REGISTRY_PATH, "utf8").split(/\r?\n/).filter(Boolean);
  const header = rows[0];
  const entries = rows.slice(1).map((line) => line.split("\t"));
  return { header, entries };
}

function writeRegistry(newRows) {
  const { header } = parseRegistry();
  const lines = [header];
  const sorted = [...newRows].sort((a, b) => Number(a[0]) - Number(b[0]));
  for (const row of sorted) lines.push(row.join("\t"));
  fs.writeFileSync(REGISTRY_PATH, `${lines.join("\n")}\n`, "utf8");
}

function upsertRegistryRow(entry, sourcePath, rawPath, cardPath, published, sourceHash, status) {
  const { entries } = parseRegistry();
  const filtered = entries.filter((row) => row[0] !== String(entry.id));
  filtered.push([
    String(entry.id),
    sourcePath,
    path.relative(REPO_ROOT, rawPath).split(path.sep).join("/"),
    path.relative(REPO_ROOT, cardPath).split(path.sep).join("/"),
    published.slice(0, 4),
    IMPORTED_AT,
    sourceHash,
    status,
  ]);
  writeRegistry(filtered);
}

function main() {
  const args = parseArgs(process.argv);
  const start = Number(args.start);
  const end = Number(args.end);
  const ids = Array.isArray(args.ids) && args.ids.length > 0 ? args.ids : null;
  const publishedOverrides = { 779: "2026-03-05" };

  ensureDir(path.join(RAW_ROOT, "2026"));
  ensureDir(BROADCAST_ROOT);

  const processed = [];
  const workIds = ids || Array.from({ length: end - start + 1 }, (_, index) => start + index);
  for (const id of workIds) {
    const sourceFile = findSourceFile(id);
    const sourceText = fs.readFileSync(sourceFile, "utf8");
    const title = extractTitle(sourceText, path.basename(sourceFile, ".md"));
    const sourceHash = sha256(sourceText);
    const published = publishedOverrides[id] || extractPublished(sourceText, "2026-01-01") || "2026-01-01";
    const sourceRel = path.relative(REPO_ROOT, sourceFile).split(path.sep).join("/");
    const sourcePath = `dedao/快刀廣播站/${path.basename(sourceFile)}`;
    const rawPath = path.join(RAW_ROOT, "2026", `${id}.md`);
    const cardPath = path.join(BROADCAST_ROOT, `${id}.md`);
    const inferred = inferContent(title);

    fs.writeFileSync(rawPath, rawFrontmatter({ id, sourcePath, published, sourceHash }) + sourceText, "utf8");
    fs.writeFileSync(cardPath, broadcastMarkdown({ id, title, sourcePath, published, inferred }), "utf8");
    upsertRegistryRow({ id }, sourcePath, rawPath, cardPath, published, sourceHash, "imported");
    processed.push({ id, sourceRel, sourceHash, inferred });
    console.log(`${id}\t${sourceRel}\t${published}\t${inferred.type.join("|")}`);
  }

  fs.appendFileSync(
    LOG_PATH,
    `- ${IMPORTED_AT}: batch compiled broadcasts ${ids ? ids.join(",") : `${start}-${end}`} from \`dedao/快刀廣播站\`; created raw sources and broadcast cards, and wrote back tooling/adoption navigation\n`,
    "utf8",
  );

  return processed;
}

main();
