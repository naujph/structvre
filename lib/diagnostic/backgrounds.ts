function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=85`;
}

const STAGE_BACKGROUNDS: Record<string, string> = {
  welcome: unsplash("1600210492486-724fe5c67fb0"),
  casa: unsplash("1600585154340-be6161a56a0c"),
  sobre_voce: unsplash("1600210491896-9549a8a30292"),
  objetivo: unsplash("1556228453-efd6c1ff04f6"),
  infraestrutura: unsplash("1558002038-1091a1661116"),
  orcamento: unsplash("1583847268964-b28dc8fc51ba"),
  instalacao: unsplash("1600607687939-ce8a6c25118c"),
  contact: unsplash("1600566753190-17f0baa2a6c3"),
  result: unsplash("1600585154526-991d4774045e"),
};

const ANSWER_BACKGROUNDS: Record<
  string,
  Record<string, string>
> = {
  tipo_imovel: {
    apartamento: unsplash("1502672260266-1c1ef2d93636"),
    casa_terrea: unsplash("1600585154526-991d4774045e"),
    casa_sobrado: unsplash("1600607687939-ce8a6c25118c"),
    kitnet: unsplash("1554999367-4a6f83f58f78"),
    cobertura: unsplash("1600210492493-09469154332b"),
  },
  comodos: {
    sala: unsplash("1600210492486-724fe5c67fb0"),
    quarto: unsplash("1616594039963-1e9138757035"),
    cozinha: unsplash("1556911220-bda9f6f8f06d"),
    escritorio: unsplash("1497215728101-856f4ea42174"),
    varanda: unsplash("1560185009-c5d23e3a5045"),
    garagem: unsplash("1582582484337-08b5058d5562"),
    corredor: unsplash("1516455590571-14396e9ee76f"),
  },
  comeco: {
    sala: unsplash("1600210492486-724fe5c67fb0"),
    quarto: unsplash("1616594039963-1e9138757035"),
    cozinha: unsplash("1556911220-bda9f6f8f06d"),
    escritorio: unsplash("1497215728101-856f4ea42174"),
    varanda: unsplash("1560185009-c5d23e3a5045"),
    garagem: unsplash("1582582484337-08b5058d5562"),
    corredor: unsplash("1516455590571-14396e9ee76f"),
  },
  objetivo_principal: {
    economia: unsplash("1513506003013-577b5e0ed7fa"),
    seguranca: unsplash("1558002038-1091a1661116"),
    conforto: unsplash("1600210492486-724fe5c67fb0"),
    entretenimento: unsplash("1574375927938-d5a98e8ffe85"),
    acessibilidade: unsplash("1573164713714-d78e57f44b3d"),
    produtividade: unsplash("1497215728101-856f4ea42174"),
  },
  hobbies: {
    jogar: unsplash("1598550476439-6847785fcea6"),
    musica: unsplash("1511379938547-c1f69419868d"),
    ler: unsplash("1506880018603-83d5b814b5a6"),
    filmes: unsplash("1574375927938-d5a98e8ffe85"),
    receber: unsplash("1600891964092-4316c288032e"),
    trabalhar: unsplash("1497215728101-856f4ea42174"),
    descansar: unsplash("1540555700478-65ff2c8b6d3e"),
  },
  profissao: {
    tech: unsplash("1518770660439-4636190af475"),
    criativo: unsplash("1513364776144-60967b0f800f"),
    saude: unsplash("1576091160399-112ba8d25d1d"),
    negocios: unsplash("1486406146926-c627a92ad1ab"),
    educacao: unsplash("1503676260728-1c00da094a49"),
    outro: unsplash("1454165804606-c3d57bc86b40"),
  },
  modo_instalacao: {
    diy: unsplash("1581094794329-11d2b673eea2"),
    instalador: unsplash("1621905251189-3b7e6a8d9b0a"),
    ver_guia: unsplash("1516321318420-f909f4d6c404"),
  },
};

const PERSONA_BG: Record<string, string> = {
  gamer: unsplash("1598550476439-6847785fcea6"),
  musico: unsplash("1511379938547-c1f69419868d"),
  leitor: unsplash("1506880018603-83d5b814b5a6"),
  home_office: unsplash("1497215728101-856f4ea42174"),
  familia: unsplash("1511895426328-dc8714191300"),
  wellness: unsplash("1505693416388-ac5ce068fe85"),
  executivo: unsplash("1486406146926-c627a92ad1ab"),
  viajante: unsplash("1518780664697-55e3ad937233"),
};

function resolveValue(
  value: string | string[] | null | undefined,
  map: Record<string, string>
): string | null {
  if (!value || !map) return null;
  if (Array.isArray(value)) {
    for (const v of value) {
      if (map[v]) return map[v];
    }
    return null;
  }
  return map[value] || null;
}

export function resolveBackground(
  stageKey: string,
  answers: Record<string, string | string[] | null | undefined>,
  lastAnsweredCode: string | null,
  detectedPersona?: string | null
): string {
  if (
    (stageKey === "contact" || stageKey === "result") &&
    detectedPersona &&
    PERSONA_BG[detectedPersona]
  ) {
    return PERSONA_BG[detectedPersona];
  }

  if (lastAnsweredCode && ANSWER_BACKGROUNDS[lastAnsweredCode]) {
    const resolved = resolveValue(
      answers[lastAnsweredCode],
      ANSWER_BACKGROUNDS[lastAnsweredCode]
    );
    if (resolved) return resolved;
  }

  if (answers.comeco) {
    const resolved = resolveValue(answers.comeco, ANSWER_BACKGROUNDS.comeco);
    if (resolved) return resolved;
  }

  if (answers.objetivo_principal) {
    const resolved = resolveValue(
      answers.objetivo_principal,
      ANSWER_BACKGROUNDS.objetivo_principal
    );
    if (resolved) return resolved;
  }

  if (answers.comodos) {
    const resolved = resolveValue(answers.comodos, ANSWER_BACKGROUNDS.comodos);
    if (resolved) return resolved;
  }

  if (answers.hobbies) {
    const resolved = resolveValue(answers.hobbies, ANSWER_BACKGROUNDS.hobbies);
    if (resolved) return resolved;
  }

  if (answers.profissao) {
    const resolved = resolveValue(
      answers.profissao,
      ANSWER_BACKGROUNDS.profissao
    );
    if (resolved) return resolved;
  }

  if (answers.tipo_imovel) {
    const resolved = resolveValue(
      answers.tipo_imovel,
      ANSWER_BACKGROUNDS.tipo_imovel
    );
    if (resolved) return resolved;
  }

  return STAGE_BACKGROUNDS[stageKey] || STAGE_BACKGROUNDS.welcome;
}
