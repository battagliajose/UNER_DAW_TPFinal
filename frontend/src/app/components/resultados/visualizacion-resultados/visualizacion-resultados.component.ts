import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ResultadosEncuestaComponent } from '../resultados-encuesta/resultados-encuesta.component';
import { ResumenEstadisticoComponent } from '../resumen-estadistico/resumen-estadistico.component';

@Component({
  selector: 'app-visualizacion-resultados',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ResultadosEncuestaComponent,
    ResumenEstadisticoComponent,
  ],
  templateUrl: './visualizacion-resultados.component.html',
  styleUrl: './visualizacion-resultados.component.css',
  providers: [MessageService],
})
export class VisualizacionResultadosComponent implements OnInit {
  mostrarVista: 'respuestas' | 'estadisticas' | null = 'respuestas';
  id!: number;
  codigo!: string;

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.obtenerParametros();
  }

  obtenerParametros() {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.codigo = this.route.snapshot.queryParamMap.get('codigo') ?? '';

    console.log('ID:', this.id);
    console.log('Código:', this.codigo);
  }

  mostrarRespuestas() {
    this.mostrarVista = 'respuestas';
  }

  mostrarEstadisticas() {
    this.mostrarVista = 'estadisticas';
  }
}
