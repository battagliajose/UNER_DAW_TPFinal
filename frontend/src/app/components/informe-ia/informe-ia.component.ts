import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-informe-encuesta',
  templateUrl: './informe-ia.component.html',
  styleUrls: ['./informe-ia.component.css'],
  imports: [CommonModule, ProgressSpinnerModule],
  providers: [ExportAsService],
})
export class InformeIaComponent implements OnInit {
  @Input() id!: number;
  @Input() codigo!: string;
  @Input() tipo!: string;

  @ViewChild('contenidoPDF') contenidoPDF!: ElementRef;

  informe = '';
  cargando = true;

  constructor(
    private aiService: AiService,
    private exportAsService: ExportAsService,
  ) {}

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

  exportarPDF() {
    const config: ExportAsConfig = {
      type: 'pdf',
      elementIdOrContent: this.contenidoPDF.nativeElement,
      options: {
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        margin: [20, 20, 20, 20], // top, left, bottom, right (en mm)
      },
    };

    this.exportAsService.save(config, 'informe').subscribe(() => {
      // archivo guardado
    });
  }
}
