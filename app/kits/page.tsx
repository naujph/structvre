import { SiteHeader } from "@/components/mobile-nav";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kits de Automação Residencial — Strucvre",
  description: "Conheça os kits de automação residencial recomendados pela Strucvre para cada perfil e orçamento.",
};

export default async function KitsPage() {
  const kits = await prisma.kit.findMany({
    where: { isActive: true },
    include: { items: { include: { product: true } } },
    orderBy: { totalPrice: "asc" },
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
      </div>
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl sm:mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Kits recomendados</span>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">Escolha o kit para seu estágio</h1>
            <p className="mt-4 text-slate-300">
              Cada kit pode ser personalizado pelo diagnóstico. Aqui você vê os modelos base que usamos como ponto de partida.
            </p>
          </div>

          {kits.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-slate-300">Nenhum kit cadastrado ainda. Faça o diagnóstico para receber uma recomendação personalizada.</p>
              <Link
                href="/diagnostico"
                className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Fazer diagnóstico
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kits.map((kit) => (
                <div
                  key={kit.id}
                  className="glass-card flex flex-col p-5 transition hover:border-cyan-400/40 sm:p-6"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white">{kit.name}</h2>
                    <p className="mt-1 text-sm text-cyan-300">{formatCurrency(kit.totalPrice)}</p>
                  </div>
                  <p className="text-sm text-slate-300">{kit.description || "Kit montado para o seu perfil."}</p>

                  {kit.items.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {kit.items.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                        >
                          {item.quantity}x {item.product.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    <Link
                      href="/diagnostico"
                      className="block w-full rounded-full border border-cyan-400/40 px-5 py-2.5 text-center text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                    >
                      Ver no diagnóstico
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
