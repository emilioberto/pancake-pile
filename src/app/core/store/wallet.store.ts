import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';
import { BigNumber } from '@ethersproject/bignumber';

export interface WalletState {
  address: string;
  chainId: string | number;
  balance: BigNumber;
}

export function createInitialState(): WalletState {
  return {
    address: null,
    chainId: null,
    balance: null
  };
}

@StoreConfig({ name: 'wallet', resettable: true })
@Injectable({ providedIn: 'root' })
export class WalletStore extends Store<WalletState> {
  constructor() {
    super(createInitialState());
  }
}
