const base = process.argv[2] ?? "http://localhost:3000";

const html = await fetch(base + "/speak").then((r) => r.text());
const m = html.match(/href="(\/_next\/static\/css\/[^"]+\.css[^"]*)"/);

if (!m) {
  console.error("NO CSS LINK in HTML — derleme gerekli (fix-css.bat veya start.bat --rebuild)");
  process.exit(1);
}

const cssPath = m[1].replace(/&amp;/g, "&");
const cssUrl = cssPath.startsWith("http") ? cssPath : base + cssPath;
const res = await fetch(cssUrl);

console.log("CSS:", cssPath, "-> HTTP", res.status);
if (!res.ok) {
  console.error("CSS dosyasi yuklenemiyor — fix-css.bat calistirin, tarayicida Ctrl+F5");
}
process.exit(res.ok ? 0 : 1);
