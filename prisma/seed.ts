// Dados de demonstração: uma barbearia com três serviços e algumas semanas de agenda.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.profissional.deleteMany({ where: { slug: 'barbearia-do-leo' } });
  const leo = await prisma.profissional.create({ data: { nome: 'Barbearia do Léo', slug: 'barbearia-do-leo' } });
  const [corte, barba, combo] = await Promise.all([
    prisma.servico.create({ data: { profissionalId: leo.id, nome: 'Corte', duracaoMin: 30, precoCentavos: 4990 } }),
    prisma.servico.create({ data: { profissionalId: leo.id, nome: 'Barba', duracaoMin: 30, precoCentavos: 3500 } }),
    prisma.servico.create({ data: { profissionalId: leo.id, nome: 'Corte e barba', duracaoMin: 60, precoCentavos: 7990 } }),
  ]);

  const clientes = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabi', 'Hugo'];
  const servicos = [corte, barba, combo];
  const base = new Date();
  base.setUTCHours(12, 0, 0, 0);
  let n = 0;
  for (let dia = 1; dia <= 15; dia++) {
    for (const hora of [12, 14, 17]) {
      const servico = servicos[n % servicos.length];
      const inicio = new Date(base.getTime() + dia * 86_400_000 + (hora - 12) * 3_600_000);
      const nome = clientes[n % clientes.length];
      await prisma.agendamento.create({
        data: {
          profissionalId: leo.id,
          servicoId: servico.id,
          clienteNome: nome,
          clienteEmail: `${nome.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}@exemplo.com`,
          inicio,
          fim: new Date(inicio.getTime() + servico.duracaoMin * 60_000),
        },
      });
      n++;
    }
  }
  console.log(`Seed pronto: ${leo.nome} (${leo.id}) com ${n} agendamentos.`);
}

main().finally(() => prisma.$disconnect());
