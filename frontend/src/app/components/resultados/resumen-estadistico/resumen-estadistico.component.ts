import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenEstadisticoService } from '../../../services/resumen-estadistico.service';
import { ResumenEstadisticoDTO } from '../../../models/resumen-estadistico.dto';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

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
  resumen: ResumenEstadisticoDTO = {
    cantidadEncuestasProcesadas: 0,
    totalPreguntas: 0,
    totalRespuestasAnalizadas: 0,
    resultadosProcesados: [],
  };

  currentIndex = signal(0);

  private resumenService = inject(ResumenEstadisticoService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.obtenerResumen();
  }

  obtenerResumen() {
    this.resumenService.obtenerResumen(this.id, this.codigo).subscribe({
      next: (data: any) => {
        this.resumen = data.resumenEstadistico ?? {
          cantidadEncuestasProcesadas: 0,
          totalPreguntas: 0,
          totalRespuestasAnalizadas: 0,
          resultadosProcesados: [],
        };
        this.currentIndex.set(0);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener el resumen estadístico',
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
      (this.resumen.resultadosProcesados?.length ?? 1) - 1
    )
      this.currentIndex.set(this.currentIndex() + 1);
  }

  getPieChartData(resultado: any) {
    if (!resultado.opciones) return null;
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
