import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';

import { WalletState, WalletStore } from 'src/app/core/store/wallet.store';

@Injectable({ providedIn: 'root' })
export class WalletQuery extends Query<WalletState> {

  isConnected$ = this.select(state => !!state.address);
  isBsc$ = this.select(state => state.isBsc);
  address$ = this.select(state => state.address);

  constructor(protected store: WalletStore) {
    super(store);
  }

  get currentAddress(): string {
    return this.store.getValue()?.address;
  }
}
