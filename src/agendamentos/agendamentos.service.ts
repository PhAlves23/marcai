import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Agendamento as AgendamentoDb } from '@prisma/client';
import type { components } from '../gen/api';
import { PrismaService } from '../prisma/prisma.service';
import { calcularFim, haConflito } from './domain/horario';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';

type Agendamento = components['schemas']['Agendamento'];

function paraApi(a: AgendamentoDb): Agendamento {
  return {
    id: a.id,
    servicoId: a.servicoId,
    clienteNome: a.clienteNome,
    clienteEmail: a.clienteEmail,
    inicio: a.inicio.toISOString(),
    fim: a.fim.toISOString(),
    status: a.status,
  };
}

@Injectable()
export class AgendamentosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(profissionalId: string): Promise<Agendamento[]> {
    const agendamentos = await this.prisma.agendamento.findMany({
      where: { profissionalId },
      orderBy: { inicio: 'asc' },
    });
    return agendamentos.map(paraApi);
  }

  async criar(profissionalId: string, dto: CriarAgendamentoDto): Promise<Agendamento> {
    const servico = await this.prisma.servico.findFirst({ where: { id: dto.servicoId, profissionalId, ativo: true } });
    if (!servico) throw new NotFoundException('Serviço não encontrado');

    const inicio = new Date(dto.inicio);
    const fim = calcularFim(inicio, servico.duracaoMin);
    const doDia = await this.prisma.agendamento.findMany({
      where: { profissionalId, status: 'CONFIRMADO', inicio: { lt: fim }, fim: { gt: inicio } },
    });
    if (haConflito({ inicio, fim }, doDia)) throw new ConflictException('Horário já ocupado');

    const criado = await this.prisma.agendamento.create({
      data: { profissionalId, servicoId: servico.id, clienteNome: dto.clienteNome, clienteEmail: dto.clienteEmail, inicio, fim },
    });
    return paraApi(criado);
  }

  async cancelar(profissionalId: string, id: string): Promise<Agendamento> {
    const existente = await this.prisma.agendamento.findFirst({ where: { id, profissionalId } });
    if (!existente) throw new NotFoundException('Agendamento não encontrado');
    const cancelado = await this.prisma.agendamento.update({ where: { id }, data: { status: 'CANCELADO' } });
    return paraApi(cancelado);
  }
}
