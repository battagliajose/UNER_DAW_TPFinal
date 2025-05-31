import { Component, Input } from '@angular/core';
import { EncuestaDTO } from '../../../models/encuesta.dto';

@Component({
  selector: 'app-dashboard-list',
  imports: [],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.css'
})
export class DashboardListComponent {
  @Input() encuestas: EncuestaDTO[] = [];

  ngOnInit() {
    // Puedes usar this.encuestas aquí
    console.log('Encuestas recibidas en el componente:', this.encuestas);
  }
}
