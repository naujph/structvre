import { SiteHeader } from "@/components/mobile-nav";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Hero Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
        <div className="absolute -left-20 top-0 h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-3xl sm:h-[500px] sm:w-[500px]" />
        <div className="absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl sm:right-0 sm:top-40 sm:h-[700px] sm:w-[700px]" />
      </div>

      <SiteHeader />

      {/* Hero */}
      <section className="relative px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pb-32 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 sm:mb-6 sm:px-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                Diagnóstico imersivo v2
              </div>
              <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl">
                Sua casa, <br />
                <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  pensada para você
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg lg:text-xl">
                Descubra em minutos qual é o projeto de automação residencial ideal para seu
                estilo de vida, cômodos e sonhos — com orçamento, kits e próximo passo claros.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/diagnostico"
                  className="rounded-full bg-cyan-400 px-6 py-3.5 text-center text-base font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.4)] transition hover:bg-cyan-300 sm:px-8 sm:py-4"
                >
                  Começar diagnóstico
                </Link>
                <a
                  href="#como-funciona"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-center text-base font-semibold text-white transition hover:bg-white/10 sm:px-8 sm:py-4"
                >
                  Ver como funciona
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Sem spam
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Gratuito
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Até 8 perfis de lifestyle
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 blur-2xl" />
              <div className="glass-card relative overflow-hidden p-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(34,211,238,0.25),transparent_50%)]" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:bottom-10 sm:left-10 sm:right-10 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-cyan-300">Seu projeto ideal</p>
                        <p className="text-lg font-bold text-white sm:text-xl">Smart Living Plus</p>
                      </div>
                      <div className="rounded-full bg-cyan-400/20 px-3 py-1 text-sm font-bold text-cyan-300">
                        R$ 12.490
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">Iluminação</span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">Cortinas</span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">Segurança</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl sm:mb-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">Três passos para o projeto ideal</h2>
            <p className="mt-4 text-slate-300">
              O Strucvre transforma suas respostas em um projeto de automação residencial
              completo, com recomendações reais e orçamento aproximado.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {[
              {
                step: "01",
                title: "Responde o diagnóstico",
                desc: "Escolha seu perfil, tipo de imóvel, cômodos e prioridades. O fundo da tela evolui junto com você.",
              },
              {
                step: "02",
                title: "Recebe o projeto",
                desc: "Nossa engine cruza necessidades, compatibilidade e preço para montar o kit ideal.",
              },
              {
                step: "03",
                title: "Agenda uma conversa",
                desc: "Levamos o orçamento, visita técnica e instalação. Você decide o ritmo.",
              },
            ].map((card) => (
              <div
                key={card.step}
                className="glass-card p-6 transition hover:-translate-y-1 hover:border-cyan-400/40 sm:p-8"
              >
                <span className="text-3xl font-black text-cyan-400/30 sm:text-4xl">{card.step}</span>
                <h3 className="mt-4 text-lg font-bold text-white sm:text-xl">{card.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experiencia" className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="glass-card p-2">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/20 sm:h-16 sm:w-16">
                        <svg className="h-6 w-6 text-cyan-300 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-base font-semibold text-white sm:text-lg">Interface reativa</p>
                      <p className="text-sm text-slate-400">O ambiente muda conforme suas escolhas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Uma experiência visual absurda no navegador
              </h2>
              <p className="mt-4 text-slate-300 lg:text-lg">
                Desktop é o palco principal: fundos imersivos, transições suaves e um
                fluxo que parece conversa, não formulário. No mobile, tudo se adapta sem
                perder a identidade.
              </p>
              <ul className="mt-6 space-y-3 text-slate-300 sm:mt-8 sm:space-y-4">
                {[
                  "Transições de fundo por cômodo e categoria",
                  "8 personas de lifestyle com recomendações diferentes",
                  "Score multi-dimensional: conforto, segurança, economia, tech",
                  "Prévia de orçamento antes de qualquer cadastro",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-xs text-cyan-300">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Kits preview */}
      <section id="kits" className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-16 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">Kits para cada estágio</h2>
              <p className="mt-4 text-slate-300">
                Do primeiro passo à casa totalmente conectada. Cada kit pode ser expandido depois.
              </p>
            </div>
            <Link
              href="/kits"
              className="rounded-full border border-cyan-400/40 px-5 py-2.5 text-center font-semibold text-cyan-300 transition hover:bg-cyan-400/10 sm:px-6 sm:py-3"
            >
              Ver todos os kits →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              { name: "Start", price: "a partir de R$ 3.490", tags: ["Iluminação", "Tomadas"] },
              { name: "Comfort", price: "a partir de R$ 7.490", tags: ["Cortinas", "Climatização", "Sensores"] },
              { name: "Secure", price: "a partir de R$ 8.990", tags: ["Câmeras", "Fechadura", "Alarme"] },
              { name: "Living Plus", price: "a partir de R$ 14.990", tags: ["Tudo integrado", "Cinema", "Energia"] },
            ].map((kit) => (
              <div
                key={kit.name}
                className="glass-card p-5 transition hover:border-cyan-400/40 sm:p-6"
              >
                <h3 className="text-lg font-bold text-white">{kit.name}</h3>
                <p className="mt-1 text-sm text-cyan-300">{kit.price}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {kit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="glass-card relative overflow-hidden p-6 text-center sm:p-10 lg:p-16">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Pronto para transformar sua casa?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300 lg:text-lg">
              O diagnóstico leva menos de 3 minutos. Ao final você já tem uma visão clara
              do projeto, investimento e próximo passo.
            </p>
            <Link
              href="/diagnostico"
              className="mt-6 inline-block rounded-full bg-cyan-400 px-8 py-3.5 text-base font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.4)] transition hover:bg-cyan-300 sm:mt-8 sm:px-10 sm:py-4 sm:text-lg"
            >
              Fazer diagnóstico agora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" aria-label="Strucvre home">
            <Logo className="h-7 w-auto" />
          </Link>
          <p className="text-center text-sm text-slate-500 md:text-left">
            © {new Date().getFullYear()} Strucvre. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 sm:gap-6">
            <Link href="/kits" className="transition-colors hover:text-cyan-300">Kits</Link>
            <Link href="/instaladores" className="transition-colors hover:text-cyan-300">Instaladores</Link>
            <Link href="/conteudo" className="transition-colors hover:text-cyan-300">Conteúdo</Link>
            <Link href="/termos" className="transition-colors hover:text-cyan-300">Termos</Link>
            <Link href="/privacidade" className="transition-colors hover:text-cyan-300">Privacidade</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
