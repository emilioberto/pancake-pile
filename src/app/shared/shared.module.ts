import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiBadgeModule } from '@taiga-ui/kit';

import { FormatEtherPipe } from 'src/app/shared/pipes/ethers/format-ether.pipe';
import { TruncateAddressPipe } from 'src/app/shared/pipes/truncate-address.pipe';

const TuiModules = [
  TuiLetModule,
  TuiButtonModule,
  TuiBadgeModule,
];

const Pipes = [
  FormatEtherPipe,
  TruncateAddressPipe,
];

@NgModule({
  declarations: [
    ...Pipes,
  ],
  imports: [
    CommonModule,
    ...TuiModules
  ],
  exports: [
    CommonModule,
    ...TuiModules,
    ...Pipes,
  ],
  providers: [
    ...Pipes,
  ]
})
export class SharedModule { }
