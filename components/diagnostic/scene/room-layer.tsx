"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Palette, RoomType } from "@/lib/diagnostic/scene";

interface RoomLayerProps {
  room: RoomType | null;
  palette: Palette;
}

/**
 * Casca da sala (parede, janela, piso, teto, luminoso) — sempre montada,
 * cores animadas pelo mood. O móvel-chave troca por cômodo com crossfade.
 * Flat-illustration, viewBox 1440x900, cobre a tela via preserveAspectRatio slice.
 */
export function RoomLayer({ room, palette }: RoomLayerProps) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sky} />
          <stop offset="100%" stopColor={palette.wall} stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="fixtureGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.fixture} />
          <stop offset="100%" stopColor={palette.fixture} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Teto */}
      <rect x="0" y="0" width="1440" height="70" fill="#e3eaf2" />
      {/* Parede do fundo (tint por mood) */}
      <motion.rect
        x="0"
        y="70"
        width="1440"
        height="650"
        fill={palette.wall}
        animate={{ fill: palette.wall }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <rect x="0" y="70" width="1440" height="650" fill="url(#wallShade)" />
      {/* Piso (madeira clara) */}
      <rect x="0" y="720" width="1440" height="180" fill="#d2c0a2" />
      <rect x="0" y="720" width="1440" height="6" fill={palette.light} opacity="0.22" />

      {/* Janela */}
      <g>
        <rect x="560" y="150" width="320" height="260" rx="6" fill="#0a0f1a" />
        <motion.rect
          x="568"
          y="158"
          width="304"
          height="244"
          rx="3"
          fill={palette.sky}
          animate={{ fill: palette.sky }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* lua/sol discreto */}
        <circle cx="780" cy="220" r="26" fill={palette.light} opacity="0.18" />
        {/* moldura + cruzeta */}
        <rect x="556" y="146" width="328" height="268" rx="8" fill="none" stroke="#0b1020" strokeWidth="10" />
        <rect x="716" y="158" width="8" height="244" fill="#0b1020" />
        <rect x="568" y="276" width="304" height="8" fill="#0b1020" />
      </g>

      {/* Luminoso de teto (pendente) */}
      <g>
        <rect x="716" y="70" width="8" height="90" fill="#1c2433" />
        <motion.circle
          cx="720"
          cy="190"
          r="14"
          fill={palette.light}
          animate={{ fill: palette.light, opacity: [0.85, 1, 0.85] }}
          transition={{
            fill: { duration: 0.8, ease: "easeOut" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.circle
          cx="720"
          cy="190"
          r="70"
          fill="url(#fixtureGlow)"
          animate={{ opacity: [0.6, 0.85, 0.6], scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "720px 190px" }}
        />
      </g>

      {/* Móvel-chave por cômodo (crossfade) */}
      <AnimatePresence mode="wait">
        <motion.g
          key={room ?? "empty"}
          initial={{ opacity: 0, y: 24, scale: 1.04 }}
          animate={{ opacity: 1, y: 0, scale: 1.1 }}
          exit={{ opacity: 0, y: -24, scale: 1.04 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ transformOrigin: "720px 760px" }}
        >
          <Furniture room={room} />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

/** Silhueta do móvel-chave por cômodo, apoiada no piso (y~720-820). */
function Furniture({ room }: { room: RoomType | null }) {
  const wood = "#1b2536";
  const wood2 = "#2a3346";
  const edge = "rgba(148,163,184,0.16)";
  switch (room) {
    case "sala":
      return (
        <g>
          {/* TV na parede */}
          <rect x="940" y="360" width="240" height="140" rx="8" fill="#0a0f1a" stroke="#222b3a" strokeWidth="4" />
          <rect x="952" y="372" width="216" height="116" rx="3" fill="#0d1422" opacity="0.6" />
          {/* rack */}
          <rect x="950" y="500" width="220" height="60" rx="4" fill={wood} />
          {/* sofá */}
          <rect x="240" y="640" width="430" height="90" rx="20" fill={wood2} />
          <rect x="250" y="560" width="410" height="110" rx="18" fill={wood} stroke={edge} strokeWidth="2" />
          <rect x="260" y="575" width="180" height="80" rx="14" fill={wood2} opacity="0.9" />
          <rect x="470" y="575" width="180" height="80" rx="14" fill={wood2} opacity="0.9" />
          {/* mesa de centro */}
          <rect x="430" y="740" width="160" height="40" rx="6" fill={wood} />
        </g>
      );
    case "quarto":
      return (
        <g>
          {/* cabeceira */}
          <rect x="220" y="430" width="900" height="180" rx="20" fill={wood2} stroke={edge} strokeWidth="2" />
          {/* colchão */}
          <rect x="240" y="600" width="860" height="110" rx="14" fill={wood} />
          {/* travesseiros */}
          <rect x="280" y="565" width="300" height="60" rx="20" fill="#222b3a" />
          <rect x="620" y="565" width="300" height="60" rx="20" fill="#222b3a" />
          {/* criado-mudo */}
          <rect x="150" y="650" width="70" height="80" rx="6" fill={wood} />
          {/* abajur */}
          <circle cx="185" cy="635" r="16" fill="#2a3343" />
        </g>
      );
    case "cozinha":
      return (
        <g>
          {/* bancada */}
          <rect x="120" y="560" width="1200" height="60" rx="6" fill={wood2} stroke={edge} strokeWidth="2" />
          <rect x="120" y="620" width="1200" height="180" fill={wood} />
          {/* gabinetes superiores */}
          <rect x="120" y="300" width="1200" height="120" rx="6" fill={wood} />
          <rect x="200" y="320" width="180" height="90" rx="4" fill="#0d1422" />
          <rect x="420" y="320" width="180" height="90" rx="4" fill="#0d1422" />
          <rect x="640" y="320" width="180" height="90" rx="4" fill="#0d1422" />
          {/* cooktop */}
          <rect x="900" y="560" width="160" height="20" rx="4" fill="#0a0f1a" />
          <circle cx="950" cy="540" r="14" fill="#222b3a" />
          <circle cx="1010" cy="540" r="14" fill="#222b3a" />
          {/* geladeira */}
          <rect x="1180" y="350" width="140" height="320" rx="8" fill={wood} stroke="#222b3a" strokeWidth="3" />
          <rect x="1192" y="370" width="116" height="120" rx="3" fill="#0d1422" />
        </g>
      );
    case "escritorio":
      return (
        <g>
          {/* mesa */}
          <rect x="220" y="640" width="760" height="24" rx="4" fill={wood2} stroke={edge} strokeWidth="2" />
          <rect x="250" y="664" width="16" height="120" fill={wood} />
          <rect x="934" y="664" width="16" height="120" fill={wood} />
          {/* monitor */}
          <rect x="500" y="430" width="240" height="150" rx="8" fill="#0a0f1a" stroke="#222b3a" strokeWidth="4" />
          <rect x="612" y="580" width="16" height="60" fill={wood} />
          <rect x="560" y="636" width="120" height="14" rx="4" fill={wood2} />
          {/* cadeira */}
          <rect x="560" y="700" width="120" height="70" rx="10" fill={wood} />
          <rect x="560" y="640" width="24" height="70" rx="8" fill={wood} />
        </g>
      );
    case "varanda":
      return (
        <g>
          {/* grade */}
          <rect x="120" y="600" width="1200" height="10" fill={wood} stroke={edge} strokeWidth="1.5" />
          {Array.from({ length: 16 }).map((_, i) => (
            <rect key={i} x={140 + i * 74} y="610" width="8" height="160" fill={wood2} />
          ))}
          <rect x="120" y="770" width="1200" height="10" fill={wood} />
          {/* planta */}
          <rect x="1180" y="640" width="70" height="80" rx="6" fill={wood2} />
          <circle cx="1215" cy="600" r="50" fill="#1a2a22" />
          <circle cx="1190" cy="580" r="34" fill="#1f3329" />
          <circle cx="1245" cy="585" r="30" fill="#1f3329" />
        </g>
      );
    case "garagem":
      return (
        <g>
          {/* carro (silhueta) */}
          <path
            d="M260 700 L320 600 L900 600 L980 700 Z"
            fill={wood2}
            stroke={edge}
            strokeWidth="2"
          />
          <rect x="320" y="640" width="580" height="40" rx="16" fill={wood} stroke={edge} strokeWidth="2" />
          {/* rodas */}
          <circle cx="400" cy="700" r="44" fill="#0a0f1a" />
          <circle cx="400" cy="700" r="20" fill="#222b3a" />
          <circle cx="840" cy="700" r="44" fill="#0a0f1a" />
          <circle cx="840" cy="700" r="20" fill="#222b3a" />
          {/* porta de garagem (linhas) */}
          <rect x="100" y="120" width="1240" height="430" fill="none" stroke="#1a212e" strokeWidth="6" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={120 + i * 206} y="140" width="6" height="400" fill="#1a212e" />
          ))}
        </g>
      );
    case "corredor":
      return (
        <g>
          {/* tapete de corredor (perspectiva) */}
          <path d="M620 720 L820 720 L980 820 L460 820 Z" fill={wood2} opacity="0.9" />
          <path d="M640 740 L800 740 L920 810 L520 810 Z" fill="#1a212e" />
          {/* quadros na parede */}
          <rect x="260" y="280" width="120" height="160" rx="6" fill="#0d1422" stroke="#222b3a" strokeWidth="4" />
          <rect x="1060" y="280" width="120" height="160" rx="6" fill="#0d1422" stroke="#222b3a" strokeWidth="4" />
        </g>
      );
    default:
      // sem cômodo ainda: sala vazia, só um tapete
      return <rect x="520" y="760" width="400" height="40" rx="6" fill="#1a212e" opacity="0.5" />;
  }
}