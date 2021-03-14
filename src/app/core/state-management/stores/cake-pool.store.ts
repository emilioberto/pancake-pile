import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';
import { BigNumber } from '@ethersproject/bignumber';

import { PoolInfo, UserInfo } from 'src/app/shared/contracts/interfaces/cake-pool.contract';

export interface CakePoolState {
  bonusMultiplier: BigNumber;
  cakePerBlock: BigNumber;
  pendingCake: BigNumber;
  poolInfo: PoolInfo;
  totalAllocPoint: BigNumber;
  userInfo: UserInfo;
  apy: number;
  networkFeeInCake: number;
}

export function createInitialState(): CakePoolState {
  return {
    bonusMultiplier: null,
    cakePerBlock: null,
    pendingCake: null,
    poolInfo: null,
    totalAllocPoint: null,
    userInfo: null,
    apy: null,
    networkFeeInCake: null,
  };
}

@StoreConfig({ name: 'cakePool', resettable: true })
@Injectable({ providedIn: 'root' })
export class CakePoolStore extends Store<CakePoolState> {
  constructor() {
    super(createInitialState());
  }
}
