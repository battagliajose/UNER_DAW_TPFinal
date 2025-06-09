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

    let url = this.urlResultados.trim();
    // Solo acepta URLs completas de localhost:4200 nuestro dominio actual
    const match = url.match(
      /^https?:\/\/localhost:4200\/visualizacion-resultados\/(\d+)\?codigo=([^&]+)&tipo=([^&]+)/,
    );
    if (!match) {
      this.messageService.add({
        severity: 'error',
        summary: 'URL inválida',
        detail: 'Pegá la URL completa que recibiste de la encuesta',
      });
      return;
    }

    const idEncuesta = Number(match[1]);
    const codigo = match[2];
    const tipo = match[3];

    this.resultadosService.getResultados(idEncuesta, codigo, tipo).subscribe({
      next: () => {
        // Si existe y es válido, redirige a la página de resultados
        this.router.navigateByUrl(
          `/visualizacion-resultados/${idEncuesta}?codigo=${codigo}&tipo=${tipo}`,
        );
        this.mostrarDialog = false;
      },
      error: () => {
        // Si no existe o hubo un error, muestra un mensaje
        this.messageService.add({
          severity: 'error',
          summary: 'Encuesta no encontrada',
          detail: 'No se encontraron resultados para la URL ingresada.',
        });
      },
    });
  }
}
