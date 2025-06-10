import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { DashboardResultadosComponent } from './dashboard-resultados/dashboard-resultados.component';
import { DashboardCrearComponent } from './dashboard-crear/dashboard-crear.component';

  @Component({
    selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    DashboardContentComponent,
    DashboardListComponent,
    DashboardResultadosComponent,    
    DashboardCrearComponent
],    
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  //variable para recibir los datos del dashboard-content  
  activeView: string = 'inicio'; // Vista por defecto.

  onMenuClick(view: string) {
    this.activeView = view;
  }  
 
}
