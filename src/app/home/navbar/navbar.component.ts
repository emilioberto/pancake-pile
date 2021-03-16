import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { TuiStatus } from '@taiga-ui/kit';

import { WalletService } from 'src/app/core/services/wallet.service';
import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent extends BaseComponent {

  isConnected$ = this.walletQuery.isConnected$;
  address$ = this.walletQuery.address$;
  isBsc$ = this.walletQuery.isBsc$;

  tuiStatusSuccess = TuiStatus.Success;
  tuiStatusError = TuiStatus.Error;

  constructor(
    private walletQuery: WalletQuery,
    public walletService: WalletService
  ) {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }

}
