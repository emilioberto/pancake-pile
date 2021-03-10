import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';

const TuiModules = [
  TuiLetModule,
  TuiButtonModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...TuiModules
  ],
  exports: [
    ...TuiModules
  ]
})
export class SharedModule { }
