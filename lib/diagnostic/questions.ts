export interface DiagnosticOption {
  value: string;
  label: string;
  icon?: string;
  /** Presente apenas no tipo "range": limites do slider. */
  min?: number;
  max?: number;
  step?: number;
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
  toque_final: "Toque final",
};

export const STAGE_SUBTITLES: Record<string, string> = {
  casa: "Começando pelo espaço",
  objetivo: "O que você quer resolver",
  infraestrutura: "O que você já tem",
  orcamento: "Quanto pretende investir",
  toque_final: "Opcional — ajuda a personalizar a cena",
};

export const STAGE_ORDER = [
  "casa",
  "objetivo",
  "infraestrutura",
  "orcamento",
  "toque_final",
];

/**
 * Pergunta de orçamento renderizada como slider (uma única opção marcadora
 * com value "range" + min/max/step). O card troca os botões por um input range
 * e a página NÃO avança automaticamente (precisa do botão Avançar).
 */
export function isRangeQuestion(q: DiagnosticQuestion): boolean {
  return q.options.length === 1 && q.options[0].value === "range";
}

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
