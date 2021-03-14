export function calculateInterests(amount: number, interestRate: number): number {
  return amount * interestRate;
}

export function calculateCompoundInterests(amount: number, composedInterestRate: number): number {
  return amount * composedInterestRate;
}

export function calculatePeriodInterestRate(apy: number, days: number): number {
  return ((apy / 365) * days) / 1e2;
}

export function calculateComposedInterestRate(apy: number, period: number): number {
  return ((apy / 1e2) / (365 / period)) ** ((365 / period) * 30);
}

