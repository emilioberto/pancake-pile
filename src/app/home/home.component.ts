import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BigNumber } from 'ethers';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ConnectionResult, WalletService } from 'src/app/core/services/wallet.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { handleLoading } from 'src/app/shared/rxjs/operators';

@Component({
  selector: 'cake-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends BaseComponent {

  private readonly connectionTrigger = new BehaviorSubject(null);
  private readonly balanceTrigger = new BehaviorSubject(null);

  connection$: Observable<ConnectionResult>;
  balance$: Observable<BigNumber>;

  constructor(
    public walletService: WalletService
  ) {
    super();
  }

  onInit(): void {
    this.connection$ = this.connectionTrigger
      .pipe(
        switchMap(() => this.walletService.connect().pipe(handleLoading(this)))
      );
    this.balance$ = this.balanceTrigger
      .pipe(
        switchMap(() => this.walletService.balance().pipe(handleLoading(this)))
      );
  }

  onDestroy(): void { }

  connect(): void {
    this.connectionTrigger.next(1);
  }

}
