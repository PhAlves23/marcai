import { IsInt, Max, Min } from 'class-validator';

export class CriarPacoteDto {
  @IsInt()
  @Min(2)
  @Max(50)
  sessoes!: number;

  @IsInt()
  @Min(0)
  @Max(90)
  descontoPercentual!: number;
}
