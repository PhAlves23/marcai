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

## Problemas conhecidos (de propósito)

O Marcaí cresce aula a aula, e alguns problemas ficam no código até a aula que trata deles. Estão aqui para ninguém confundir com descuido.

- **Dois clientes podem marcar o mesmo horário.** A API confere se o horário está livre e só depois grava, sem trava no banco. Com pedidos simultâneos, mais de um passa. Num teste com 10 pedidos ao mesmo tempo, 5 foram gravados. É o tipo de bug que a IA não pega sozinha e vira aula.
- **Ainda não tem login.** Quem souber o id de um profissional lista e cancela os agendamentos dele. Autenticação entra no módulo de segurança.
- **Ainda não tem horário de funcionamento** e o fuso do profissional ainda não é usado.

Não use este código em produção antes dessas aulas.

## Stack

NestJS, Prisma, PostgreSQL, Jest e um contrato OpenAPI (`openapi.yaml`). Licença MIT (veja `LICENSE`).
