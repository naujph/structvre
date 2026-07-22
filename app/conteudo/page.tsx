import { SiteHeader } from "@/components/mobile-nav";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conteúdo — Strucvre",
  description: "Guias, dicas e novidades sobre automação residencial e casa inteligente.",
};

const POSTS = [
  {
    slug: "primeira-automacao-residencial",
    category: "Comece aqui",
    title: "Qual a primeira automação residencial que vale a pena fazer?",
    excerpt:
      "Iluminação e tomadas inteligentes entregam resultado imediato, são fáceis de instalar e custam pouco. Veja por onde começar sem furar parede.",
  },
  {
    slug: "matter-vs-wifi-vs-zigbee",
    category: "Tecnologia",
    title: "Matter, Wi-Fi ou Zigbee: qual protocolo escolher?",
    excerpt:
      "Cada protocolo tem seu lugar. Entenda as diferenças de alcance, consumo de energia, custo e compatibilidade com Alexa, Google e HomeKit.",
  },
  {
    slug: "economia-energia-casa-inteligente",
    category: "Economia",
    title: "Quanto dá para economizar com uma casa inteligente?",
    excerpt:
      "Cenas de ausência, sensores de presença e tomadas monitoradas podem reduzir a conta de luz. Confira os números reais de economia mensal.",
  },
];

export default function ContentPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
      </div>
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl sm:mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Conteúdo</span>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">Guias e dicas de automação</h1>
            <p className="mt-4 text-slate-300">
              Conteúdo prático para quem quer entender, escolher e instalar automação residencial com segurança.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="glass-card flex flex-col p-5 transition hover:border-cyan-400/40 sm:p-6"
              >
                <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {post.category}
                </span>
                <h2 className="mt-3 text-lg font-bold text-white">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm text-slate-300">{post.excerpt}</p>
                <Link
                  href={`/conteudo/${post.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Ler artigo →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
