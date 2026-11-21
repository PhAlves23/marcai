import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';

@Controller('profissionais/:profissionalId/agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentos: AgendamentosService) {}

  @Get()
  listar(@Param('profissionalId') profissionalId: string) {
    return this.agendamentos.listar(profissionalId);
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
