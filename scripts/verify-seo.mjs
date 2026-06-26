/**
 * SEO smoke test — node scripts/verify-seo.mjs [baseUrl]
 * Default: https://germancoach.app
 */
const BASE = process.argv[2] ?? "https://germancoach.app";

const CHECKS = [
  { path: "/", name: "Ana sayfa" },
  { path: "/robots.txt", name: "robots.txt" },
  { path: "/sitemap.xml", name: "sitemap.xml" },
  { path: "/blog", name: "Blog" },
  { path: "/cards", name: "Kartlar" },
];

async function check({ path, name }) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    const noindex = /noindex/i.test(text);
    const ok = res.ok;
    return { name, url, status: res.status, ok, noindex, snippet: text.slice(0, 120) };
  } catch (err) {
    return { name, url, status: 0, ok: false, error: err.message };
  }
}

console.log(`SEO kontrol: ${BASE}\n`);

const results = await Promise.all(CHECKS.map(check));
let failed = 0;

for (const r of results) {
  const icon = r.ok ? "✓" : "✗";
  console.log(`${icon} ${r.name} — ${r.status}${r.noindex ? " (noindex!)" : ""}`);
  if (!r.ok) {
    failed++;
    if (r.error) console.log(`   ${r.error}`);
    else if (r.snippet) console.log(`   ${r.snippet.replace(/\s+/g, " ")}…`);
  }
}

// sitemap url count
const sm = results.find((r) => r.name === "sitemap.xml");
if (sm?.ok) {
  const full = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  const count = (full.match(/<loc>/g) ?? []).length;
  console.log(`\nSitemap URL sayısı: ${count}`);
}

console.log(failed ? `\n${failed} hata — deploy veya sitemap düzeltmesi gerekli.` : "\nTemel SEO endpoint'leri OK.");
console.log("\nGoogle'da görünmek için: Search Console → mülk ekle → sitemap gönder");
process.exit(failed ? 1 : 0);
