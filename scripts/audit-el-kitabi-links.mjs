/**
 * El kitabi ic linklerini, practice moduleHref ve donus bandlarini dogrular.
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
const GRUNDLAGEN_DIR = join(APP_DIR, "grundlagen");

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

function collectPagesWithReturnBanner(dir, base = "") {
  const result = new Set();
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = `${base}/${name}`.replace(/\\/g, "/");
    if (statSync(full).isDirectory()) {
      for (const r of collectPagesWithReturnBanner(full, rel)) result.add(r);
    } else if (name === "page.tsx" && base) {
      const content = readFileSync(full, "utf8");
      if (content.includes("ElKitabiReturnBanner")) {
        result.add(base);
      }
    }
  }
  return result;
}

function extractHrefs() {
  const files = walkTsFiles(EL_KITABI_DIR);
  let all = "";
  for (const f of files) all += readFileSync(f, "utf8");
  return [...new Set([...all.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]))];
}

function extractModulePractice() {
  const practiceFile = join(EL_KITABI_DIR, "practice.ts");
  const content = readFileSync(practiceFile, "utf8");
  const entries = [];
  for (const m of content.matchAll(
    /"((?:ch)\d+-\d+)":\s*\{[\s\S]*?moduleHref:\s*"([^"]+)"/g
  )) {
    entries.push({ subsectionId: m[1], moduleHref: m[2] });
  }
  return entries;
}

function auditReturnBanner(hrefs, routesWithBanner) {
  const grundlagenHrefs = [...new Set(hrefs.filter((h) => h.startsWith("/grundlagen/")))];
  const missing = [];
  const ok = [];
  for (const href of grundlagenHrefs.sort()) {
    if (routesWithBanner.has(href)) {
      ok.push(href);
    } else {
      missing.push(href);
    }
  }
  return { grundlagenHrefs, ok, missing };
}

function main() {
  const routes = collectAppRoutes(APP_DIR);
  const hrefs = extractHrefs();
  const missingHrefs = hrefs.filter((h) => !routes.has(h));
  const okHrefs = hrefs.filter((h) => routes.has(h));

  const moduleEntries = extractModulePractice();
  const missingModuleRoutes = [];
  const moduleAudited = moduleEntries.map((e) => {
    const routeValid = routes.has(e.moduleHref);
    if (!routeValid) missingModuleRoutes.push(e);
    return {
      ...e,
      returnUrl: `${e.moduleHref}?from=el-kitabi&section=${e.subsectionId}`,
      routeValid,
    };
  });

  const returnBannerPages = collectPagesWithReturnBanner(GRUNDLAGEN_DIR, "/grundlagen");
  const returnBannerAudit = auditReturnBanner(hrefs, returnBannerPages);

  const practiceMissingBanner = moduleAudited
    .filter((e) => e.routeValid && !returnBannerPages.has(e.moduleHref))
    .map((e) => ({ subsectionId: e.subsectionId, moduleHref: e.moduleHref }));

  const report = {
    generatedAt: new Date().toISOString(),
    totalHrefs: hrefs.length,
    valid: okHrefs.length,
    missing: missingHrefs,
    hrefs: hrefs.sort(),
    modulePractice: {
      total: moduleAudited.length,
      routesValid: moduleAudited.filter((e) => e.routeValid).length,
      missingRoutes: missingModuleRoutes,
      missingReturnBanner: practiceMissingBanner,
      entries: moduleAudited,
    },
    grundlagenReturnBanner: {
      total: returnBannerAudit.grundlagenHrefs.length,
      withBanner: returnBannerAudit.ok.length,
      missing: returnBannerAudit.missing,
      optionalWarnings: true,
    },
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");

  const failCount = missingHrefs.length + missingModuleRoutes.length + practiceMissingBanner.length;

  console.log("El kitabi link audit");
  console.log("─".repeat(40));
  console.log(`Icerik href:     ${okHrefs.length}/${hrefs.length} gecerli`);
  if (missingHrefs.length) {
    console.log("  Eksik href:");
    for (const m of missingHrefs) console.log(`    ${m}`);
  }

  console.log(`Practice modul:  ${report.modulePractice.routesValid}/${report.modulePractice.total} route`);
  if (missingModuleRoutes.length) {
    console.log("  Eksik moduleHref route:");
    for (const m of missingModuleRoutes) {
      console.log(`    ${m.subsectionId} → ${m.moduleHref}`);
    }
  }

  console.log(
    `Donus bandi:     ${returnBannerAudit.ok.length}/${returnBannerAudit.grundlagenHrefs.length} grundlagen href`
  );
  if (practiceMissingBanner.length) {
    console.log("  Practice moduleHref — ElKitabiReturnBanner yok:");
    for (const m of practiceMissingBanner) {
      console.log(`    ${m.subsectionId} → ${m.moduleHref}`);
    }
  }
  if (returnBannerAudit.missing.length) {
    console.log("  Uyari — icerik href, donus bandi yok (istege bagli):");
    for (const m of returnBannerAudit.missing) console.log(`    ${m}`);
  }

  console.log(`\n→ ${OUT}`);

  if (failCount > 0) {
    process.exitCode = 1;
  }
}

main();
