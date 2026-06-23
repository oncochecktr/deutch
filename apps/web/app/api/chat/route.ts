import {
  ChatProviderError,
  completeChat,
  isValidChatBody,
  parseChatAuth,
  getChatProviderConfig,
  resolveChatProvider,
} from "@/lib/chat";
import type { ChatErrorResponse, ChatResponse } from "@/lib/speakTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Geçersiz JSON gövdesi." } satisfies ChatErrorResponse,
      { status: 400 }
    );
  }

  if (!isValidChatBody(body)) {
    return Response.json(
      { error: "message, level (A1|A2|B1) ve history gerekli." } satisfies ChatErrorResponse,
      { status: 400 }
    );
  }

  try {
    const auth = parseChatAuth(body as unknown as Record<string, unknown>);
    const provider = resolveChatProvider(auth);
    const config = getChatProviderConfig(provider, auth);
    const t0 = Date.now();
    const msgPreview = body.message.slice(0, 60).replace(/\s+/g, " ");
    console.log(
      `[chat] ▶ model=${config.model} level=${body.level} history=${body.history.length} msg="${msgPreview}"${auth?.apiKey ? " userKey=1" : ""}`
    );
    const parsed = await completeChat(
      {
        message: body.message,
        level: body.level,
        history: body.history,
        inputLanguage: body.inputLanguage ?? "de",
        lessonId: body.lessonId,
        lessonStepIndex: body.lessonStepIndex,
        studentProfile: body.studentProfile,
      },
      auth
    );
    const ms = Date.now() - t0;
    console.log(
      `[chat] ✓ ${ms}ms tokens=${parsed.usage?.totalTokens ?? "?"} model=${parsed.usage?.model ?? config.model} reply="${parsed.reply.slice(0, 50)}…"`
    );
    return Response.json({ ...parsed, provider } satisfies ChatResponse);
  } catch (err) {
    if (err instanceof ChatProviderError) {
      console.error(`[chat] ✗ ${err.message}`, err.detail ?? "");
      return Response.json(
        {
          error: err.message,
          detail: err.detail,
          code: `${err.provider}_${err.status}`,
        } satisfies ChatErrorResponse,
        { status: err.status }
      );
    }

    console.error("Chat API hata:", err);
    return Response.json(
      { error: "Konuşma partneri şu an kullanılamıyor." } satisfies ChatErrorResponse,
      { status: 500 }
    );
  }
}
