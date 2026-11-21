<!-- revisado em nov/2026 · PH -->
# marcai

## Comandos
- Testes: docker compose up -d db && pnpm test
- Tipos e lint: pnpm typecheck && pnpm lint
- Regerar src/gen: pnpm gen:api

## Onde mexer (e onde não)
- Regra de negócio só em src/**/domain/
- src/gen/ é gerado pelo OpenAPI: não editar

## Decisões do time
- Dinheiro em centavos (inteiro), nunca float
- Datas em UTC no banco, America/Sao_Paulo na tela
- Migration nova precisa de aprovação no PR

## Pronto quando
- pnpm test e pnpm typecheck passam
- Endpoint novo tem teste de integração
