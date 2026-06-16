import { synthesizeGermanMp3 } from "@/lib/edgeTtsServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("text")?.trim();
  if (!text) {
    return new Response("text gerekli", { status: 400 });
  }
  if (text.length > 500) {
    return new Response("metin çok uzun", { status: 400 });
  }

  try {
    const audio = await synthesizeGermanMp3(text);
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
