import { NextRequest } from "next/server";
import { synthesizeGermanMp3, synthesizeTurkishMp3 } from "@/lib/edgeTtsServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text")?.trim();
  const lang = request.nextUrl.searchParams.get("lang")?.toLowerCase() ?? "de";

  if (!text) {
    return new Response("text gerekli", { status: 400 });
  }
  if (text.length > 500) {
    return new Response("metin çok uzun", { status: 400 });
  }

  try {
    const t0 = Date.now();
    console.log(`[tts] ▶ lang=${lang} chars=${text.length} text="${text.slice(0, 40)}…"`);
    const audio = lang === "tr" ? await synthesizeTurkishMp3(text) : await synthesizeGermanMp3(text);
    console.log(`[tts] ✓ ${Date.now() - t0}ms bytes=${audio.byteLength}`);
    return new Response(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800",
      },
    });
  } catch (err) {
    console.error("TTS hata:", err);
    return new Response("TTS başarısız", { status: 500 });
  }
}
