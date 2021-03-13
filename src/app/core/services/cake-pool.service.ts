import { Inject, Injectable } from '@angular/core';

import { BigNumber, ethers, Signer } from 'ethers';
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

  get calculateCompound$(): Observable<any> {
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
        tap(([pendingCake, userInfo, gasUnitPrice, apy, estimatedGas, cakeBnbConversionRate]) => {

          const days = new Array(60).fill(null).map((x, index, arr) => index + 1);
          const estimatedGasInCAKE = estimatedGas.mul(cakeBnbConversionRate[0]).mul(ethers.utils.parseUnits('1', 'gwei'));


          const dailyEarnings = days.map(day => {
            const periodInterestRate = 1 + ((apy / 365) / 100);
            // const periodCount = (720 * months) / hours;
            const investedAmount = userInfo.amount;
            const networkFee = estimatedGasInCAKE;
            // const composedInterestRate = periodInterestRate ** periodCount;
            // const totalFeeCost = networkFee * periodCount;
            // const result = (userInfo.amount * composedInterestRate - totalFeeCost - userInfo.amount);
            const stackedAmount = parseFloat(ethers.utils.formatUnits(userInfo.amount));
            const cakesByPeriod = stackedAmount * ((periodInterestRate * day) - 1);
            const compounded = ((stackedAmount * (periodInterestRate ** day) - stackedAmount)) * (30 / day);
            return compounded;
          });

          debugger;
        })



        //   map(([pendingCake, gasUnitPrice]) => {
        //     this.cakePoolContract.estimateGas.enterStaking(pendingCake || 1, { from: this.walletQuery.currentAddress })
        //       .then((gas: any) => {
        //         const estimatedGasInBNB = gas.mul(gasUnitPrice);
        //         const bbb = ethers.utils.formatEther(estimatedGasInBNB);
        //         debugger;
        //       });

        //     this.swapContract.getAmountsIn(ethers.utils.parseUnits('1'), [CakeContractInfo.address, BnbContractInfo.address])
        //       .then((res: any) => {
        //         debugger;
        //       });
        //   })
      );
  }

  private estimatedGas$(pendingCake: BigNumber): Observable<BigNumber> {
    return from(this.cakePoolContract.estimateGas.enterStaking(pendingCake || 1, { from: this.walletQuery.currentAddress }));
  }

  private get cakeBnbConversionRate$(): Observable<BigNumber[]> {
    return from(this.swapContract.getAmountsIn(
      ethers.utils.parseUnits('1'),
      [CakeContractInfo.address, BnbContractInfo.address]
    ) as Promise<BigNumber[]>);
  }

  calc(): any {

    // const periodInterestRate = ((this.apyToCalc / 365 / 24) * hours) / 100 + 1
    // const periodCount = (720 * months) / hours
    // const investedAmount = this.amountToCalc
    // const networkFee = this.estimatedGasInCAKE

    // const composedInterestRate = periodInterestRate ** periodCount
    // const totalFeeCost = networkFee * periodCount

    // const result = (investedAmount * composedInterestRate - totalFeeCost - investedAmount)

    // const cakesByPeriod = investedAmount * (periodInterestRate - 1)

    // if (logDebugInfo) {
    //   try {
    //     console.debug('==================================================================')
    //     console.debug('periodLengthInHours: ' + hours)
    //     console.debug('periodInterestRate: ' + periodInterestRate)
    //     console.debug('periodCount: ' + periodCount)
    //     console.debug('investedAmount: ' + this.fromWei(investedAmount) + ' CAKES')
    //     console.debug('networkFee: ' + this.fromWei(networkFee) + ' CAKES')
    //     console.debug("composedInterestRate: " + composedInterestRate)
    //     console.debug("totalFeeCost: " + this.fromWei(totalFeeCost) + ' CAKES')
    //     console.debug("EARNED CAKES AFTER 1 MONTH: " + this.fromWei(result) + ' CAKES')
    //   }
    //   catch (e){}
    // }

    // if (result < 0) {
    //   return 0
    // }

    // if (pushData) {
    //   this.calculatedData.push({
    //     periodLengthInHours: hours,
    //     cakesByPeriod: cakesByPeriod,
    //     periodInterestRate: periodInterestRate,
    //     periodCount: periodCount,
    //     investedAmount: investedAmount,
    //     networkFeeInCakes: networkFee,
    //     composedInterestRate: composedInterestRate,
    //     totalFeeCostInPeriod: totalFeeCost,
    //     earned: result
    //   })
    // }

    // return this.fromWei(result)
  }

}
