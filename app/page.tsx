import { SiteHeader } from "@/components/mobile-nav";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20" />
        <div className="absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl sm:h-[560px] sm:w-[560px]" />
      </div>

      <SiteHeader />

      {/* Hero */}
      <section className="relative flex flex-1 items-center justify-center px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Sua casa,{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              pensada para você
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-slate-300 sm:text-lg lg:text-xl">
            Descubra em minutos o projeto de automação ideal para o seu estilo de vida.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href="/diagnostico"
              className="rounded-full bg-cyan-400 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.4)] transition hover:bg-cyan-300 sm:px-10 sm:text-lg"
            >
              Começar diagnóstico
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" aria-label="Strucvre home">
            <Logo className="h-7 w-auto" />
          </Link>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 sm:gap-6">
            <Link href="/kits" className="transition-colors hover:text-cyan-300">Kits</Link>
            <Link href="/instaladores" className="transition-colors hover:text-cyan-300">Instaladores</Link>
            <Link href="/conteudo" className="transition-colors hover:text-cyan-300">Conteúdo</Link>
            <Link href="/termos" className="transition-colors hover:text-cyan-300">Termos</Link>
            <Link href="/privacidade" className="transition-colors hover:text-cyan-300">Privacidade</Link>
          </div>
          <p className="text-center text-sm text-slate-500 md:text-right">
            © {new Date().getFullYear()} Strucvre
          </p>
        </div>
      </footer>
    </main>
  );
}