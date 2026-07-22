"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  affiliate_url?: string;
  marketplace_url?: string;
  image_url?: string | null;
  requires_professional: boolean;
  difficulty: string;
}

interface Recommendation {
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
  products: Product[];
}

interface ResultCardProps {
  recommendation: Recommendation;
  personaName: string;
}

export function ResultCard({ recommendation, personaName }: ResultCardProps) {
  const primary =
    recommendation.products.find((p) => p.affiliate_url || p.marketplace_url) ||
    recommendation.products[0];
  const buyUrl = primary?.affiliate_url || primary?.marketplace_url || "#";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto w-full max-w-3xl px-4 sm:px-0"
    >
      <div className="glass-card p-6 sm:p-10 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300 sm:text-sm">
          Recomendação para {personaName}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:mt-3 sm:text-3xl lg:text-4xl">
          {recommendation.name}
        </h2>
        <p className="mt-3 text-base text-slate-300 sm:text-lg">{recommendation.explanation}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
          <span className="rounded-full bg-cyan-400/15 px-3 py-1.5 text-sm font-bold text-cyan-300 sm:px-4">
            {formatCurrency(recommendation.total_price)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300 sm:px-4">
            Score {(recommendation.score * 100).toFixed(0)}%
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-8 sm:p-6">
          <h3 className="text-base font-bold text-white sm:text-lg">Produtos inclusos</h3>
          <ul className="mt-3 space-y-3 sm:mt-4">
            {recommendation.products.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm text-slate-300 sm:text-base">
                  {p.name} {p.quantity > 1 && ` (x${p.quantity})`}
                </span>
                <span className="font-semibold text-white">
                  {formatCurrency(p.price * p.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 text-sm text-slate-300 sm:mt-6 sm:text-base">
          <strong className="text-white">Por que escolhemos:</strong>{" "}
          {recommendation.reasons.slice(0, 4).join(", ")}.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300 sm:px-6 sm:text-base"
          >
            Ver melhor preço
          </a>
          <Link
            href="/instaladores"
            className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6 sm:text-base"
          >
            Solicitar instalador
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
