import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QRCodeComponent } from 'angularx-qrcode';
import { environment } from '../../../environments/environment';
import { RippleModule } from 'primeng/ripple';
import { SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { MailService } from '../../services/mail.service';
import { TextErrorComponent } from '../text-error/text-error.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-dialog-enlaces',
  imports: [
    ButtonModule,
    QRCodeComponent,
    RippleModule,
    InputTextModule,
    FloatLabel,
    Message,
    FormsModule,
    ReactiveFormsModule,
    TextErrorComponent,
  ],
  templateUrl: './dialog-enlaces.component.html',
  styleUrl: './dialog-enlaces.component.css',
  providers: [MailService],
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
  private readonly mailService = inject(MailService);
  private fb: FormBuilder = inject(FormBuilder);

  enlaceResponder: string = '';
  enlaceRespuestas: string = '';
  redireccionResponder: string = '';
  redireccionRespuestas: string = '';
  qrCodeDownloadLink: SafeUrl = '';

  emailForm: FormGroup;

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
    const incomingData = this.config.data || this.config.inputValues;
    if (incomingData) {
      const { id, codigoRespuesta, codigoResultados, created } = incomingData;

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

  sendEmail() {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email')?.value;
      const params = {
        email,
        participationLink: this.enlaceResponder,
        consultationLink: this.enlaceRespuestas,
      };

      this.mailService.sendEnlacesEmail(params).subscribe({
        next: (res) => {
          if (res) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Email enviado',
            });
            this.emailForm.reset();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo enviar el email',
          });
          console.log(err);
        },
      });
    }
  }
}
