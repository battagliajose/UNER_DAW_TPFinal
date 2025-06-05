import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosService } from '../../../services/resultados.service';
import { DescargaService } from '../../../services/descarga.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-resultados-encuesta',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, ToastModule],
  templateUrl: './resultados-encuesta.component.html',
  styleUrl: './resultados-encuesta.component.css',
  providers: [MessageService],
})
export class ResultadosEncuestaComponent implements OnInit {
  @Input() id!: number;
  @Input() codigo!: string;
  @Input() tipo!: string;

  respuestas: any[] = [];
  nombreEncuesta = '';
  currentIndex = signal(0);

  private resultadosService = inject(ResultadosService);
  private descargaService = inject(DescargaService);
  private messageService = inject(MessageService);

  errorCarga = false;

  ngOnInit() {
    this.obtenerResultados();
  }

  obtenerResultados() {
    this.errorCarga = false;
    this.resultadosService
      .getResultados(this.id, this.codigo, this.tipo)
      .subscribe({
        next: (data: any) => {
          this.nombreEncuesta = data.nombre ?? '';
          this.respuestas = Array.isArray(data.respuestas)
            ? data.respuestas
            : [];
          this.currentIndex.set(0);
          this.errorCarga = false;
          if (!this.respuestas.length) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Encuesta sin respuestas',
              detail:
                'Esta encuesta no tiene respuestas aún! O no generó interés, o te olvidaste de enviarla!',
            });
          }
        },
        error: () => {
          this.respuestas = [];
          this.errorCarga = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener resultados',
          });
        },
      });
  }

  descargarCSV() {
    console.log('Descargar CSV llamado');
    const url = `/api/v1/encuestas/csv/${this.id}/${this.codigo}`;
    this.descargaService.descargarArchivo(url).subscribe((blob) => {
      this.descargarBlob(blob, 'resultados-encuesta.csv');
    });
  }

  descargarPDF() {
    console.log('Descargar PDF llamado');
    const url = `/api/v1/encuestas/pdf/${this.id}/${this.codigo}`;
    this.descargaService.descargarArchivo(url).subscribe((blob) => {
      this.descargarBlob(blob, 'resultados-encuesta.pdf');
    });
  }

  private descargarBlob(blob: Blob, nombreArchivo: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  agruparRespuestasOpciones(respuestasOpciones: any[]) {
    return respuestasOpciones.reduce(
      (
        acc: { textoPregunta: string; opcionesSeleccionadas: any[] }[],
        opcion: any,
      ) => {
        const existente = acc.find(
          (p: { textoPregunta: string; opcionesSeleccionadas: any[] }) =>
            p.textoPregunta === opcion.textoPregunta,
        );
        if (existente) {
          existente.opcionesSeleccionadas.push(opcion.opcionSeleccionada);
        } else {
          acc.push({
            textoPregunta: opcion.textoPregunta,
            opcionesSeleccionadas: [opcion.opcionSeleccionada],
          });
        }
        return acc;
      },
      [],
    );
  }

  anterior() {
    if (this.currentIndex() > 0) this.currentIndex.set(this.currentIndex() - 1);
  }
  siguiente() {
    if (this.currentIndex() < this.respuestas.length - 1)
      this.currentIndex.set(this.currentIndex() + 1);
  }
}
