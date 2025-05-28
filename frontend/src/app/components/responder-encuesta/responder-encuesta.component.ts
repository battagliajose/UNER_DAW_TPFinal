import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
} from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { TipoRespuestaEnum } from '../../enums/tipo-pregunta.enum';

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
  ],
  templateUrl: './responder-encuesta.component.html',
  styleUrls: ['./responder-encuesta.component.css'],
})
export class ResponderEncuestaComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private encuestaService: EncuestaService,
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
                      ['respuesta_' + i]: new FormControl(''),
                    }),
                  );
                } else if (
                  pregunta.tipo ===
                  TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE
                ) {
                  const opcionesArray = new FormArray(
                    pregunta.opciones?.map(() => new FormControl(false)) || [],
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
    console.log('Formulario enviado');
  }
}
