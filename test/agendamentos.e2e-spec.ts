import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { criarApp, criarProfissionalComServico, limparBanco } from './helpers';

describe('Agendamentos (integração)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, prisma } = await criarApp());
  });

  beforeEach(async () => {
    await limparBanco(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  const novo = (servicoId: string, inicio: string) => ({
    servicoId,
    clienteNome: 'Ana',
    clienteEmail: 'ana@exemplo.com',
    inicio,
  });

  it('cria um agendamento e calcula o fim pela duração do serviço', async () => {
    const { profissional, servico } = await criarProfissionalComServico(prisma);
    const res = await request(app.getHttpServer())
      .post(`/profissionais/${profissional.id}/agendamentos`)
      .send(novo(servico.id, '2026-12-01T13:00:00.000Z'))
      .expect(201);
    expect(res.body).toMatchObject({ status: 'CONFIRMADO', fim: '2026-12-01T13:30:00.000Z' });
  });

  it('lista do mais cedo para o mais tarde', async () => {
    const { profissional, servico } = await criarProfissionalComServico(prisma);
    const url = `/profissionais/${profissional.id}/agendamentos`;
    await request(app.getHttpServer()).post(url).send(novo(servico.id, '2026-12-01T15:00:00.000Z')).expect(201);
    await request(app.getHttpServer()).post(url).send(novo(servico.id, '2026-12-01T13:00:00.000Z')).expect(201);

    const res = await request(app.getHttpServer()).get(url).expect(200);
    expect(res.body.itens.map((a: { inicio: string }) => a.inicio)).toEqual([
      '2026-12-01T13:00:00.000Z',
      '2026-12-01T15:00:00.000Z',
    ]);
  });

  it('pagina a listagem com 20 por página por padrão', async () => {
    const { profissional, servico } = await criarProfissionalComServico(prisma);
    await prisma.agendamento.createMany({
      data: Array.from({ length: 25 }, (_, i) => ({
        profissionalId: profissional.id,
        servicoId: servico.id,
        clienteNome: `Cliente ${i}`,
        clienteEmail: `c${i}@exemplo.com`,
        inicio: new Date(Date.UTC(2026, 11, 1 + i, 13)),
        fim: new Date(Date.UTC(2026, 11, 1 + i, 13, 30)),
      })),
    });
    const url = `/profissionais/${profissional.id}/agendamentos`;

    const primeira = await request(app.getHttpServer()).get(url).expect(200);
    expect(primeira.body).toMatchObject({ pagina: 1, porPagina: 20, total: 25 });
    expect(primeira.body.itens).toHaveLength(20);

    const segunda = await request(app.getHttpServer()).get(`${url}?pagina=2`).expect(200);
    expect(segunda.body.itens).toHaveLength(5);
    expect(segunda.body.itens[0].clienteNome).toBe('Cliente 20');
  });

  it('aceita porPagina até 100', async () => {
    const { profissional } = await criarProfissionalComServico(prisma);
    const url = `/profissionais/${profissional.id}/agendamentos`;
    await request(app.getHttpServer()).get(`${url}?porPagina=100`).expect(200);
    await request(app.getHttpServer()).get(`${url}?porPagina=101`).expect(400);
  });

  it('recusa página menor que 1', async () => {
    const { profissional } = await criarProfissionalComServico(prisma);
    await request(app.getHttpServer()).get(`/profissionais/${profissional.id}/agendamentos?pagina=0`).expect(400);
  });

  it('recusa horário que se sobrepõe a outro', async () => {
    const { profissional, servico } = await criarProfissionalComServico(prisma);
    const url = `/profissionais/${profissional.id}/agendamentos`;
    await request(app.getHttpServer()).post(url).send(novo(servico.id, '2026-12-01T13:00:00.000Z')).expect(201);
    await request(app.getHttpServer()).post(url).send(novo(servico.id, '2026-12-01T13:15:00.000Z')).expect(409);
  });

  it('libera o horário depois de cancelar', async () => {
    const { profissional, servico } = await criarProfissionalComServico(prisma);
    const url = `/profissionais/${profissional.id}/agendamentos`;
    const criado = await request(app.getHttpServer()).post(url).send(novo(servico.id, '2026-12-01T13:00:00.000Z'));
    await request(app.getHttpServer()).patch(`${url}/${criado.body.id}/cancelar`).expect(200);
    await request(app.getHttpServer()).post(url).send(novo(servico.id, '2026-12-01T13:00:00.000Z')).expect(201);
  });

  it('valida o e-mail do cliente', async () => {
    const { profissional, servico } = await criarProfissionalComServico(prisma);
    await request(app.getHttpServer())
      .post(`/profissionais/${profissional.id}/agendamentos`)
      .send({ ...novo(servico.id, '2026-12-01T13:00:00.000Z'), clienteEmail: 'ana' })
      .expect(400);
  });
});
