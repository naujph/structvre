"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";

const NAV_LINKS = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#experiencia", label: "Experiência" },
  { href: "/#kits", label: "Kits" },
  { href: "/conteudo", label: "Conteúdo" },
  { href: "/instaladores", label: "Instaladores" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-xl p-2 text-slate-300 hover:bg-white/10 md:hidden"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 top-[65px] z-40 bg-slate-950/95 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-2 p-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-300 transition hover:bg-white/10 hover:text-cyan-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/diagnostico"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-cyan-400 px-5 py-3 text-center text-base font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
            >
              Fazer diagnóstico
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Strucvre home">
          <Logo className="h-8 w-auto sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex lg:gap-8">
          <a href="/#como-funciona" className="transition-colors hover:text-cyan-300">
            Como funciona
          </a>
          <a href="/#experiencia" className="transition-colors hover:text-cyan-300">
            Experiência
          </a>
          <a href="/#kits" className="transition-colors hover:text-cyan-300">
            Kits
          </a>
          <Link href="/conteudo" className="transition-colors hover:text-cyan-300">
            Conteúdo
          </Link>
          <Link href="/instaladores" className="transition-colors hover:text-cyan-300">
            Instaladores
          </Link>
          <Link
            href="/diagnostico"
            className="rounded-full bg-cyan-400 px-5 py-2 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
          >
            Fazer diagnóstico
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
