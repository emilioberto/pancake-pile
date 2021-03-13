import { Inject, Injectable } from '@angular/core';

import { BigNumber, ethers } from 'ethers';
import { from, Observable, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PancakeSwapService } from 'src/app/core/services/pancake-swap.service';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { CakePoolStore } from 'src/app/core/state-management/stores/cake-pool.store';
import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';
import { CONSTANTS } from 'src/app/shared/constants/constants';
import { CakePoolContractInfo } from 'src/app/shared/contracts/cake-pool.contract';
import { CakePoolContract, PoolInfo, UserInfo } from 'src/app/shared/contracts/interfaces/cake-pool.contract';

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

}
