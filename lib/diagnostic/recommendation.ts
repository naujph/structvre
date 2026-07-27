import { prisma } from "@/lib/db";
import { buildAffiliateUrl } from "@/lib/affiliate";
import { buildNarrative } from "@/lib/diagnostic/narrative";

export interface RecommendationProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  affiliate_url?: string | null;
  marketplace_url?: string | null;
  image_url?: string | null;
  requires_professional: boolean;
  difficulty: string;
}

export interface Recommendation {
  kit_id: number;
  name: string;
  slug: string;
  category: string;
  total_price: number;
  image_url?: string | null;
  score: number;
  score_breakdown: Record<string, number>;
  explanation: string;
  reasons: string[];
  products: RecommendationProduct[];
}

const BUDGET_ORDER = [
  "ate_1500",
  "1500_3000",
  "3000_5000",
  "5000_7000",
  "7000_10000",
  "10000_15000",
  "15000_22000",
  "22000_30000",
];

/** Converte o valor numérico (R$) do slider num tier de BUDGET_ORDER. */
export function budgetTierFromNumber(
  n: number | null | undefined,
): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  if (n < 1500) return "ate_1500";
  if (n < 3000) return "1500_3000";
  if (n < 5000) return "3000_5000";
  if (n < 7000) return "5000_7000";
  if (n < 10000) return "7000_10000";
  if (n < 15000) return "10000_15000";
  if (n < 22000) return "15000_22000";
  return "22000_30000";
}

/**
 * Resolve o tier de orçamento do usuário a partir de answers.faixa, que pode
 * ser o valor numérico (R$) do slider ("5000") ou, em sessões antigas, um tier
 * legado ("ate_3000"). Retorna null se ausente/inválido.
 */
function resolveUserBudget(faixa: unknown): string | null {
  if (typeof faixa === "number") return budgetTierFromNumber(faixa);
  if (typeof faixa === "string" && faixa !== "") {
    if (BUDGET_ORDER.includes(faixa)) return faixa; // legado: tier antigo
    return budgetTierFromNumber(Number(faixa)); // slider: valor em R$
  }
  return null;
}

function budgetIndex(value: string | null): number {
  if (!value) return -1;
  return BUDGET_ORDER.indexOf(value);
}

function scoreBudget(kitBudget: string, userBudget: string | null): number {
  const k = budgetIndex(kitBudget);
  const u = budgetIndex(userBudget);
  if (k === -1 || u === -1) return 0.5;
  if (k === u) return 1;
  if (k < u) return 0.75; // kit abaixo do orçamento: ainda ok
  if (k === u + 1) return 0.55; // um degrau acima: aceitável
  return 0.2; // muito acima
}

function scoreGoal(kitCategory: string, userGoal: string | null): number {
  if (!userGoal) return 0.5;
  const mapping: Record<string, string[]> = {
    conforto: ["comfort", "living_plus"],
    seguranca: ["secure", "living_plus"],
    economia: ["comfort", "living_plus", "start"],
    entretenimento: ["living_plus", "comfort"],
    acessibilidade: ["comfort", "start", "living_plus"],
    produtividade: ["comfort", "start", "living_plus"],
  };
  const matches = mapping[userGoal] || [];
  if (matches.includes(kitCategory)) return 1;
  return 0.3;
}

function scoreHomeType(kitHomeType: string, userHomeType: string | null): number {
  if (!userHomeType) return 0.7;
  if (kitHomeType === "todos") return 0.9;
  if (kitHomeType === userHomeType) return 1;
  if (userHomeType.startsWith("casa_") && kitHomeType === "casa") return 0.85;
  return 0.5;
}

function scoreRental(kitRental: boolean, userHomeType: string | null): number {
  if (!kitRental) return 0.75;
  const rentalHeavy = ["apartamento", "kitnet"];
  if (userHomeType && rentalHeavy.includes(userHomeType)) return 1;
  return 0.85;
}

function scoreDifficulty(
  kitDifficulty: string,
  installMode: string | null
): number {
  if (!installMode || installMode === "ver_guia") return 0.8;
  if (installMode === "diy") {
    return kitDifficulty === "facil" ? 1 : kitDifficulty === "medio" ? 0.6 : 0.2;
  }
  if (installMode === "instalador") return 1;
  return 0.8;
}

function scoreRooms(
  kitItems: { product: { category: string } }[],
  userRooms: unknown
): number {
  if (!Array.isArray(userRooms) || userRooms.length === 0) return 0.75;

  const roomNeeds: Record<string, string[]> = {
    sala: ["iluminacao", "climatizacao", "conforto", "entretenimento", "energia"],
    quarto: ["iluminacao", "climatizacao", "conforto", "energia"],
    cozinha: ["iluminacao", "energia", "sensor"],
    escritorio: ["iluminacao", "climatizacao", "conforto", "entretenimento"],
    varanda: ["seguranca", "iluminacao", "sensor"],
    garagem: ["seguranca", "sensor", "iluminacao"],
    corredor: ["iluminacao", "sensor"],
  };

  const kitCategories = new Set(kitItems.map((i) => i.product.category));
  let matchedRooms = 0;
  for (const room of userRooms as string[]) {
    const needs = roomNeeds[room] || [];
    if (needs.some((cat) => kitCategories.has(cat))) matchedRooms++;
  }
  return 0.4 + 0.6 * (matchedRooms / userRooms.length);
}

export async function recommendKits(
  answers: Record<string, unknown>,
  limit = 3
): Promise<{ top: Recommendation[]; persona: { slug: string; name: string } }> {
  const kits = await prisma.kit.findMany({
    where: { isActive: true },
    include: { items: { include: { product: true } } },
  });

  const userBudget = resolveUserBudget(answers.faixa);
  const userGoal = answers.objetivo_principal as string | null;
  const userHomeType = answers.tipo_imovel as string | null;
  const installMode = answers.modo_instalacao as string | null;
  const userRooms = answers.comodos as unknown;
  const ecosystem = (answers.ecossistema as string | null) ?? null;

  // Hubs de voz por ecossistema — o diagnóstico decide qual assistente entra no kit.
  const assistentes = await prisma.product.findMany({
    where: { category: "assistente", isActive: true },
  });
  const swapAssistente =
    ecosystem && ecosystem !== "sem_preferencia"
      ? assistentes.find((a) =>
          a.compatibility.split(",").map((s) => s.trim()).includes(ecosystem),
        ) ?? null
      : null;

  // Persona derivada do objetivo principal — usada para rotular o orçamento e
  // alimentar a narrativa (toque de personalidade por hobby). Computada antes do
  // map para ficar disponível dentro de buildNarrative.
  const persona = detectPersona(userGoal);

  const scored = kits.map((kit) => {
    const budget = scoreBudget(kit.targetBudget, userBudget);
    const goal = scoreGoal(kit.category, userGoal);
    const home = scoreHomeType(kit.homeType, userHomeType);
    const rental = scoreRental(kit.isRentalFriendly, userHomeType);
    const difficulty = scoreDifficulty(kit.difficulty, installMode);
    const rooms = scoreRooms(kit.items, userRooms);

    const weights = {
      budget: 0.35,
      goal: 0.3,
      home: 0.1,
      rental: 0.05,
      difficulty: 0.1,
      rooms: 0.1,
    };

    const score =
      budget * weights.budget +
      goal * weights.goal +
      home * weights.home +
      rental * weights.rental +
      difficulty * weights.difficulty +
      rooms * weights.rooms;

    const products: RecommendationProduct[] = kit.items.map((item) => {
      // Troca o assistente do kit pelo do ecossistema escolhido pelo usuário.
      const product =
        swapAssistente && item.product.category === "assistente"
          ? swapAssistente
          : item.product;
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
        affiliate_url: buildAffiliateUrl(product),
        marketplace_url: product.marketplaceUrl,
        image_url: product.imageUrl,
        requires_professional: product.requiresProfessional,
        difficulty: product.difficulty,
      };
    });

    // Recalcula o total a partir dos produtos (o hub pode ter sido trocado).
    const totalPrice = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0,
    );

    // Narrativa rica em PT-BR: cita orçamento real (R$), objetivo, imóvel,
    // cômodos, ecossistema, dificuldade e toque de personalidade por hobby.
    const narrative = buildNarrative({
      kitName: kit.name,
      kitCategory: kit.category,
      kitDescription: kit.description,
      totalPrice,
      scores: { budget, goal, home, rental, difficulty, rooms },
      answers: {
        tipo_imovel: userHomeType,
        comodos: Array.isArray(userRooms) ? (userRooms as string[]) : null,
        objetivo_principal: userGoal,
        ecossistema: ecosystem,
        faixa: answers.faixa as string | number | null,
        hobbies: Array.isArray(answers.hobbies)
          ? (answers.hobbies as string[])
          : null,
      },
      personaName: persona.name,
      productCount: products.length,
    });

    const recommendation: Recommendation = {
      kit_id: kit.id,
      name: kit.name,
      slug: kit.slug,
      category: kit.category,
      total_price: totalPrice,
      image_url: kit.imageUrl,
      score,
      score_breakdown: {
        budget,
        goal,
        home,
        rental,
        difficulty,
        rooms,
      },
      explanation: narrative.explanation,
      reasons: narrative.reasons,
      products,
    };

    return recommendation;
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, limit);

  return { top, persona };
}

function detectPersona(goal: string | null): { slug: string; name: string } {
  switch (goal) {
    case "seguranca":
      return { slug: "secure", name: "Segurança" };
    case "economia":
      return { slug: "economia", name: "Economia" };
    case "entretenimento":
      return { slug: "living", name: "Living" };
    case "acessibilidade":
    case "produtividade":
      return { slug: "comfort", name: "Conforto" };
    case "conforto":
    default:
      return { slug: "comfort", name: "Conforto" };
  }
}
