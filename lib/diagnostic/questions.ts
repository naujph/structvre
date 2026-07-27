export interface DiagnosticOption {
  value: string;
  label: string;
  icon?: string;
}

export interface DiagnosticQuestion {
  id: number;
  order: number;
  code: string;
  question: string;
  type: "single" | "multi";
  options: DiagnosticOption[];
  dimension: string;
  impact_weight: number;
  stage: string;
  optional: boolean;
}

export const STAGE_LABELS: Record<string, string> = {
  casa: "Sua casa",
  objetivo: "Objetivo",
  infraestrutura: "Infraestrutura",
  orcamento: "Orçamento",
  instalacao: "Instalação",
  toque_final: "Toque final",
};

export const STAGE_SUBTITLES: Record<string, string> = {
  casa: "Começando pelo espaço",
  objetivo: "O que você quer resolver",
  infraestrutura: "O que você já tem",
  orcamento: "Quanto pretende investir",
  instalacao: "Como prefere fazer",
  toque_final: "Opcional — ajuda a personalizar a cena",
};

export const STAGE_ORDER = [
  "casa",
  "objetivo",
  "infraestrutura",
  "orcamento",
  "instalacao",
  "toque_final",
];

export function groupByStage(questions: DiagnosticQuestion[]) {
  const grouped = new Map<string, DiagnosticQuestion[]>();
  for (const q of questions) {
    const stage = q.stage || "geral";
    if (!grouped.has(stage)) grouped.set(stage, []);
    grouped.get(stage)!.push(q);
  }
  return Array.from(grouped.entries())
    .filter(([stage]) => STAGE_ORDER.includes(stage))
    .sort(([a], [b]) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b))
    .map(([key, items]) => ({
      key,
      label: STAGE_LABELS[key] || key,
      subtitle: STAGE_SUBTITLES[key] || "",
      optional: items.every((q) => q.optional),
      questions: items.sort((a, b) => a.order - b.order),
    }));
}
