import { calcularFim, estaNoPassado, haConflito } from './horario';

const h = (hora: string) => new Date(`2026-12-01T${hora}:00Z`);

describe('horario', () => {
  it('calcula o fim pela duração do serviço', () => {
    expect(calcularFim(h('13:00'), 45)).toEqual(h('13:45'));
  });

  it('acusa conflito quando os horários se sobrepõem', () => {
    expect(haConflito({ inicio: h('13:30'), fim: h('14:00') }, [{ inicio: h('13:00'), fim: h('14:00') }])).toBe(true);
  });

  it('considera passado qualquer horário até agora', () => {
    const agora = h('12:00');
    expect(estaNoPassado(h('11:59'), agora)).toBe(true);
    expect(estaNoPassado(h('12:00'), agora)).toBe(true);
    expect(estaNoPassado(h('12:01'), agora)).toBe(false);
  });

  it('não acusa conflito quando um termina e o outro começa', () => {
    expect(haConflito({ inicio: h('14:00'), fim: h('14:30') }, [{ inicio: h('13:00'), fim: h('14:00') }])).toBe(false);
  });
});
