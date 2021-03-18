import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TuiStatus } from '@taiga-ui/kit';
import { Observable, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CakePoolService } from 'src/app/core/services/cake-pool.service';
import { CakePoolQuery } from 'src/app/core/state-management/queries/cake-pool.query';
import { PancakeSwapQuery } from 'src/app/core/state-management/queries/pancake-swap.query';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-pool-info',
  templateUrl: './pool-info.component.html',
  styleUrls: ['./pool-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoolInfoComponent extends BaseComponent {

  @Input() showSkeleton$: Observable<boolean>;

  tuiStatusCustom = TuiStatus.Custom;

  poolInfo$ = this.walletQuery.address$
    .pipe(
      switchMap(() => zip(
        this.cakePoolService.apy$,
        this.cakePoolService.userInfo$,
        this.cakePoolService.poolPendingCake$,
        this.cakePoolService.poolBonusMultiplier$
      ))
    );

  constructor(
    public cakePoolQuery: CakePoolQuery,
    private cakePoolService: CakePoolService,
    public walletQuery: WalletQuery,
    public pancakeSwapQuery: PancakeSwapQuery
  ) {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }

}
