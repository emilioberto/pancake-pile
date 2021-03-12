import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

export interface WalletState {
  address: string;
  chainId: string | number;
}

export function createInitialState(): WalletState {
  return {
    address: null,
    chainId: null
  };
}

@StoreConfig({ name: 'wallet', resettable: true })
@Injectable({ providedIn: 'root' })
export class WalletStore extends Store<WalletState> {
  constructor() {
    super(createInitialState());
  }
}
