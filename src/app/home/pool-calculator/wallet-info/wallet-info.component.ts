import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-wallet-info',
  templateUrl: './wallet-info.component.html',
  styleUrls: ['./wallet-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletInfoComponent extends BaseComponent {

  constructor() {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }

}
