export function calculatePeriodInterestRate(apy: number, days: number): number {
  return (1 + (apy / (1e2 * 365))) * days;
}

export function calculateComposedInterestRate(apy: number, days: number): number {
  return (1 + (apy / (1e2 * 365) * days)) ** (365 / (365 / (30 / days)));
}

