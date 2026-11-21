import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

export async function criarApp(): Promise<{ app: INestApplication; prisma: PrismaService }> {
  const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = modulo.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return { app, prisma: app.get(PrismaService) };
}

export async function limparBanco(prisma: PrismaService) {
  await prisma.$executeRawUnsafe('TRUNCATE "Pacote", "Agendamento", "Servico", "Profissional" CASCADE');
}

export async function criarProfissionalComServico(prisma: PrismaService, precoCentavos = 4990, duracaoMin = 30) {
  const profissional = await prisma.profissional.create({ data: { nome: 'Barbearia do Léo', slug: `leo-${Date.now()}` } });
  const servico = await prisma.servico.create({
    data: { profissionalId: profissional.id, nome: 'Corte', duracaoMin, precoCentavos },
  });
  return { profissional, servico };
}
