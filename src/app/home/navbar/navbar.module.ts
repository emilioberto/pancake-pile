import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NavbarComponent } from 'src/app/home/navbar/navbar.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [NavbarComponent],
  imports: [
    SharedModule
  ]
})
export class NavbarModule { }
