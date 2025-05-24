import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
                   theme: {
                       preset: 'lara-dark-blue'
                   }
               }),
    provideHttpClient(),
    MessageService,
    DialogService
  ]
};


// import { ApplicationConfig } from '@angular/core';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { providePrimeNG } from 'primeng/config';
// import Aura from '@primeng/themes/aura';

// export const appConfig: ApplicationConfig = {
//     providers: [
//         provideAnimationsAsync(),
//         providePrimeNG({
//             theme: {
//                 preset: Aura
//             }
//         })
//     ]
// };