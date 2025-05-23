import { Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'test',
    component: TestComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
