import { Module } from '@nestjs/common';
import { PacotesController } from './pacotes.controller';
import { PacoteService } from './pacote.service';

@Module({
  controllers: [PacotesController],
  providers: [PacoteService],
})
export class CobrancaModule {}
