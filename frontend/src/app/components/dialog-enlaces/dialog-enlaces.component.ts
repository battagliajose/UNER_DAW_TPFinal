import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QRCodeComponent } from 'angularx-qrcode';
import { environment } from '../../../environments/environment';
import { RippleModule } from 'primeng/ripple';
import { SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dialog-enlaces',
  imports: [ButtonModule, QRCodeComponent, RippleModule],
  templateUrl: './dialog-enlaces.component.html',
  styleUrl: './dialog-enlaces.component.css',
})
export class DialogEnlacesComponent implements OnInit, OnDestroy {
  visible: boolean = false;
  public id!: number;
  public codigoRespuesta!: string;
  public codigoResultados!: string;
  public created: boolean = false;
  private readonly router = inject(Router);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  private readonly messageService = inject(MessageService);

  enlaceResponder: string = '';
  enlaceRespuestas: string = '';
  redireccionResponder: string = '';
  redireccionRespuestas: string = '';
  qrCodeDownloadLink: SafeUrl = '';

  ngOnInit(): void {
    const incomingData = this.config.data || this.config.inputValues;
    if (incomingData) {
      const { id, codigoRespuesta, codigoResultados, created } = incomingData;
      console.log(incomingData);

      this.id = id;
      this.codigoRespuesta = codigoRespuesta;
      this.codigoResultados = codigoResultados;
      this.created = created;
    }
    this.generarEnlaceDetalles();
    this.generarEnlaceResponder();
  }

  closeDialog() {
    this.ref.close();
  }

  onChangeUrl(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  ngOnDestroy(): void {
    this.closeDialog();
  }

  generarEnlaceResponder(): void {
    let url = `/responder/${this.id}/${this.codigoRespuesta}`;
    console.log(url);
    this.enlaceResponder = environment.baseUrl + url;
    this.redireccionResponder = url;
  }

  generarEnlaceDetalles(): void {
    let url = `/visualizacion-resultados/${this.id}?codigo=${this.codigoResultados}&tipo=RESULTADOS`;
    console.log(url);
    this.enlaceRespuestas = environment.baseUrl + url;
    this.redireccionRespuestas = url;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copiado',
          detail: 'El enlace fue copiado',
        });
      })
      .catch((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo copiar',
        });
        console.error(err);
      });
  }

  redirectTo(target: 'INICIO' | 'DETALLES' | 'RESPONDER') {
    switch (target) {
      case 'DETALLES':
        this.router.navigateByUrl(this.redireccionRespuestas);
        break;
      case 'INICIO':
        this.router.navigateByUrl('');
        break;
      case 'RESPONDER':
        this.router.navigateByUrl(this.redireccionResponder);
        break;
      default:
        this.router.navigateByUrl('');
        break;
    }
  }
}
