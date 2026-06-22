<div align="center">

# Seguros Digital RGL

**Simulador premium de planos de saúde — região de Juiz de Fora / MG**

Next.js 14 · TypeScript · Tailwind · Recharts · Leaflet · Prisma · Framer Motion

</div>

---

## Visão geral

Plataforma que conduz o usuário por uma jornada de 7 telas, entende seu perfil
(idade, cidade, contratação, acomodação, hospitais de preferência) e recomenda os
melhores planos das operadoras **Cedplan, Plasc, Unimed Juiz de Fora e Sul América**.
A jornada termina no resultado — esta versão **não realiza vendas**.

Além da jornada pública, há um **painel restrito** com dashboards de gestão,
operação e administração, com controle de acesso por perfil.

## Identidade visual

- **Marca:** escudo + pulso (healthtech), gradiente **esmeralda `#10b981` → ciano `#06b6d4`**.
- **Neutros:** escala slate; **dark mode** como padrão, light disponível.
- **Tipografia:** sans para texto, **mono** para dados/KPIs (assinatura técnica).
- Logo em `public/logo.svg` e componente em `src/components/brand/Logo.tsx`.
- A identidade é própria e **poderá ser personalizada depois** sem afetar a lógica.

## Decisões de negócio aplicadas (validadas com o cliente)

1. **Sem tabela real** → mensalidades simuladas com **valores-padrão de mercado** por operadora.
2. **Contratação familiar não exige mínimo de pessoas**; **titular × dependente importa no preço** (modificador configurável — titular `×1.0`, dependente `×0.95`).
3. **Score com 3 fatores**: cobertura de hospitais (50%), menor preço (30%) e maior margem (20%) — pesos em `WEIGHTS`.
4. Rede de hospitais **fictícia**, conforme o que cada plano cobre.
5. **Operadoras regionais limitadas por cidade**; Sul América é nacional.
6. **KPIs de receita ocultos** nesta versão (mantido apenas o valor sugerido por proposta).
7. **Mapa real** (Leaflet + OpenStreetMap) no dashboard geográfico.
8. **Identidade/logo próprios**, prontos para personalização.

## Rodando

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:3000
```

A demo funciona **sem banco** (leads gerados em memória). Para persistência real,
veja `docs/INSTALL.md` (Prisma + Neon) e `docker-compose.yml`.

## Acessos de demonstração

| Perfil   | E-mail                              | Senha         |
|----------|-------------------------------------|---------------|
| Operador | operador@segurosdigital.com.br      | Operador@123  |
| Gestor   | gestor@segurosdigital.com.br        | Gestor@123    |
| Admin    | admin@segurosdigital.com.br         | Admin@123     |

> Acesso público (simulador) não exige login.

## Estrutura

```
src/
├─ app/                 # rotas (App Router): landing, simular, login, painel/*, api/*
├─ components/
│  ├─ ui/               # design system (button, card, input, badge…)
│  ├─ brand/            # logo e marca das operadoras
│  ├─ marketing/        # landing
│  ├─ journey/          # jornada de 7 telas + resultado
│  └─ dashboard/        # KPIs, gráficos, mapa, shell e painéis
├─ lib/
│  ├─ data/             # operadoras, hospitais, planos
│  ├─ pricing.ts        # faixas ANS + modificadores
│  ├─ recommendation.ts # motor de score (3 fatores)
│  ├─ auth.ts / nav.ts  # usuários, permissões e navegação por perfil
│  └─ seed-leads.ts     # dados de demonstração
├─ providers/           # tema, auth e store (contextos)
└─ types/               # tipos de domínio
prisma/                 # schema (Neon) + seed
docs/                   # INSTALL, ADMIN, ROADMAP
```

## Demo × Produção

| Recurso | Demo (atual) | Produção |
|---------|--------------|----------|
| Auth    | contexto no cliente (usuários-semente) | `POST /api/auth/login` (JWT em cookie httpOnly) |
| Leads   | em memória (`seed-leads`) | Prisma + Neon (`/api/leads`) |
| Preços  | valores-padrão de mercado | tabelas reais por operadora |

Lógica de negócio (planos, preços, score, cobertura) está centralizada em `src/lib/`
e é trocável **sem alterar a interface**.

---

<div align="center"><sub>© Seguros Digital RGL · segurosdigital-rgl.com.br</sub></div>
