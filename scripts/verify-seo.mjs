/**
 * SEO smoke test — node scripts/verify-seo.mjs [baseUrl]
 * Default: https://germancoach.app
 */
const BASE = process.argv[2] ?? "https://germancoach.app";

const MIN_SITEMAP_URLS = 42;

const CHECKS = [
  { path: "/", name: "Ana sayfa" },
  { path: "/robots.txt", name: "robots.txt" },
  { path: "/sitemap.xml", name: "sitemap.xml" },
  { path: "/diktat", name: "Diktat" },
  { path: "/ozellikler", name: "Özellikler" },
  { path: "/grundlagen/cumle-motoru", name: "Kelime Oyunu" },
  { path: "/listen", name: "Dinle" },
  { path: "/cards", name: "Kartlar" },
  { path: "/blog", name: "Blog" },
];

const REQUIRED_IN_SITEMAP = [
  "/",
  "/diktat",
  "/ozellikler",
  "/grundlagen/cumle-motoru",
  "/listen",
  "/cards",
  "/exam",
  "/blog",
];

async function check({ path, name }) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    const noindex = /noindex/i.test(text);
    const hasGoogleVerify = /google-site-verification/i.test(text);
    const ok = res.ok;
    return { name, url, status: res.status, ok, noindex, hasGoogleVerify, snippet: text.slice(0, 120) };
  } catch (err) {
    return { name, url, status: 0, ok: false, error: err.message };
  }
}

console.log(`SEO kontrol: ${BASE}\n`);

const results = await Promise.all(CHECKS.map(check));
let failed = 0;
let hasVerification = false;

for (const r of results) {
  const icon = r.ok ? "✓" : "✗";
  console.log(`${icon} ${r.name} — ${r.status}${r.noindex ? " (noindex!)" : ""}`);
  if (r.hasGoogleVerify) hasVerification = true;
  if (!r.ok) {
    failed++;
    if (r.error) console.log(`   ${r.error}`);
    else if (r.snippet) console.log(`   ${r.snippet.replace(/\s+/g, " ")}…`);
  }
}

let sitemapText = "";
const sm = results.find((r) => r.name === "sitemap.xml");
if (sm?.ok) {
  try {
    sitemapText = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
    const count = (sitemapText.match(/<loc>/g) ?? []).length;
    console.log(`\nSitemap URL sayısı: ${count}`);
    if (count < MIN_SITEMAP_URLS) {
      console.log(`✗ Sitemap çok kısa (beklenen ≥ ${MIN_SITEMAP_URLS})`);
      failed++;
    }
    for (const p of REQUIRED_IN_SITEMAP) {
      const full = `${BASE}${p === "/" ? "" : p}`;
      if (!sitemapText.includes(`<loc>${full}</loc>`) && !sitemapText.includes(`<loc>${full}/</loc>`)) {
        console.log(`✗ Sitemap'te eksik: ${p}`);
        failed++;
      } else {
        console.log(`✓ Sitemap: ${p}`);
      }
    }
  } catch (e) {
    console.log(`✗ Sitemap parse hatası: ${e.message}`);
    failed++;
  }
} else {
  console.log("\n✗ sitemap.xml erişilemiyor — Google indeksleyemez!");
  failed++;
}

const robots = results.find((r) => r.name === "robots.txt");
if (robots?.ok) {
  const robotsText = await fetch(`${BASE}/robots.txt`).then((r) => r.text());
  if (!/sitemap:/i.test(robotsText)) {
    console.log("✗ robots.txt içinde Sitemap satırı yok");
    failed++;
  } else {
    console.log("✓ robots.txt → sitemap tanımlı");
  }
}

console.log(
  failed
    ? `\n${failed} sorun — düzeltme gerekli.`
    : "\nTeknik SEO endpoint'leri OK."
);

console.log("\n--- Google'da neden henüz çıkmıyor olabilir? ---");
console.log("1. Search Console'da mülk (germancoach.app) ekli mi?");
console.log("2. Sitemap gönderildi mi? → https://germancoach.app/sitemap.xml");
console.log(
  hasVerification
    ? "3. ✓ Google doğrulama meta etiketi görünüyor."
    : "3. ✗ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION env ayarlı değil (Vercel)."
);
console.log("4. Yeni siteler 1–4 hafta indeks alır — sabır + blog paylaşımı yardımcı.");
console.log("5. site:germancoach.app ile Google'da kontrol et.");

process.exit(failed ? 1 : 0);
