import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const questions = await prisma.quizQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      questions: questions.map((q) => ({
        id: q.id,
        order: q.order,
        code: q.code,
        question: q.question,
        type: q.allowsMultiple ? "multi" : "single",
        options: Array.isArray(q.options) ? q.options : [],
        dimension: q.dimension,
        impact_weight: q.impactWeight,
        stage: q.stage || "geral",
        optional: Boolean(q.optional),
      })),
    });
  } catch (error) {
    console.error("[diagnostic/questions]", error);
    return NextResponse.json(
      { error: "Erro ao carregar perguntas" },
      { status: 500 }
    );
  }
}
