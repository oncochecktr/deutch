import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "apps", "web");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  systemInstruction:
    "Du bist ein deutscher Lehrer A1. Antworte NUR JSON: {reply, correction, correctionExplanation}",
  generationConfig: {
    responseMimeType: "application/json",
    maxOutputTokens: 1024,
  },
});

try {
  const chat = model.startChat({ history: [] });
  const result = await chat.sendMessage("Hallo, wo fangen wir an?");
  console.log("OK", result.response.text().slice(0, 300));
} catch (err) {
  console.error("ERR", err.message);
  process.exit(1);
}
