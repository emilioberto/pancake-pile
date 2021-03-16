export interface InterestsResult {
  day: number;
  interestRate: number;
  composedInterestRate: number;
  cakePerMonthSimpleInterest: number;
  cakePerMonthComposedInterest: number;
  networkFeeInCake: number;
  periodFees: number;
  cakePerMonthComposedInterestWithFees: number;
}
