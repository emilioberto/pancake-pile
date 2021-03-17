import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

import { TUI_DEFAULT_STRINGIFY } from '@taiga-ui/cdk';
import { TuiNotification, TuiPoint } from '@taiga-ui/core';
import { TuiStatus } from '@taiga-ui/kit';
import { combineLatest, of, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CakePoolService } from 'src/app/core/services/cake-pool.service';
import { PancakeSwapService } from 'src/app/core/services/pancake-swap.service';
import { WalletService } from 'src/app/core/services/wallet.service';
import { CakePoolQuery } from 'src/app/core/state-management/queries/cake-pool.query';
import { PancakeSwapQuery } from 'src/app/core/state-management/queries/pancake-swap.query';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { InterestsResult } from 'src/app/shared/models/interests-result.model';

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

  @ViewChild('chartContainer', { static: true }) public chartContainer: ElementRef;

  chartY = 1;
  chartHeight = 100;
  chartWidth: number;
  axisXLabels = new Array(30).fill(null).map((item, index, array) => ((index + 1).toString()));
  axisYLabels: string[];
  suggestedCompound: InterestsResult;
  tuiStatusSuccess = TuiNotification.Success;
  readonly stringify = TUI_DEFAULT_STRINGIFY;


  // calculateCompound$ = this.cakePoolService.calculateCompound$
  //   .pipe(
  //     tap(interestsResults => {
  //       const orderedTotalCakes = interestsResults
  //         .map(y => y.cakePerMonthComposedInterestWithFees)
  //         .sort((a, b) => a - b);

  //       this.chartHeight = orderedTotalCakes[orderedTotalCakes.length - 1] - orderedTotalCakes[0];
  //       this.chartY = orderedTotalCakes[0];
  //       this.axisYLabels = [orderedTotalCakes[0].toPrecision(4), orderedTotalCakes[orderedTotalCakes.length - 1].toPrecision(4)];
  //       const maxCakesWithCompoundInterestAndFees = interestsResults
  //         .map(y => y.cakePerMonthComposedInterestWithFees)
  //         .sort((a, b) => b - a)[0];
  //       this.suggestedCompound = interestsResults
  //          .find(x => x.cakePerMonthComposedInterestWithFees === maxCakesWithCompoundInterestAndFees);
  //     }),
  //     map(x => x.map(y => {
  //       const totalCakes = y.cakePerMonthComposedInterestWithFees;
  //       return [y.day, Math.round(totalCakes * 1e3) / 1e3] as TuiPoint;
  //     }))
  //   );

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
    // this.chartWidth = (this.chartContainer.nativeElement as HTMLElement).clientWidth;
  }

  onDestroy(): void { }

}
