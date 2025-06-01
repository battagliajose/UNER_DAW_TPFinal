import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EncuestaService } from '../../../services/encuesta.service';
import { EncuestaDTO } from '../../../models/encuesta.dto';
import { delay } from 'rxjs/operators';


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
  encuestas: EncuestaDTO[] = [];
  nuevaEncuesta: NuevaEncuestaDTO[] = [];
  //variable para mostrar el loading
  loading: boolean = true;
 
  error: string | null = null;

  constructor(private encuestaService: EncuestaService) {}

  //Al cargar el componente ejecuto el método loadEncuestas para cargar el objeto
  ngOnInit(): void {
    this.loadEncuestas();
  }

  /**
   * Carga las encuestas desde el backend
   * Agrego atributos booleanos a las encuestas
   * Agrego valores aleatorios a los atributos booleanos
   * Emito los datos al padre
   * Actualizo las tarjetas del dashboard
   */
  public loadEncuestas(): void {
    this.loading = true;
    this.error = null;

    this.encuestaService.getAll().pipe(delay(1000)).subscribe({      
      next: (data) => {
        this.encuestas = data[0]; 
        this.nuevaEncuesta = this.agregarAtributos(this.encuestas);  
        this.nuevaEncuesta = this.agregarValoresAleatorias(this.nuevaEncuesta);              
        this.datosCargados.emit(this.nuevaEncuesta);       
        this.updateDashboardCards();
        this.loading = false;
      },
      error: () => {       
        this.error = 'No se pudieron cargar las encuestas. Intente nuevamente o avise al administrador.';
        this.loading = false;
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
    this.cardsTotales.value =this.encuestas.length;
    this.cardsEstados.value = this.nuevaEncuesta.filter(e => e.esActivo).length;
    this.cardsEnviadas.value = this.nuevaEncuesta.filter(e => e.esEnviada).length;
    
  }
  
 /**
 * Agrega atributos booleanas a un array de encuestas.
 * @param encuestas - Array de objetos EncuestaDTO a modificar
 * @returns Nuevo array con las propiedades adicionales con sus propiedades
 * @example codigoRespuesta:"xxxx-xxxx-xxxx-xxxx-xxx"
 * esActivo:1
 * esEnviada:0
 * id:1
 * nombre:"Encuesta de satisfacción"
 * preguntas:(2) [{…}, {…}]
 */
  private agregarAtributos(encuestas: EncuestaDTO[]) {
    return encuestas.map(encuesta => ({
      ...encuesta,
      //nuevos atributos
      esActivo:false,
      esEnviada:false
    }));
  }

 /**
 * Agrega valores aleatorios a los atributos esActivo y esEnviada
 * @param encuestas - Array de objetos NuevaEncuestaDTO a modificar. 
 * @returns Nuevo array con las propiedades adicionales con sus propiedades
 */
  private agregarValoresAleatorias(encuestas: NuevaEncuestaDTO[])  {
    return encuestas.map(encuesta => ({
      ...encuesta,
      esActivo: Math.random() > 0.5,  // Esto devuelve boolean
      esEnviada: Math.random() > 0.5
    }));
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
