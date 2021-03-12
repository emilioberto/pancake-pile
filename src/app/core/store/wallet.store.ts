import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

export interface WalletState {
  address: string;
  isBsc: boolean;
}

export function createInitialState(): WalletState {
  return {
    address: null,
    isBsc: false
  };
}

@StoreConfig({ name: 'wallet' })
@Injectable({ providedIn: 'root' })
export class WalletStore extends Store<WalletState> {
  constructor() {
    super(createInitialState());
  }
}
