import { Component, Input } from '@angular/core';
import { EncuestaDTO } from '../../../models/encuesta.dto';

@Component({
  selector: 'app-dashboard-enviadas',
  imports: [],
  templateUrl: './dashboard-enviadas.component.html',
  styleUrl: './dashboard-enviadas.component.css'
})
export class DashboardEnviadasComponent {
  @Input() encuestas: EncuestaDTO[] = [];

  ngOnInit() {
    // Puedes usar this.encuestas aquí
    console.log('Encuestas recibidas en el componente:', this.encuestas);
  }
}
