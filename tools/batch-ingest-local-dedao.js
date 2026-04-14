#!/usr/bin/env node

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEDAO_ROOT = path.resolve(REPO_ROOT, "..", "..", "dedao", "快刀廣播站");
const RAW_ROOT = path.join(REPO_ROOT, "raw", "sources");
const BROWCAST_ROOT = path.join(REPO_ROOT, "wiki", "broadcasts");
const IMPORTED_AT = new Date().toISOString().slice(0, 10);

const TARGETS = [
  { id: 777, published: "2026-03-03" },
  { id: 778, published: "2026-03-04" },
  { id: 779, published: "2026-03-05" },
  { id: 780, published: "2026-03-06" },
  { id: 781, published: "2026-03-07" },
  { id: 782, published: "2026-03-08" },
  { id: 784, published: "2026-03-10" },
  { id: 785, published: "2026-03-11" },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function sha256(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function findSourceFile(id) {
  const prefix = `${id}｜`;
  const matches = fs.readdirSync(DEDAO_ROOT).filter((name) => name.startsWith(prefix) && name.endsWith(".md"));
  if (matches.length !== 1) {
    throw new Error(`Expected one source for ${id}, found ${matches.length}`);
  }
  return path.join(DEDAO_ROOT, matches[0]);
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

function broadcastSkeleton({ id, sourcePath, published, sourceRelPath, title }) {
  return [
    `# ${id}｜${title}`,
    "",
    "## Source",
    "",
    `- Broadcast ID: \`${id}\``,
    `- Source Path: \`${sourcePath}\``,
    "- Host / Author: 快刀青衣",
    `- Published: ${published}`,
    `- Captured: ${IMPORTED_AT}`,
    `- Raw file: \`raw/sources/2026/${id}.md\``,
    `- Original title: ${id}｜${title}`,
    "- Content type: ",
    "- Series:",
    "",
    "## Main Claims",
    "",
    "- ",
    "",
    "## Why It Matters",
    "",
    "-",
    "",
    "## Practical Takeaways",
    "",
    "- ",
    "",
    "## Relation To Existing Pages",
    "",
    "- ",
    "",
    "## Tensions Or Disagreements",
    "",
    "- ",
    "",
    "## Open Questions",
    "",
    "- ",
    "",
    "## Merge Candidates",
    "",
    "- ",
    "",
  ].join("\n");
}

function main() {
  ensureDir(path.join(RAW_ROOT, "2026"));
  ensureDir(BROWCAST_ROOT);

  for (const target of TARGETS) {
    const sourceFile = findSourceFile(target.id);
    const sourceText = fs.readFileSync(sourceFile, "utf8");
    const sourceHash = sha256(sourceText);
    const sourceRelPath = path.relative(REPO_ROOT, sourceFile).split(path.sep).join("/");
    const rawPath = path.join(RAW_ROOT, "2026", `${target.id}.md`);
    const broadcastPath = path.join(BROWCAST_ROOT, `${target.id}.md`);
    const title = sourceText.match(/^#\s+\d+｜([^\n]+)/m)?.[1] || path.basename(sourceFile, ".md");
    const sourcePath = `dedao/快刀廣播站/${path.basename(sourceFile)}`;

    fs.writeFileSync(rawPath, rawFrontmatter({
      id: target.id,
      sourcePath,
      published: target.published,
      sourceHash,
    }) + sourceText, "utf8");

    fs.writeFileSync(broadcastPath, broadcastSkeleton({
      id: target.id,
      sourcePath,
      published: target.published,
      sourceRelPath,
      title,
    }), "utf8");

    console.log(`${target.id}\t${sourceRelPath}\t${rawPath}\t${broadcastPath}\t${sourceHash}`);
  }
}

main();
