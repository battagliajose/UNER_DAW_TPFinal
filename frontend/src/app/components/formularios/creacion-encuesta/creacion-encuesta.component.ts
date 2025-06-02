import { Component, inject, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
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
import { DividerModule } from 'primeng/divider';
import { DialogPreguntaComponent } from '../dialog-pregunta/dialog-pregunta.component';
import { NgClass } from '@angular/common';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CreatePreguntaDTO } from '../../../models/create-pregunta.dto';

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
    DividerModule,
    DialogPreguntaComponent,
    NgClass,
  ],
  templateUrl: './creacion-encuesta.component.html',
  styleUrl: './creacion-encuesta.component.css',
})
export class CreacionEncuestaComponent implements OnInit {
  form: FormGroup;

  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private encuestaService: EncuestaService = inject(EncuestaService);

  private localStorageService: LocalStorageService =
    inject(LocalStorageService);

  dialogGestionPreguntaVisible = signal<boolean>(false);
  isLoading: boolean = false;
  encuestaPrevia: CreateEncuestaDTO | null = null;

  constructor() {
    this.form = new FormGroup({
      nombre: new FormControl<string>('', [Validators.required]),
      preguntas: new FormArray<FormControl<PreguntaDTO>>(
        [],
        [Validators.required, Validators.minLength(1)],
      ),
    });
  }

  ngOnInit(): void {
    this.encuestaPrevia = this.localStorageService.getEncuestaData();
    if (this.encuestaPrevia) {
      this.confirmarRestaurarSesion();
    }
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
    this.localStorageService.updateEncuestaData(this.form.value);
  }

  eliminarPregunta(index: number) {
    this.preguntas.removeAt(index);
    this.localStorageService.updateEncuestaData(this.form.value);
  }

  getTipoPreguntaPresentacion(tipo: TipoRespuestaEnum): string {
    return tipoPreguntaPresentacion.find(
      (tipoPresentacion) => tipoPresentacion.tipo === tipo,
    )!?.presentacion;
  }

  confirmarCrearEncuesta() {
    this.confirmationService.confirm({
      message:
        'Vas a crear una encuesta, una vez creada no se puede editar. ¿Estás seguro?',
      header: 'Confirmar creación',
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
        severity: 'contrast',
      },
      accept: () => {
        this.crearEncuesta();
      },
    });
  }

  confirmarEliminarPregunta(index: number) {
    this.confirmationService.confirm({
      message: 'Vas a eliminar una pregunta, ¿estás seguro?',
      header: 'Confirmar eliminación',
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
        severity: 'contrast',
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
    this.isLoading = true;
    this.form.disable();
    this.encuestaService.post(encuesta).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'La encuesta se creó con éxito',
        });
        this.isLoading = false;
        this.form.enable();
        this.localStorageService.removeEncuestaData();
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
        this.isLoading = false;
        this.form.enable();
        this.messageService.add({
          severity: 'error',
          summary: 'Ha ocurrido un error al crear la encuesta',
        });
      },
    });
  }

  confirmarRestaurarSesion() {
    this.confirmationService.confirm({
      message: 'Detectamos una sesión previa. ¿Deseas restaurarla?',
      header: 'Sesión guardada',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No (Eliminar)',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Si',
        severity: 'contrast',
      },
      accept: () => {
        this.restaurarSesionPrevia();
      },
      reject: () => {
        this.localStorageService.removeEncuestaData();
      },
    });
  }

  restaurarSesionPrevia() {
    this.form.patchValue({ nombre: this.encuestaPrevia?.nombre });

    // Si preguntas es un array dinámico, debes llenar el FormArray correctamente
    const preguntasArray = this.form.get('preguntas') as FormArray;
    preguntasArray.clear(); // Limpia cualquier dato previo

    this.encuestaPrevia?.preguntas.forEach((pregunta) => {
      preguntasArray.push(new FormControl<CreatePreguntaDTO>(pregunta));
    });
  }

  getClase: { [key: string]: string } = {
    'Selección simple': 'opcion-simple',
    'Selección múltiple': 'opcion-multiple',
    Abierta: 'opcion-libre',
  };
}
