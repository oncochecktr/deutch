import { completeExerciseCheck, isValidExerciseCheckBody } from "@/lib/speakExerciseCheck";
import { ChatProviderError } from "@/lib/chat/types";
import type { ExerciseCheckResponse } from "@/lib/speakExercisePrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Geçersiz JSON gövdesi." }, { status: 400 });
  }

  if (!isValidExerciseCheckBody(body)) {
    return Response.json(
      { error: "level, exerciseType, promptDe ve studentAnswer gerekli." },
      { status: 400 }
    );
  }

  const raw = body as unknown as Record<string, unknown>;
  const userApiKey = typeof raw.userApiKey === "string" ? raw.userApiKey : undefined;

  const req = {
    level: body.level,
    exerciseType: body.exerciseType,
    promptDe: body.promptDe,
    expectedHint: body.expectedHint ?? null,
    studentAnswer: body.studentAnswer.trim(),
    hintLevel: typeof body.hintLevel === "number" ? body.hintLevel : 1,
    weaknesses: Array.isArray(body.weaknesses)
      ? body.weaknesses.filter((w): w is string => typeof w === "string")
      : [],
    correctOptionId:
      typeof body.correctOptionId === "string" ? body.correctOptionId : undefined,
    correctTrueFalse:
      typeof body.correctTrueFalse === "boolean" ? body.correctTrueFalse : undefined,
    blankWord: typeof body.blankWord === "string" ? body.blankWord : undefined,
  };

  try {
    const t0 = Date.now();
    const result = await completeExerciseCheck(req, userApiKey);
    console.log(
      `[exercise] ✓ ${Date.now() - t0}ms type=${req.exerciseType} score=${result.score}`
    );
    return Response.json(result satisfies ExerciseCheckResponse);
  } catch (err) {
    if (err instanceof ChatProviderError) {
      return Response.json(
        { error: err.message, detail: err.detail },
        { status: err.status }
      );
    }
    console.error("[exercise] hata:", err);
    return Response.json({ error: "Egzersiz kontrolü şu an kullanılamıyor." }, { status: 500 });
  }
}
