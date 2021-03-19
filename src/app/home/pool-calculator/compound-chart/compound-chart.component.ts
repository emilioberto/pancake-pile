import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { TUI_DEFAULT_STRINGIFY } from '@taiga-ui/cdk';
import { TuiNotification, TuiPoint } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { CakePoolService } from 'src/app/core/services/cake-pool.service';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { InterestsResult } from 'src/app/shared/models/interests-result.model';

@Component({
  selector: 'cake-compound-chart',
  templateUrl: './compound-chart.component.html',
  styleUrls: ['./compound-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompoundChartComponent extends BaseComponent {

  @Input() showSkeleton$: Observable<boolean>;

  @ViewChild('chartContainer', { static: true }) public chartContainer: ElementRef;

  chartY = 1;
  chartHeight = 100;
  chartWidth: number;
  axisXLabels = new Array(30).fill(null).map((item, index, array) => ((index + 1).toString()));
  axisYLabels: string[] = [];
  suggestedCompound: InterestsResult;
  stringify = TUI_DEFAULT_STRINGIFY;
  tuiStatusSuccess = TuiNotification.Success;

  calculateCompound$ = this.walletQuery.canReadData$
      .pipe(
        filter(canReadData => canReadData),
        switchMap(() => this.cakePoolService.calculateCompound$),
        tap(interestsResults => {
          const orderedTotalCakes = interestsResults
            .map(y => y.cakePerMonthComposedInterestWithFees)
            .sort((a, b) => a - b);

          this.chartHeight = orderedTotalCakes[orderedTotalCakes.length - 1] - orderedTotalCakes[0];
          this.chartY = orderedTotalCakes[0];
          this.axisYLabels = [orderedTotalCakes[0].toPrecision(4), orderedTotalCakes[orderedTotalCakes.length - 1].toPrecision(4)];
          const maxCakesWithCompoundInterestAndFees = interestsResults
            .map(y => y.cakePerMonthComposedInterestWithFees)
            .sort((a, b) => b - a)[0];
          this.suggestedCompound = interestsResults
            .find(x => x.cakePerMonthComposedInterestWithFees === maxCakesWithCompoundInterestAndFees);
        }),
        map(x => x.map(y => {
          const totalCakes = y.cakePerMonthComposedInterestWithFees;
          return [y.day, Math.round(totalCakes * 1e3) / 1e3] as TuiPoint;
        }))
      );

  constructor(
    private cakePoolService: CakePoolService,
    private walletQuery: WalletQuery
  ) {
    super();
  }

  onInit(): void {
    this.chartWidth = (this.chartContainer.nativeElement as HTMLElement).clientWidth;
  }

  onDestroy(): void { }

}
