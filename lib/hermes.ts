import "server-only";

interface HermesLeadPayload {
  source: string;
  lead_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  geo_source: string | null;
  budget: string | null;
  automation_goals: string[];
  kit_recommended_id: number | null;
  wants_installer: boolean;
  temperature: string | null;
  quiz_session_id: number | null;
}

export interface HermesResult {
  sent: boolean;
  status?: number;
  error?: string;
}

export async function sendLeadToHermes(payload: HermesLeadPayload): Promise<HermesResult> {
  const hermesUrl = process.env.HERMES_WEBHOOK_URL;
  if (!hermesUrl) {
    return { sent: false, error: "HERMES_WEBHOOK_URL not configured" };
  }

  try {
    const resp = await fetch(hermesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Webhooks externos não devem bloquear o usuário por muito tempo
      signal: AbortSignal.timeout(8000),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "Unknown error");
      return { sent: false, status: resp.status, error: text };
    }

    return { sent: true, status: resp.status };
  } catch (err: any) {
    return { sent: false, error: err?.message || String(err) };
  }
}
