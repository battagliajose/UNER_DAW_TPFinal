import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core'; // Added Input
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-informe-encuesta',
  templateUrl: './informe-ia.component.html',
  styleUrls: ['./informe-ia.component.css'],
  imports: [CommonModule],
})
export class InformeIaComponent implements OnInit {
  @Input() id!: number; // Now receives ID as an input
  @Input() codigo!: string; // Now receives CODE as an input
  @Input() tipo!: string; // Receives TYPE as an input (even if not used directly here)

  informe = '';
  cargando = true;

  constructor(private aiService: AiService) {
    // ActivatedRoute is no longer needed in the constructor as parameters are inputs
  }

  ngOnInit(): void {
    // Use the @Input() properties directly
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
