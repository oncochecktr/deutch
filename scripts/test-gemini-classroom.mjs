import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "apps", "web");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const systemInstruction = readFileSync(resolve(root, "lib/speakPrompts.ts"), "utf8").slice(0, 500)
  + "\n...(truncated for test)...";

const history = [
  { role: "user", content: "[DERS BAŞLAT]" },
  {
    role: "assistant",
    content:
      "Harikasın Timur, ilk cümleni yazdın! 'heiße' fiilinde sadece küçük bir harf hatası var.",
  },
  { role: "user", content: "[YAZILI CEVAP] Hallo, ich heisse Timur." },
  {
    role: "assistant",
    content: "Çok güzel! Şimdi nereden geldiğini öğrenelim.",
  },
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: modelName,
  systemInstruction:
    "Sen Almanca profesörüsün. JSON döndür: {reply, speakText, correction, correctionExplanation, lessonNotes, assignment, weaknesses, professorAdvice, expectsWrittenAnswer, stepComplete, lessonComplete, assessedLevel}",
  generationConfig: {
    responseMimeType: "application/json",
    maxOutputTokens: modelName.includes("pro") ? 4096 : 2048,
  },
});

const geminiHistory = history.map((h) => ({
  role: h.role === "assistant" ? "model" : "user",
  parts: [{ text: h.content }],
}));

console.log("Model:", modelName, "| history:", history.length);

const t0 = Date.now();
try {
  const chat = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(
    "[YAZILI CEVAP] schreb bitte: ich komme aus der turkei"
  );
  console.log("OK in", Date.now() - t0, "ms");
  console.log(result.response.text().slice(0, 400));
} catch (err) {
  console.error("ERR in", Date.now() - t0, "ms:", err.message);
  process.exit(1);
}
