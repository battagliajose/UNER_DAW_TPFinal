import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';


@Component({
  selector: 'app-dashboard-list',
  imports: [CommonModule, CardModule, TooltipModule, MessageModule, ChipModule],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.css',
  standalone: true
})
export class DashboardListComponent {
  @Input() encuestas: any; // uso any porque modifique encuestas.
  error: string = 'No hay encuestas disponibles. Por favor, verifique que existan encuestas en el sistema o cree una nueva encuesta.';

  ngOnInit() {    
    console.log('Encuestas recibidas en el componente:', this.encuestas);
  }

  editarEncuesta(encuesta: any) {
    console.log('Editar encuesta:', encuesta);
  }

  eliminarEncuesta(encuesta: any) {
    console.log('Eliminar encuesta:', encuesta);
  }
}
