import { SiteHeader } from "@/components/mobile-nav";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instaladores Parceiros — Strucvre",
  description: "Cadastre-se como instalador parceiro da Strucvre e receba leads qualificados de automação residencial na sua região.",
};

export default function InstallersPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
      </div>
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Instaladores parceiros</span>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Receba leads qualificados na sua região
              </h1>
              <p className="mt-4 text-slate-300">
                A Strucvre conecta você a clientes que já fizeram o diagnóstico e sabem o que precisam. Você recebe o perfil, o kit recomendado e os dados de contato.
              </p>

              <ul className="mt-6 space-y-3 text-slate-300">
                {[
                  "Clientes com projeto e orçamento definidos",
                  "Filtro por cidade e região",
                  "Comissão transparente por orçamento fechado",
                  "Sem mensalidade para participar",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 text-cyan-400">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 sm:p-10">
              <h2 className="text-xl font-bold text-white">Cadastre seu interesse</h2>
              <p className="mt-2 text-sm text-slate-300">
                Preencha os dados abaixo. Entraremos em contato para validar seu perfil.
              </p>

              <form className="mt-6 space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Nome completo"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <input
                  required
                  type="email"
                  placeholder="E-mail"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <input
                  required
                  type="tel"
                  placeholder="WhatsApp / telefone"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    placeholder="Cidade"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                  <input
                    required
                    type="text"
                    placeholder="UF"
                    maxLength={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Anos de experiência"
                  min={0}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
                >
                  Quero ser parceiro
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/diagnostico" className="text-cyan-300 hover:underline">← Voltar para o diagnóstico</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
