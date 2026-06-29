/**
 * El kitabi ic linklerini dogrular.
 * node scripts/audit-el-kitabi-links.mjs
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const OUT = join(__dir, "out", "el-kitabi-links-audit.json");
const EL_KITABI_DIR = join(ROOT, "apps", "web", "lib", "elKitabi");
const APP_DIR = join(ROOT, "apps", "web", "app");

function walkTsFiles(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walkTsFiles(full, files);
    } else if (name.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

function collectAppRoutes(dir, base = "") {
  const routes = new Set();
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = `${base}/${name}`.replace(/\\/g, "/");
    if (statSync(full).isDirectory()) {
      if (name.startsWith("(") || name === "api") continue;
      try {
        readFileSync(join(full, "page.tsx"));
        routes.add(rel);
      } catch {
        /* no page */
      }
      for (const r of collectAppRoutes(full, rel)) routes.add(r);
    }
  }
  return routes;
}

function extractHrefs() {
  const files = walkTsFiles(EL_KITABI_DIR);
  let all = "";
  for (const f of files) all += readFileSync(f, "utf8");
  return [...new Set([...all.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]))];
}

function main() {
  const routes = collectAppRoutes(APP_DIR);
  const hrefs = extractHrefs();
  const missing = hrefs.filter((h) => !routes.has(h));
  const ok = hrefs.filter((h) => routes.has(h));

  const report = {
    generatedAt: new Date().toISOString(),
    totalHrefs: hrefs.length,
    valid: ok.length,
    missing,
    hrefs: hrefs.sort(),
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");

  console.log("El kitabi link audit");
  console.log("─".repeat(40));
  console.log(`Toplam link: ${hrefs.length}`);
  console.log(`Gecerli:      ${ok.length}`);
  console.log(`Eksik:        ${missing.length}`);
  if (missing.length) {
    console.log("\nEksik route'lar:");
    for (const m of missing) console.log(`  ${m}`);
  }
  console.log(`\n→ ${OUT}`);

  if (missing.length) process.exitCode = 1;
}

main();
