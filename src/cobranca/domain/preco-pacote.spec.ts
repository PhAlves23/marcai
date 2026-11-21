import { calcularPrecoPacote } from './preco-pacote';

describe('calcularPrecoPacote', () => {
  it('sem desconto, é sessões x preço', () => {
    expect(calcularPrecoPacote(5000, 4, 0)).toBe(20000);
  });

  it('aplica o desconto percentual', () => {
    expect(calcularPrecoPacote(5000, 4, 10)).toBe(18000);
  });

  it('arredonda meio centavo para cima, sem perder centavo no float', () => {
    // 3 sessões de R$ 49,90 com 15%: R$ 127,245 vira R$ 127,25
    expect(calcularPrecoPacote(4990, 3, 15)).toBe(12725);
  });
});
