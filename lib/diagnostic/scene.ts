/**
 * Resolver puro da cena de fundo do diagnóstico.
 *
 * Deriva, das respostas do quiz, o estado da cena em camadas:
 *   room   — cômodo (de comeco, senão o 1º de comodos)
 *   mood   — clima/illuminação (de objetivo_principal)
 *   device — assistente de voz (de ecossistema)
 *   props  — silhuetas de objetos (de hobbies, multi → sala se "enche")
 *
 * Sem React, sem side-effects. Consumido por components/diagnostic/scene.
 */

export type RoomType =
  | "sala"
  | "quarto"
  | "cozinha"
  | "escritorio"
  | "varanda"
  | "garagem"
  | "corredor";

export type Mood =
  | "neutro"
  | "conforto"
  | "seguranca"
  | "economia"
  | "entretenimento"
  | "acessibilidade"
  | "produtividade";

export type Device = null | "alexa" | "google_home" | "homekit";

export type PropKey =
  | "musica"
  | "filmes"
  | "jogar"
  | "ler"
  | "receber"
  | "trabalhar"
  | "descansar"
  | "tech";

export interface Palette {
  /** Tinta da parede (hex). */
  wall: string;
  /** Cor do céu pela janela (hex). */
  sky: string;
  /** Cor da luz ambiente (hex). */
  light: string;
  /** Cor do glow do luminoso de teto (rgba). */
  fixture: string;
  /** Cor do overlay de mood (rgba), aplicado com mix-blend soft-light. */
  overlay: string;
  /** Opacidade do overlay (0..1). */
  overlayOpacity: number;
}

export const MOODS: Record<Mood, Palette> = {
  neutro: {
    wall: "#1e293b",
    sky: "#0f1b2e",
    light: "#cbd5e1",
    fixture: "rgba(203,213,225,0.45)",
    overlay: "rgba(148,163,184,0.5)",
    overlayOpacity: 0.38,
  },
  conforto: {
    wall: "#3a2e26",
    sky: "#2a1a14",
    light: "#ffb86b",
    fixture: "rgba(255,184,107,0.55)",
    overlay: "rgba(255,170,90,0.6)",
    overlayOpacity: 0.5,
  },
  seguranca: {
    wall: "#2a1f24",
    sky: "#1a1014",
    light: "#ff8b8b",
    fixture: "rgba(255,90,90,0.5)",
    overlay: "rgba(255,60,60,0.55)",
    overlayOpacity: 0.45,
  },
  economia: {
    wall: "#1a2620",
    sky: "#0e1a14",
    light: "#7fb88f",
    fixture: "rgba(110,190,130,0.35)",
    overlay: "rgba(110,190,130,0.5)",
    overlayOpacity: 0.42,
  },
  entretenimento: {
    wall: "#2a1f3b",
    sky: "#1a0f24",
    light: "#d946ef",
    fixture: "rgba(217,70,239,0.5)",
    overlay: "rgba(124,58,237,0.55)",
    overlayOpacity: 0.5,
  },
  acessibilidade: {
    wall: "#2a2f38",
    sky: "#1a2230",
    light: "#fef3c7",
    fixture: "rgba(254,243,199,0.6)",
    overlay: "rgba(255,250,230,0.5)",
    overlayOpacity: 0.38,
  },
  produtividade: {
    wall: "#1f2a38",
    sky: "#10182a",
    light: "#93c5fd",
    fixture: "rgba(147,197,253,0.5)",
    overlay: "rgba(120,160,220,0.55)",
    overlayOpacity: 0.45,
  },
};

export interface DeviceStyle {
  /** Cor do halo (hex). */
  halo: string;
  /** Forma da silhueta. */
  shape: "cylinder" | "screen" | "puck";
}

export const DEVICES: Record<Exclude<Device, null>, DeviceStyle> = {
  alexa: { halo: "#22d3ee", shape: "cylinder" },
  google_home: { halo: "#8ab4f8", shape: "screen" },
  homekit: { halo: "#f5f5f7", shape: "puck" },
};

export interface SceneState {
  room: RoomType | null;
  mood: Mood;
  device: Device;
  props: PropKey[];
}

export function isRoomType(v: unknown): v is RoomType {
  return (
    v === "sala" ||
    v === "quarto" ||
    v === "cozinha" ||
    v === "escritorio" ||
    v === "varanda" ||
    v === "garagem" ||
    v === "corredor"
  );
}

const MOOD_KEYS: Mood[] = [
  "neutro",
  "conforto",
  "seguranca",
  "economia",
  "entretenimento",
  "acessibilidade",
  "produtividade",
];

function isMood(v: unknown): v is Mood {
  return typeof v === "string" && (MOOD_KEYS as string[]).includes(v);
}

function isPropKey(v: unknown): v is PropKey {
  return (
    v === "musica" ||
    v === "filmes" ||
    v === "jogar" ||
    v === "ler" ||
    v === "receber" ||
    v === "trabalhar" ||
    v === "descansar" ||
    v === "tech"
  );
}

type Answers = Record<string, string | string[] | null | undefined>;

/**
 * Deriva o estado da cena. `lastAnsweredCode` não é estritamente necessário
 * aqui (a cena reflete o estado consolidado das respostas), mas é mantido na
 * assinatura para futuras refinações (ex.: realçar a camada que acabou de mudar).
 */
export function resolveScene(answers: Answers, _lastAnsweredCode?: string | null): SceneState {
  // room: comeco (single) se definido, senão o 1º de comodos (multi).
  const comeco = answers.comeco;
  const comodos = answers.comodos;
  let room: RoomType | null = null;
  if (isRoomType(comeco)) {
    room = comeco;
  } else if (Array.isArray(comodos)) {
    const first = comodos.find(isRoomType);
    room = first ?? null;
  } else if (isRoomType(comodos)) {
    room = comodos;
  }

  // mood
  const objetivo = answers.objetivo_principal;
  const mood: Mood = isMood(objetivo) ? objetivo : "neutro";

  // device
  const eco = answers.ecossistema;
  const device: Device =
    eco === "alexa" || eco === "google_home" || eco === "homekit" ? eco : null;

  // props (hobbies multi → array, ordem estável)
  const hobbies = answers.hobbies;
  const props: PropKey[] = [];
  if (Array.isArray(hobbies)) {
    for (const h of hobbies) if (isPropKey(h) && !props.includes(h)) props.push(h);
  } else if (isPropKey(hobbies)) {
    props.push(hobbies);
  }

  return { room, mood, device, props };
}