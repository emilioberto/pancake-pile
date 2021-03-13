import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TuiStatus } from '@taiga-ui/kit';
import { zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CakePoolService } from 'src/app/core/services/cake-pool.service';
import { PancakeSwapService } from 'src/app/core/services/pancake-swap.service';
import { WalletService } from 'src/app/core/services/wallet.service';
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

  walletInfo$ = this.walletQuery.address$
    .pipe(
      switchMap(() => zip(
        this.walletService.balance$,
        this.pancakeSwapService.tokenSymbol$,
        this.pancakeSwapService.cakeBalance$
      ))
    );

  poolInfo$ = this.walletQuery.address$
    .pipe(
      switchMap(() => zip(
        this.cakePoolService.poolPendingCake$,
        this.cakePoolService.userInfo$,
        this.cakePoolService.poolInfo$,
        this.cakePoolService.poolBonusMultiplier$
      ))
    );

  tuiStatusPrimary = TuiStatus.Primary;

  constructor(
    public cakePoolQuery: CakePoolQuery,
    public pancakeSwapQuery: PancakeSwapQuery,
    public walletQuery: WalletQuery,
    private cakePoolService: CakePoolService,
    private pancakeSwapService: PancakeSwapService,
    private walletService: WalletService,
  ) {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }
}
