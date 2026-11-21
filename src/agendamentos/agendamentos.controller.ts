import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';
import { PaginacaoDto } from './dto/paginacao.dto';

@Controller('profissionais/:profissionalId/agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentos: AgendamentosService) {}

  @Get()
  listar(@Param('profissionalId') profissionalId: string, @Query() { pagina, porPagina }: PaginacaoDto) {
    return this.agendamentos.listar(profissionalId, pagina, porPagina);
  }

  @Post()
  criar(@Param('profissionalId') profissionalId: string, @Body() dto: CriarAgendamentoDto) {
    return this.agendamentos.criar(profissionalId, dto);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('profissionalId') profissionalId: string, @Param('id') id: string) {
    return this.agendamentos.cancelar(profissionalId, id);
  }
}
