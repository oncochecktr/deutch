import { ChatProviderError } from "@/lib/chat/types";
import { generateDialogueStory, isValidDialogueGenerateBody } from "@/lib/dialogueGenerate";
import type { DialogueStory } from "@/lib/dialogueTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  if (!isValidDialogueGenerateBody(body)) {
    return Response.json({ error: "level (A1|A2|B1) gerekli." }, { status: 400 });
  }

  const req = {
    level: body.level,
    theme: typeof body.theme === "string" ? body.theme : undefined,
    style:
      body.style === "funny" || body.style === "daily" || body.style === "exam"
        ? body.style
        : undefined,
    maxLines: typeof body.maxLines === "number" ? body.maxLines : 16,
  };

  try {
    const t0 = Date.now();
    const story = await generateDialogueStory(req);
    console.log(
      `[dialogue] ✓ ${Date.now() - t0}ms level=${req.level} lines=${story.lines.length}`
    );
    return Response.json(story satisfies DialogueStory);
  } catch (err) {
    if (err instanceof ChatProviderError) {
      return Response.json({ error: err.message, detail: err.detail }, { status: err.status });
    }
    console.error("[dialogue] hata:", err);
    return Response.json({ error: "Hikaye üretimi şu an kullanılamıyor." }, { status: 500 });
  }
}
