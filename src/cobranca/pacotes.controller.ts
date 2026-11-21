import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CriarPacoteDto } from './dto/criar-pacote.dto';
import { PacoteService } from './pacote.service';

@Controller('servicos/:servicoId/pacotes')
export class PacotesController {
  constructor(private readonly pacotes: PacoteService) {}

  @Get()
  listar(@Param('servicoId') servicoId: string) {
    return this.pacotes.listar(servicoId);
  }

  @Post()
  criar(@Param('servicoId') servicoId: string, @Body() dto: CriarPacoteDto) {
    return this.pacotes.criar(servicoId, dto);
  }
}
