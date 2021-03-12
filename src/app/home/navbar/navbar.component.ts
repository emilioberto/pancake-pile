import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'cake-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent extends BaseComponent {

  constructor() {
    super();
  }

  onInit(): void { }

  onDestroy(): void { }

}
