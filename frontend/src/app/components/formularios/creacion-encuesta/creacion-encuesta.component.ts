import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EncuestaService } from '../../../services/encuesta.service';
import { PreguntaDTO } from '../../../models/pregunta.dto';
import { CreateEncuestaDTO } from '../../../models/create-encuesta.dto';
import {
  TipoRespuestaEnum,
  tipoPreguntaPresentacion,
} from '../../../enums/tipo-pregunta.enum';
import { CardModule } from 'primeng/card';
import { TextErrorComponent } from '../../text-error/text-error.component';

@Component({
  selector: 'app-creacion-encuesta',
  imports: [
    InputTextModule,
    FloatLabel,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    TextErrorComponent,
  ],
  templateUrl: './creacion-encuesta.component.html',
  styleUrl: './creacion-encuesta.component.css',
})
export class CreacionEncuestaComponent {
  form: FormGroup;

  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private encuestaService: EncuestaService = inject(EncuestaService);
  private readonly _formBuilder = inject(NonNullableFormBuilder);

  dialogGestionPreguntaVisible = signal<boolean>(false);

  constructor() {
    this.form = new FormGroup({
      nombre: new FormControl<string>('', [Validators.required]),
      preguntas: new FormArray<FormControl<PreguntaDTO>>(
        [],
        [Validators.required, Validators.minLength(1)],
      ),
    });
  }

  get preguntas(): FormArray<FormControl<PreguntaDTO>> {
    return this.form.get('preguntas') as FormArray<FormControl<PreguntaDTO>>;
  }

  get nombre(): FormControl<string> {
    return this.form.get('nombre') as FormControl<string>;
  }

  abrirDialog() {
    this.dialogGestionPreguntaVisible.set(true);
  }

  agregarPregunta(pregunta: PreguntaDTO) {
    this.preguntas.push(
      new FormControl<PreguntaDTO>(pregunta) as FormControl<PreguntaDTO>,
    );
  }

  eliminarPregunta(index: number) {
    this.preguntas.removeAt(index);
  }

  getTipoPreguntaPresentacion(tipo: TipoRespuestaEnum): string {
    return tipoPreguntaPresentacion.find(
      (tipoPresentacion) => tipoPresentacion.tipo === tipo,
    )!?.presentacion;
  }

  confirmarCrearEncuesta() {
    this.confirmationService.confirm({
      message: 'Confirmar creación de encuesta?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
      },
      accept: () => {
        this.crearEncuesta();
      },
    });
  }

  confirmarEliminarPregunta(index: number) {
    this.confirmationService.confirm({
      message: 'Confirmar eliminación?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
      },
      accept: () => {
        this.eliminarPregunta(index);
      },
    });
  }

  crearEncuesta() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Hay errores en el formulario',
      });
      return;
    }

    const encuesta: CreateEncuestaDTO = this.form.value;

    for (let i = 0; i < encuesta.preguntas.length; i++) {
      const pregunta = encuesta.preguntas[i];
      pregunta.numero = i + 1;

      if (pregunta.opciones) {
        for (let j = 0; j < pregunta.opciones.length; j++) {
          pregunta.opciones[j].numero = j + 1;
        }
      }
    }

    this.encuestaService.post(encuesta).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'La encuesta se creó con éxito',
        });

        this.router.navigateByUrl(
          '/presentacion-enlaces?id-encuesta=' +
            res.id +
            '&codigo-respuesta=' +
            res.codigoRespuesta +
            '&codigo-resultados=' +
            res.codigoResultados,
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Ha ocurrido un error al crear la encuesta',
        });
      },
    });
  }
}
