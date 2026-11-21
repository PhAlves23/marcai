/**
 * Preço total de um pacote: sessões x preço do serviço, com desconto percentual.
 * Entrada e saída em centavos.
 */
export function calcularPrecoPacote(precoCentavos: number, sessoes: number, descontoPercentual: number): number {
  const precoReais = precoCentavos / 100;
  const total = precoReais * sessoes * (1 - descontoPercentual / 100);
  return Math.floor(total * 100);
}
