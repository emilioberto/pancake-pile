import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PoolCalculatorComponent } from 'src/app/home/pool-calculator/pool-calculator.component';

const routes: Routes = [
  {
    path: '',
    component: PoolCalculatorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoolCalculatorRoutingModule { }
