import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TuiButtonModule } from '@taiga-ui/core';

import { HomeRoutingModule } from 'src/app/home/home-routing.module';
import { HomeComponent } from 'src/app/home/home.component';

const TuiModules = [
  TuiButtonModule
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ...TuiModules
  ]
})
export class HomeModule { }
