import { SiteHeader } from "@/components/mobile-nav";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Strucvre",
  description: "Como a Strucvre coleta, usa e protege seus dados.",
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
      </div>
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="glass-card p-6 sm:p-10">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Política de Privacidade</h1>
            <p className="mt-4 text-slate-400">Última atualização: {new Date().getFullYear()}</p>

            <div className="mt-8 space-y-6 text-slate-300">
              <section>
                <h2 className="text-lg font-semibold text-white">1. Dados que coletamos</h2>
                <p className="mt-2">
                  Coletamos nome, e-mail, telefone, cidade/estado e respostas do diagnóstico. Opcionalmente, com seu consentimento, coletamos localização aproximada para melhorar a indicação de instaladores e produtos disponíveis na sua região.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">2. Como usamos seus dados</h2>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Montar e enviar sua recomendação de projeto.</li>
                  <li>Entrar em contato sobre orçamento, visita técnica ou instalação.</li>
                  <li>Melhorar o motor de recomendação e a experiência do site.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">3. Compartilhamento</h2>
                <p className="mt-2">
                  Seus dados podem ser compartilhados com instaladores parceiros apenas quando você solicitar uma instalação. Não vendemos dados para terceiros.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">4. Segurança</h2>
                <p className="mt-2">
                  Usamos criptografia em trânsito e práticas de segurança padrão do mercado. Nenhum sistema é 100% invulnerável, mas trabalhamos para proteger suas informações.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">5. Seus direitos</h2>
                <p className="mt-2">
                  Você pode solicitar acesso, correção ou exclusão dos seus dados enviando um e-mail para contato@strucvre.com.br.
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
