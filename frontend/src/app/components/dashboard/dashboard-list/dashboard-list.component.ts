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
import { ToastModule } from 'primeng/toast'; // Añade esta línea
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

interface NuevaEncuestaDTO extends EncuestaDTO {
  esActivo: boolean;
  esEnviada: boolean;
}

@Component({
  selector: 'app-dashboard-list',
  imports: [
    CommonModule,
    CardModule,
    TooltipModule,
    MessageModule,
    ChipModule,
    DialogModule,
    ToastModule,
    FormsModule,
  ],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.css',
  standalone: true,
})
@Injectable({
  providedIn: 'root',
})
export class DashboardListComponent {
  constructor(
    private encuestaModService: EncuestaModService,
    private encuestaService: EncuestaService,
    private messageService: MessageService,
  ) {}

  encuestas: NuevaEncuestaDTO[] = [];
  error: string = '';
  loading: boolean = true;
  mostrarConfirmacion = false;
  encuestaAEliminar: NuevaEncuestaDTO | null = null; // objeto encuesta a eliminar

  //Variables para enviar encuesta
  encuestaSelecionada: NuevaEncuestaDTO | null = null; // objeto encuesta seleccionada
  telefonos: string = '';
  mostrarDialogoTelefonos = false;

  ngOnInit() {
    this.cargarEncuestas();
  }

  cargarEncuestas() {
    this.encuestaModService.loadEncuestas().subscribe({
      next: (data) => {
        this.encuestas = data;
        console.log(this.encuestas);
        this.loading = false;
        this.error = '';
      },
      error: (error) => {
        this.loading = false;
        this.error =
          'No se pudieron cargar las encuestas. Intente nuevamente o avise al administrador.' +
          error;
      },
    });
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
        this.error =
          'No se pudo eliminar la encuesta. Intente nuevamente o avise al administrador. ' +
          error;
        this.mostrarConfirmacion = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar encuesta',
          detail: 'No se pudo eliminar la encuesta.',
        });
      },
    });
  }

  // confirmar eliminacion
  confirmarEliminar(encuesta: NuevaEncuestaDTO) {
    if (encuesta.esActivo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Eliminar encuesta',
        detail: 'No se pudo eliminar una encuesta activa.',
      });
      return;
    } else {
      this.encuestaAEliminar = encuesta;
      this.mostrarConfirmacion = true;
    }
  }

  // cancelar eliminacion
  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.encuestaAEliminar = null;
  }

  abrirDialogoEnvio(encuesta: NuevaEncuestaDTO) {
    console.log('Esta es la encuesta', encuesta);
    if (!encuesta.esEnviada) {
      this.encuestaSelecionada = encuesta;
      this.telefonos = '';
      this.mostrarDialogoTelefonos = true;
    } else {
      return;
    }
  }
  enviarEncuesta() {
    console.log('Esta es la encuesta que envio', this.encuestaSelecionada);
    if (!this.telefonos || !this.encuestaSelecionada) {
      return;
    }

    const telefonosArray = this.telefonos.split('\n').map((tel) => tel.trim());
    //toast de envio
    this.messageService.add({
      severity: 'success',
      summary: 'Envio de Encuesta ',
      detail: 'La encuesta se ha enviado a los contactos correctamente.',
    });
    // Aquí iría la lógica para enviar los enlaces
    console.log(
      'Enviando enlaces para la encuesta: http://localhost:4200/responder/encuesta/',
      this.encuestaSelecionada.codigoRespuesta,
    );
    console.log('Teléfonos:', telefonosArray);
    this.encuestaSelecionada.esEnviada = true;

    // Cerrar el diálogo después de enviar
    this.mostrarDialogoTelefonos = false;
    this.encuestaSelecionada = null;
  }
}
