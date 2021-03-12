import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { BigNumber } from 'ethers';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { WalletQuery } from 'src/app/core/store/wallet.query';
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
    private walletQuery: WalletQuery
  ) {
    super();
  }

  onInit(): void {
    this.subscription.add(
      this.walletQuery.isBsc$
        .pipe(
          filter(isBsc => !isBsc),
          switchMap(() => this.notifyIsNotBsc())
        )
        .subscribe()
    );
  }

  onDestroy(): void { }

  private notifyIsNotBsc(): Observable<void> {
    return this.notificationsService.show(
      'Plase ensure you are connected to the Binance Smart Chain',
      { status: TuiNotification.Warning, autoClose: false }
    );
  }

}
