import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { AiService } from '../../services/ai.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-informe-encuesta',
  templateUrl: './informe-ia.component.html',
  styleUrls: ['./informe-ia.component.css'],
  imports: [CommonModule, ProgressSpinnerModule, ButtonModule],
  providers: [ExportAsService],
  encapsulation: ViewEncapsulation.None,
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
        this.informe =
          '<h2><strong>Opinar.ar</strong> - Informe generado con IA</h2> <hr> <br> ' +
          texto;
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
