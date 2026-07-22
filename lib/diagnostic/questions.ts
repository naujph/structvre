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
  sobre_voce: "Sobre você",
  objetivo: "Objetivo",
  infraestrutura: "Infraestrutura",
  orcamento: "Orçamento",
  instalacao: "Instalação",
};

export const STAGE_SUBTITLES: Record<string, string> = {
  casa: "Começando pelo espaço",
  sobre_voce: "Opcional — ajuda a personalizar",
  objetivo: "O que você quer resolver",
  infraestrutura: "O que você já tem",
  orcamento: "Quanto pretende investir",
  instalacao: "Como prefere fazer",
};

export const STAGE_ORDER = [
  "casa",
  "sobre_voce",
  "objetivo",
  "infraestrutura",
  "orcamento",
  "instalacao",
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
