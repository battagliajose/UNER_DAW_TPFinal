import { Component, Injectable, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { EncuestaModService } from '../../../services/encuesta-mod.service';
import { EncuestaDTO } from '../../../models/encuesta.dto';


interface NuevaEncuestaDTO extends EncuestaDTO {
  esActivo: boolean;
  esEnviada: boolean;
}

@Component({
  selector: 'app-dashboard-list',
  imports: [CommonModule, CardModule, TooltipModule, MessageModule, ChipModule],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.css',
  standalone: true
})


@Injectable({
  providedIn: 'root',
})

export class DashboardListComponent {

  encuestas: NuevaEncuestaDTO[] = [];
  constructor(private encuestaModService: EncuestaModService) {
        
  }
 
  error: string = "";
  loading: boolean = true;
  ngOnInit() {    
   this.cargarEncuestas();      
  }

  cargarEncuestas(){
    this.encuestaModService.loadEncuestas().subscribe({
      next: (data) => {
        this.encuestas = data;                
        this.loading = false;
        this.error = "";
        },
      error: (error) => {
        console.error("Error al cargar y modificar encuestas:", error);
        this.loading = false;        
        this.error = 'No se pudieron cargar las encuestas. Intente nuevamente o avise al administrador.';
      }
    });
  }

  editarEncuesta(encuesta: any) {
    console.log('Editar encuesta:', encuesta);
  }

  eliminarEncuesta(encuesta: any) {
    console.log('Eliminar encuesta:', encuesta);
  }
}
