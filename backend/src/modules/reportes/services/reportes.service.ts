import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encuesta } from '../../encuestas/entities/encuesta.entity';
import { RespuestaEncuesta } from 'src/modules/respuestas/entities/respuesta-encuesta.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Encuesta)
    private readonly encuestaRepo: Repository<Encuesta>,

    @InjectRepository(RespuestaEncuesta)
    private readonly respuestaEncuestaRepo: Repository<RespuestaEncuesta>,
  ) {}

  async generarReporteResultados(idEncuesta: number, codigo: string) {
    const encuesta = await this.encuestaRepo.findOne({
      where: { id: idEncuesta, codigoResultados: codigo },
      relations: ['preguntas', 'preguntas.opciones'],
    });

    if (!encuesta) {
      throw new Error('Encuesta no encontrada.');
    }

    const respuestasEncuesta = await this.respuestaEncuestaRepo.find({
      where: { encuesta: { id: idEncuesta } },
      relations: [
        'respuestasAbiertas',
        'respuestasOpciones',
        'respuestasOpciones.opcion',
        'respuestasOpciones.opcion.pregunta',
      ],
    });

    const conteoOpcionesPorPregunta: {
      [preguntaId: number]: { [opcionTexto: string]: number };
    } = {};

    respuestasEncuesta.forEach((respuestaEncuesta) => {
      respuestaEncuesta.respuestasOpciones.forEach((respuestaOpcion) => {
        if (!respuestaOpcion.opcion || !respuestaOpcion.opcion.pregunta) return;

        const preguntaId = respuestaOpcion.opcion.pregunta.id;
        const textoOpcion = respuestaOpcion.opcion.texto;

        if (!conteoOpcionesPorPregunta[preguntaId]) {
          conteoOpcionesPorPregunta[preguntaId] = {};
        }
        conteoOpcionesPorPregunta[preguntaId][textoOpcion] =
          (conteoOpcionesPorPregunta[preguntaId][textoOpcion] || 0) + 1;
      });
    });

    const resultadosProcesados = encuesta.preguntas.map((pregunta) => {
      if (pregunta.tipo === 'ABIERTA') {
        return {
          textoPregunta: pregunta.texto,
          tipoPregunta: pregunta.tipo,
          respuestas: respuestasEncuesta.flatMap((r) =>
            r.respuestasAbiertas.map((ra) => ra.texto),
          ),
        };
      } else if (
        pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE' ||
        pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE'
      ) {
        const conteoParaEstaPregunta =
          conteoOpcionesPorPregunta[pregunta.id] || {};
        return {
          textoPregunta: pregunta.texto,
          tipoPregunta: pregunta.tipo,
          respuestas: Object.entries(conteoParaEstaPregunta).map(
            ([opcion, cantidad]) => `${opcion} ${cantidad} veces seleccionada`,
          ),
        };
      }
      return {
        textoPregunta: pregunta.texto,
        tipoPregunta: pregunta.tipo,
        respuestas: [],
      };
    });

    return {
      nombreEncuesta: encuesta.nombre,
      resultadosProcesados,
    };
  }
}
