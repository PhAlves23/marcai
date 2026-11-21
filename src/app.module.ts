import { Module } from '@nestjs/common';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { CobrancaModule } from './cobranca/cobranca.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AgendamentosModule, CobrancaModule],
})
export class AppModule {}
