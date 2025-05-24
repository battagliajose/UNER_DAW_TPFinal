import { Routes } from '@angular/router';
import { HomeComponent } from '../app/presentacion/home/pages/home/home.component';

export const routes: Routes = [
  { 
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  { 
    path: '**',
    redirectTo: ''
  }
];
