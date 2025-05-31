import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EncuestaService } from '../../../services/encuesta.service';
import { EncuestaDTO } from '../../../models/encuesta.dto';
import { delay } from 'rxjs/operators';
interface DashboardCard {
  title: string;
  value: number | string;
  icon: string;
  color?: string;
}

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent {

  encuestas: EncuestaDTO[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private encuestaService: EncuestaService) {}

  //Al cargar el componente ejecuto el método loadEncuestas para cargar el objeto
  ngOnInit(): void {
    this.loadEncuestas();
  }

  public loadEncuestas(): void {
    this.loading = true;
    this.error = null;

    //al metodo se le agrega delay para simular un tiempo de carga
    this.encuestaService.getAll().pipe(delay(2000)).subscribe({      
      next: (data) => {
        this.encuestas = data;        
        this.updateDashboardCards();
        this.loading = false;
      },
      error: (err) => {
        console.error('Revisar el server del backend, Posible caida:', err);
        this.error = 'No se pudieron cargar las encuestas. Intente nuevamente más tarde.';
        this.loading = false;
      }
    });
  }

  private updateDashboardCards(): void {
    // Actualizar el total de encuestas
    this.cards[0].value = this.encuestas.length;        
  }
  
  cards: DashboardCard[] = [
    { 
      title: 'Total de encuestas', 
      value: 10, 
      icon: 'pi pi-receipt',  
      color: 'var(--color-primary)'    
    },
    { 
      title: 'Estados de encuestas', 
      value: 0, 
      icon: 'pi pi-wave-pulse',
      color: 'var(--color-primary)'
    },
    { 
      title: 'Encuestas enviadas', 
      value: 0, 
      icon: 'pi pi-megaphone',
      color: 'var(--color-primary)'
    }
  ];
}
