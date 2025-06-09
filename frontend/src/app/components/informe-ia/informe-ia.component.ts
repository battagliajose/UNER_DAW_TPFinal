import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-informe-encuesta',
  templateUrl: './informe-ia.component.html',
  styleUrls: ['./informe-ia.component.css'],
  imports: [CommonModule],
})
export class InformeIaComponent implements OnInit {
  informe = '';
  cargando = true;

  constructor(
    private aiService: AiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const codigo = this.route.snapshot.paramMap.get('codigo')!;
    this.aiService.obtenerInformeEncuesta(id, codigo).subscribe({
      next: (texto) => {
        this.informe = texto;
        this.cargando = false;
      },
      error: (err) => {
        this.informe = 'Ocurrió un error al generar el informe.';
        this.cargando = false;
      },
    });
  }
}
