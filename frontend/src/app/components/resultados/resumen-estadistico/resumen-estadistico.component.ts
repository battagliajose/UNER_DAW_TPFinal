import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenEstadisticoService } from '../../../services/resumen-estadistico.service';
import { ResumenEstadisticoDTO } from '../../../models/resumen-estadistico.dto';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-resumen-estadistico',
  standalone: true,
  imports: [CommonModule],
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
  }; // fix inicializo como objeto vacío

  private resumenService = inject(ResumenEstadisticoService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.obtenerResumen();
  }

  obtenerResumen() {
    this.resumenService.obtenerResumen(this.id, this.codigo).subscribe({
      /* next: (data: ResumenEstadisticoDTO) => {
        console.log('Datos recibidos:', data);
        this.resumen = data; // fix correcc. `undefined`
      },*/

      next: (data: any) => {
        console.log('Datos recibidos:', data); // 🔥 Verifica que `resumenEstadistico` existe dentro de `data`
        this.resumen = data.resumenEstadistico ?? {
          cantidadEncuestasProcesadas: 0,
          totalPreguntas: 0,
          totalRespuestasAnalizadas: 0,
          resultadosProcesados: [],
        };
      },

      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener el resumen estadístico',
        });
      },
    });
  }
}
