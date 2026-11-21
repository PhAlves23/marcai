import { Injectable, NotFoundException } from '@nestjs/common';
import type { Pacote as PacoteDb } from '@prisma/client';
import type { components } from '../gen/api';
import { PrismaService } from '../prisma/prisma.service';
import { calcularPrecoPacote } from './domain/preco-pacote';
import { CriarPacoteDto } from './dto/criar-pacote.dto';

type Pacote = components['schemas']['Pacote'];

function paraApi(p: PacoteDb): Pacote {
  return {
    id: p.id,
    servicoId: p.servicoId,
    sessoes: p.sessoes,
    descontoPercentual: p.descontoPercentual,
    valorCentavos: p.valorCentavos,
  };
}

@Injectable()
export class PacoteService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(servicoId: string): Promise<Pacote[]> {
    const pacotes = await this.prisma.pacote.findMany({ where: { servicoId }, orderBy: { sessoes: 'asc' } });
    return pacotes.map(paraApi);
  }

  async criar(servicoId: string, dto: CriarPacoteDto): Promise<Pacote> {
    const servico = await this.prisma.servico.findUnique({ where: { id: servicoId } });
    if (!servico) throw new NotFoundException('Serviço não encontrado');

    const valorCentavos = calcularPrecoPacote(servico.precoCentavos, dto.sessoes, dto.descontoPercentual);
    const criado = await this.prisma.pacote.create({
      data: { servicoId, sessoes: dto.sessoes, descontoPercentual: dto.descontoPercentual, valorCentavos },
    });
    return paraApi(criado);
  }
}
