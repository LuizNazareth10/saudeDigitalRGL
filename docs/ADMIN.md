# Manual administrativo

## Perfis de acesso
| Perfil    | Acesso |
|-----------|--------|
| Operador  | Leads, Propostas |
| Gestor    | Dashboards (Executivo, Funil, Geográfico, Planos, UX) |
| Admin     | Tudo + Administração (Usuários, Operadoras, Planos, Preços, Auditoria) |

## Credenciais de demonstração
- Operador — operador@segurosdigital.com.br / Operador@123
- Gestor — gestor@segurosdigital.com.br / Gestor@123
- Admin — admin@segurosdigital.com.br / Admin@123

## Onde mexer nas regras de negócio
- Operadoras e cobertura por cidade: `src/lib/data/operators.ts`
- Planos, rede e margem: `src/lib/data/plans.ts`
- Hospitais (e coordenadas do mapa): `src/lib/data/hospitals.ts`
- Faixas etárias / modificadores: `src/lib/pricing.ts`
- Pesos do score (hospital/preço/margem): `src/lib/recommendation.ts` → `WEIGHTS`
