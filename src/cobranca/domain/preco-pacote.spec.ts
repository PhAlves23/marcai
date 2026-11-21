import { calcularPrecoPacote } from './preco-pacote';

describe('calcularPrecoPacote', () => {
  it('sem desconto, é sessões x preço', () => {
    expect(calcularPrecoPacote(5000, 4, 0)).toBe(20000);
  });

  it('aplica o desconto percentual', () => {
    expect(calcularPrecoPacote(5000, 4, 10)).toBe(18000);
  });
});
