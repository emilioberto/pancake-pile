import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiBadgeModule, TuiIslandModule } from '@taiga-ui/kit';

import { FormatEtherPipe } from 'src/app/shared/pipes/ethers/format-ether.pipe';
import { TruncateAddressPipe } from 'src/app/shared/pipes/truncate-address.pipe';

const TuiModules = [
  TuiLetModule,
  TuiButtonModule,
  TuiBadgeModule,
  TuiIslandModule,
  TuiLabelModule,
  TuiMoneyModule
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
  ]
})
export class SharedModule { }
