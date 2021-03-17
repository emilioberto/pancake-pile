import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CompoundChartComponent } from 'src/app/home/pool-calculator/compound-chart/compound-chart.component';
import { PoolCalculatorRoutingModule } from 'src/app/home/pool-calculator/pool-calculator-routing.module';
import { PoolCalculatorComponent } from 'src/app/home/pool-calculator/pool-calculator.component';
import { PoolInfoComponent } from 'src/app/home/pool-calculator/pool-info/pool-info.component';
import { WalletInfoComponent } from 'src/app/home/pool-calculator/wallet-info/wallet-info.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [PoolCalculatorComponent, WalletInfoComponent, PoolInfoComponent, CompoundChartComponent],
  imports: [
    CommonModule,
    PoolCalculatorRoutingModule,
    SharedModule,
  ],
  exports: [PoolCalculatorComponent]
})
export class PoolCalculatorModule { }
