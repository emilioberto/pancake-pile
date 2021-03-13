import { ChangeDetectionStrategy, Component } from '@angular/core';

import { zip } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { PancakeSwapService } from 'src/app/core/services/pancake-swap.service';
import { WalletService } from 'src/app/core/services/wallet.service';
import { PancakeSwapQuery } from 'src/app/core/store/pancake-swap.query';
import { WalletQuery } from 'src/app/core/store/wallet.query';
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

  constructor(
    public walletQuery: WalletQuery,
    public pancakeSwapQuery: PancakeSwapQuery,
    private pancakeSwapService: PancakeSwapService,
    private walletService: WalletService,
  ) {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }
}
