import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-pool-calculator',
  templateUrl: './pool-calculator.component.html',
  styleUrls: ['./pool-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoolCalculatorComponent extends BaseComponent {

  constructor() {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }
}
