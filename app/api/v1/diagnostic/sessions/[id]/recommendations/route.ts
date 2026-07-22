import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendLeadToHermes } from "@/lib/hermes";

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

    if (!answersDict.faixa) {
      return NextResponse.json(
        { error: "Budget not answered yet" },
        { status: 400 }
      );
    }

    // TODO: portar recommend_kits do Flask. Stub enquanto isso.
    const topRecommendations = [
      {
        kit_id: 1,
        name: "Kit Comfort",
        slug: "comfort",
        category: "comfort",
        total_price: 7490,
        image_url: null,
        score: 0.88,
        score_breakdown: { conforto: 0.9, economia: 0.8, seguranca: 0.75, tech: 0.9 },
        explanation:
          "Ideal para quem quer começar pela sala e quarto com conforto e economia de energia.",
        reasons: [
          "Foco em conforto",
          "Orçamento compatível",
          "Instalação simplificada",
        ],
        products: [
          {
            id: 1,
            name: "Hub central",
            brand: "Strucvre",
            category: "hub",
            price: 890,
            quantity: 1,
            affiliate_url: "#",
            marketplace_url: "#",
            image_url: null,
            requires_professional: false,
            difficulty: "easy",
          },
          {
            id: 2,
            name: "Interruptor inteligente",
            brand: "Strucvre",
            category: "iluminacao",
            price: 180,
            quantity: 4,
            affiliate_url: "#",
            marketplace_url: "#",
            image_url: null,
            requires_professional: false,
            difficulty: "easy",
          },
        ],
      },
    ];

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
      },
    });

    return NextResponse.json({
      session_id: sessionId,
      persona: { slug: "comfort", name: "Conforto" },
      fallback_used: false,
      top_recommendations: topRecommendations,
      lead_id: leadId,
      project_id: null,
      hermes_sent: hermesResult.sent,
      hermes_status: hermesResult.status,
      hermes_error: hermesResult.error,
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
