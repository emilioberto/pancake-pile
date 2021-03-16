import { Inject, Injectable } from '@angular/core';

import { BigNumber, ethers, Signer } from 'ethers';
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils';
import { from, Observable, of, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { PancakeSwapService } from 'src/app/core/services/pancake-swap.service';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { CakePoolStore } from 'src/app/core/state-management/stores/cake-pool.store';
import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';
import { CONSTANTS } from 'src/app/shared/constants/constants';
import { CakePoolContractInfo } from 'src/app/shared/contracts/cake-pool.contract';
import { CakeContractInfo } from 'src/app/shared/contracts/cake.contract';
import { CakePoolContract, PoolInfo, UserInfo } from 'src/app/shared/contracts/interfaces/cake-pool.contract';
import { SwapContractInfo } from 'src/app/shared/contracts/swap.contract';
import { BnbContractInfo } from 'src/app/shared/contracts/wbnb.contract';
import { InterestsResult } from 'src/app/shared/models/interests-result.model';
import { calculateComposedInterestRate, calculatePeriodInterestRate } from 'src/app/shared/utils/interests.utils';

@Injectable({ providedIn: 'root' })
export class CakePoolService {

  provider = new ethers.providers.Web3Provider(this.web3Provider);

  constructor(
    @Inject(MetamaskWeb3Provider) private web3Provider: any,
    private store: CakePoolStore,
    private walletQuery: WalletQuery,
    private pancakeSwapService: PancakeSwapService
  ) { }

  private get cakePoolContract(): CakePoolContract {
    return new ethers.Contract(CakePoolContractInfo.address, CakePoolContractInfo.ABI, this.provider) as CakePoolContract;
  }

  private get swapContract(): CakePoolContract {
    return new ethers.Contract(SwapContractInfo.address, SwapContractInfo.ABI, this.provider) as CakePoolContract;
  }

  get poolPendingCake$(): Observable<BigNumber> {
    return from(this.cakePoolContract.pendingCake(CONSTANTS.CAKE_POOL_INDEX, this.walletQuery.currentAddress))
      .pipe(tap(pendingCake => this.store.update({ pendingCake })));
  }

  get userInfo$(): Observable<UserInfo> {
    return from(this.cakePoolContract.userInfo(CONSTANTS.CAKE_POOL_INDEX, this.walletQuery.currentAddress))
      .pipe(tap(userInfo => this.store.update({ userInfo })));
  }

  get poolInfo$(): Observable<PoolInfo> {
    return from(this.cakePoolContract.poolInfo(CONSTANTS.CAKE_POOL_INDEX))
      .pipe(tap(poolInfo => this.store.update({ poolInfo })));
  }

  get poolBonusMultiplier$(): Observable<BigNumber> {
    return from(this.cakePoolContract.BONUS_MULTIPLIER())
      .pipe(tap(bonusMultiplier => this.store.update({ bonusMultiplier })));
  }

  get cakePerBlock$(): Observable<BigNumber> {
    return from(this.cakePoolContract.cakePerBlock())
      .pipe(tap(cakePerBlock => this.store.update({ cakePerBlock })));
  }

  get totalAllocPoint$(): Observable<BigNumber> {
    return from(this.cakePoolContract.totalAllocPoint())
      .pipe(tap(totalAllocPoint => this.store.update({ totalAllocPoint })));
  }

  get apy$(): Observable<number> {
    return zip(
      this.poolInfo$,
      this.cakePerBlock$,
      this.totalAllocPoint$,
      this.pancakeSwapService.cakePoolBalance$
    )
      .pipe(
        map(([poolInfo, cakePerBlock, totalAllocPoint, poolLpSupply]) => {
          const blockReward = cakePerBlock
            .mul(poolInfo.allocPoint)
            .div(totalAllocPoint);

          const numberOfBlocksInOneYear = CONSTANTS.CAKE_BLOCKS_PER_MINUTE * 60 * 24 * 365;
          const annualBlockReward = blockReward
            .mul(BigNumber.from(numberOfBlocksInOneYear))
            .mul(BigNumber.from('1000000000000'));
          const apy = annualBlockReward
            .div(poolLpSupply)
            .div(BigNumber.from('100000000')).toNumber() / 100;
          return apy;
        }),
        tap(apy => this.store.update({ apy }))
      );
  }

  get calculateCompound$(): Observable<InterestsResult[]> {
    return zip(
      this.poolPendingCake$,
      this.userInfo$,
      this.provider.getGasPrice(),
      this.apy$
    )
      .pipe(
        switchMap(([pendingCake, userInfo, gasUnitPrice, apy]) => zip(
          of(pendingCake),
          of(userInfo),
          of(gasUnitPrice),
          of(apy),
          this.estimatedGas$(pendingCake),
          this.cakeBnbConversionRate$)
        ),
        map(([pendingCake, userInfo, gasUnitPrice, apy, estimatedGas, cakeBnbConversionRate]) => {

          const days = new Array(30).fill(null).map((x, index, arr) => index + 1);
          const networkFeeInCake = this.calculateEstimatedGasInCake(estimatedGas, gasUnitPrice, cakeBnbConversionRate);
          this.store.update({ networkFeeInCake });

          const dailyEarnings = days.map(day => {
            const amountInPool = parseFloat(ethers.utils.formatUnits(userInfo.amount));
            const interestRate = calculatePeriodInterestRate(apy, day);
            const composedInterestRate = calculateComposedInterestRate(apy, day);
            const cakePerMonthSimpleInterest = (amountInPool * interestRate);
            const cakePerMonthComposedInterest = (amountInPool * composedInterestRate) - amountInPool;
            const periodFees = networkFeeInCake * (30 / day);
            const cakePerMonthComposedInterestWithFees = cakePerMonthComposedInterest - periodFees;

            return {
              day,
              interestRate,
              composedInterestRate,
              cakePerMonthSimpleInterest,
              cakePerMonthComposedInterest,
              networkFeeInCake,
              periodFees,
              cakePerMonthComposedInterestWithFees
            } as InterestsResult;
          });

          return dailyEarnings;
        })
      );
  }

  private estimatedGas$(pendingCake: BigNumber): Observable<BigNumber> {
    return from(
      this.cakePoolContract.estimateGas.enterStaking(
        pendingCake || 1,
        { from: this.walletQuery.currentAddress }
      )
    );
  }

  private get cakeBnbConversionRate$(): Observable<BigNumber[]> {
    return from(this.swapContract.getAmountsIn(
      ethers.utils.parseUnits('1'),
      [CakeContractInfo.address, BnbContractInfo.address]
    ) as Promise<BigNumber[]>);
  }

  private calculateEstimatedGasInCake(estimatedGas: BigNumber, gasUnitPrice: BigNumber, cakeBnbConversionRate: BigNumber[]): number {
    const estimatedGasInBNB = estimatedGas.mul(gasUnitPrice);
    const bnbGasValue = formatEther(estimatedGasInBNB);
    const cakeBnbConversionRateValue = formatEther(cakeBnbConversionRate[0]);

    return parseFloat(bnbGasValue) * parseFloat(cakeBnbConversionRateValue);
  }

}
