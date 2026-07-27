/**
 * lib/diagnostic/narrative.ts
 * --------------------------------------------------------------------------
 * GERADOR DE NARRATIVA do diagnóstico de automação residencial.
 *
 * Substitui a construção genérica de `explanation` (que era só kit.description)
 * e dos `reasons` fixos em lib/diagnostic/recommendation.ts por um texto rico,
 * em PT-BR, que cita o orçamento real (R$), o objetivo, o tipo de imóvel, os
 * cômodos, o ecossistema, a dificuldade de instalação e um toque de
 * personalidade derivado dos hobbies.
 *
 * Função PURA e determinística: nada de Date.now(), Math.random(), React ou
 * imports externos. Tudo que ela precisa entra por parâmetro.
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface NarrativeInput {
  kitName: string;
  kitCategory: string;
  kitDescription: string | null;
  totalPrice: number;
  scores: {
    budget: number;
    goal: number;
    home: number;
    rental: number;
    difficulty: number;
    rooms: number;
  };
  answers: {
    tipo_imovel?: string | null;
    comodos?: string[] | null;
    objetivo_principal?: string | null;
    ecossistema?: string | null;
    faixa?: number | string | null;
    hobbies?: string[] | null;
  };
  personaName: string;
  productCount: number;
}

export interface NarrativeOutput {
  explanation: string;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Mapas de labels (valor cru do quiz -> texto legível em PT-BR)
// ---------------------------------------------------------------------------

const HOME_LABELS: Record<string, string> = {
  apartamento: "apartamento",
  casa_terrea: "casa térrea",
  casa_sobrado: "sobrado",
  kitnet: "kitnet",
  cobertura: "cobertura",
};

const ROOM_LABELS: Record<string, string> = {
  sala: "sala",
  quarto: "quarto",
  cozinha: "cozinha",
  escritorio: "escritório",
  varanda: "varanda",
  garagem: "garagem",
  corredor: "corredor",
};

const GOAL_LABELS: Record<string, string> = {
  economia: "economia de energia",
  seguranca: "segurança",
  conforto: "conforto",
  entretenimento: "entretenimento",
  acessibilidade: "acessibilidade",
  produtividade: "produtividade",
};

const ECOSYSTEM_LABELS: Record<string, string> = {
  alexa: "Alexa",
  google_home: "Google Home",
  homekit: "Apple HomeKit",
  sem_preferencia: "",
};

// Toque de personalidade por hobby — conecta o lazer a um recurso do kit.
const HOBBY_TOUCH: Record<string, string> = {
  jogar: "cenas de gameplay com a iluminação RGB",
  musica: "controle de som ambiente pelo assistente",
  ler: "luz de leitura com temperatura ajustável",
  filmes: "iluminação cenicável para sessão de cinema",
  receber: "cenas de recepção para visitantes",
  trabalhar: "rotinas de foco no escritório",
  descansar: "rotinas de relaxamento ao fim do dia",
  tech: "automações avançadas com sensores e rotinas",
};

const HOBBY_LABEL: Record<string, string> = {
  jogar: "gamer",
  musica: "ouvinte de música",
  ler: "leitor(a)",
  filmes: "cinéfilo(a)",
  receber: "anfitrião(ã)",
  trabalhar: "perfil produtivo",
  descansar: "busca por descanso",
  tech: "entusiasta de tecnologia",
};

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/** Formata um valor em R$ no padrão pt-BR sem centavos (R$ 5.000). */
function formatBRL(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "R$ 0";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/** Converte answers.faixa (number | string | null) num número válido (0 se vazio). */
function parseBudget(faixa: number | string | null | undefined): number {
  if (faixa === null || faixa === undefined) return 0;
  if (typeof faixa === "number")
    return Number.isFinite(faixa) && faixa > 0 ? faixa : 0;
  const n = Number(
    String(faixa)
      .replace(/[^\d.,]/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Junta uma lista de itens com vírgulas e "e" no final (lista pt-BR). */
function joinNatural(items: string[]): string {
  const list = items.filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} e ${list[1]}`;
  return `${list.slice(0, -1).join(", ")} e ${list[list.length - 1]}`;
}

function labelHome(value?: string | null): string {
  if (!value) return "";
  return HOME_LABELS[value] ?? value;
}

function labelGoal(value?: string | null): string {
  if (!value) return "";
  return GOAL_LABELS[value] ?? value;
}

function labelEcosystem(value?: string | null): string {
  if (!value) return "";
  return ECOSYSTEM_LABELS[value] ?? "";
}

function labelRooms(rooms?: string[] | null): string[] {
  if (!Array.isArray(rooms)) return [];
  return rooms
    .map((r) => (r && ROOM_LABELS[r]) || r || "")
    .filter(Boolean);
}

/** Frase curta sobre o encaixe do kit no orçamento (para a explanation). */
function budgetSentence(
  _budget: number,
  totalPrice: number,
  faixa: number,
): string {
  if (faixa <= 0) {
    return `O kit sai por ${formatBRL(totalPrice)}, sem teto de orçamento definido`;
  }
  if (totalPrice <= faixa) {
    const headroom = faixa - totalPrice;
    if (headroom > 0) {
      return `O investimento de ${formatBRL(totalPrice)} cabe folgado nos seus ${formatBRL(faixa)}, sobrando ${formatBRL(headroom)} para ajustes`;
    }
    return `O investimento de ${formatBRL(totalPrice)} encaixa exatamente nos seus ${formatBRL(faixa)}`;
  }
  const overspend = totalPrice - faixa;
  const ratio = overspend / faixa;
  if (ratio <= 0.1) {
    return `O kit custa ${formatBRL(totalPrice)}, um pouco acima dos seus ${formatBRL(faixa)}, mas ainda num estirão razoável`;
  }
  return `O kit custa ${formatBRL(totalPrice)}, estendendo ${formatBRL(overspend)} além dos seus ${formatBRL(faixa)} — é o topo da faixa`;
}

/**
 * Constrói a narrativa de análise exibida no resultado do diagnóstico.
 */
export function buildNarrative(input: NarrativeInput): NarrativeOutput {
  const {
    kitName,
    kitDescription,
    totalPrice,
    scores,
    answers,
    personaName,
    productCount,
  } = input;

  const faixa = parseBudget(answers.faixa);
  const home = labelHome(answers.tipo_imovel);
  const goal = labelGoal(answers.objetivo_principal);
  const ecosystem = labelEcosystem(answers.ecossistema);
  const rooms = labelRooms(answers.comodos);
  const hobbies = Array.isArray(answers.hobbies)
    ? answers.hobbies.filter(Boolean)
    : [];

  // ---------------------------------------------------------------------
  // explanation — 1 parágrafo, 2 a 4 frases
  // ---------------------------------------------------------------------
  const parts: string[] = [];

  const budgetPhrase =
    faixa <= 0 ? "sem teto de orçamento definido" : `com ${formatBRL(faixa)}`;
  const goalPhrase = goal ? `foco em ${goal}` : "foco em automação residencial";
  const homePhrase = home ? ` no seu ${home}` : "";

  const opening =
    faixa <= 0
      ? `Sem teto definido e ${goalPhrase}${homePhrase}, o kit ${kitName} é a nossa recomendação`
      : `${budgetPhrase.charAt(0).toUpperCase()}${budgetPhrase.slice(1)} e ${goalPhrase}${homePhrase}, o kit ${kitName} é a nossa recomendação`;
  parts.push(opening);

  if (rooms.length > 0) {
    parts.push(
      `ele cobre ${joinNatural(rooms)} com ${productCount} ${
        productCount === 1 ? "dispositivo" : "dispositivos"
      } selecionados`,
    );
  } else {
    parts.push(
      `ele reúne ${productCount} ${
        productCount === 1 ? "dispositivo" : "dispositivos"
      } prontos para instalar onde você preferir`,
    );
  }

  parts.push(`${budgetSentence(scores.budget, totalPrice, faixa)}.`);

  if (kitDescription) {
    const ecoPhrase = ecosystem ? ` integrado a ${ecosystem}` : "";
    parts.push(`${kitDescription.replace(/\.$/, "")}${ecoPhrase}`);
  } else if (ecosystem) {
    parts.push(`Tudo integrado a ${ecosystem}`);
  }

  const last = parts[parts.length - 1];
  const explanation =
    parts.join(", ") + (/[.!?]$/.test(last) ? "" : ".");

  // ---------------------------------------------------------------------
  // reasons — 4 a 6 bullets ricos e específicos
  // ---------------------------------------------------------------------
  const reasons: string[] = [];

  // 1) Orçamento
  if (faixa <= 0) {
    reasons.push(
      `Sem teto de orçamento: o kit custa ${formatBRL(totalPrice)} e fica por conta da sua decisão de investimento`,
    );
  } else if (totalPrice < faixa) {
    const headroom = faixa - totalPrice;
    const pct = Math.round((headroom / faixa) * 100);
    reasons.push(
      `Encaixe no orçamento: ${formatBRL(totalPrice)} dentro dos seus ${formatBRL(
        faixa,
      )}, com ${formatBRL(headroom)} (${pct}%) de folga para ajustes ou extras`,
    );
  } else if (totalPrice === faixa) {
    reasons.push(
      `Orçamento no limite: ${formatBRL(totalPrice)} corresponde exatamente ao teto de ${formatBRL(
        faixa,
      )} que você definiu`,
    );
  } else {
    const overspend = totalPrice - faixa;
    reasons.push(
      `No topo da faixa: ${formatBRL(totalPrice)} fica ${formatBRL(
        overspend,
      )} acima dos seus ${formatBRL(faixa)} — é a opção mais robusta antes de passar de patamar`,
    );
  }

  // 2) Objetivo principal
  if (goal) {
    const goalVerbs: Record<string, string> = {
      economia: "reduzindo consumo com tomadas e iluminação inteligentes",
      seguranca: "protegendo entradas com câmeras, sensores e fechadura",
      conforto: "automatizando clima, luzes e cortinas para o dia a dia",
      entretenimento: "elevando o som e a iluminação para momentos de lazer",
      acessibilidade: "facilitando o controle por voz e automações simples",
      produtividade: "criando rotinas de foco e cenas por cômodo",
    };
    const tail =
      goalVerbs[answers.objetivo_principal ?? ""] ?? "atendendo ao seu objetivo";
    reasons.push(
      `${goal.charAt(0).toUpperCase()}${goal.slice(1)} em primeiro lugar, ${tail}`,
    );
  }

  // 3) Cômodos cobertos
  if (rooms.length > 0) {
    reasons.push(
      `Cobre ${joinNatural(rooms)} — onde você disse que quer começar a automatizar`,
    );
  }

  // 4) Ecossistema / assistente
  if (ecosystem) {
    reasons.push(
      `Integra com ${ecosystem}, o assistente que você já usa, sem trocar de ecossistema`,
    );
  } else if (answers.ecossistema === "sem_preferencia") {
    reasons.push(
      `Funciona com Alexa, Google Home ou HomeKit — você escolhe o assistente depois`,
    );
  }

  // 5) Tipo de imóvel / locação
  if (home) {
    const rentalFriendly = scores.rental >= 0.9;
    if (
      rentalFriendly &&
      (answers.tipo_imovel === "apartamento" ||
        answers.tipo_imovel === "kitnet")
    ) {
      reasons.push(
        `Pensado para ${home}: instalação sem obra, ideal para aluguel ou imóvel compartilhado`,
      );
    } else {
      reasons.push(
        `Compatível com ${home}, respeitando o tipo de imóvel que você informou`,
      );
    }
  }

  // 6) Dificuldade de instalação
  if (scores.difficulty >= 0.9) {
    reasons.push("Instalação simples, sem necessidade de eletricista");
  } else if (scores.difficulty >= 0.55) {
    reasons.push(
      "Instalação intermediária — recomendamos um eletricista para os itens de parede",
    );
  } else {
    reasons.push(
      "Instalação mais exigente, com pontos que pedem profissional habilitado",
    );
  }

  // 7) Toque de personalidade (hobbies)
  const hobbyHits = hobbies.map((h) => HOBBY_TOUCH[h]).filter(Boolean);
  if (hobbyHits.length > 0) {
    const personaTag = personaName ? ` do perfil ${personaName}` : "";
    reasons.push(
      `Toque de personalidade${personaTag}: como você é ${
        hobbies.length === 1
          ? HOBBY_LABEL[hobbies[0]] ?? "multifacetado(a)"
          : "multifacetado(a)"
      }, vale explorar ${joinNatural(hobbyHits.slice(0, 2))}`,
    );
  }

  // Garante 4-6 bullets.
  const trimmed = reasons.slice(0, 6);
  while (trimmed.length < 4) {
    trimmed.push(
      kitDescription
        ? kitDescription.replace(/\.$/, "")
        : `Recomendado para o seu perfil com ${productCount} dispositivos`,
    );
    if (trimmed.length >= 4) break;
  }

  return {
    explanation,
    reasons: trimmed.slice(0, 6),
  };
}