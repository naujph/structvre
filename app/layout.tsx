import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strucvre — Arquitetura Inteligente para sua Casa",
  description:
    "Descubra o projeto de automação residencial ideal para seu estilo de vida. Diagnóstico imersivo, kits personalizados e orçamento em minutos.",
  keywords: ["automação residencial", "casa inteligente", "kits de automação", "instalador IoT"],
  authors: [{ name: "Strucvre" }],
  openGraph: {
    title: "Strucvre — Arquitetura Inteligente para sua Casa",
    description:
      "Descubra o projeto de automação residencial ideal para seu estilo de vida.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b1020",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased animated-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
