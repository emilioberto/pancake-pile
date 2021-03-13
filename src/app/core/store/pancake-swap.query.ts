import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';

import { PancakeSwapState, PancakeSwapStore } from 'src/app/core/store/pancake-swap.store';
import { FormatEtherPipe } from 'src/app/shared/pipes/ethers/format-ether.pipe';

@Injectable({ providedIn: 'root' })
export class PancakeSwapQuery extends Query<PancakeSwapState> {

  cakeBalance$ = this.select(state => state.cakeBalance);
  formattedCakeBalance$ = this.cakeBalance$
    .pipe(
      map(balance => this.formatEtherPipe.transform(balance)),
      map(balance => Number(balance))
    );

  tokenName$ = this.select(state => state.tokenSymbol);

  constructor(
    protected store: PancakeSwapStore,
    private formatEtherPipe: FormatEtherPipe
  ) {
    super(store);
  }

}
