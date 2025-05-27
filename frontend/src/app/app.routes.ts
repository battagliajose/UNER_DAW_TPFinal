import { Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { HomeComponent } from './components/home/home.component';
import { CreacionEncuestaComponent } from './components/formularios/creacion-encuesta/creacion-encuesta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

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
    path: 'crear',
    component: CreacionEncuestaComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
