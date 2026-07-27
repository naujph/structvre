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

/**
 * Resolve o link de compra de um produto: prioriza o link de afiliado (já com
 * ?tag=strv08-20), cai no marketplaceUrl real, e devolve null quando não há
 * nenhum (item sem ASIN na Amazon BR). Nunca retorna "#".
 */
function resolveBuyUrl(p: Product): string | null {
  if (p.affiliate_url && p.affiliate_url !== "#" && p.affiliate_url !== "")
    return p.affiliate_url;
  if (p.marketplace_url && p.marketplace_url !== "#" && p.marketplace_url !== "")
    return p.marketplace_url;
  return null;
}

export function ResultCard({ recommendation, personaName }: ResultCardProps) {
  const products = recommendation.products;
  const itemCount = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto w-full max-w-3xl px-4 sm:px-0"
    >
      <div className="glass-card p-6 sm:p-10 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300 sm:text-sm">
          Orçamento para {personaName}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:mt-3 sm:text-3xl lg:text-4xl">
          {recommendation.name}
        </h2>
        <p className="mt-3 text-base text-slate-300 sm:text-lg">
          {recommendation.explanation}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
          <span className="rounded-full bg-cyan-400/15 px-3 py-1.5 text-sm font-bold text-cyan-300 sm:px-4">
            {formatCurrency(recommendation.total_price)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300 sm:px-4">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300 sm:px-4">
            Match {(recommendation.score * 100).toFixed(0)}%
          </span>
        </div>

        {/* Checklist de itens — cada um com seu próprio link de compra */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-8 sm:p-6">
          <h3 className="text-base font-bold text-white sm:text-lg">
            Itens do orçamento
          </h3>
          <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
            {products.map((p) => {
              const url = resolveBuyUrl(p);
              const subtotal = p.price * p.quantity;
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 border-b border-white/5 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/15 text-xs text-cyan-300"
                    >
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 sm:text-base">
                        {p.name}
                        {p.quantity > 1 && (
                          <span className="ml-1 text-slate-400">
                            (x{p.quantity})
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatCurrency(p.price)}
                        {p.quantity > 1 && ` · ${formatCurrency(subtotal)} total`}
                      </p>
                    </div>
                  </div>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex-none self-start rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20 sm:self-center sm:text-sm"
                    >
                      Ver preço →
                    </a>
                  ) : (
                    <span className="flex-none self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-500 sm:self-center sm:text-sm">
                      link indisponível
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 sm:mt-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Total do orçamento
            </span>
            <span className="text-xl font-bold text-white sm:text-2xl">
              {formatCurrency(recommendation.total_price)}
            </span>
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <h3 className="text-sm font-bold text-white sm:text-base">
            Por que escolhemos
          </h3>
          <ul className="mt-2 space-y-1.5">
            {recommendation.reasons.slice(0, 6).map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300 sm:text-base"
              >
                <span aria-hidden className="mt-1 text-cyan-400">
                  •
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
          <Link
            href="/instaladores"
            className="flex-1 rounded-full bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300 sm:px-6 sm:text-base"
          >
            Solicitar instalador
          </Link>
          <Link
            href="/kits"
            className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6 sm:text-base"
          >
            Ver todos os kits
          </Link>
        </div>
      </div>
    </motion.div>
  );
}