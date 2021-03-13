import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';
import { BigNumber } from '@ethersproject/bignumber';

export interface PancakeSwapState {
  cakeBalance: BigNumber;
  tokenSymbol: string;
}

export function createInitialState(): PancakeSwapState {
  return {
    cakeBalance: null,
    tokenSymbol: null
  };
}

@StoreConfig({ name: 'pancakeSwap', resettable: true })
@Injectable({ providedIn: 'root' })
export class PancakeSwapStore extends Store<PancakeSwapState> {
  constructor() {
    super(createInitialState());
  }
}
