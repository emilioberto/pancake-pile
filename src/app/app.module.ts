import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { iconsPathFactory, TuiButtonModule, TuiDialogModule, TuiNotificationsModule, TuiRootModule, TUI_ICONS_PATH } from '@taiga-ui/core';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiRootModule,
    TuiNotificationsModule,
    TuiDialogModule,
    CoreModule
  ],
  providers: [
    {
      provide: TUI_ICONS_PATH,
      useValue: iconsPathFactory('assets/taiga-ui/icons/'),
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
