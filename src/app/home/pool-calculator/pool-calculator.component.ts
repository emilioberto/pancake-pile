import { ChangeDetectionStrategy, Component } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CakePoolQuery } from 'src/app/core/state-management/queries/cake-pool.query';
import { PancakeSwapQuery } from 'src/app/core/state-management/queries/pancake-swap.query';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-pool-calculator',
  templateUrl: './pool-calculator.component.html',
  styleUrls: ['./pool-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoolCalculatorComponent extends BaseComponent {

  showSkeleton$ = combineLatest([
    this.walletQuery.isConnected$,
    this.walletQuery.isBsc$
  ]).pipe(map(([isBsc, isConnected]) => !(isBsc && isConnected)));

  constructor(
    public cakePoolQuery: CakePoolQuery,
    public pancakeSwapQuery: PancakeSwapQuery,
    public walletQuery: WalletQuery
  ) {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }

}
