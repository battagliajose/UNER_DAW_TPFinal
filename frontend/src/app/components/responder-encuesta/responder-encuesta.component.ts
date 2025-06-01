import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestaService } from '../../services/encuesta.service';
import { EncuestaDTO } from '../../models/encuesta.dto';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { NgForOf, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';

import {
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { TipoRespuestaEnum } from '../../enums/tipo-pregunta.enum';
import { RespuestasService } from '../../services/respuestas.service';
import { unaseleccion } from '../../validators/opcion-multiple-no-vacia.validator';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-responder-encuesta',
  imports: [
    CheckboxModule,
    RadioButtonModule,
    TextareaModule,
    ButtonModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    ToastModule,
  ],
  templateUrl: './responder-encuesta.component.html',
  styleUrls: ['./responder-encuesta.component.css'],
  providers: [MessageService],
})
export class ResponderEncuestaComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private encuestaService: EncuestaService,
    private respuestasService: RespuestasService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  id: number = 0;
  codigo: string = '';
  encuesta?: EncuestaDTO;

  formularioRespuestas = new FormGroup({
    respuestas: new FormArray([]),
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const codigo = params.get('codigo');

      const respuestasFormArray = this.formularioRespuestas.get(
        'respuestas',
      ) as FormArray;

      if (id && codigo) {
        this.id = parseInt(id, 10);
        this.codigo = codigo;

        this.encuestaService
          .getOne(this.id, this.codigo, CodigoTipoEnum.RESPUESTA)
          .subscribe({
            next: (data) => {
              this.encuesta = data;

              this.encuesta.preguntas.forEach((pregunta, i) => {
                if (
                  pregunta.tipo === TipoRespuestaEnum.ABIERTA ||
                  pregunta.tipo ===
                    TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE
                ) {
                  const preguntaGroup = new FormGroup({
                    respuesta: new FormControl(''),
                  });

                  respuestasFormArray.push(
                    new FormGroup({
                      ['respuesta_' + i]: new FormControl(
                        '',
                        Validators.required,
                      ),
                    }),
                  );
                } else if (
                  pregunta.tipo ===
                  TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE
                ) {
                  const opcionesArray = new FormArray(
                    pregunta.opciones?.map(() => new FormControl(false)) || [],
                    { validators: unaseleccion },
                  );

                  const preguntaGroup = new FormGroup({
                    ['respuesta_' + i]: opcionesArray,
                  });

                  respuestasFormArray.push(preguntaGroup);
                }
              });
            },
            error: (err) => {
              console.error('Error al obtener la encuesta:', err);
            },
          });
      }
    });
  }

  enviarFormulario() {
    this.formularioRespuestas.markAllAsTouched();

    if (this.formularioRespuestas.invalid) {
      const respuestasArray = this.formularioRespuestas.get(
        'respuestas',
      ) as FormArray;

      for (let i = 0; i < respuestasArray.length; i++) {
        const grupo = respuestasArray.at(i);
        if (grupo.invalid) {
          const elemento = document.getElementById('pregunta_' + i);
          if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          break;
        }
      }

      return;
    }

    const dto: any = {
      encuestaId: this.encuesta!.id,
      abiertas: [],
      opciones: [],
    };

    const respuestasArray = this.formularioRespuestas.get(
      'respuestas',
    ) as FormArray;

    this.encuesta!.preguntas.forEach((pregunta, i) => {
      const grupo = respuestasArray.at(i) as FormGroup;
      const controlKey = 'respuesta_' + i;

      // Pregunta ABIERTA
      if (pregunta.tipo === TipoRespuestaEnum.ABIERTA) {
        const texto = grupo.get(controlKey)?.value?.trim();
        if (texto) {
          dto.abiertas.push({
            preguntaId: pregunta.id,
            texto: texto,
          });
        }
      }

      // Selección SIMPLE (radio)
      else if (
        pregunta.tipo === TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE
      ) {
        const opcionId = grupo.get(controlKey)?.value;
        if (opcionId !== null && opcionId !== undefined) {
          dto.opciones.push({
            preguntaId: pregunta.id,
            opcionId: opcionId,
          });
        }
      }

      // Selección MÚLTIPLE (checkboxes)
      else if (
        pregunta.tipo === TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE
      ) {
        const array = grupo.get(controlKey) as FormArray;
        array.controls.forEach((control, j) => {
          if (control.value === true && pregunta.opciones?.[j]) {
            const opcionId = pregunta.opciones[j].id;
            dto.opciones.push({
              preguntaId: pregunta.id,
              opcionId: opcionId,
            });
          }
        });
      }
    });

    console.log('DTO a enviar:', dto);

    // Llamada al backend
    this.respuestasService.postRespuestas(dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Gracias!',
          detail: 'Tu respuesta fue registrada con éxito.',
          life: 3000,
        });

        // Redirigir después de un pequeño delay
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3200);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Hubo un problema al registrar tu respuesta. Intentá nuevamente.',
          life: 4000,
        });
        console.error('Error al enviar el formulario:', err);
      },
    });
  }

  getRespuestaControl(i: number): FormControl {
    const grupo = this.formularioRespuestas.get(['respuestas', i]) as FormGroup;
    return grupo?.get('respuesta_' + i) as FormControl;
  }

  getCheckboxArray(i: number): FormArray {
    const grupo = this.formularioRespuestas.get(['respuestas', i]) as FormGroup;
    return grupo.get('respuesta_' + i) as FormArray;
  }
}
