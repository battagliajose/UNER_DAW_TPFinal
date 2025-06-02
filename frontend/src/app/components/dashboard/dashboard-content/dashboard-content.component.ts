import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EncuestaService } from '../../../services/encuesta.service';
import { EncuestaDTO } from '../../../models/encuesta.dto';
import { delay } from 'rxjs/operators';
import { EncuestaModService } from '../../../services/encuesta-mod.service';

interface DashboardCard {
  title: string;
  value: number | string;  
  esActivo: boolean;
  esEnviada: boolean;
  icon: string;
  color?: string;
}

interface NuevaEncuestaDTO extends EncuestaDTO {
  esActivo: boolean;
  esEnviada: boolean;
}

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent {
  //variable para pasar al padre
  @Output() datosCargados = new EventEmitter<EncuestaDTO[]>();

  //variable para poblar el dashboard-content
 
  nuevaEncuesta: NuevaEncuestaDTO[] = [];
  //variable para mostrar el loading
  loading: boolean = true;
 
  error: string | null = null;

  constructor(private encuestaService: EncuestaService, private encuestaModService: EncuestaModService) {}

  //Al cargar el componente ejecuto el método loadEncuestas para cargar el objeto
  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    this.cargarEncuestas();
    
  }
  
  cargarEncuestas(){
    this.encuestaModService.loadEncuestas().subscribe({
      next: (data) => {
        this.nuevaEncuesta = data;        
        this.updateDashboardCards();
        this.loading = false; 
        },
      error: (error) => {
        console.error("Error al cargar y modificar encuestas:", error);
        this.loading = false;
        this.error = 'No se pudieron cargar las encuestas. Intente nuevamente o avise al administrador.';
      }
    });
    
  }
  

  /**
   * Actualiza las tarjetas del dashboard con los valores de las encuestas
   * Total de encuestas
   * Total de encuestas activas
   * Total de encuestas enviadas
   */
  private updateDashboardCards(): void {
    // Actualizar el total de encuestas
    this.cardsTotales.value =this.nuevaEncuesta.length;
    this.cardsEstados.value = this.nuevaEncuesta.filter(e => e.esActivo).length;
    this.cardsEnviadas.value = this.nuevaEncuesta.filter(e => e.esEnviada).length;
    
  }
  
// Tarjetas por defecto para porblarlas y mostralas con los valores del objeto
  cardsTotales: DashboardCard = 
    { 
      title: 'Total de encuestas', 
      value: 0, 
      esActivo: false,
      esEnviada: false,
      icon: 'pi pi-receipt',  
      color: 'var(--color-primary)'    
    }

    cardsEstados: DashboardCard = 
    { 
      title: 'Encuestas Activas', 
      value: 0, 
      esActivo: false,
      esEnviada: false,
      icon: 'pi pi-wave-pulse',
      color: 'var(--color-primary)'
    }
    cardsEnviadas: DashboardCard = 
    { 
      title: 'Encuestas Enviadas', 
      value: 0, 
      esActivo: false,
      esEnviada: false,
      icon: 'pi pi-send',
      color: 'var(--color-primary)'
    }
}
