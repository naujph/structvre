import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = parseInt(id, 10);
  if (Number.isNaN(sessionId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const data = await request.json().catch(() => ({}));
    const rawAnswers = Array.isArray(data.answers) ? data.answers : [];
    const isFinal = Boolean(data.is_final);

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const questionMap = new Map(
      (await prisma.quizQuestion.findMany()).map((q) => [q.code, q])
    );

    // Limpa e reinsere respostas
    for (const [idx, item] of rawAnswers.entries()) {
      const code = item.question_code;
      const value = item.value;
      if (!code || value === null || value === undefined) continue;

      const question = questionMap.get(code);

      await prisma.quizAnswer.deleteMany({
        where: { sessionId, questionCode: code },
      });

      await prisma.quizAnswer.create({
        data: {
          sessionId,
          questionId: question?.id || null,
          questionCode: code,
          value,
          orderIndex: idx,
        },
      });
    }

    const answers = await prisma.quizAnswer.findMany({
      where: { sessionId },
      orderBy: { orderIndex: "asc" },
    });
    const answersDict: Record<string, unknown> = {};
    for (const a of answers) {
      answersDict[a.questionCode] = a.value;
    }

    // TODO: portar detect_persona e price_preview do Flask
    // Por enquanto, o front mostra preview apenas quando a API retornar.
    const detectedPersona: string | null = null;
    const pricePreview: number | null = null;

    if (isFinal) {
      await prisma.quizSession.update({
        where: { id: sessionId },
        data: { status: "completed", completedAt: new Date() },
      });
    }

    const nextQuestion = await prisma.quizQuestion.findFirst({
      where: {
        isActive: true,
        code: { notIn: Object.keys(answersDict) },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      session_id: sessionId,
      answered_count: Object.keys(answersDict).length,
      next_question_code: nextQuestion?.code || null,
      is_complete: !nextQuestion,
      detected_persona: detectedPersona,
      price_preview: pricePreview,
    });
  } catch (error) {
    console.error("[diagnostic/answers]", error);
    return NextResponse.json(
      { error: "Erro ao salvar respostas" },
      { status: 500 }
    );
  }
}
