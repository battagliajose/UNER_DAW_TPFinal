import {
  Component,
  effect,
  inject,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {
  tipoPreguntaPresentacion,
  TipoRespuestaEnum,
} from '../../../enums/tipo-pregunta.enum';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CreateOpcionDTO } from '../../../models/create-opcion.dto';
import { PreguntaDTO } from '../../../models/pregunta.dto';
import { opcionesNoVacias } from '../../../validators/opciones-no-vacias.validator';
import { TextErrorComponent } from '../../text-error/text-error.component';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-pregunta',
  imports: [
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    TextErrorComponent,
    RippleModule,
  ],
  templateUrl: './dialog-pregunta.component.html',
  styleUrl: './dialog-pregunta.component.css',
})
export class DialogPreguntaComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  visible = model.required<boolean>();

  dialogGestionOpcionVisible = signal<boolean>(false);

  agregarPregunta = output<PreguntaDTO>();

  private messageService: MessageService = inject(MessageService);

  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  private readonly _formBuilder = inject(FormBuilder);

  private subscription!: Subscription | undefined;

  ngOnInit(): void {
    this.form = this._formBuilder.group(
      {
        texto: ['', Validators.required],
        tipo: [TipoRespuestaEnum.ABIERTA, Validators.required],
        opciones: this._formBuilder.array([
          this._formBuilder.group({ texto: [''] }),
        ]) as FormArray<FormGroup<{ texto: FormControl<string | null> }>>,
      },
      {
        validators: opcionesNoVacias,
      },
    );
    this.subscription = this.form.get('tipo')?.valueChanges.subscribe((val) => {
      this.actualizarValidacionOpciones(val);
    });
  }

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.reset();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.form.reset();
  }

  reset() {
    this.form.reset();
    this.opciones.clear();
  }

  actualizarValidacionOpciones(tipo: TipoRespuestaEnum) {
    const opcionesControl = this.form.get('opciones');

    if (
      tipo === TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE ||
      tipo === TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE
    ) {
      // Se requieren al menos dos opciones
      opcionesControl?.setValidators([Validators.required]);
      this.agregarOpcionesVaciasSiEsNecesario();
    } else {
      opcionesControl?.clearValidators();
      this.opciones.clear();
    }

    opcionesControl?.updateValueAndValidity();
  }

  agregarOpcionesVaciasSiEsNecesario() {
    while (this.opciones.length < 2) {
      this.opciones.push(
        this._formBuilder.group({ texto: ['', Validators.required] }),
      );
    }
  }

  esMultipleChoice(tipo: TipoRespuestaEnum) {
    return [
      TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
      TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
    ].includes(tipo);
  }

  getTiposPreguntaPresentacion(): {
    tipo: TipoRespuestaEnum;
    presentacion: string;
  }[] {
    return tipoPreguntaPresentacion;
  }

  get texto(): FormControl<string | null> {
    return this.form.controls['texto'] as FormControl;
  }

  get tipo(): FormControl<TipoRespuestaEnum | null> {
    return this.form.controls['tipo'] as FormControl;
  }

  get opciones() {
    return this.form.controls['opciones'] as FormArray;
  }

  agregar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Hay errores en el formulario',
      });
      return;
    }

    const pregunta: PreguntaDTO = this.form.value;
    this.agregarPregunta.emit(pregunta);
    this.cerrar();
  }

  cerrar() {
    this.visible.set(false);
  }

  agregarOpcion() {
    this.opciones.push(
      this._formBuilder.group({ texto: ['', Validators.required] }),
    );
  }

  eliminarOpcion(index: number) {
    this.opciones.removeAt(index);
  }

  confirmarEliminarOpcion(index: number) {
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
        this.eliminarOpcion(index);
      },
    });
  }
}
