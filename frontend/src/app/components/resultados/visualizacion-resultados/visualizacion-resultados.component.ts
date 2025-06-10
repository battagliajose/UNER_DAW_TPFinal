import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ResultadosEncuestaComponent } from '../resultados-encuesta/resultados-encuesta.component';
import { ResumenEstadisticoComponent } from '../resumen-estadistico/resumen-estadistico.component';
import { InformeIaComponent } from '../../informe-ia/informe-ia.component';

@Component({
  selector: 'app-visualizacion-resultados',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ResultadosEncuestaComponent,
    ResumenEstadisticoComponent,
    InformeIaComponent,
  ],
  templateUrl: './visualizacion-resultados.component.html',
  styleUrl: './visualizacion-resultados.component.css',
  providers: [MessageService],
})
export class VisualizacionResultadosComponent implements OnInit {
  mostrarVista: 'respuestas' | 'estadisticas' | 'informe-ia' = 'respuestas';
  id!: number;
  codigo!: string;
  tipo!: string;
  private route = inject(ActivatedRoute);

  constructor(private router: Router) {}

  ngOnInit() {
    this.obtenerParametros();
  }

  obtenerParametros() {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.codigo = this.route.snapshot.queryParamMap.get('codigo') ?? '';
    this.tipo = this.route.snapshot.queryParamMap.get('tipo') ?? '';
  }

  mostrarRespuestas() {
    this.mostrarVista = 'respuestas';
  }

  mostrarEstadisticas() {
    this.mostrarVista = 'estadisticas';
  }

  mostrarInformeIA() {
    this.mostrarVista = 'informe-ia';
  }
}
