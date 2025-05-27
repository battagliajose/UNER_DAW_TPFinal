import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,CardModule,ButtonModule,RippleModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  sidebarItems = [
    { label: 'Inicio', icon: 'pi pi-home' },
    { label: 'Estadísticas', icon: 'pi pi-chart-bar' },
    { label: 'Configuración', icon: 'pi pi-cog' }
  ];

 
}
