import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: "Hub Central Strucvre",
    brand: "Strucvre",
    category: "hub",
    protocol: "wifi",
    compatibility: "alexa,google_home,homekit",
    price: 890,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Central de automação que conecta todos os dispositivos em um único app.",
  },
  {
    name: "Interruptor Inteligente 1 Tecla",
    brand: "Strucvre",
    category: "iluminacao",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 189,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: true,
    requiresNeutralWire: true,
    isRentalFriendly: false,
    difficulty: "medio",
    description: "Substitui o interruptor comum e permite controle por app e voz.",
  },
  {
    name: "Lâmpada Inteligente RGB",
    brand: "Strucvre",
    category: "iluminacao",
    protocol: "wifi",
    compatibility: "alexa,google_home,homekit",
    price: 129,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Lâmpada com ajuste de cor, temperatura e intensidade via app.",
  },
  {
    name: "Tomada Inteligente 16A",
    brand: "Strucvre",
    category: "energia",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 149,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Monitora consumo e permite ligar/desligar remotamente qualquer aparelho.",
  },
  {
    name: "Sensor de Presença Zigbee",
    brand: "Strucvre",
    category: "sensor",
    protocol: "zigbee",
    compatibility: "alexa,google_home",
    price: 159,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Ativa cenas de iluminação e segurança ao detectar movimento.",
  },
  {
    name: "Câmera Interna Full HD",
    brand: "Strucvre",
    category: "seguranca",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 349,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Câmera com visão noturna, detecção de movimento e notificações no celular.",
  },
  {
    name: "Fechadura Digital Inteligente",
    brand: "Strucvre",
    category: "seguranca",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 1290,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: true,
    requiresNeutralWire: false,
    isRentalFriendly: false,
    difficulty: "dificil",
    description: "Abertura por senha, biometria, tag e app. Ideal para portas principais.",
  },
  {
    name: "Sensor de Abertura para Portas",
    brand: "Strucvre",
    category: "seguranca",
    protocol: "zigbee",
    compatibility: "alexa,google_home",
    price: 99,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Avisa no celular quando portas ou janelas são abertas.",
  },
  {
    name: "Controle Remoto Infravermelho Universal",
    brand: "Strucvre",
    category: "climatizacao",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 199,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Transforma ar-condicionado e TV em inteligentes sem trocar equipamento.",
  },
  {
    name: "Cortina Motorizada",
    brand: "Strucvre",
    category: "conforto",
    protocol: "wifi",
    compatibility: "alexa,google_home",
    price: 990,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: true,
    requiresNeutralWire: false,
    isRentalFriendly: false,
    difficulty: "medio",
    description: "Abre e fecha automaticamente conforme horário, luz ou comando de voz.",
  },
  {
    name: "Soundbar Inteligente com Alexa",
    brand: "Strucvre",
    category: "entretenimento",
    protocol: "wifi",
    compatibility: "alexa",
    price: 1490,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Som ambiente e assistente virtual para salas e escritórios.",
  },
  {
    name: "Mini Hub Zigbee + Wi-Fi",
    brand: "Strucvre",
    category: "hub",
    protocol: "zigbee",
    compatibility: "alexa,google_home",
    price: 349,
    marketplaceUrl: "#",
    affiliateUrl: "#",
    requiresProfessional: false,
    requiresNeutralWire: false,
    isRentalFriendly: true,
    difficulty: "facil",
    description: "Expansão para redes Zigbee com baixa latência e maior estabilidade.",
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
      { productName: "Hub Central Strucvre", quantity: 1 },
      { productName: "Lâmpada Inteligente RGB", quantity: 4 },
      { productName: "Tomada Inteligente 16A", quantity: 3 },
      { productName: "Interruptor Inteligente 1 Tecla", quantity: 2 },
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
      { productName: "Hub Central Strucvre", quantity: 1 },
      { productName: "Controle Remoto Infravermelho Universal", quantity: 2 },
      { productName: "Sensor de Presença Zigbee", quantity: 4 },
      { productName: "Tomada Inteligente 16A", quantity: 3 },
      { productName: "Cortina Motorizada", quantity: 1 },
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
      { productName: "Hub Central Strucvre", quantity: 1 },
      { productName: "Câmera Interna Full HD", quantity: 3 },
      { productName: "Fechadura Digital Inteligente", quantity: 1 },
      { productName: "Sensor de Abertura para Portas", quantity: 4 },
      { productName: "Sensor de Presença Zigbee", quantity: 2 },
      { productName: "Mini Hub Zigbee + Wi-Fi", quantity: 1 },
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
      { productName: "Hub Central Strucvre", quantity: 1 },
      { productName: "Mini Hub Zigbee + Wi-Fi", quantity: 2 },
      { productName: "Interruptor Inteligente 1 Tecla", quantity: 8 },
      { productName: "Lâmpada Inteligente RGB", quantity: 6 },
      { productName: "Tomada Inteligente 16A", quantity: 4 },
      { productName: "Sensor de Presença Zigbee", quantity: 6 },
      { productName: "Controle Remoto Infravermelho Universal", quantity: 3 },
      { productName: "Cortina Motorizada", quantity: 2 },
      { productName: "Soundbar Inteligente com Alexa", quantity: 1 },
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
    code: "hobbies",
    question: "O que você mais gosta de fazer em casa?",
    stage: "sobre_voce",
    optional: true,
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
  {
    order: 4,
    code: "profissao",
    question: "Qual área te descreve melhor?",
    stage: "sobre_voce",
    optional: true,
    options: [
      { value: "tech", label: "Tecnologia" },
      { value: "criativo", label: "Criativo / design" },
      { value: "saude", label: "Saúde" },
      { value: "negocios", label: "Negócios" },
      { value: "educacao", label: "Educação" },
      { value: "outro", label: "Outro" },
    ],
  },
  {
    order: 5,
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
    order: 6,
    code: "comeco",
    question: "Por qual cômodo você gostaria de começar?",
    stage: "objetivo",
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
    order: 7,
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
    order: 8,
    code: "protocolo",
    question: "Tem preferência por protocolo de comunicação?",
    stage: "infraestrutura",
    optional: true,
    options: [
      { value: "zigbee", label: "Zigbee" },
      { value: "zwave", label: "Z-Wave" },
      { value: "wifi", label: "Wi-Fi / Matter" },
      { value: "nenhum", label: "Não sei / não importa" },
    ],
  },
  {
    order: 9,
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
    order: 10,
    code: "modo_instalacao",
    question: "Como prefere fazer a instalação?",
    stage: "instalacao",
    options: [
      { value: "diy", label: "Quero instalar sozinho" },
      { value: "instalador", label: "Contratar instalador" },
      { value: "ver_guia", label: "Ver guia e decidir depois" },
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
