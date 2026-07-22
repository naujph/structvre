import { prisma } from "@/lib/db";

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

const BUDGET_ORDER = ["ate_3000", "3000_7000", "7000_15000", "acima_15000"];

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

  const userBudget = answers.faixa as string | null;
  const userGoal = answers.objetivo_principal as string | null;
  const userHomeType = answers.tipo_imovel as string | null;
  const installMode = answers.modo_instalacao as string | null;
  const userRooms = answers.comodos as unknown;

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

    const reasons: string[] = [];
    if (budget >= 0.9) reasons.push("Orçamento ideal");
    else if (budget >= 0.6) reasons.push("Dentro do orçamento");
    if (goal >= 0.9) reasons.push("Foco no seu objetivo principal");
    if (home >= 0.9) reasons.push("Compatível com seu imóvel");
    if (difficulty >= 0.9) reasons.push("Instalação adequada ao seu perfil");
    if (rooms >= 0.8) reasons.push("Cobre os cômodos escolhidos");
    if (reasons.length === 0) reasons.push("Kits disponíveis para o seu perfil");

    const products: RecommendationProduct[] = kit.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      brand: item.product.brand,
      category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
      affiliate_url: item.product.affiliateUrl,
      marketplace_url: item.product.marketplaceUrl,
      image_url: item.product.imageUrl,
      requires_professional: item.product.requiresProfessional,
      difficulty: item.product.difficulty,
    }));

    const recommendation: Recommendation = {
      kit_id: kit.id,
      name: kit.name,
      slug: kit.slug,
      category: kit.category,
      total_price: kit.totalPrice,
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
      explanation:
        kit.description ||
        `Kit ${kit.name} recomendado com base no seu perfil.`,
      reasons,
      products,
    };

    return recommendation;
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, limit);
  const persona = detectPersona(userGoal);

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
