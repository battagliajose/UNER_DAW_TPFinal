import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ResultadosService } from '../../services/resultados.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [MessageService],
})
export class HomeComponent {
  mostrarDialog = false;
  urlResultados = '';
  private messageService = inject(MessageService);
  private resultadosService = inject(ResultadosService);

  constructor(private router: Router) {}

  abrirDialog() {
    this.mostrarDialog = true;
    this.urlResultados = '';
  }

  irAResultados() {
    if (!this.urlResultados) return;

    let url = new URL(this.urlResultados.trim());

    if (!url.hostname.includes('localhost')) {
      this.messageService.add({
        severity: 'error',
        summary: 'URL inválida',
        detail: 'Pegá la URL completa que recibiste de la encuesta',
      });
      return;
    }

    const idEncuesta = url.pathname.split('/')[2];
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
          this.mostrarDialog = false;
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
