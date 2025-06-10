import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-informe-encuesta',
  templateUrl: './informe-ia.component.html',
  styleUrls: ['./informe-ia.component.css'],
  imports: [CommonModule],
})
export class InformeIaComponent implements OnInit {
  @Input() id!: number;
  @Input() codigo!: string;
  @Input() tipo!: string;

  informe = '';
  cargando = true;

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    this.aiService.obtenerInformeEncuesta(this.id, this.codigo).subscribe({
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
