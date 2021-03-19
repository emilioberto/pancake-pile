import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Observable, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { PancakeSwapService } from 'src/app/core/services/pancake-swap.service';
import { WalletService } from 'src/app/core/services/wallet.service';
import { PancakeSwapQuery } from 'src/app/core/state-management/queries/pancake-swap.query';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-wallet-info',
  templateUrl: './wallet-info.component.html',
  styleUrls: ['./wallet-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletInfoComponent extends BaseComponent {

  @Input() showSkeleton$: Observable<boolean>;

  walletInfo$ = this.walletQuery.canReadData$
    .pipe(
      filter(canReadData => canReadData),
      switchMap(() => this.walletQuery.address$),
      switchMap(() => zip(
        this.walletService.balance$,
        this.pancakeSwapService.tokenSymbol$,
        this.pancakeSwapService.addressBalance$
      )),
    );

  constructor(
    private walletService: WalletService,
    private pancakeSwapService: PancakeSwapService,
    public walletQuery: WalletQuery,
    public pancakeSwapQuery: PancakeSwapQuery
  ) {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }

}
