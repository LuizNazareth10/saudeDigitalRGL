# Instalação

## Requisitos
- Node.js 20+
- npm 10+
- (Opcional) PostgreSQL / conta Neon para persistência real

## Passo a passo
```bash
npm install
cp .env.example .env        # ajuste DATABASE_URL e JWT_SECRET
npm run dev                 # http://localhost:3000
```

A versão demo roda **sem banco** — os dados de leads são gerados em memória.

## Banco de dados (opcional)
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

## Docker
```bash
docker compose up --build   # app em :3000, postgres em :5432
```

## Deploy (Vercel + Neon)
1. Importe o repositório na Vercel.
2. Crie um banco no Neon e copie a connection string para `DATABASE_URL`.
3. Defina `JWT_SECRET` nas variáveis de ambiente da Vercel.
4. Build command padrão (`next build`). Deploy.
