import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import detectEthereumProvider from '@metamask/detect-provider';
import { iconsPathFactory, TuiDialogModule, TuiNotificationsModule, TuiRootModule, TUI_ICONS_PATH } from '@taiga-ui/core';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    {
      provide: APP_INITIALIZER,
      useFactory: detectEthereumProviderFactory,
      deps: [],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

function detectEthereumProviderFactory(): () => Promise<void> {
  return async () => {
    const provider = await detectEthereumProvider();
    if (!provider) {
      console.log('Please install Metamask');
    }
  };
}
