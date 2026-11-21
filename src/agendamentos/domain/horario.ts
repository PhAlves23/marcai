export interface Intervalo {
  inicio: Date;
  fim: Date;
}

/** Fim do atendimento a partir do início e da duração do serviço. */
export function calcularFim(inicio: Date, duracaoMin: number): Date {
  return new Date(inicio.getTime() + duracaoMin * 60_000);
}

/** Não se agenda no passado (nem no instante exato de agora). */
export function estaNoPassado(inicio: Date, agora: Date = new Date()): boolean {
  return inicio.getTime() <= agora.getTime();
}

/** Dois horários conflitam quando se sobrepõem. Encostar (um termina quando o outro começa) não é conflito. */
export function haConflito(novo: Intervalo, existentes: Intervalo[]): boolean {
  return existentes.some((e) => novo.inicio < e.fim && e.inicio < novo.fim);
}
