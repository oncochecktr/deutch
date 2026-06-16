const base = process.argv[2] ?? "http://localhost:3000";
const html = await fetch(base + "/").then((r) => r.text());
const m = html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
if (!m) {
  console.error("NO CSS LINK in HTML");
  process.exit(1);
}
const cssUrl = base + m[1];
const res = await fetch(cssUrl);
console.log("CSS:", m[1], "-> HTTP", res.status);
process.exit(res.ok ? 0 : 1);
