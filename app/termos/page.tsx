import { SiteHeader } from "@/components/mobile-nav";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Strucvre",
  description: "Termos de uso da plataforma Strucvre de automação residencial.",
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
      </div>
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="glass-card p-6 sm:p-10">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Termos de Uso</h1>
            <p className="mt-4 text-slate-400">Última atualização: {new Date().getFullYear()}</p>

            <div className="mt-8 space-y-6 text-slate-300">
              <section>
                <h2 className="text-lg font-semibold text-white">1. Aceitação dos termos</h2>
                <p className="mt-2">
                  Ao acessar e usar a plataforma Strucvre, você concorda com estes Termos de Uso. Se não concordar, não use o site.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">2. Serviços oferecidos</h2>
                <p className="mt-2">
                  A Strucvre oferece um diagnóstico online para ajudar usuários a descobrirem projetos de automação residencial. Não vendemos produtos diretamente: recomendamos kits, dispositivos e, quando solicitado, profissionais instaladores parceiros.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">3. Precisão das informações</h2>
                <p className="mt-2">
                  Os orçamentos e recomendações são estimativas baseadas nas respostas fornecidas. Preços podem variar conforme região, disponibilidade e profissional escolhido.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">4. Conta e dados</h2>
                <p className="mt-2">
                  Você é responsável pelas informações que enviar. Não use dados falsos. Respeitamos sua privacidade conforme descrito na nossa Política de Privacidade.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">5. Alterações</h2>
                <p className="mt-2">
                  Podemos atualizar estes termos a qualquer momento. Mudanças significativas serão comunicadas no site.
                </p>
              </section>
            </div>

            <div className="mt-10">
              <Link href="/" className="text-cyan-300 hover:underline">← Voltar para home</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
