import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosService } from '../../../services/resultados.service';
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
  respuestas: any[] = [];
  currentIndex = signal(0);
  private resultadosService = inject(ResultadosService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.obtenerResultados();
  }

  obtenerResultados() {
    this.resultadosService.getResultados(this.id, this.codigo).subscribe({
      next: (data: any) => {
        this.respuestas = Array.isArray(data.respuestas) ? data.respuestas : [];
        this.currentIndex.set(0);
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
