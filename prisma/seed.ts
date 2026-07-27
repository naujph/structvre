import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Produtos REAIS vendidos na Amazon BR. marketplaceUrl "#" = fallback pra
// busca por nome com a tag de afiliado (lib/affiliate.ts). Cole a URL exata
// (amazon.com.br/dp/ASIN) em marketplaceUrl para maior conversão.
// category "assistente" = hub de voz (troca por ecossistema no diagnóstico);
// category "hub" = bridge Zigbee (agnóstico).
const PRODUCTS = [
  {
    name: "Amazon Echo Dot 5ª geração",
    brand: "Amazon",
    category: "assistente",
    protocol: "wifi",
    compatibility: "alexa",
    price: 449,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Caixa de som inteligente com Alexa. Funciona como central de automação por voz.",
  },
  {
    name: "Google Nest Hub 2ª geração",
    brand: "Google",
    category: "assistente",
    protocol: "wifi",
    compatibility: "google_home",
    price: 749,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Tela inteligente com Google Assistant. Controla dispositivos compatíveis por voz e toque.",
  },
  {
    name: "Apple HomePod mini",
    brand: "Apple",
    category: "assistente",
    protocol: "wifi",
    compatibility: "homekit",
    price: 1099,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Caixa de som com Siri e Apple HomeKit. Central para o ecossistema Apple.",
  },
  {
    name: "Aqara Hub M2",
    brand: "Aqara",
    category: "hub",
    protocol: "zigbee",
    compatibility: "alexa,google_home,homekit",
    price: 599,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Hub Zigbee com Matter. Conecta sensores e dispositivos Aqara a qualquer assistente.",
  },
  {
    name: "Sonoff Zigbee Bridge",
    brand: "Sonoff",
    category: "hub",
    protocol: "zigbee",
    compatibility: "alexa,google_home",
    price: 179,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Bridge Zigbee de baixo custo para expandir a rede de sensores sem fio.",
  },
  {
    name: "Intelbras Interruptor Inteligente Wi-Fi IFW 1000",
    brand: "Intelbras",
    category: "iluminacao",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 159,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: true,
    requiresNeutralWire: true,
    isRentalFriendly: false,
    difficulty: "medio",
    description: "Interruptor de parede com controle por app e voz. Substitui o interruptor comum.",
  },
  {
    name: "Philips WiZ Connected RGB 9W",
    brand: "Philips",
    category: "iluminacao",
    protocol: "wifi",
    compatibility: "alexa,google_home,homekit",
    price: 119,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Lâmpada RGB com ajuste de cor e temperatura. Compatível com Matter (HomeKit).",
  },
  {
    name: "TP-Link Tapo P110 Tomada Inteligente",
    brand: "TP-Link",
    category: "energia",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 129,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Tomada inteligente com monitoramento de consumo em tempo real via app.",
  },
  {
    name: "Aqara Motion Sensor P1",
    brand: "Aqara",
    category: "sensor",
    protocol: "zigbee",
    compatibility: "alexa,google_home,homekit",
    price: 199,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Sensor de presença Zigbee. Ativa cenas de luz e segurança ao detectar movimento.",
  },
  {
    name: "TP-Link Tapo C200 Câmera Wi-Fi",
    brand: "TP-Link",
    category: "seguranca",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 229,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Câmera Full HD 360° com visão noturna, detecção de movimento e gravação na nuvem.",
  },
  {
    name: "Intelbras FR 220 Fechadura Digital",
    brand: "Intelbras",
    category: "seguranca",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 1299,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: true,
    requiresNeutralWire: false,
    isRentalFriendly: false,
    difficulty: "dificil",
    description: "Fechadura digital com biometria, senha, tag e app. Ideal para porta principal.",
  },
  {
    name: "Aqara Door/Window Sensor",
    brand: "Aqara",
    category: "seguranca",
    protocol: "zigbee",
    compatibility: "alexa,google_home,homekit",
    price: 149,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Sensor de abertura Zigbee. Avisa no celular quando portas ou janelas são abertas.",
  },
  {
    name: "BroadLink RM4 Mini Controle IR Universal",
    brand: "BroadLink",
    category: "climatizacao",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 119,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Controle infravermelho que transforma ar-condicionado e TV em inteligentes.",
  },
  {
    name: "SwitchBot Curtain 2",
    brand: "SwitchBot",
    category: "conforto",
    protocol: "wifi",
    compatibility: "alexa,google_home,homekit",
    price: 899,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: true,
    requiresNeutralWire: false,
    isRentalFriendly: false,
    difficulty: "medio",
    description: "Motor para cortina que abre/fecha por app, voz ou horário. Sem reforma pesada.",
  },
  {
    name: "Amazon Echo Studio",
    brand: "Amazon",
    category: "entretenimento",
    protocol: "wifi",
    compatibility: "alexa",
    price: 1299,
    marketplace: "amazon",
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Caixa de som 3D com Alexa. Som ambiente e assistente para salas e escritórios.",
  },
];

const KITS = [
  {
    name: "Start",
    slug: "start",
    category: "start",
    targetBudget: "ate_3000",
    homeType: "todos",
    hasAssistant: "sem_preferencia",
    protocol: "wifi",
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Iluminação e tomadas inteligentes para quem quer começar sem obras.",
    items: [
      { productName: "Amazon Echo Dot 5ª geração", quantity: 1 },
      { productName: "Philips WiZ Connected RGB 9W", quantity: 4 },
      { productName: "TP-Link Tapo P110 Tomada Inteligente", quantity: 3 },
      { productName: "Intelbras Interruptor Inteligente Wi-Fi IFW 1000", quantity: 2 },
    ],
  },
  {
    name: "Comfort",
    slug: "comfort",
    category: "comfort",
    targetBudget: "3000_7000",
    homeType: "todos",
    hasAssistant: "sem_preferencia",
    protocol: "wifi",
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Conforto com climatização, cortinas e sensores para sala e quarto.",
    items: [
      { productName: "Amazon Echo Dot 5ª geração", quantity: 1 },
      { productName: "BroadLink RM4 Mini Controle IR Universal", quantity: 2 },
      { productName: "Aqara Motion Sensor P1", quantity: 4 },
      { productName: "TP-Link Tapo P110 Tomada Inteligente", quantity: 3 },
      { productName: "SwitchBot Curtain 2", quantity: 1 },
    ],
  },
  {
    name: "Secure",
    slug: "secure",
    category: "secure",
    targetBudget: "3000_7000",
    homeType: "todos",
    hasAssistant: "sem_preferencia",
    protocol: "wifi",
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "medio",
    description: "Segurança completa com câmeras, fechadura e sensores de abertura.",
    items: [
      { productName: "Amazon Echo Dot 5ª geração", quantity: 1 },
      { productName: "TP-Link Tapo C200 Câmera Wi-Fi", quantity: 3 },
      { productName: "Intelbras FR 220 Fechadura Digital", quantity: 1 },
      { productName: "Aqara Door/Window Sensor", quantity: 4 },
      { productName: "Aqara Motion Sensor P1", quantity: 2 },
      { productName: "Aqara Hub M2", quantity: 1 },
    ],
  },
  {
    name: "Living Plus",
    slug: "living-plus",
    category: "living_plus",
    targetBudget: "7000_15000",
    homeType: "casa",
    hasAssistant: "sem_preferencia",
    protocol: "wifi",
    requiresNeutralWire: false,
    isRentalFriendly: false,
    difficulty: "medio",
    description: "Casa totalmente integrada com som, iluminação, climatização e segurança.",
    items: [
      { productName: "Amazon Echo Dot 5ª geração", quantity: 1 },
      { productName: "Sonoff Zigbee Bridge", quantity: 2 },
      { productName: "Intelbras Interruptor Inteligente Wi-Fi IFW 1000", quantity: 8 },
      { productName: "Philips WiZ Connected RGB 9W", quantity: 6 },
      { productName: "TP-Link Tapo P110 Tomada Inteligente", quantity: 4 },
      { productName: "Aqara Motion Sensor P1", quantity: 6 },
      { productName: "BroadLink RM4 Mini Controle IR Universal", quantity: 3 },
      { productName: "SwitchBot Curtain 2", quantity: 2 },
      { productName: "Amazon Echo Studio", quantity: 1 },
    ],
  },
];

const QUESTIONS = [
  {
    order: 1,
    code: "tipo_imovel",
    question: "Qual é o tipo do seu imóvel?",
    stage: "casa",
    options: [
      { value: "apartamento", label: "Apartamento" },
      { value: "casa_terrea", label: "Casa térrea" },
      { value: "casa_sobrado", label: "Sobrado" },
      { value: "kitnet", label: "Kitnet / studio" },
      { value: "cobertura", label: "Cobertura" },
    ],
  },
  {
    order: 2,
    code: "comodos",
    question: "Quais cômodos você quer automatizar primeiro?",
    stage: "casa",
    allowsMultiple: true,
    options: [
      { value: "sala", label: "Sala" },
      { value: "quarto", label: "Quarto" },
      { value: "cozinha", label: "Cozinha" },
      { value: "escritorio", label: "Escritório" },
      { value: "varanda", label: "Varanda" },
      { value: "garagem", label: "Garagem" },
      { value: "corredor", label: "Corredor" },
    ],
  },
  {
    order: 3,
    code: "objetivo_principal",
    question: "Qual é o seu objetivo principal com a automação?",
    stage: "objetivo",
    options: [
      { value: "economia", label: "Economia de energia" },
      { value: "seguranca", label: "Segurança" },
      { value: "conforto", label: "Conforto" },
      { value: "entretenimento", label: "Entretenimento" },
      { value: "acessibilidade", label: "Acessibilidade" },
      { value: "produtividade", label: "Produtividade" },
    ],
  },
  {
    order: 4,
    code: "ecossistema",
    question: "Você já usa algum assistente virtual?",
    stage: "infraestrutura",
    options: [
      { value: "alexa", label: "Amazon Alexa" },
      { value: "google_home", label: "Google Home" },
      { value: "homekit", label: "Apple HomeKit" },
      { value: "sem_preferencia", label: "Sem preferência" },
    ],
  },
  {
    order: 5,
    code: "faixa",
    question: "Qual faixa de investimento você imagina para começar?",
    stage: "orcamento",
    options: [
      { value: "ate_3000", label: "Até R$ 3.000" },
      { value: "3000_7000", label: "R$ 3.000 a R$ 7.000" },
      { value: "7000_15000", label: "R$ 7.000 a R$ 15.000" },
      { value: "acima_15000", label: "Acima de R$ 15.000" },
    ],
  },
  {
    order: 6,
    code: "modo_instalacao",
    question: "Como prefere fazer a instalação?",
    stage: "instalacao",
    options: [
      { value: "diy", label: "Quero instalar sozinho" },
      { value: "instalador", label: "Contratar instalador" },
      { value: "ver_guia", label: "Ver guia e decidir depois" },
    ],
  },
  {
    order: 7,
    code: "hobbies",
    question: "O que você mais gosta de fazer em casa?",
    stage: "toque_final",
    optional: true,
    allowsMultiple: true,
    options: [
      { value: "jogar", label: "Jogar" },
      { value: "musica", label: "Ouvir música / tocar" },
      { value: "ler", label: "Ler" },
      { value: "filmes", label: "Assistir filmes e séries" },
      { value: "receber", label: "Receber amigos e família" },
      { value: "trabalhar", label: "Trabalhar / estudar" },
      { value: "descansar", label: "Descansar" },
      { value: "tech", label: "Testar tecnologia" },
    ],
  },
];

async function main() {
  for (const q of QUESTIONS) {
    await prisma.quizQuestion.upsert({
      where: { code: q.code },
      update: {
        order: q.order,
        question: q.question,
        stage: q.stage,
        allowsMultiple: q.allowsMultiple ?? false,
        optional: q.optional ?? false,
        options: q.options,
        isActive: true,
      },
      create: {
        code: q.code,
        order: q.order,
        question: q.question,
        stage: q.stage,
        allowsMultiple: q.allowsMultiple ?? false,
        optional: q.optional ?? false,
        options: q.options,
        isActive: true,
      },
    });
  }

  // Desativa perguntas que saíram do fluxo (comeco, protocolo, profissao) —
  // a rota GET filtra isActive:true, então elas somem do quiz. Soft delete
  // preserva respostas antigas para análise e é idempotente.
  const activeCodes = QUESTIONS.map((q) => q.code);
  await prisma.quizQuestion.updateMany({
    where: { code: { notIn: activeCodes } },
    data: { isActive: false },
  });

  await prisma.kitItem.deleteMany({});
  await prisma.kit.deleteMany({});
  await prisma.product.deleteMany({});

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        brand: p.brand,
        category: p.category,
        protocol: p.protocol,
        compatibility: p.compatibility,
        price: p.price,
        marketplace: p.marketplace ?? null,
        marketplaceUrl: p.marketplaceUrl,
        affiliateUrl: p.affiliateUrl,
        requiresProfessional: p.requiresProfessional,
        requiresNeutralWire: p.requiresNeutralWire,
        isRentalFriendly: p.isRentalFriendly,
        difficulty: p.difficulty,
        description: p.description,
        isActive: true,
      },
    });
  }

  for (const k of KITS) {
    const kit = await prisma.kit.upsert({
      where: { slug: k.slug },
      update: {
        name: k.name,
        category: k.category,
        targetBudget: k.targetBudget,
        homeType: k.homeType,
        hasAssistant: k.hasAssistant,
        protocol: k.protocol,
        requiresNeutralWire: k.requiresNeutralWire,
        isRentalFriendly: k.isRentalFriendly,
        difficulty: k.difficulty,
        description: k.description,
        isActive: true,
      },
      create: {
        name: k.name,
        slug: k.slug,
        category: k.category,
        targetBudget: k.targetBudget,
        homeType: k.homeType,
        hasAssistant: k.hasAssistant,
        protocol: k.protocol,
        requiresNeutralWire: k.requiresNeutralWire,
        isRentalFriendly: k.isRentalFriendly,
        difficulty: k.difficulty,
        description: k.description,
        isActive: true,
      },
    });

    await prisma.kitItem.deleteMany({ where: { kitId: kit.id } });
    for (const item of k.items) {
      const product = await prisma.product.findFirst({ where: { name: item.productName } });
      if (!product) continue;
      await prisma.kitItem.create({
        data: {
          kitId: kit.id,
          productId: product.id,
          quantity: item.quantity,
        },
      });
    }

    const items = await prisma.kitItem.findMany({
      where: { kitId: kit.id },
      include: { product: true },
    });
    const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    await prisma.kit.update({ where: { id: kit.id }, data: { totalPrice } });
  }

  const qCount = await prisma.quizQuestion.count();
  const pCount = await prisma.product.count();
  const kCount = await prisma.kit.count();
  console.log(`Seed concluído: ${qCount} perguntas, ${pCount} produtos, ${kCount} kits.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });