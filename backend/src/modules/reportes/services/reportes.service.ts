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
      ],
    });

    const conteoOpciones = respuestasEncuesta
      .flatMap((r) => r.respuestasOpciones)
      .reduce((conteo, respuesta) => {
        const textoOpcion = respuesta.opcion.texto;
        conteo[textoOpcion] = (conteo[textoOpcion] || 0) + 1;
        return conteo;
      }, {});

    const resultadosProcesados = encuesta.preguntas.map((pregunta) => {
      if (pregunta.tipo === 'ABIERTA') {
        return {
          textoPregunta: pregunta.texto,
          tipoPregunta: pregunta.tipo,
          respuestas: respuestasEncuesta.flatMap((r) =>
            r.respuestasAbiertas.map((ra) => ra.texto),
          ),
        };
      } else {
        return {
          textoPregunta: pregunta.texto,
          tipoPregunta: pregunta.tipo,
          respuestas: Object.entries(conteoOpciones).map(
            ([opcion, cantidad]) => `${opcion} ${cantidad} veces seleccionada`,
          ),
        };
      }
    });

    return {
      nombreEncuesta: encuesta.nombre,
      resultadosProcesados,
    };
  }
}
