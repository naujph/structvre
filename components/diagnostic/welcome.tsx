"use client";

import { motion } from "framer-motion";

interface WelcomeProps {
  onStart: () => void;
}

export function Welcome({ onStart }: WelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto w-full max-w-2xl px-4 text-center sm:px-0"
    >
      <div className="glass-card p-6 sm:p-10 lg:p-14">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300 sm:text-sm">
          Diagnóstico Strucvre
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-white sm:mt-4 sm:text-4xl lg:text-5xl">
          Vamos desenhar o projeto da sua casa inteligente
        </h1>
        <p className="mt-4 text-base text-slate-300 sm:mt-5 sm:text-lg">
          Responda algumas perguntas rápidas. A cada escolha, o ambiente na tela
          muda para refletir o seu espaço e seu estilo de vida.
        </p>

        <div className="mt-6 grid gap-3 text-left sm:mt-8 sm:grid-cols-2 sm:gap-4">
          {[
            "Imóvel, cômodos e prioridades",
            "8 perfis de lifestyle",
            "Score multi-dimensional",
            "Orçamento e próximo passo",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
            >
              <span className="text-cyan-400">✓</span> {item}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3.5 text-base font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.4)] transition hover:bg-cyan-300 sm:mt-10 sm:px-8 sm:py-4 sm:text-lg"
        >
          Iniciar diagnóstico
        </button>
        <p className="mt-3 text-xs text-slate-500 sm:mt-4">
          Leva cerca de 3 minutos. Seus dados são usados apenas para montar a recomendação.
        </p>
      </div>
    </motion.div>
  );
}
