import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';

import { PancakeSwapState, PancakeSwapStore } from 'src/app/core/state-management/stores/pancake-swap.store';
import { FormatEtherPipe } from 'src/app/shared/pipes/ethers/format-ether.pipe';

@Injectable({ providedIn: 'root' })
export class PancakeSwapQuery extends Query<PancakeSwapState> {

  tokenName$ = this.select(state => state.tokenSymbol);

  cakeBalance$ = this.select(state => state.cakeBalance);
  formattedCakeBalance$ = this.cakeBalance$
    .pipe(
      map(balance => this.formatEtherPipe.transform(balance)),
      map(balance => Number(balance))
    );

  constructor(
    protected store: PancakeSwapStore,
    private formatEtherPipe: FormatEtherPipe
  ) {
    super(store);
  }

}
