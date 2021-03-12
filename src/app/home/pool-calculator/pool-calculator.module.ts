import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoolCalculatorRoutingModule } from 'src/app/home/pool-calculator/pool-calculator-routing.module';
import { PoolCalculatorComponent } from 'src/app/home/pool-calculator/pool-calculator.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [PoolCalculatorComponent],
  imports: [
    CommonModule,
    PoolCalculatorRoutingModule,
    SharedModule,
  ],
  exports: [PoolCalculatorComponent]
})
export class PoolCalculatorModule { }
