import {
  Component,
  effect,
  inject,
  model,
  OnDestroy,
  output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {
  tipoPreguntaPresentacion,
  TipoRespuestaEnum,
} from '../../../enums/tipo-pregunta.enum';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PreguntaDTO } from '../../../models/pregunta.dto';
import { TextErrorComponent } from '../../text-error/text-error.component';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  templateUrl: './dialog-pregunta.component.html',
  styleUrl: './dialog-pregunta.component.css',
})
export class DialogPreguntaComponent implements OnDestroy {
  // Inputs y Outputs
  visible = model.required<boolean>();
  agregarPregunta = output<PreguntaDTO>();

  // Servicios
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  // Internal
  form!: FormGroup;
  private subscription: Subscription | undefined;

  constructor() {
    this.form = new FormGroup({
      texto: new FormControl('', [Validators.required]),
      tipo: new FormControl(TipoRespuestaEnum.ABIERTA, [Validators.required]),
      opciones: new FormArray([
        new FormGroup({
          texto: new FormControl('', [Validators.required]),
        }),
      ]),
    });

    this.subscription = this.tipo.valueChanges.subscribe((val) => {
      this.actualizarValidacionOpciones(val);
    });

    this.actualizarValidacionOpciones(this.tipo.value);
    effect(() => {
      if (this.visible()) {
        this.reset();
      }
    });
  }

  ngOnDestroy(): void {
    // Esto es para cancelar la suscripción al destruir el componente
    this.subscription?.unsubscribe();
    // Resetear y limpiar form
    this.reset();
  }

  reset(): void {
    this.form.reset();
    this.opciones.clear();
  }

  actualizarValidacionOpciones(tipo: TipoRespuestaEnum): void {
    if (
      tipo === TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE ||
      tipo === TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE
    ) {
      this.opciones.setValidators([Validators.required]);
      this.agregarOpcionesVaciasSiEsNecesario();
    } else {
      this.opciones.clearValidators();
      this.opciones.clear();
    }

    this.opciones.updateValueAndValidity();
  }

  agregarOpcionesVaciasSiEsNecesario(): void {
    while (this.opciones.length < 2) {
      this.opciones.push(
        new FormGroup({
          texto: new FormControl('', [Validators.required]),
        }),
      );
    }
  }

  esMultipleChoice(tipo: TipoRespuestaEnum): boolean {
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

  // Getters
  get texto(): FormControl {
    return this.form.get('texto') as FormControl;
  }

  get tipo(): FormControl {
    return this.form.get('tipo') as FormControl;
  }

  get opciones(): FormArray {
    return this.form.get('opciones') as FormArray;
  }

  agregar(): void {
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
    this.reset();
    this.visible.set(false);
  }

  cerrar(): void {
    // Acá preguntamos si realmente quiere salir en caso de que hayan datos en el form
    if (this.form.dirty) {
      this.confirmationService.confirm({
        message: 'Tenés cambios no guardados, ¿seguro que querés salir?',
        header: 'Confirmar salida',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
          this.visible.set(false);
          this.reset();
        },
        reject: () => {
          // No hacer nada, dejar el form abierto
        },
      });
    } else {
      this.visible.set(false);
    }
  }

  agregarOpcion(): void {
    const opcionesControl = this.form.get('opciones') as FormArray;
    opcionesControl.push(
      new FormGroup({
        texto: new FormControl('', [Validators.required]),
      }),
    );
  }

  eliminarOpcion(index: number): void {
    const opcionesControl = this.form.get('opciones') as FormArray;
    opcionesControl.removeAt(index);
  }

  confirmarEliminarOpcion(index: number): void {
    this.confirmationService.confirm({
      message: 'Vas a eliminar un registro, ¿estás seguro?',
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
      },
      accept: () => {
        this.eliminarOpcion(index);
      },
    });
  }
}
