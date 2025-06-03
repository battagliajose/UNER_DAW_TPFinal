import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosService } from '../../../services/resultados.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-resultados-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados-encuesta.component.html',
  styleUrl: './resultados-encuesta.component.css',
  providers: [MessageService],
})
export class ResultadosEncuestaComponent implements OnInit {
  @Input() id!: number;
  @Input() codigo!: string;
  respuestas: any[] = [];
  currentIndex = signal(0); // Signal para el índice actual
  private resultadosService = inject(ResultadosService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.obtenerResultados();
  }

  obtenerResultados() {
    this.resultadosService.getResultados(this.id, this.codigo).subscribe({
      next: (data: any) => {
        this.respuestas = Array.isArray(data.respuestas) ? data.respuestas : [];
        this.currentIndex.set(0); // Reinicia al primer encuestado
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener resultados',
        });
      },
    });
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
