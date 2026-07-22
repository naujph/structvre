import { SiteHeader } from "@/components/mobile-nav";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const POSTS: Record<
  string,
  { category: string; title: string; body: string[] }
> = {
  "primeira-automacao-residencial": {
    category: "Comece aqui",
    title: "Qual a primeira automação residencial que vale a pena fazer?",
    body: [
      "Se você está começando do zero, a melhor porta de entrada é a iluminação. Lâmpadas e interruptores inteligentes entregam resultado imediato, são fáceis de instalar e custam pouco.",
      "Depois, vale a pena olhar para tomadas inteligentes e sensores de presença. Com eles, você cria cenas automáticas como 'ligar a luz do corredor quando alguém passar'.",
      "O importante é escolher dispositivos que falem o mesmo protocolo da sua assistente virtual (Alexa, Google Home ou HomeKit) para evitar dor de cabeça futura.",
    ],
  },
  "matter-vs-wifi-vs-zigbee": {
    category: "Tecnologia",
    title: "Matter, Wi-Fi ou Zigbee: qual protocolo escolher?",
    body: [
      "Wi-Fi é o mais universal, mas consome mais energia e pode sobrecarregar sua rede se você tiver muitos dispositivos.",
      "Zigbee cria uma malha própria, é mais estável e econômico em bateria. É ideal para sensores, fechaduras e interruptores.",
      "Matter é o novo padrão que promete interoperabilidade entre Apple, Google, Amazon e Samsung. Ainda está em evolução, mas é a aposta para o futuro.",
    ],
  },
  "economia-energia-casa-inteligente": {
    category: "Economia",
    title: "Quanto dá para economizar com uma casa inteligente?",
    body: [
      "Cenas de ausência, sensores de presença e tomadas monitoradas podem reduzir a conta de luz em 10% a 30%, dependendo do tamanho da casa e dos hábitos.",
      "O maior ganho costuma vir da climatização: desligar o ar-condicionado automaticamente quando ninguém está no cômodo gera economia real.",
      "Além da economia financeira, você ganha conforto e segurança, o que também tem valor.",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Artigo não encontrado — Strucvre" };
  return {
    title: `${post.title} — Strucvre`,
    description: post.body[0],
  };
}

export default async function ContentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return notFound();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
      </div>
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="glass-card p-6 sm:p-10">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {post.category}
            </span>
            <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{post.title}</h1>

            <div className="mt-6 space-y-4 text-base text-slate-300">
              {post.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/conteudo" className="text-cyan-300 hover:underline">← Ver todos os artigos</Link>
              <Link href="/diagnostico" className="text-cyan-300 hover:underline">Fazer diagnóstico →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
