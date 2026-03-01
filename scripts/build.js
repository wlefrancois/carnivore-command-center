// scripts/build.js
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const DIST_DIR = path.join(ROOT, "dist");
const TEMPLATE_PATH = path.join(ROOT, "templates", "base.html");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function emptyDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

function applyIncludes(html) {
  return html.replace(/<!--#include file="([^"]+)" -->/g, (_, includePath) => {
    const normalized = includePath.replace(/^\//, "");
    const full = path.join(ROOT, normalized);
    if (!fs.existsSync(full)) throw new Error(`Missing include: ${includePath}`);
    return read(full);
  });
}

function walkHtml(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkHtml(full, files);
    else if (item.endsWith(".html")) files.push(full);
  }
  return files;
}

function pageMeta(relPath) {
  // minimal for now; we’ll add per-page meta later
  return {
    TITLE: "Carnivore Command Center",
    DESCRIPTION:
      "Elite performance + metabolic intelligence. Track what matters, see patterns, and execute with confidence.",
    PAGE: relPath.replace(/\\/g, "/"),
  };
}

function buildPage(pagePath) {
  const rel = path.relative(SRC_DIR, pagePath);
  const outPath = path.join(DIST_DIR, rel);

  const base = read(TEMPLATE_PATH);
  const content = read(pagePath);

  const meta = pageMeta(rel);

  let merged = base
    .replaceAll("{{TITLE}}", meta.TITLE)
    .replaceAll("{{DESCRIPTION}}", meta.DESCRIPTION)
    .replaceAll("{{PAGE}}", meta.PAGE)
    .replace("{{CONTENT}}", content);

  merged = applyIncludes(merged);
  write(outPath, merged);
}

(function main() {
  emptyDir(DIST_DIR);

  // Copy shared static folders from repo root into dist
  for (const folder of ["css", "assets", "js"]) {
    const p = path.join(ROOT, folder);
    if (fs.existsSync(p)) copyDir(p, path.join(DIST_DIR, folder));
  }

  const pages = walkHtml(SRC_DIR);
  pages.forEach(buildPage);

  console.log(`Built ${pages.length} pages to /dist`);
})();
