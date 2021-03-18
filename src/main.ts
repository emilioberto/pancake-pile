import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { persistState } from '@datorama/akita';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const storage = persistState({
  include: ['wallet']
});

const providers = [{ provide: 'persistStorage', useValue: storage, }];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
