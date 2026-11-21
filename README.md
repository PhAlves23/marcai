# Marcaí

Agenda online com cobrança para profissionais autônomos: barbeiro, personal, psicólogo, manicure. O cliente escolhe o horário e paga; o profissional vê a agenda e recebe.

Este é o projeto do curso **Claude Code de verdade**, do PH Alves. Ele cresce aula a aula, do primeiro comando até o deploy.

## Uma branch por aula

| Branch | Estado |
|---|---|
| `aula-00-inicio` | API de agendamentos e pacotes, antes da demo da Aula 00 |
| `aula-00-fim` | Depois da demo: listagem de agendamentos com paginação |
| `aula-01-inicio` | Ponto de partida da Aula 01, ainda sem CLAUDE.md |
| `aula-01-fim` | Com o CLAUDE.md da aula e o arredondamento do pacote corrigido |

```bash
git checkout aula-00-inicio
pnpm install
```

## Por que este README é curto

De propósito. O que o projeto precisa para rodar e as regras do time entram no CLAUDE.md, que você escreve na Aula 01. Até lá, repare no que o Claude Code descobre sozinho e no que ele não tem como saber.

## Stack

NestJS, Prisma, PostgreSQL, Jest e um contrato OpenAPI (`openapi.yaml`). Licença MIT.
