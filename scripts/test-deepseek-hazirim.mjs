import { readFileSync } from "fs";
import { resolve } from "path";

const root = resolve("apps/web");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const system = `Sen Alman Almanca profesorusun. JSON ile cevap ver.
ADIM DURUMU: Bu adim HENUZ TANITILMADI.
boardPhase MUST be teach.
germanQuestion = null, conceptIntroduced = false.
Ogrenci ornekleri okudu ve hazirim dedi - alistirmaya gec.`;

const history = [
  { role: "user", content: "[YAZILI CEVAP] hocam merhaba" },
  {
    role: "assistant",
    content:
      "Merhaba Timur! Bugun Ne is yapiyorsun konusunu ogrenecegiz. Ornekleri oku.",
  },
];

const body = {
  model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
  messages: [
    { role: "system", content: system },
    ...history,
    { role: "user", content: "[YAZILI CEVAP] hazirim hocam" },
  ],
  response_format: { type: "json_object" },
  max_tokens: 2048,
  temperature: 0.7,
};

const res = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  },
  body: JSON.stringify(body),
});
const data = await res.json();
console.log("status", res.status);
console.log("finish", data.choices?.[0]?.finish_reason);
console.log("content len", data.choices?.[0]?.message?.content?.length ?? 0);
console.log("content preview", (data.choices?.[0]?.message?.content ?? "").slice(0, 400));
console.log("usage", data.usage);
if (data.error) console.log("error", data.error);
console.log("keys", Object.keys(data.choices?.[0]?.message ?? {}));
