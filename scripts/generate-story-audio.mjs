/**
 * Hikaye satırları için DE + TR MP3 üretimi
 *
 *   node scripts/generate-story-audio.mjs --story d_a2_eg_markt
 *   node scripts/generate-story-audio.mjs --story d_a2_eg_markt --resume
 *   node scripts/generate-story-audio.mjs --story d_a2_eg_markt --lang tr
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const VOICES = {
  de: { voice: "de-DE-KatjaNeural", alt: "de-DE-KatjaNeural", rate: "-12%", pitch: "+0Hz" },
  tr: { voice: "tr-TR-EmelNeural", alt: "tr-TR-FilizNeural", rate: "-5%", pitch: "+0Hz" },
};

const STORY_FILES = {
  d_a2_eg_markt: "data/dialogues/easy-german-market.json",
};

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const PUBLIC_ROOT = join(ROOT, "apps/web/public");
const ERROR_LOG = join(ROOT, "scripts/story-audio-errors.log");
const DELAY_MS = 350;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function synthesize(lang, text) {
  const cfg = VOICES[lang];
  for (const voice of [cfg.voice, cfg.alt]) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const { audioStream } = await tts.toStream(text, { rate: cfg.rate, pitch: cfg.pitch });
      return await streamToBuffer(audioStream);
    } catch {
      /* try alt */
    }
  }
  throw new Error(`TTS failed (${lang}): ${text.slice(0, 40)}…`);
}

function logError(label, message) {
  appendFileSync(ERROR_LOG, `[${new Date().toISOString()}] ${label}: ${message}\n`);
}

function loadStory(storyId) {
  const rel = STORY_FILES[storyId];
  if (!rel) throw new Error(`Unknown story: ${storyId}. Known: ${Object.keys(STORY_FILES).join(", ")}`);
  const raw = JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
  const stories = Array.isArray(raw) ? raw : [raw];
  const story = stories.find((s) => s.id === storyId);
  if (!story) throw new Error(`Story id ${storyId} not in ${rel}`);
  return { story, filePath: join(ROOT, rel), isArray: Array.isArray(raw), raw };
}

function audioRel(storyId, lineId, lang) {
  return `/audio/stories/${storyId}/${lineId}-${lang}.mp3`;
}

async function main() {
  const args = process.argv.slice(2);
  const storyId = args.includes("--story") ? args[args.indexOf("--story") + 1] : "d_a2_eg_markt";
  const resume = args.includes("--resume");
  const langFilter = args.includes("--lang") ? args[args.indexOf("--lang") + 1] : "both";
  const langs = langFilter === "both" ? ["de", "tr"] : [langFilter];

  const { story, filePath, isArray, raw } = loadStory(storyId);
  let ok = 0;
  let fail = 0;
  let skipped = 0;

  console.log(`Hikaye: ${story.title_de} (${story.lines.length} satır)`);
  console.log(`Sesler: DE=${VOICES.de.voice}, TR=${VOICES.tr.voice}`);

  for (const line of story.lines) {
    for (const lang of langs) {
      const text = lang === "de" ? line.text_de : line.text_tr;
      const rel = audioRel(storyId, line.id, lang);
      const out = join(PUBLIC_ROOT, rel.replace(/^\//, ""));
      const field = lang === "de" ? "audio_de" : "audio_tr";
      line[field] = rel;

      if (resume && existsSync(out)) {
        skipped++;
        continue;
      }

      try {
        mkdirSync(dirname(out), { recursive: true });
        const buffer = await synthesize(lang, text);
        writeFileSync(out, buffer);
        ok++;
        process.stdout.write(`  ✓ ${line.id}-${lang}\n`);
      } catch (err) {
        fail++;
        logError(`${storyId}/${line.id}-${lang}`, err.message);
        console.error(`  ✗ ${line.id}-${lang}: ${err.message}`);
      }
      await sleep(DELAY_MS);
    }
  }

  const payload = isArray ? raw : story;
  writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n");

  const manifestPath = join(PUBLIC_ROOT, "audio/stories/manifest.json");
  let manifest = { generated: new Date().toISOString(), stories: {} };
  if (existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch {
      /* fresh */
    }
  }
  manifest.stories[storyId] = {
    title_de: story.title_de,
    lines: story.lines.length,
    audioFiles: story.lines.length * 2,
    updatedAt: new Date().toISOString(),
  };
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\nBitti: ${ok} üretildi, ${skipped} atlandı, ${fail} hata`);
  console.log(`JSON güncellendi: ${filePath}`);
  if (fail > 0) console.log(`Log: ${ERROR_LOG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
