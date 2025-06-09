import { Component, Injectable, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { EncuestaModService } from '../../../services/encuesta-mod.service';
import { EncuestaDTO } from '../../../models/encuesta.dto';
import { EncuestaService } from '../../../services/encuesta.service';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';  // Añade esta línea
import { MessageService } from 'primeng/api';

interface NuevaEncuestaDTO extends EncuestaDTO {
  esActivo: boolean;
  esEnviada: boolean;
}

@Component({
  selector: 'app-dashboard-list',
  imports: [CommonModule, CardModule, TooltipModule, MessageModule, ChipModule, DialogModule,ToastModule],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.css',
  standalone: true
})


@Injectable({
  providedIn: 'root',
})

export class DashboardListComponent {

  encuestas: NuevaEncuestaDTO[] = [];
  constructor(
    private encuestaModService: EncuestaModService,
    private encuestaService: EncuestaService,
    private messageService: MessageService) {
        
  }
 
  error: string = "";
  loading: boolean = true;
  mostrarConfirmacion = false;

  encuestaAEliminar: EncuestaDTO | null = null; // objeto encuesta a eliminar

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
        this.loading = false;        
        this.error = 'No se pudieron cargar las encuestas. Intente nuevamente o avise al administrador.'+error;
      }
    });
  }

  enviarEncuesta(encuesta: any) {
    console.log('Editar encuesta:', encuesta);
  }

  // eliminar encuesta
  eliminarEncuesta() {
    if (!this.encuestaAEliminar) return;
    
    this.encuestaService.delete(this.encuestaAEliminar.id).subscribe({
      next: () => {
        this.cargarEncuestas();
        this.mostrarConfirmacion = false;
        this.encuestaAEliminar = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Encuesta eliminada',
          detail: 'La encuesta se eliminó correctamente.',
        });
      },
      error: (error) => {
        this.error = 'No se pudo eliminar la encuesta. Intente nuevamente o avise al administrador. ' + error;
        this.mostrarConfirmacion = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar encuesta',
          detail: 'No se pudo eliminar la encuesta.',
        });
      }
    });
  }

  // confirmar eliminacion
  confirmarEliminar(encuesta: EncuestaDTO) {
    this.encuestaAEliminar = encuesta;
    this.mostrarConfirmacion = true;
  }

  // cancelar eliminacion
  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.encuestaAEliminar = null;
  }
}
