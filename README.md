# Strucvre Web

Next.js 15 + React 19 + TypeScript + Tailwind CSS + Supabase + Prisma.

## Estrutura

- `app/` — rotas do Next.js (App Router)
- `components/` — componentes reutilizáveis
- `lib/` — helpers, clientes Supabase e Prisma singleton
- `prisma/` — schema e seeds

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

## Rodar local

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Deploy no Vercel

1. Conecte o repositório no Vercel.
2. Adicione as environment variables acima.
3. Adicione o comando de build:
   - Build: `prisma generate && next build`
   - Instale Prisma CLI nas dev deps (já está em `package.json`).
4. O Vercel deploya automaticamente a cada push.

## Diagnóstico v2

Rota `/diagnostico` consome `/api/v1/diagnostic/*`. O front já tem fundo
reativo e navegação entre etapas. A engine de recomendação (`recommender_v2`)
ainda é stub; portar do Flask em `app/services/recommender.ts` quando for
prioridade.
