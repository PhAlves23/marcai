import { IsEmail, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CriarAgendamentoDto {
  @IsString()
  @IsNotEmpty()
  servicoId!: string;

  @IsString()
  @IsNotEmpty()
  clienteNome!: string;

  @IsEmail()
  clienteEmail!: string;

  @IsISO8601()
  inicio!: string;
}
