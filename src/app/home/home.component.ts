import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { BigNumber } from 'ethers';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { CakePoolStore } from 'src/app/core/state-management/stores/cake-pool.store';
import { PancakeSwapStore } from 'src/app/core/state-management/stores/pancake-swap.store';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends BaseComponent {

  private readonly connectionTrigger = new BehaviorSubject(null);

  connection$: Observable<string[]>;
  balance$: Observable<BigNumber>;
  pendingCake$: Observable<BigNumber>;
  isBsc$: Observable<boolean>;

  constructor(
    private notificationsService: TuiNotificationsService,
    private walletQuery: WalletQuery,
    private cakePoolStore: CakePoolStore,
    private pancakeSwapStore: PancakeSwapStore,
  ) {
    super();
  }

  onInit(): void {
    this.subscription.add(
      combineLatest([
        this.walletQuery.isBsc$,
        this.walletQuery.isConnected$
      ])
        .pipe(
          switchMap(([isBsc, isConnected]) => {
            if (!isConnected || (isConnected && isBsc)) {
              return of(null);
            }
            if (!isBsc) {
              this.cakePoolStore.reset();
              this.pancakeSwapStore.reset();
              return this.notifyIsNotBsc();
            }
            return of(null);
          })
        )
        .subscribe()
    );
  }

  onDestroy(): void { }

  private notifyIsNotBsc(): Observable<void> {
    return this.notificationsService.show(
      'Plase ensure you are connected to the Binance Smart Chain',
      { status: TuiNotification.Error, autoClose: false }
    );
  }

}
