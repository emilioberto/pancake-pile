import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';

import { FormatEtherPipe } from 'src/app/shared/pipes/ethers/format-ether.pipe';

const TuiModules = [
  TuiLetModule,
  TuiButtonModule
];

@NgModule({
  declarations: [
    FormatEtherPipe
  ],
  imports: [
    CommonModule,
    ...TuiModules
  ],
  exports: [
    ...TuiModules,
    FormatEtherPipe
  ],
  providers: [
    FormatEtherPipe
  ]
})
export class SharedModule { }
