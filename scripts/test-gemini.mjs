import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "apps", "web");
const envPath = resolve(root, ".env.local");
const env = readFileSync(envPath, "utf8");
for (const line of env.split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
  console.error("NO GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

try {
  const result = await model.generateContent("Antworte auf Deutsch: Hallo!");
  console.log("OK", modelName, "->", result.response.text().slice(0, 150));
} catch (err) {
  console.error("ERR", err.message);
  process.exit(1);
}
