import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BigNumber } from 'ethers';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { WalletService } from 'src/app/core/services/wallet.service';
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

  connection$: Observable<string[]>;
  balance$: Observable<BigNumber>;
  pendingCake$: Observable<BigNumber>;
  isBsc$: Observable<boolean>;

  constructor(
    public walletService: WalletService
  ) {
    super();
  }

  onInit(): void {
    // this.connection$ = this.connectionTrigger
    //   .pipe(
    //     switchMap(() => this.walletService.connect().pipe(handleLoading(this)))
    //   );
    // this.balance$ = this.balanceTrigger
    //   .pipe(
    //     switchMap(() => this.walletService.balance().pipe(handleLoading(this)))
    //   );
    // this.isBsc$ = timer(0, 1000)
    //   .pipe(
    //     switchMap(() => this.walletService.isBsc())
    //   );
    // this.pendingCake$ = timer(0, 1000)
    //   .pipe(
    //     switchMap(() => this.walletService.pendingCake())
    //   );
  }

  onDestroy(): void { }

  connect(): void {
    this.connectionTrigger.next(1);
  }

}
