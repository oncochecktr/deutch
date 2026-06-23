import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "apps", "web");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const modelName = process.env.GEMINI_MODEL || "gemini-2.5-pro";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test(label, config) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: config,
  });
  try {
    const result = await model.generateContent("[YAZILI CEVAP] Hallo, ich heiße Timur.");
    const text = result.response.text?.() ?? "";
    console.log(label, "OK", "len=", text.length, text.slice(0, 120));
  } catch (err) {
    console.log(label, "ERR", err.message?.slice(0, 200));
  }
}

await test("with thinkingBudget 0", {
  responseMimeType: "application/json",
  maxOutputTokens: 4096,
  thinkingConfig: { thinkingBudget: 0 },
});
await test("without thinking", {
  responseMimeType: "application/json",
  maxOutputTokens: 4096,
});
