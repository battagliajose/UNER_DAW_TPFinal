import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { DashboardEnviadasComponent } from './dashboard-enviadas/dashboard-enviadas.component';
import { EncuestaDTO } from '../../models/encuesta.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    SidebarComponent,
    DashboardContentComponent,
    DashboardListComponent,
    DashboardEnviadasComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  //variable para recibir los datos del dashboard-content
  encuestasCompartidas: EncuestaDTO[] = [];
  activeView: string = 'inicio'; // Vista por defecto

  onMenuClick(view: string) {
    this.activeView = view;
  }
  //metodo para cargar la variable con el dato recibido del dashboard-content
  onDatosCargados(encuestas: EncuestaDTO[]) {
    this.encuestasCompartidas = encuestas;
  }
}
