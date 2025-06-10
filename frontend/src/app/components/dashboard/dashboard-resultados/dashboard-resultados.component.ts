import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';
import { ResultadosService } from '../../../services/resultados.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, InputTextModule, FormsModule, ToastModule, ButtonModule],
  templateUrl: './dashboard-resultados.component.html',
  styleUrls: ['./dashboard-resultados.component.css']
})
export class DashboardResultadosComponent {
  constructor(private router: Router) {}
    
  urlResultados = '';
  private messageService = inject(MessageService);
  private resultadosService = inject(ResultadosService);

  irAResultados() {
    if (!this.urlResultados) return;

    let url = new URL(this.urlResultados.trim());

    // Validar que la URL pertenece al dominio correcto
    if (
      !url.hostname.includes('localhost') &&
      !url.hostname.includes('tu-dominio.com')
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'URL inválida',
        detail: 'Pegá la URL completa que recibiste de la encuesta',
      });
      return;
    }

    const idEncuesta = url.pathname.split('/')[2]; // Extraer el ID de la encuesta
    const codigo = url.searchParams.get('codigo');
    const tipo = url.searchParams.get('tipo');

    if (!idEncuesta || !codigo || !tipo) {
      this.messageService.add({
        severity: 'error',
        summary: 'URL inválida',
        detail: 'Faltan parámetros en la URL ingresada.',
      });
      return;
    }

    this.resultadosService
      .getResultados(Number(idEncuesta), codigo, tipo)
      .subscribe({
        next: () => {
          this.router.navigateByUrl(
            `/visualizacion-resultados/${idEncuesta}?codigo=${codigo}&tipo=${tipo}`,
          );         
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Encuesta no encontrada',
            detail: 'No se encontraron resultados para la URL ingresada.',
          });
        },
      });
  }
}
