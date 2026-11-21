import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { criarApp, criarProfissionalComServico, limparBanco } from './helpers';

describe('Pacotes (integração)', () => {
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

  it('cria um pacote com o valor total em centavos', async () => {
    const { servico } = await criarProfissionalComServico(prisma, 5000);
    const res = await request(app.getHttpServer())
      .post(`/servicos/${servico.id}/pacotes`)
      .send({ sessoes: 4, descontoPercentual: 10 })
      .expect(201);
    expect(res.body).toMatchObject({ sessoes: 4, descontoPercentual: 10, valorCentavos: 18000 });
  });

  it('não aceita pacote de uma sessão só', async () => {
    const { servico } = await criarProfissionalComServico(prisma);
    await request(app.getHttpServer())
      .post(`/servicos/${servico.id}/pacotes`)
      .send({ sessoes: 1, descontoPercentual: 10 })
      .expect(400);
  });
});
