#!/usr/bin/env node

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("playwright-core");

const CHROME_EXECUTABLE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CHROME_USER_DATA_ROOT = path.join(os.homedir(), "Library", "Application Support", "Google", "Chrome");
const LOCAL_STATE_PATH = path.join(CHROME_USER_DATA_ROOT, "Local State");
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const WORKSPACE_ROOT = path.resolve(REPO_ROOT, "..", "..");
const APP_STATE_ROOT = path.join(os.homedir(), "Library", "Application Support", "aiquan-kb", "dedao-browser-ingest");
const RAW_ROOT = path.join(REPO_ROOT, "raw");
const RAW_SOURCES_ROOT = path.join(RAW_ROOT, "sources");
const REGISTRY_PATH = path.join(RAW_ROOT, "ingest-registry.tsv");
const STATE_PATH = path.join(APP_STATE_ROOT, "state.json");
const AUTOMATION_PROFILE_DIR = path.join(APP_STATE_ROOT, "chrome-user-data");
const RUNS_DIR = path.join(APP_STATE_ROOT, "runs");
const REGISTRY_HEADERS = [
  "broadcast_id",
  "source_path",
  "raw_file",
  "broadcast_card",
  "year",
  "imported_at",
  "source_hash",
  "status",
];

function parseArgs(argv) {
  const args = {};
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
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function sanitizeText(value) {
  return String(value || "")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, " ")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 120);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function timestampSlug() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const sec = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}${sec}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function normalizePathForStorage(filePath) {
  try {
    return path.relative(process.cwd(), filePath) || ".";
  } catch (_) {
    return filePath;
  }
}

function normalizeUrlForMatch(value) {
  try {
    const parsed = new URL(value);
    parsed.hash = "";
    return parsed.toString();
  } catch (_) {
    return String(value || "");
  }
}

async function waitForJsonVersion(port, timeoutMs = 20000) {
  const startedAt = Date.now();
  const url = `http://127.0.0.1:${port}/json/version`;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch (_) {
      // keep polling
    }
    await sleep(500);
  }

  throw new Error(`Chrome remote debugging port ${port} 未就緒`);
}

function buildDebugPortHelp(port, userDataDir) {
  return [
    `找不到 automation Chrome 的 remote debugging port ${port}。`,
    "這個工具現在依賴專用 browser profile，而不是你正在使用的預設 Chrome。",
    `預設 user data dir: ${userDataDir}`,
    "若是首次執行，請先用 --launch-only 啟動該 profile 並手動登入 Dedao。",
  ].join("\n");
}

function removeIfExists(targetPath) {
  if (!fs.existsSync(targetPath)) return;
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function sanitizeClonedProfile(userDataDir, profileDirectory) {
  const profileRoot = path.join(userDataDir, profileDirectory);
  const preferencesPath = path.join(profileRoot, "Preferences");

  if (fs.existsSync(preferencesPath)) {
    const preferences = readJson(preferencesPath);
    preferences.profile = preferences.profile || {};
    preferences.profile.exit_type = "Normal";
    preferences.profile.exited_cleanly = true;
    fs.writeFileSync(preferencesPath, JSON.stringify(preferences), "utf8");
  }

  removeIfExists(path.join(profileRoot, "Sessions"));
  for (const name of ["Current Session", "Current Tabs", "Last Session", "Last Tabs"]) {
    removeIfExists(path.join(profileRoot, name));
  }
}

function cloneChromeProfile({ sourceProfileDirectory, targetUserDataDir, targetProfileDirectory }) {
  const sourceProfileDir = path.join(CHROME_USER_DATA_ROOT, sourceProfileDirectory);
  const targetProfileDir = path.join(targetUserDataDir, targetProfileDirectory);

  if (!fs.existsSync(sourceProfileDir)) {
    throw new Error(`找不到 source Chrome profile directory: ${sourceProfileDir}`);
  }
  if (!fs.existsSync(LOCAL_STATE_PATH)) {
    throw new Error(`找不到 Chrome Local State: ${LOCAL_STATE_PATH}`);
  }

  ensureDir(targetUserDataDir);
  fs.copyFileSync(LOCAL_STATE_PATH, path.join(targetUserDataDir, "Local State"));

  const firstRunPath = path.join(CHROME_USER_DATA_ROOT, "First Run");
  if (fs.existsSync(firstRunPath)) {
    fs.copyFileSync(firstRunPath, path.join(targetUserDataDir, "First Run"));
  }

  removeIfExists(targetProfileDir);
  fs.cpSync(sourceProfileDir, targetProfileDir, {
    recursive: true,
    force: true,
    dereference: true,
  });

  sanitizeClonedProfile(targetUserDataDir, targetProfileDirectory);
}

function launchChrome({ port, url, userDataDir }) {
  if (!fs.existsSync(CHROME_EXECUTABLE)) {
    throw new Error(`找不到 Chrome executable: ${CHROME_EXECUTABLE}`);
  }

  ensureDir(userDataDir);
  const args = [
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${port}`,
    "--hide-crash-restore-bubble",
    "--new-window",
    url,
  ];

  const child = spawn(CHROME_EXECUTABLE, args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

async function ensureAutomationChrome({ port, url, userDataDir }) {
  try {
    await waitForJsonVersion(port, 1500);
    return { launched: false };
  } catch (_) {
    launchChrome({ port, url, userDataDir });
    try {
      await waitForJsonVersion(port, 20000);
      return { launched: true };
    } catch (_) {
      throw new Error(buildDebugPortHelp(port, userDataDir));
    }
  }
}

async function findOrCreateTargetPage(context, targetUrl) {
  const normalizedTarget = normalizeUrlForMatch(targetUrl);

  for (const page of context.pages()) {
    if (normalizeUrlForMatch(page.url()) === normalizedTarget) {
      return page;
    }
  }

  for (const page of context.pages()) {
    if (page.url().includes("dedao.cn")) {
      return page;
    }
  }

  return context.pages()[0] || context.newPage();
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`registry not found: ${REGISTRY_PATH}`);
  }

  const lines = fs.readFileSync(REGISTRY_PATH, "utf8").split(/\r?\n/).filter(Boolean);
  const header = lines[0].split("\t");
  const rows = lines.slice(1).map((line) => {
    const values = line.split("\t");
    const row = {};
    header.forEach((key, index) => {
      row[key] = values[index] || "";
    });
    return row;
  });

  const byBroadcastId = new Map(rows.map((row) => [row.broadcast_id, row]));
  return { header, rows, byBroadcastId };
}

function writeRegistry(registry) {
  const header = registry.header.length ? registry.header : REGISTRY_HEADERS;
  const lines = [
    header.join("\t"),
    ...registry.rows.map((row) => header.map((key) => row[key] || "").join("\t")),
  ];
  fs.writeFileSync(REGISTRY_PATH, `${lines.join("\n")}\n`, "utf8");
}

function upsertRegistryRow(registry, nextRow) {
  const existingIndex = registry.rows.findIndex((row) => row.broadcast_id === nextRow.broadcast_id);
  const normalizedRow = {};
  for (const key of REGISTRY_HEADERS) normalizedRow[key] = nextRow[key] || "";

  if (existingIndex >= 0) {
    registry.rows[existingIndex] = normalizedRow;
  } else {
    registry.rows.push(normalizedRow);
  }
  registry.byBroadcastId.set(normalizedRow.broadcast_id, normalizedRow);
}

function loadState() {
  return readJsonIfExists(STATE_PATH, {});
}

function saveState(state) {
  ensureDir(path.dirname(STATE_PATH));
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

function getSessionState(state, sessionKey) {
  return state[sessionKey] || {};
}

function patchSessionState(state, sessionKey, patch) {
  state[sessionKey] = {
    ...(state[sessionKey] || {}),
    ...patch,
    updated_at: new Date().toISOString(),
  };
}

function normalizePublishedDate(text, referenceDate = new Date()) {
  const value = String(text || "").trim();
  const match = value.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    const [, yyyy, mm, dd] = match;
    return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }
  if (value === "今天") {
    return referenceDate.toISOString().slice(0, 10);
  }
  if (value === "昨天") {
    const date = new Date(referenceDate);
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
  }
  if (value === "前天") {
    const date = new Date(referenceDate);
    date.setDate(date.getDate() - 2);
    return date.toISOString().slice(0, 10);
  }
  return "";
}

function deriveBroadcastId(article) {
  if (article.articleSerial) return article.articleSerial;
  const publishedCompact = (article.published || todayIso()).replace(/-/g, "");
  if (article.sourceId) return `special-${publishedCompact}-${article.sourceId.slice(0, 8)}`;
  const slug = sanitizeText(article.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `special-${publishedCompact}-${slug || "dedao"}`;
}

function buildRawRelativePath(year, broadcastId) {
  return `publishes/aiquan-kb/raw/sources/${year}/${broadcastId}.md`;
}

function buildRawAbsolutePath(year, broadcastId) {
  return path.join(RAW_SOURCES_ROOT, String(year), `${broadcastId}.md`);
}

function buildRawFileContent(article, metadata) {
  const frontmatter = [
    "---",
    `broadcast_id: ${yamlString(metadata.broadcastId)}`,
    `source_path: ${yamlString(metadata.sourcePath)}`,
    `source_url: ${yamlString(metadata.sourceUrl)}`,
    `published: ${metadata.published || ""}`,
    `imported_at: ${metadata.importedAt}`,
    `ingest_status: ${metadata.ingestStatus}`,
    `source_hash: ${yamlString(metadata.sourceHash)}`,
    "---",
    "",
  ];
  return `${frontmatter.join("\n")}${article.markdown.trim()}\n`;
}

async function extractArticle(page) {
  return page.evaluate(() => {
    const SELECTORS = {
      title: "div.article-title.iget-common-c1",
      info: "div.article-info",
      body: "div.article-body",
      time: "div.article-time-info.iget-common-c3.iget-common-f4",
      articleHeader: "article-header",
    };

    const query = (selector) => document.querySelector(selector);

    function escapeMarkdown(text) {
      return String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/([`*_{}\\[\\]()#+\\-.!|>])/g, "\\$1");
    }

    function normalizeText(text) {
      return String(text || "").replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ").trim();
    }

    function inlineNodeToMarkdown(node) {
      if (!node) return "";
      if (node.nodeType === Node.TEXT_NODE) return escapeMarkdown(node.nodeValue || "");
      if (node.nodeType !== Node.ELEMENT_NODE) return "";

      const tag = node.tagName.toLowerCase();
      const content = Array.from(node.childNodes).map(inlineNodeToMarkdown).join("");

      if (tag === "br") return "  \n";
      if (tag === "b" || tag === "strong") return `**${content}**`;
      if (tag === "i" || tag === "em") return `*${content}*`;
      if (tag === "code") return `\`${normalizeText(content)}\``;
      if (tag === "a") {
        const href = node.getAttribute("href") || "";
        const text = normalizeText(content) || href;
        return href ? `[${text}](${href})` : text;
      }
      if (tag === "img") {
        const src = node.getAttribute("src") || "";
        const alt = normalizeText(node.getAttribute("alt") || "image");
        return src ? `![${alt}](${src})` : "";
      }
      return content;
    }

    function blockNodeToMarkdown(node) {
      if (!node) return "";
      if (node.nodeType === Node.TEXT_NODE) {
        const text = normalizeText(node.nodeValue || "");
        return text ? `${escapeMarkdown(text)}\n\n` : "";
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return "";

      const tag = node.tagName.toLowerCase();
      const classList = node.classList;

      if (tag === "svg") return "";
      if (classList.contains("split")) return "---\n\n";
      if (classList.contains(SELECTORS.articleHeader)) {
        const headerText = normalizeText(node.innerText || "");
        return headerText ? `## ${escapeMarkdown(headerText)}\n\n` : "";
      }
      if (tag === "figure") {
        const figureBody = Array.from(node.childNodes).map(inlineNodeToMarkdown).join("").trim();
        return figureBody ? `${figureBody}\n\n` : "";
      }
      if (tag === "p") {
        const text = normalizeText(Array.from(node.childNodes).map(inlineNodeToMarkdown).join(""));
        return text ? `${text}\n\n` : "";
      }
      if (tag === "ul" || tag === "ol") {
        const isOrdered = tag === "ol";
        const lines = Array.from(node.children)
          .filter((child) => child.tagName && child.tagName.toLowerCase() === "li")
          .map((child, index) => {
            const itemText = normalizeText(Array.from(child.childNodes).map(inlineNodeToMarkdown).join(""));
            const prefix = isOrdered ? `${index + 1}. ` : "- ";
            return itemText ? `${prefix}${itemText}` : "";
          })
          .filter(Boolean);
        return lines.length ? `${lines.join("\n")}\n\n` : "";
      }
      if (tag === "blockquote") {
        const text = normalizeText(Array.from(node.childNodes).map(inlineNodeToMarkdown).join(""));
        return text ? `> ${text}\n\n` : "";
      }

      const childBlocks = Array.from(node.childNodes).map(blockNodeToMarkdown).join("");
      if (childBlocks.trim()) return childBlocks;

      const fallback = normalizeText(Array.from(node.childNodes).map(inlineNodeToMarkdown).join(""));
      return fallback ? `${fallback}\n\n` : "";
    }

    function getSourceUrl() {
      const canonicalUrl = document.querySelector('link[rel="canonical"]')?.href || "";
      const ogUrl = document.querySelector('meta[property="og:url"]')?.content || "";
      return canonicalUrl || ogUrl || window.location.href || "";
    }

    const titleElement = query(SELECTORS.title);
    const infoElement = query(SELECTORS.info);
    const bodyElement = query(SELECTORS.body);
    const timeElement = query(SELECTORS.time);

    const titleText = (titleElement?.innerText || document.title || "page").trim();
    const rawTimeText = timeElement?.innerText || "";
    const timeText = rawTimeText.replace(/\s*首次发布:\s*/, "").trim();
    const authorText = normalizeText(infoElement?.querySelector(".course-title")?.innerText || "");
    const publishText = normalizeText(infoElement?.querySelector(".article-publish-time")?.innerText || "");
    const sourceUrl = getSourceUrl();
    const sourceId = (() => {
      try {
        return new URL(sourceUrl || window.location.href).searchParams.get("id") || "";
      } catch (_) {
        return "";
      }
    })();
    const bodyRoot = bodyElement?.querySelector(".editor-show") || bodyElement;
    const bodyMarkdown = bodyRoot
      ? Array.from(bodyRoot.childNodes).map(blockNodeToMarkdown).join("").replace(/\n{3,}/g, "\n\n").trim()
      : "";
    const articleSerialMatch = titleText.match(/^([^｜]+)｜/);
    const articleSerial = articleSerialMatch ? articleSerialMatch[1].trim() : "";
    const bodyText = bodyRoot?.innerText?.replace(/\s+/g, " ").trim() || "";
    const bodyFingerprint = bodyText.slice(0, 200);

    const parts = [];
    parts.push(`# ${titleText}`);
    if (authorText) parts.push(`作者：${authorText}`);
    if (publishText) parts.push(`發布：${publishText}`);
    if (sourceUrl) parts.push(`原始連結：[${sourceUrl}](${sourceUrl})`);
    if (bodyMarkdown) parts.push(bodyMarkdown);
    if (timeText) parts.push(`發布時間：${timeText}`);

    return {
      title: titleText,
      timeText,
      publishText,
      authorText,
      sourceUrl,
      sourceId,
      articleSerial,
      bodyFingerprint,
      markdown: `${parts.join("\n\n").trim()}\n`,
      articleKey: [sourceId || sourceUrl, articleSerial, titleText, timeText, bodyFingerprint].filter(Boolean).join(" | "),
    };
  });
}

async function waitForArticleReady(page) {
  await page.waitForSelector("div.article-title.iget-common-c1", { timeout: 30000 });
  await page.waitForSelector("div.article-body", { timeout: 30000 });
  await page.waitForFunction(() => {
    const title = document.querySelector("div.article-title.iget-common-c1")?.innerText?.trim();
    const body = document.querySelector("div.article-body .editor-show, div.article-body")?.innerText?.trim();
    return Boolean(title && body && body.length > 50);
  }, { timeout: 30000 });
}

async function clickNext(page) {
  const clicked = await page.evaluate(() => {
    const labels = ["下一篇", "下一页", "下一頁"];
    const modules = document.querySelectorAll("div.button-module");
    for (const module of modules) {
      const text = module.querySelector("span.font")?.innerText?.trim() || "";
      if (!labels.some((label) => text.includes(label))) continue;

      const button = module.querySelector("button.button.iget-common-b4");
      const isDisabled =
        !button ||
        button.disabled ||
        button.classList.contains("noMore") ||
        button.getAttribute("aria-disabled") === "true";

      if (isDisabled) return false;

      button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      return true;
    }
    return false;
  });

  if (!clicked) {
    throw new Error("找不到可點擊的「下一篇 / 下一页」按鈕");
  }
}

async function waitForArticleChange(page, previousKey) {
  await page.waitForFunction(
    (key) => {
      const title = document.querySelector("div.article-title.iget-common-c1")?.innerText?.trim() || "";
      const time = document.querySelector("div.article-time-info.iget-common-c3.iget-common-f4")?.innerText?.trim() || "";
      const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
      const sourceId = (() => {
        try {
          return new URL(canonical || location.href).searchParams.get("id") || "";
        } catch (_) {
          return "";
        }
      })();
      const bodyText =
        document.querySelector("div.article-body .editor-show, div.article-body")?.innerText?.replace(/\s+/g, " ").trim() || "";
      const bodyFingerprint = bodyText.slice(0, 200);
      const articleSerialMatch = title.match(/^([^｜]+)｜/);
      const articleSerial = articleSerialMatch ? articleSerialMatch[1].trim() : "";
      const currentKey = [sourceId || canonical || location.href, articleSerial, title, time, bodyFingerprint]
        .filter(Boolean)
        .join(" | ");
      return currentKey && currentKey !== key;
    },
    previousKey,
    { timeout: 30000 }
  );

  await sleep(1500);
  await waitForArticleReady(page);
}

async function advanceToNextArticle(page, previousKey, label = "下一篇切換") {
  let changed = false;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await clickNext(page);
    try {
      await waitForArticleChange(page, previousKey);
      changed = true;
      break;
    } catch (error) {
      console.warn(`${label}未完成，重試 ${attempt}/2: ${error.message}`);
      if (attempt === 2) throw error;
      await sleep(2000);
    }
  }

  if (!changed) {
    throw new Error(`${label}失敗：文章內容未改變`);
  }
}

async function advanceToDistinctNextArticle(page, currentArticle, label = "下一篇切換") {
  const currentIdentity = currentArticle.sourceId || currentArticle.articleSerial || currentArticle.articleKey;

  for (let cycle = 1; cycle <= 3; cycle += 1) {
    await advanceToNextArticle(page, currentArticle.articleKey, `${label} 第${cycle}次`);
    const candidate = await extractArticle(page);
    const candidateIdentity = candidate.sourceId || candidate.articleSerial || candidate.articleKey;
    if (candidateIdentity && candidateIdentity !== currentIdentity) {
      return candidate;
    }
    console.warn(`${label} 第${cycle}次後仍停留在同一篇，繼續重試`);
    await sleep(1500);
  }

  throw new Error(`${label}失敗：無法前進到不同文章`);
}

async function writeDebugArtifacts(page, name = "last-failure") {
  ensureDir(RUNS_DIR);
  const safeName = sanitizeText(name || "last-failure") || "last-failure";
  const stamp = timestampSlug();
  const screenshotPath = path.join(RUNS_DIR, `${stamp}-${safeName}.png`);
  const htmlPath = path.join(RUNS_DIR, `${stamp}-${safeName}.html`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  fs.writeFileSync(htmlPath, await page.content(), "utf8");
  console.log(`debug screenshot: ${screenshotPath}`);
  console.log(`debug html: ${htmlPath}`);
}

function determineRegistryVerdict(article, registry, sourceHash) {
  const existing = registry.byBroadcastId.get(article.broadcastId);
  if (!existing) return { verdict: "new", existing: null };
  if (existing.source_hash === sourceHash) {
    const rawPath = existing.raw_file ? path.join(WORKSPACE_ROOT, existing.raw_file) : "";
    if (article.published && rawPath && fs.existsSync(rawPath)) {
      const rawContent = fs.readFileSync(rawPath, "utf8");
      const publishedMatch = rawContent.match(/^published:[ \t]*(.*)$/m);
      const existingPublished = String(publishedMatch?.[1] || "").trim();
      if (!existingPublished) {
        return { verdict: "updated", existing };
      }
    }
    return { verdict: "skip", existing };
  }
  return { verdict: "updated", existing };
}

function saveRawSource(article, metadata) {
  const absolutePath = buildRawAbsolutePath(metadata.year, metadata.broadcastId);
  ensureDir(path.dirname(absolutePath));
  fs.writeFileSync(absolutePath, buildRawFileContent(article, metadata), "utf8");
  return absolutePath;
}

async function main() {
  const args = parseArgs(process.argv);
  const count = Number(args.count || 5);
  const port = Number(args.port || 9222);
  const forceUrl = Boolean(args["force-url"]);
  const includeStart = Boolean(args["include-start"]);
  const launchOnly = Boolean(args["launch-only"]);
  const bootstrapFromProfileDirectory = args["bootstrap-from-profile-directory"] || "";
  const sessionKey = args["session-key"] || "automation-default";
  const seedUrl = args.url || "https://www.dedao.cn/";
  const chromeUserDataDir = path.resolve(args["chrome-user-data-dir"] || AUTOMATION_PROFILE_DIR);
  const automationProfileDirectory = args["automation-profile-directory"] || "Default";

  const state = loadState();
  const sessionState = getSessionState(state, sessionKey);
  const registry = loadRegistry();
  const startUrl = forceUrl ? seedUrl : (sessionState.last_ingested_url || seedUrl);

  console.log(`session key: ${sessionKey}`);
  console.log(`chrome user data dir: ${normalizePathForStorage(chromeUserDataDir)}`);
  console.log(`automation profile directory: ${automationProfileDirectory}`);
  console.log(`target url: ${startUrl}`);
  console.log(`count: ${count}`);
  console.log(`registry rows: ${registry.rows.length}`);
  console.log(`remote debugging port: ${port}`);

  if (bootstrapFromProfileDirectory) {
    console.log(`bootstrapping automation profile from Chrome/${bootstrapFromProfileDirectory} ...`);
    cloneChromeProfile({
      sourceProfileDirectory: bootstrapFromProfileDirectory,
      targetUserDataDir: chromeUserDataDir,
      targetProfileDirectory: automationProfileDirectory,
    });
    patchSessionState(state, sessionKey, {
      chrome_user_data_dir: normalizePathForStorage(chromeUserDataDir),
      automation_profile_directory: automationProfileDirectory,
      bootstrap_source_profile_directory: bootstrapFromProfileDirectory,
      last_run_status: "bootstrapped",
      last_checked_at: new Date().toISOString(),
      last_run_new_count: 0,
    });
    saveState(state);
    console.log("bootstrap completed");
  }

  const { launched } = await ensureAutomationChrome({
    port,
    url: startUrl,
    userDataDir: chromeUserDataDir,
  });
  if (launched) {
    console.log("launched dedicated automation Chrome");
    await sleep(1500);
  } else {
    console.log("reusing dedicated automation Chrome");
  }

  if (launchOnly) {
    console.log("launch-only enabled; browser is ready for manual login / inspection");
    return;
  }

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await findOrCreateTargetPage(context, startUrl);

  await page.bringToFront();
  if (normalizeUrlForMatch(page.url()) !== normalizeUrlForMatch(startUrl)) {
    await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  }

  try {
    await waitForArticleReady(page);
  } catch (error) {
    console.error(`page url on failure: ${page.url()}`);
    await writeDebugArtifacts(page, "article-ready-timeout");
    throw new Error(
      [
        error.message,
        "若這是首次執行，請先用 --launch-only 啟動專用 Chrome profile，手動登入 Dedao，再重跑。",
      ].join("\n")
    );
  }

  let currentArticle = await extractArticle(page);
  if (sessionState.last_ingested_url && !forceUrl && !includeStart) {
    try {
      currentArticle = await advanceToDistinctNextArticle(page, currentArticle, "增量起點切換");
    } catch (error) {
      patchSessionState(state, sessionKey, {
        chrome_user_data_dir: normalizePathForStorage(chromeUserDataDir),
        last_checked_at: new Date().toISOString(),
        last_run_status: "no-new-items",
        last_run_new_count: 0,
      });
      saveState(state);
      console.log(`no new items: ${error.message}`);
      return;
    }
  }

  let processedCount = 0;
  const seenThisRun = new Set();

  while (processedCount < count) {
    const article = currentArticle;
    const published = normalizePublishedDate(article.timeText || article.publishText);
    const importedAt = todayIso();
    const broadcastId = deriveBroadcastId({ ...article, published });
    const year = (published || importedAt).slice(0, 4);
    const sourceHash = hashContent(article.markdown);
    const sourcePath = article.sourceUrl || page.url();
    const { verdict } = determineRegistryVerdict({ broadcastId, published }, registry, sourceHash);
    const runIdentity = article.sourceId || broadcastId || article.articleKey;

    if (seenThisRun.has(runIdentity)) {
      console.warn(`duplicate article in current run: ${broadcastId} ${article.title}`);
      break;
    }
    seenThisRun.add(runIdentity);

    if (verdict === "skip") {
      if (processedCount === 0) {
        patchSessionState(state, sessionKey, {
          chrome_user_data_dir: normalizePathForStorage(chromeUserDataDir),
          last_checked_at: new Date().toISOString(),
          last_run_status: "no-new-items",
          last_run_new_count: 0,
        });
        saveState(state);
        console.log(`no new items: already captured ${broadcastId}`);
        return;
      }

      console.log(`reached existing article boundary: ${broadcastId}`);
      break;
    }

    const ingestStatus = verdict === "updated" ? "updated" : "captured";
    const rawRelativePath = buildRawRelativePath(year, broadcastId);
    const rawAbsolutePath = saveRawSource(article, {
      broadcastId,
      sourcePath,
      sourceUrl: sourcePath,
      published,
      importedAt,
      ingestStatus,
      sourceHash,
      year,
    });

    upsertRegistryRow(registry, {
      broadcast_id: broadcastId,
      source_path: sourcePath,
      raw_file: rawRelativePath,
      broadcast_card: "",
      year: String(year),
      imported_at: importedAt,
      source_hash: sourceHash,
      status: ingestStatus,
    });
    writeRegistry(registry);

    processedCount += 1;
    patchSessionState(state, sessionKey, {
      chrome_user_data_dir: normalizePathForStorage(chromeUserDataDir),
      last_checked_at: new Date().toISOString(),
      last_ingested_at: new Date().toISOString(),
      last_ingested_broadcast_id: broadcastId,
      last_ingested_url: sourcePath,
      last_raw_file: rawRelativePath,
      last_run_status: ingestStatus,
      last_run_new_count: processedCount,
    });
    saveState(state);

    console.log(`[${processedCount}/${count}] ${ingestStatus}: ${rawAbsolutePath}`);

    if (processedCount === count) break;

    try {
      await sleep(1200 + Math.floor(Math.random() * 1000));
      currentArticle = await advanceToDistinctNextArticle(page, article, "下一篇切換");
    } catch (error) {
      console.log(`stop after ${processedCount} captured items: ${error.message}`);
      break;
    }
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
