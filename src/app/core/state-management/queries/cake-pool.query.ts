import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';

import { CakePoolState, CakePoolStore } from 'src/app/core/state-management/stores/cake-pool.store';
import { FormatEtherPipe } from 'src/app/shared/pipes/ethers/format-ether.pipe';

@Injectable({ providedIn: 'root' })
export class CakePoolQuery extends Query<CakePoolState> {

  bonusMultiplier$ = this.select(state => state.bonusMultiplier);

  pendingCake$ = this.select(state => state.pendingCake);
  formattedPendingCake$ = this.pendingCake$
    .pipe(
      map(pending => this.formatEtherPipe.transform(pending)),
      map(pending => Number(pending))
    );

  amount$ = this.select(state => state.userInfo.amount);
  formattedAmount$ = this.amount$
    .pipe(
      map(amount => this.formatEtherPipe.transform(amount)),
      map(amount => Number(amount))
    );

  apy$ = this.select(state => state.apy);

  constructor(
    protected store: CakePoolStore,
    private formatEtherPipe: FormatEtherPipe
  ) {
    super(store);
  }

}
