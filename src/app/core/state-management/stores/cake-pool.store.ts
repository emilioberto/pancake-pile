import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';
import { BigNumber } from '@ethersproject/bignumber';

import { PoolInfo, UserInfo } from 'src/app/shared/contracts/interfaces/cake-pool.contract';

export interface CakePoolState {
  bonusMultiplier: BigNumber;
  pendingCake: BigNumber;
  poolInfo: PoolInfo;
  userInfo: UserInfo;
}

export function createInitialState(): CakePoolState {
  return {
    bonusMultiplier: null,
    pendingCake: null,
    poolInfo: null,
    userInfo: null
  };
}

@StoreConfig({ name: 'cakePool', resettable: true })
@Injectable({ providedIn: 'root' })
export class CakePoolStore extends Store<CakePoolState> {
  constructor() {
    super(createInitialState());
  }
}
