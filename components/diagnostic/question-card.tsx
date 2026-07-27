"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DiagnosticQuestion,
  DiagnosticOption,
  isRangeQuestion,
} from "@/lib/diagnostic/questions";
import { formatCurrency } from "@/lib/format";

interface QuestionCardProps {
  question: DiagnosticQuestion;
  stageLabel: string;
  stageSubtitle: string;
  currentIndex: number;
  total: number;
  value: string | string[] | null | undefined;
  onChange: (value: string | string[]) => void;
  direction?: number;
}

const ICONS: Record<string, string> = {
  jogar: "🎮",
  musica: "🎸",
  ler: "📖",
  filmes: "🎬",
  receber: "🥂",
  trabalhar: "💼",
  descansar: "🌿",
  tech: "💻",
  criativo: "🎨",
  saude: "🩺",
  negocios: "📊",
  educacao: "🎓",
  outro: "🔹",
  apartamento: "🏢",
  casa_terrea: "🏠",
  casa_sobrado: "🏡",
  kitnet: "🛋️",
  cobertura: "🌇",
  sala: "🛋️",
  quarto: "🛏️",
  cozinha: "🍳",
  escritorio: "🖥️",
  varanda: "🪴",
  garagem: "🚗",
  corredor: "🚶",
  economia: "⚡",
  seguranca: "🔒",
  conforto: "🛋️",
  entretenimento: "🎉",
  acessibilidade: "♿",
  produtividade: "📈",
  alexa: "🎙️",
  google_home: "🎙️",
  homekit: "🎙️",
  sem_preferencia: "🔘",
  zigbee: "📡",
  zwave: "📡",
  nenhum: "❌",
  nao_tenho: "❌",
};

function getIcon(option: DiagnosticOption) {
  if (option.icon) return option.icon;
  if (ICONS[option.value]) return ICONS[option.value];
  const v = String(option.value).toLowerCase();
  if (v.includes("jogar") || v.includes("game")) return "🎮";
  if (v.includes("musica") || v.includes("tocar")) return "🎸";
  if (v.includes("ler") || v.includes("leitura")) return "📖";
  if (v.includes("filme") || v.includes("serie")) return "🎬";
  if (v.includes("receber") || v.includes("amigos")) return "🥂";
  if (v.includes("trabalh") || v.includes("estudar") || v.includes("escritorio"))
    return "💼";
  if (v.includes("descansar") || v.includes("saude")) return "🌿";
  if (v.includes("seguranca")) return "🔒";
  if (v.includes("economia")) return "⚡";
  if (v.includes("conforto")) return "🛋️";
  if (v.includes("entretenimento")) return "🎉";
  if (v.includes("lampada")) return "💡";
  if (v.includes("interruptor")) return "🔘";
  if (v.includes("camera") || v.includes("sensor")) return "📹";
  if (v.includes("fechadura")) return "🔐";
  if (v.includes("tomada")) return "🔌";
  return "✨";
}

export function QuestionCard({
  question,
  stageLabel,
  stageSubtitle,
  currentIndex,
  total,
  value,
  onChange,
  direction = 1,
}: QuestionCardProps) {
  const isMulti = question.type === "multi";
  const isRange = isRangeQuestion(question);
  const selectedValues = isMulti
    ? Array.isArray(value)
      ? value
      : []
    : value
    ? [String(value)]
    : [];

  function toggle(valueToToggle: string) {
    if (isMulti) {
      const set = new Set(selectedValues);
      if (set.has(valueToToggle)) set.delete(valueToToggle);
      else set.add(valueToToggle);
      onChange(Array.from(set));
      return;
    }
    onChange(valueToToggle);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-card mx-auto w-full max-w-3xl p-6 sm:p-10"
      >
        <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {stageLabel}
        </span>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:mt-3">
          {currentIndex + 1} de {total}
        </p>
        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          {question.question}
        </h2>
        {stageSubtitle && (
          <p className="mt-2 text-sm text-slate-400">{stageSubtitle}</p>
        )}

        {isRange ? (
          <BudgetSlider
            option={question.options[0]}
            value={value}
            onChange={(v) => onChange(v)}
          />
        ) : (
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {question.options.map((opt) => {
            const active = selectedValues.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={`
                  group flex min-h-[56px] items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.98] sm:min-h-[64px] sm:gap-4 sm:p-5
                  ${
                    active
                      ? "border-cyan-400 bg-cyan-400/15 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
                      : "border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-white/10"
                  }
                `}
                aria-pressed={active}
              >
                <span className="text-2xl transition-transform group-hover:scale-110 sm:text-3xl">
                  {getIcon(opt)}
                </span>
                <span className="text-sm font-medium text-slate-200 sm:text-base">{opt.label}</span>
              </button>
            );
          })}
        </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function BudgetSlider({
  option,
  value,
  onChange,
}: {
  option: DiagnosticOption;
  value: string | string[] | null | undefined;
  onChange: (value: string) => void;
}) {
  const min = option.min ?? 0;
  const max = option.max ?? 30000;
  const step = option.step ?? 500;
  // Armazena o valor em R$ (numero) — o motor converte pra faixa internamente
  // e a narrativa cita o valor real. Re-inicializa do salvo ao remontar (voltar).
  const stored = typeof value === "string" && value !== "" ? Number(value) : NaN;
  const [rangeValue, setRangeValue] = useState<number>(() =>
    Number.isFinite(stored) ? stored : 5000,
  );

  return (
    <div className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <span className="text-4xl font-bold text-white sm:text-5xl">
          {formatCurrency(rangeValue)}
        </span>
        <span className="text-sm text-slate-400">até {formatCurrency(max)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={rangeValue}
        onChange={(e) => {
          const n = Number(e.target.value);
          setRangeValue(n);
          onChange(String(n));
        }}
        className="mt-5 h-2 w-full cursor-pointer accent-cyan-400"
        aria-label="Faixa de investimento"
      />
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
    </div>
  );
}
