/**
 * Edge TTS ile MP3 üretimi
 *
 * Kullanım:
 *   node scripts/generate-audio.mjs --pack timur
 *   node scripts/generate-audio.mjs --pack a1
 *   node scripts/generate-audio.mjs --pack all
 *   node scripts/generate-audio.mjs --pack a1 --resume
 *   node scripts/generate-audio.mjs --pack timur --force
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const VOICE = "de-DE-KatjaNeural";
const VOICE_ALT = "de-DE-ConradNeural";
const RATE = "-5%";
const MAX_RETRIES = 3;

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const PUBLIC_AUDIO = join(ROOT, "apps/web/public/audio");
const ERROR_LOG = join(ROOT, "scripts/audio-errors.log");
const DELAY_MS = 300;

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

async function synthesize(tts, text) {
  try {
    const { audioStream } = await tts.toStream(text, { rate: RATE });
    return streamToBuffer(audioStream);
  } catch (err) {
    console.warn("  Katja başarısız, Conrad deneniyor…");
    const alt = new MsEdgeTTS();
    await alt.setMetadata(VOICE_ALT, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = await alt.toStream(text, { rate: RATE });
    return streamToBuffer(audioStream);
  }
}

function loadPack(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function collectJobs(pack, publicRoot) {
  const jobs = [];
  for (const w of pack.words) {
    const speakWord = w.article ? `${w.article} ${w.word}` : w.word;
    jobs.push({
      kind: "word",
      text: speakWord,
      out: join(publicRoot, w.audio_word.replace(/^\//, "")),
      label: w.id,
    });
    jobs.push({
      kind: "example",
      text: w.example_de,
      out: join(publicRoot, w.audio_example.replace(/^\//, "")),
      label: `${w.id}-ex`,
    });
  }
  return jobs;
}

function logError(label, message) {
  const line = `[${new Date().toISOString()}] ${label}: ${message}\n`;
  appendFileSync(ERROR_LOG, line);
}

async function runJob(tts, job) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      mkdirSync(dirname(job.out), { recursive: true });
      const buffer = await synthesize(tts, job.text);
      writeFileSync(job.out, buffer);
      return true;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        logError(job.label, err.message);
        return false;
      }
      console.warn(`  Retry ${attempt}/${MAX_RETRIES} for ${job.label}`);
      await sleep(DELAY_MS * attempt);
    }
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const packArg = args.includes("--pack")
    ? args[args.indexOf("--pack") + 1]
    : "timur";
  const force = args.includes("--force");
  const resume = args.includes("--resume");
  const limitArg = args.includes("--limit")
    ? parseInt(args[args.indexOf("--limit") + 1], 10)
    : Infinity;

  const packs = [];
  if (packArg === "a1" || packArg === "all") {
    packs.push({ name: "a1", data: loadPack(join(ROOT, "data/a1/vocabulary.json")) });
  }
  if (packArg === "timur" || packArg === "all") {
    packs.push({ name: "timur", data: loadPack(join(ROOT, "data/timur/vocabulary.json")) });
  }
  if (packArg === "a2" || packArg === "all") {
    packs.push({ name: "a2", data: loadPack(join(ROOT, "data/a2/vocabulary.json")) });
  }

  if (packs.length === 0) {
    console.error("Geçersiz --pack. a1 | a2 | timur | all");
    process.exit(1);
  }

  let jobs = [];
  for (const p of packs) {
    jobs.push(...collectJobs(p.data, PUBLIC_AUDIO));
  }

  if (!force) {
    jobs = jobs.filter((j) => !existsSync(j.out));
  }

  if (resume && jobs.length > 0) {
    console.log(`--resume: ${jobs.length} eksik dosya kaldığı yerden devam edecek`);
  }

  jobs = jobs.slice(0, limitArg);

  console.log(`Ses üretimi: ${VOICE} (Almanca)`);
  console.log(`İş sayısı: ${jobs.length}${force ? " (force)" : resume ? " (resume)" : " (eksikler)"}`);

  if (jobs.length === 0) {
    console.log("Tüm MP3 dosyaları mevcut.");
    writeManifest(packs);
    return;
  }

  mkdirSync(PUBLIC_AUDIO, { recursive: true });
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const success = await runJob(tts, job);
    if (success) ok++;
    else fail++;
    if ((i + 1) % 10 === 0 || i === jobs.length - 1) {
      console.log(`  [${i + 1}/${jobs.length}] ${ok} ok, ${fail} fail — son: ${job.label}`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n✓ Bitti: ${ok} üretildi, ${fail} hata`);
  if (fail > 0) console.log(`Hata log: ${ERROR_LOG}`);
  writeManifest(packs);
}

function writeManifest(packs) {
  const manifest = { generated: new Date().toISOString(), packs: {} };
  for (const p of packs) {
    let audioReady = 0;
    let examplesReady = 0;
    for (const w of p.data.words) {
      const wPath = join(PUBLIC_AUDIO, w.audio_word.replace(/^\//, ""));
      const exPath = join(PUBLIC_AUDIO, w.audio_example.replace(/^\//, ""));
      if (existsSync(wPath)) audioReady++;
      if (existsSync(exPath)) examplesReady++;
    }
    manifest.packs[p.name] = {
      words: p.data.words.length,
      audioReady,
      examplesReady,
    };
  }
  const manifestPath = join(PUBLIC_AUDIO, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
