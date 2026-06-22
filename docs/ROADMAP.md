# Roadmap

## Entregue (v1)
- Jornada pública de 7 telas + motor de recomendação (score de 3 fatores)
- Operadoras regionais limitadas por cidade; Sul América nacional
- 5 dashboards de gestão + operação (leads/propostas) + administração
- Mapa real (Leaflet/OpenStreetMap), dark/light, identidade visual própria
- API routes (login JWT, recommend, leads), schema Prisma para Neon

## Próximos passos
- Trocar auth demo (cliente) por fluxo /api/auth/login + middleware de sessão
- Persistência real dos leads via Prisma/Neon
- Geração de proposta em PDF
- Tabelas de preço reais por operadora
- Documentação de API (Swagger/OpenAPI)
- Testes (unit + e2e) e CI
