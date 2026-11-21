/**
 * Preço total de um pacote: sessões x preço do serviço, com desconto percentual.
 * Tudo em centavos inteiros; meio centavo arredonda para cima.
 */
export function calcularPrecoPacote(precoCentavos: number, sessoes: number, descontoPercentual: number): number {
  return Math.round((precoCentavos * sessoes * (100 - descontoPercentual)) / 100);
}
