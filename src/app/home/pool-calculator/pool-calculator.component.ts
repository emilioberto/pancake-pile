import { ChangeDetectionStrategy, Component, ElementRef, NgZone, ViewChild } from '@angular/core';

import { TUI_DEFAULT_STRINGIFY } from '@taiga-ui/cdk';
import { TuiPoint } from '@taiga-ui/core';
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

  @ViewChild('chartContainer', { static: true }) public chartContainer: ElementRef;

  walletInfo$ = this.walletQuery.address$
    .pipe(
      switchMap(() => zip(
        this.walletService.balance$,
        this.pancakeSwapService.tokenSymbol$,
        this.pancakeSwapService.addressBalance$
      ))
    );

  poolInfo$ = this.walletQuery.address$
    .pipe(
      switchMap(() => zip(
        this.cakePoolService.poolPendingCake$,
        this.cakePoolService.userInfo$,
        this.cakePoolService.poolInfo$,
        this.cakePoolService.poolBonusMultiplier$,
        this.cakePoolService.apy$,
        this.cakePoolService.calculateCompound$
      ))
    );

  tuiStatusPrimary = TuiStatus.Primary;

  readonly stringify = TUI_DEFAULT_STRINGIFY;
  readonly value: ReadonlyArray<TuiPoint> = [
    [50, 50],
    [100, 75],
    [150, 50],
    [200, 150],
    [250, 155],
    [300, 190],
    [350, 90],
  ];

  chartWidth: number;

  constructor(
    public cakePoolQuery: CakePoolQuery,
    public pancakeSwapQuery: PancakeSwapQuery,
    public walletQuery: WalletQuery,
    private cakePoolService: CakePoolService,
    private pancakeSwapService: PancakeSwapService,
    private walletService: WalletService) {
    super();
  }

  onInit(): void {
    this.chartWidth = (this.chartContainer.nativeElement as HTMLElement).clientWidth;
  }

  onDestroy(): void { }

}
