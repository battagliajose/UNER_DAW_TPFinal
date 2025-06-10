import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreacionEncuestaComponent } from "../../formularios/creacion-encuesta/creacion-encuesta.component";

@Component({
  selector: 'app-dashboard-crear',
  standalone: true,
  imports: [CommonModule, CreacionEncuestaComponent],
  templateUrl: './dashboard-crear.component.html',
  styleUrls: ['./dashboard-crear.component.css']
})
export class DashboardCrearComponent {


}
