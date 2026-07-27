import { SiteHeader } from "@/components/mobile-nav";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildAffiliateUrl } from "@/lib/affiliate";
import { formatCurrency } from "@/lib/format";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explorar Produtos — Strucvre",
  description:
    "Catálogo de produtos de automação residencial com melhores preços. Pesquisa em tempo real na Amazon com nosso código de afiliado.",
};

const CATEGORY_ORDER = [
  "assistente",
  "hub",
  "iluminacao",
  "energia",
  "climatizacao",
  "conforto",
  "sensor",
  "seguranca",
  "entretenimento",
];

const CATEGORY_LABEL: Record<string, string> = {
  assistente: "Assistentes de voz",
  hub: "Hubs e bridges",
  iluminacao: "Iluminação",
  energia: "Energia",
  climatizacao: "Climatização",
  conforto: "Conforto",
  sensor: "Sensores",
  seguranca: "Segurança",
  entretenimento: "Entretenimento",
};

export default async function ExplorarPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { price: "asc" }],
  });

  // Agrupa por categoria preservando a ordem definida.
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABEL[cat] ?? cat,
    items: products.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
      </div>
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl sm:mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
              Explorar produtos
            </span>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Melhor preço em tempo real
            </h1>
            <p className="mt-4 text-slate-300">
              Cada produto te leva direto à busca da Amazon já com nosso código de
              afiliado — você paga o mesmo preço e a gente ganha uma comissão. Sem
              custo extra pra você.
            </p>
          </div>

          {grouped.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-slate-300">
                Nenhum produto cadastrado ainda. Volamos logo com o catálogo completo.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {grouped.map((group) => (
                <div key={group.category}>
                  <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">
                    {group.label}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((product) => {
                      const url = buildAffiliateUrl(product);
                      return (
                        <div
                          key={product.id}
                          className="glass-card flex flex-col p-5 transition hover:border-cyan-400/40 sm:p-6"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                              {product.brand}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                              {product.protocol}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white">{product.name}</h3>
                          {product.description && (
                            <p className="mt-2 flex-1 text-sm text-slate-300">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">
                              {formatCurrency(product.price)}
                            </span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                              Ver na Amazon →
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <p className="text-sm text-slate-400">
              Não sabe por onde começar?{" "}
              <Link
                href="/diagnostico"
                className="font-semibold text-cyan-300 hover:underline"
              >
                Faça o diagnóstico
              </Link>{" "}
              e receba um kit personalizado.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}