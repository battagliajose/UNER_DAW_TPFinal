import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encuesta } from 'src/modules/encuestas/entities/encuesta.entity';
import { Pregunta } from 'src/modules/encuestas/entities/pregunta.entity';
import { tiposRespuestaEnum } from 'src/modules/encuestas/enums/tipos-respuesta.enum';
import { RespuestaAbierta } from 'src/modules/respuestas/entities/respuesta-abierta.entity';
import { RespuestaEncuesta } from 'src/modules/respuestas/entities/respuesta-encuesta.entity';
import { RespuestaOpcion } from 'src/modules/respuestas/entities/respuesta-opcion.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Encuesta)
    private readonly encuestasRepository: Repository<Encuesta>,

    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,

    @InjectRepository(RespuestaEncuesta)
    private readonly respuestaEncuestaRepository: Repository<RespuestaEncuesta>,

    @InjectRepository(RespuestaAbierta)
    private readonly respuestaAbiertaRepository: Repository<RespuestaAbierta>,

    @InjectRepository(RespuestaOpcion)
    private readonly respuestaOpcionRepository: Repository<RespuestaOpcion>,
  ) {}

  async generarReporteResultados(
    idEncuesta: number,
    codigo: string,
  ): Promise<any> {
    //Obtener la encuesta con preguntas relacionadas
    const encuesta = await this.encuestasRepository.findOne({
      where: { id: idEncuesta, codigoResultados: codigo },
      relations: ['preguntas'],
    });

    if (!encuesta) {
      throw new BadRequestException(
        'La encuesta no existe o el código no es válido.',
      );
    }

    //Obtener todas las respuestas abiertas
    const respuestasAbiertas = await this.respuestaAbiertaRepository.find({
      relations: ['pregunta'],
      where: { pregunta: { encuesta: { id: idEncuesta } } },
    });

    //Obtener todas las respuestas de opción múltiple
    const respuestasOpciones = await this.respuestaOpcionRepository.find({
      relations: ['opcion', 'respuestaEncuesta'],
      where: { respuestaEncuesta: { encuesta: { id: idEncuesta } } },
    });

    return {
      idEncuesta: encuesta.id,
      nombreEncuesta: encuesta.nombre,
      resultadosProcesados: encuesta.preguntas.map((pregunta) => ({
        idPregunta: pregunta.id,
        textoPregunta: pregunta.texto,
        tipoPregunta: pregunta.tipo,
        respuestas:
          pregunta.tipo === tiposRespuestaEnum.ABIERTA
            ? respuestasAbiertas
                .filter((respuesta) => respuesta.pregunta?.id === pregunta.id)
                .map((respuesta) => respuesta.texto)
            : respuestasOpciones
                .filter(
                  (respuesta) => respuesta.opcion?.pregunta?.id === pregunta.id,
                )
                .map((respuesta) => respuesta.opcion?.texto),
      })),
    };
  }
}
