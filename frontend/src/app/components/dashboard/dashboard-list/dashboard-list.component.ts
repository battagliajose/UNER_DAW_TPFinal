import { Component, Input } from '@angular/core';
import { EncuestaDTO } from '../../../models/encuesta.dto';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';


@Component({
  selector: 'app-dashboard-list',
  imports: [CommonModule, CardModule, TooltipModule, MessageModule],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.css',
  standalone: true
})
export class DashboardListComponent {
  @Input() encuestas: EncuestaDTO[] = [];
  error: string = 'No hay encuestas disponibles. Por favor, verifique que existan encuestas en el sistema o cree una nueva encuesta.';

  ngOnInit() {    
    console.log('Encuestas recibidas en el componente:', this.encuestas);
  }
}
