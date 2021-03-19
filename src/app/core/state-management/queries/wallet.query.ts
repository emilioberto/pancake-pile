import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';
import { combineLatest, zip } from 'rxjs';
import { combineAll, distinctUntilChanged, map } from 'rxjs/operators';

import { WalletState, WalletStore } from 'src/app/core/state-management/stores/wallet.store';
import { CONSTANTS } from 'src/app/shared/constants/constants';
import { FormatEtherPipe } from 'src/app/shared/pipes/ethers/format-ether.pipe';

@Injectable({ providedIn: 'root' })
export class WalletQuery extends Query<WalletState> {

  isConnected$ = this.select(state => !!state.address);

  isBsc$ = this.select(state => state.chainId === CONSTANTS.BSC_CHAIN_ID || state.chainId === CONSTANTS.BSC_CHAIN_ID_HEX);

  address$ = this.select(state => state.address).pipe(distinctUntilChanged());

  canReadData$ = combineLatest([this.isConnected$, this.isBsc$])
    .pipe(
      map(([isConnected, isBsc]) => isConnected && isBsc)
    );

  balance$ = this.select(state => state.balance);
  formattedBalance$ = this.balance$
    .pipe(
      map(balance => this.formatEtherPipe.transform(balance)),
      map(balance => Number(balance))
    );

  constructor(
    protected store: WalletStore,
    private formatEtherPipe: FormatEtherPipe
  ) {
    super(store);
  }

  get currentAddress(): string {
    return this.store.getValue()?.address;
  }
}
