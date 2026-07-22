import { NextResponse } from "next/server";
import { randomUUID, createHash } from "crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => ({}));
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    const session = await prisma.quizSession.create({
      data: {
        externalId: randomUUID(),
        channel: data.channel || "web",
        userAgent: data.user_agent || userAgent || null,
        ipHash: hashIp(ip),
        status: "started",
      },
    });

    return NextResponse.json(
      {
        session_id: session.id,
        external_id: session.externalId,
        started_at: session.startedAt?.toISOString(),
        status: session.status,
        questions_url: "/api/v1/diagnostic/questions",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[diagnostic/sessions]", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão" },
      { status: 500 }
    );
  }
}
