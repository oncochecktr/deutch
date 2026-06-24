/**
 * Rasterize brand SVG → PNG sizes for favicon, PWA, Apple, LinkedIn.
 * Run: node scripts/build-brand-assets.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const brandDir = path.join(root, "apps/web/public/brand");
const publicDir = path.join(root, "apps/web/public");
const markSvg = path.join(brandDir, "logo-mark.svg");

const SIZES = [
  { name: "favicon-16.png", size: 16, dir: publicDir },
  { name: "favicon-32.png", size: 32, dir: publicDir },
  { name: "apple-touch-icon.png", size: 180, dir: publicDir },
  { name: "icon-192.png", size: 192, dir: publicDir },
  { name: "icon-512.png", size: 512, dir: publicDir },
  { name: "linkedin-logo.png", size: 300, dir: brandDir },
  { name: "linkedin-cover.png", size: 1128, height: 191, dir: brandDir, cover: true },
];

async function renderMark(size, height) {
  const svg = await readFile(markSvg);
  const pipeline = sharp(svg).resize(size, height ?? size, { fit: "contain", background: "#1a3a5c" });
  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

async function renderCover() {
  const w = 1128;
  const h = 191;
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1f4468"/>
        <stop offset="100%" stop-color="#1a3a5c"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <circle cx="120" cy="96" r="56" fill="none" stroke="#c9a227" stroke-width="4" opacity="0.4"/>
  <text x="200" y="88" font-family="Segoe UI, system-ui, sans-serif" font-size="52" font-weight="700" fill="#ffffff">German Coach</text>
  <text x="200" y="132" font-family="Segoe UI, system-ui, sans-serif" font-size="26" font-weight="500" fill="#c9a227">Sıfırdan A1 — Almanca öğrenme platformu</text>
  </svg>`);
  return sharp(svg).png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  await mkdir(brandDir, { recursive: true });

  const mark512 = await renderMark(512);
  await writeFile(path.join(publicDir, "icon.svg"), await readFile(markSvg));

  for (const item of SIZES) {
    const buf = item.cover
      ? await renderCover()
      : await renderMark(item.size, item.height);
    const out = path.join(item.dir, item.name);
    await writeFile(out, buf);
    console.log("wrote", path.relative(root, out));
  }

  console.log("\nLinkedIn logo: apps/web/public/brand/linkedin-logo.png (300×300)");
  console.log("LinkedIn cover: apps/web/public/brand/linkedin-cover.png (1128×191)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
