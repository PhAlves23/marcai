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
    expect(res.body.map((a: { inicio: string }) => a.inicio)).toEqual([
      '2026-12-01T13:00:00.000Z',
      '2026-12-01T15:00:00.000Z',
    ]);
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
