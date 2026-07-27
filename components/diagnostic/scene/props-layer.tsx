"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PropKey } from "@/lib/diagnostic/scene";

/**
 * Silhuetas de objetos por hobby. A sala "se enche" conforme o usuário
 * revela interessos. Cada prop entra com scale+opacity e tem uma
 * micro-animação contínua leve. Múltiplos coexistem em posições fixas.
 */
export function PropsLayer({ props }: { props: PropKey[] }) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <AnimatePresence>
        {props.map((key) => (
          <PropSilhouette key={key} prop={key} />
        ))}
      </AnimatePresence>
    </svg>
  );
}

function PropSilhouette({ prop }: { prop: PropKey }) {
  const enter = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  switch (prop) {
    case "musica":
      // guitarra em suporte, canto esquerdo
      return (
        <motion.g
          {...enter}
          style={{ transformOrigin: "200px 700px" }}
          animate={{ opacity: 1, scale: 1, rotate: [-1.5, 1.5, -1.5] }}
          transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 }, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        >
          {/* suporte */}
          <rect x="170" y="760" width="60" height="14" rx="3" fill="#11161f" />
          <rect x="195" y="700" width="10" height="60" fill="#1a212e" />
          {/* corpo */}
          <ellipse cx="200" cy="640" rx="42" ry="54" fill="#1a212e" />
          <ellipse cx="200" cy="640" rx="20" ry="26" fill="#0b1020" />
          {/* braço */}
          <rect x="194" y="430" width="12" height="180" fill="#11161f" />
          <rect x="190" y="420" width="20" height="16" rx="3" fill="#1a212e" />
          {/* cordas */}
          <rect x="198" y="430" width="1.5" height="180" fill="#3a4458" opacity="0.6" />
          <rect x="202" y="430" width="1.5" height="180" fill="#3a4458" opacity="0.6" />
        </motion.g>
      );

    case "filmes":
      // brilho de projetor/tela na parede direita
      return (
        <motion.g
          {...enter}
          style={{ transformOrigin: "1200px 360px" }}
          animate={{ opacity: [1, 0.82, 1] }}
          transition={{ opacity: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
        >
          <rect x="1100" y="280" width="200" height="120" rx="6" fill="#0a0f1a" stroke="#222b3a" strokeWidth="3" />
          <rect x="1108" y="288" width="184" height="104" rx="3" fill="#10131c" opacity="0.9" />
          <rect x="1120" y="300" width="60" height="40" rx="3" fill="#1c2a3a" opacity="0.7" />
          <rect x="1190" y="300" width="60" height="40" rx="3" fill="#1c2a3a" opacity="0.5" />
          {/* glow do projetor */}
          <circle cx="1200" cy="340" r="60" fill="#22d3ee" opacity="0.05" />
        </motion.g>
      );

    case "jogar":
      // console + controle sob a TV
      return (
        <motion.g {...enter} style={{ transformOrigin: "1050px 540px" }}>
          <rect x="990" y="520" width="120" height="34" rx="10" fill="#11161f" />
          <motion.rect
            x="1090"
            y="528"
            width="6"
            height="18"
            rx="3"
            fill="#22d3ee"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* controle no chão */}
          <rect x="1010" y="600" width="80" height="30" rx="15" fill="#1a212e" />
          <circle cx="1024" cy="615" r="5" fill="#0b1020" />
          <circle cx="1076" cy="615" r="5" fill="#0b1020" />
        </motion.g>
      );

    case "ler":
      // estante de livros na parede esquerda
      return (
        <motion.g {...enter} style={{ transformOrigin: "120px 480px" }}>
          <rect x="80" y="300" width="140" height="420" rx="6" fill="#11161f" />
          {[0, 1, 2, 3].map((s) => (
            <g key={s}>
              <rect x="90" y={320 + s * 96} width="120" height="76" fill="#0b1020" />
              {Array.from({ length: 7 }).map((_, i) => (
                <rect
                  key={i}
                  x={94 + i * 16}
                  y={326 + s * 96}
                  width="10"
                  height={64 - (i % 3) * 8}
                  rx="1"
                  fill={["#1a212e", "#222b3a", "#1c2a3a", "#2a2433"][i % 4]}
                />
              ))}
            </g>
          ))}
        </motion.g>
      );

    case "receber":
      // poltronas extras centrais
      return (
        <motion.g {...enter} style={{ transformOrigin: "720px 760px" }}>
          <rect x="560" y="700" width="160" height="80" rx="16" fill="#1a212e" />
          <rect x="720" y="700" width="160" height="80" rx="16" fill="#1a212e" />
          <rect x="554" y="640" width="22" height="90" rx="8" fill="#11161f" />
          <rect x="864" y="640" width="22" height="90" rx="8" fill="#11161f" />
          {/* mesa redonda */}
          <ellipse cx="720" cy="700" rx="60" ry="16" fill="#11161f" />
        </motion.g>
      );

    case "trabalhar":
      // notebook na mesa central
      return (
        <motion.g {...enter} style={{ transformOrigin: "620px 620px" }}>
          <rect x="560" y="610" width="120" height="14" rx="3" fill="#11161f" />
          <rect x="570" y="540" width="100" height="74" rx="6" fill="#1a212e" />
          <rect x="578" y="548" width="84" height="58" rx="3" fill="#0d1422" opacity="0.8" />
          <rect x="560" y="624" width="120" height="10" rx="3" fill="#0b1020" />
        </motion.g>
      );

    case "descansar":
      // poltrona cozy / rede no canto direito
      return (
        <motion.g
          {...enter}
          style={{ transformOrigin: "1240px 760px" }}
          animate={{ opacity: 1, scale: 1, rotate: [-0.8, 0.8, -0.8] }}
          transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        >
          <rect x="1160" y="660" width="150" height="110" rx="22" fill="#1a212e" />
          <rect x="1160" y="610" width="26" height="100" rx="10" fill="#11161f" />
          <rect x="1284" y="610" width="26" height="100" rx="10" fill="#11161f" />
          <ellipse cx="1235" cy="640" rx="58" ry="20" fill="#222b3a" opacity="0.6" />
        </motion.g>
      );

    case "tech":
      // gadget/robô no chão
      return (
        <motion.g {...enter} style={{ transformOrigin: "460px 760px" }}>
          <motion.rect
            x="430"
            y="700"
            width="60"
            height="50"
            rx="14"
            fill="#1a212e"
            animate={{ y: [700, 694, 700] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="445" cy="718" r="6" fill="#22d3ee" opacity="0.8" />
          <circle cx="475" cy="718" r="6" fill="#22d3ee" opacity="0.8" />
          <rect x="438" y="750" width="10" height="24" rx="3" fill="#11161f" />
          <rect x="472" y="750" width="10" height="24" rx="3" fill="#11161f" />
          <motion.circle
            cx="460"
            cy="690"
            r="40"
            fill="#22d3ee"
            opacity="0.06"
            animate={{ opacity: [0.04, 0.12, 0.04] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      );
  }
}