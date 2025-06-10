import { Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { HomeComponent } from './components/home/home.component';
import { CreacionEncuestaComponent } from './components/formularios/creacion-encuesta/creacion-encuesta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResponderEncuestaComponent } from './components/responder-encuesta/responder-encuesta.component';
import { EnlaceInvalidoComponent } from './components/enlace-invalido/enlace-invalido.component';
import { VisualizacionResultadosComponent } from './components/resultados/visualizacion-resultados/visualizacion-resultados.component';
import { ResultadosEncuestaComponent } from './components/resultados/resultados-encuesta/resultados-encuesta.component';
import { ResumenEstadisticoComponent } from './components/resultados/resumen-estadistico/resumen-estadistico.component';
import { InformeIaComponent } from './components/informe-ia/informe-ia.component';

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
    path: 'responder/:id/:codigo',
    component: ResponderEncuestaComponent,
  },
  {
    path: 'responder/enlace-invalido',
    component: EnlaceInvalidoComponent,
  },

  {
    path: 'visualizacion-resultados/:id',
    component: VisualizacionResultadosComponent,
    children: [
      { path: 'resultados-encuesta', component: ResultadosEncuestaComponent },
      { path: 'resumen-estadistico', component: ResumenEstadisticoComponent },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
