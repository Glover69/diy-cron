import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { GoogleAuthService } from '../services/google-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
     provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (auth: GoogleAuthService) => () => auth.hydrate(),
      deps: [GoogleAuthService],
    },
  ],
};
