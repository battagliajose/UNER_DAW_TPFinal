import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenEstadisticoService } from '../../../services/resumen-estadistico.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resumen-estadistico',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ToastModule,
    ButtonModule,
    ChartModule,
  ],
  templateUrl: './resumen-estadistico.component.html',
  styleUrl: './resumen-estadistico.component.css',
  providers: [MessageService],
})
export class ResumenEstadisticoComponent implements OnInit {
  @Input() id!: number;
  @Input() codigo!: string;
  @Input() tipo!: string;

  // Inicialización más robusta para evitar undefined
  resumen: any = {
    nombreEncuesta: '',
    cantidadEncuestasProcesadas: 0,
    totalPreguntas: 0,
    totalRespuestasAnalizadas: 0,
    resultadosProcesados: [],
  };

  currentIndex = signal(0);
  errorCarga = false;
  cargando = true; // El estado inicial debe ser cargando

  private resumenService = inject(ResumenEstadisticoService);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);

  ngOnInit() {
    this.obtenerResumen();
  }

  obtenerResumen() {
    this.cargando = true; // Siempre inicia cargando al pedir datos
    this.errorCarga = false; // Resetea el estado de error
    this.resumenService
      .obtenerResumen(this.id, this.codigo, this.tipo)
      .subscribe({
        next: (data: any) => {
          // Si hay resumenEstadistico, úsalo, sino inicializa limpio
          if (data && data.resumenEstadistico) {
            this.resumen = {
              ...data.resumenEstadistico,
              nombreEncuesta:
                data.nombreEncuesta ??
                data.resumenEstadistico.nombreEncuesta ??
                '',
            };
          } else {
            // Si no hay resumenEstadistico, inicializa con valores por defecto
            this.resumen = {
              nombreEncuesta: data?.nombreEncuesta ?? '', // Asegura que el nombre de la encuesta se propague si existe
              cantidadEncuestasProcesadas: 0,
              totalPreguntas: 0,
              totalRespuestasAnalizadas: 0,
              resultadosProcesados: [],
            };
          }
          this.currentIndex.set(0); // Reinicia el índice al cargar nuevos datos
          this.cargando = false; // Finaliza la carga

          // Mensaje de advertencia si no hay encuestas procesadas
          if (this.resumen.cantidadEncuestasProcesadas === 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Encuesta sin respuestas',
              detail: 'Esta encuesta no tiene respuestas aún!',
            });
          }
        },
        error: () => {
          // En caso de error, resetea el resumen y marca el error
          this.resumen = {
            nombreEncuesta: '',
            cantidadEncuestasProcesadas: 0,
            totalPreguntas: 0,
            totalRespuestasAnalizadas: 0,
            resultadosProcesados: [],
          };
          this.currentIndex.set(0);
          this.cargando = false;
          this.errorCarga = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener el resumen estadístico',
            detail: 'No se pudieron cargar las estadísticas de la encuesta.',
          });
        },
      });
  }

  // Métodos de descarga (sin cambios en la lógica interna, solo la deshabilitación)
  descargarPDF() {
    const url = `/api/v1/reportes/pdf/${this.id}/${this.codigo}?tipo=${this.tipo}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `estadisticas_encuesta_${this.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(a.href);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al descargar PDF',
          detail: 'No se pudo generar el archivo PDF.',
        });
      },
    });
  }

  descargarCSV() {
    const url = `/api/v1/reportes/csv/${this.id}/${this.codigo}?tipo=${this.tipo}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `estadisticas_encuesta_${this.id}.csv`;
        a.click();
        window.URL.revokeObjectURL(a.href);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al descargar CSV',
          detail: 'No se pudo generar el archivo CSV.',
        });
      },
    });
  }

  anterior() {
    if (this.currentIndex() > 0) this.currentIndex.set(this.currentIndex() - 1);
  }

  siguiente() {
    if (
      this.currentIndex() <
      (this.resumen.resultadosProcesados?.length ?? 0) - 1 // Usar 0 en lugar de 1 si es null/undefined
    ) {
      this.currentIndex.set(this.currentIndex() + 1);
    }
  }

  getPieChartData(resultado: any) {
    if (!resultado || !resultado.opciones || resultado.opciones.length === 0)
      return null;
    return {
      labels: resultado.opciones.map((op: any) => op.textoOpcion),
      datasets: [
        {
          data: resultado.opciones.map(
            (op: any) => op.cantidadVecesSeleccionada,
          ),
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#AB47BC',
            '#FF7043',
            '#26A69A',
            '#D4E157',
          ],
          hoverBackgroundColor: [
            '#64B5F6',
            '#81C784',
            '#FFB74D',
            '#BA68C8',
            '#FF8A65',
            '#4DB6AC',
            '#DCE775',
          ],
        },
      ],
    };
  }
}
