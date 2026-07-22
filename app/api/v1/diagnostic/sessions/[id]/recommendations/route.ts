import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendLeadToHermes } from "@/lib/hermes";
import { recommendKits } from "@/lib/diagnostic/recommendation";

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
    const contact = data.contact || {};

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { quizAnswers: { orderBy: { orderIndex: "asc" } } },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const answersDict: Record<string, unknown> = {};
    for (const a of session.quizAnswers) {
      answersDict[a.questionCode] = a.value;
    }

    const { top: topRecommendations, persona } = await recommendKits(answersDict, data.limit || 3);

    const recommendedKit = topRecommendations[0] || null;

    let leadId: number | null = null;
    let hermesResult: { sent: boolean; status?: number; error?: string } = { sent: false };
    if (contact.email || contact.phone) {
      const lead = await prisma.lead.create({
        data: {
          name: contact.name || null,
          email: contact.email || null,
          phone: contact.phone || null,
          city: contact.city || null,
          state: contact.state || null,
          latitude: contact.latitude ?? null,
          longitude: contact.longitude ?? null,
          geoSource: contact.geo_source || null,
          homeType: answersDict.tipo_imovel as string | null,
          budget: answersDict.faixa as string | null,
          automationGoals: normalizeList(answersDict.objetivo_principal),
          kitRecommendedId: recommendedKit?.kit_id ?? null,
          quizSessionId: sessionId,
          wantsInstaller: answersDict.modo_instalacao === "instalador",
          temperature: calculateTemperature(answersDict, contact),
        },
      });
      leadId = lead.id;

      // Envia silenciosamente para o Hermes — nunca expõe isso na UI
      hermesResult = await sendLeadToHermes({
        source: "strucvre-web",
        lead_id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        city: lead.city,
        state: lead.state,
        latitude: lead.latitude,
        longitude: lead.longitude,
        geo_source: lead.geoSource,
        budget: lead.budget,
        automation_goals: lead.automationGoals,
        kit_recommended_id: lead.kitRecommendedId,
        wants_installer: lead.wantsInstaller,
        temperature: lead.temperature,
        quiz_session_id: lead.quizSessionId,
      });

      if (hermesResult.sent) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { hermesSentAt: new Date() },
        });
      } else {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { hermesError: hermesResult.error || "unknown" },
        });
      }
    }

    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        completedAt: new Date(),
        leadId,
        finalKitId: recommendedKit?.kit_id ?? null,
      },
    });

    // Nunca expomos hermes_* no response do browser — o envio é silencioso
    return NextResponse.json({
      session_id: sessionId,
      persona,
      fallback_used: false,
      top_recommendations: topRecommendations,
      lead_id: leadId,
      project_id: null,
    });
  } catch (error) {
    console.error("[diagnostic/recommendations]", error);
    return NextResponse.json(
      { error: "Erro ao gerar recomendação" },
      { status: 500 }
    );
  }
}

function normalizeList(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));
  return [String(value)];
}

function calculateTemperature(
  answers: Record<string, unknown>,
  contact: Record<string, unknown>
): string {
  if (
    contact.email &&
    contact.phone &&
    answers.modo_instalacao === "instalador"
  ) {
    return "hot";
  }
  if (contact.email) return "warm";
  return "cold";
}
