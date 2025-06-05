import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Encuesta } from '../entities/encuesta.entity';
import { RespuestaEncuesta } from 'src/modules/respuestas/entities/respuesta-encuesta.entity';
import { Repository } from 'typeorm';
import { createEncuestaDto } from '../dtos/create-encuesta.dto';
import { v4 } from 'uuid';

@Injectable()
export class EncuestasService {
  constructor(
    @InjectRepository(Encuesta)
    private encuestasRepository: Repository<Encuesta>,

    @InjectRepository(RespuestaEncuesta)
    private respuestasEncuestaRepository: Repository<RespuestaEncuesta>, // Repositorio de respuestas
  ) {}

  /**
   * Crea una nueva encuesta en la base de datos
   * @param dto - DTO con los datos necesarios para crear la encuesta
   * @returns Objeto con el id y códigos de la encuesta creada
   */
  async crearEncuesta(dto: createEncuestaDto): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    // Crear instancia de encuesta con los datos del DTO y códigos únicos
    const encuesta: Encuesta = this.encuestasRepository.create({
      ...dto,
      codigoRespuesta: v4(), // Genera UUID para código de respuesta
      codigoResultados: v4(),
    });

    // Guardar la encuesta en la base de datos
    const encuestaGuardada = await this.encuestasRepository.save(encuesta);

    // Retornar los datos necesarios de la encuesta creada
    return {
      id: encuestaGuardada.id,
      codigoRespuesta: encuestaGuardada.codigoRespuesta,
      codigoResultados: encuestaGuardada.codigoResultados,
    };
  }

  async obtenerEncuesta(
    id: number,
    codigo: string,
    codigoTipo: CodigoTipoEnum.RESPUESTA | CodigoTipoEnum.RESULTADOS,
  ): Promise<Encuesta> {
    const query = this.encuestasRepository
      .createQueryBuilder('encuesta')
      .innerJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
      .where('encuesta.id = :id', { id });

    switch (codigoTipo) {
      case CodigoTipoEnum.RESPUESTA:
        query.andWhere('encuesta.codigoRespuesta = :codigo', { codigo });
        break;
      case CodigoTipoEnum.RESULTADOS:
        query.andWhere('encuesta.codigoResultados = :codigo', { codigo });
        break;
    }

    query.orderBy('pregunta.numero', 'ASC');
    query.addOrderBy('preguntaOpcion.numero', 'ASC');

    const encuesta = await query.getOne();

    if (!encuesta) {
      console.error(
        `Encuesta no encontrada - ID: ${id}, Código: ${codigo}, Tipo: ${codigoTipo}`,
      );
      throw new BadRequestException('Datos de encuesta no válidos');
    }

    // incluir respuestas para la encuesta si es de tipo RESULTADOS
    if (codigoTipo === CodigoTipoEnum.RESULTADOS) {
      const respuestasQuery = this.respuestasEncuestaRepository
        .createQueryBuilder('respuestaEncuesta')
        .leftJoinAndSelect('respuestaEncuesta.encuesta', 'encuesta')
        .leftJoinAndSelect(
          'respuestaEncuesta.respuestasAbiertas',
          'respuestaAbierta',
        )
        .leftJoinAndSelect('respuestaAbierta.pregunta', 'preguntaAbierta')
        .leftJoinAndSelect(
          'respuestaEncuesta.respuestasOpciones',
          'respuestaOpcion',
        )
        .leftJoinAndSelect('respuestaOpcion.opcion', 'opcion')
        .leftJoinAndSelect('opcion.pregunta', 'preguntaOpcion')
        .where('respuestaEncuesta.encuesta.id = :id', { id });

      const respuestasEncuesta = await respuestasQuery.getMany();

      encuesta['respuestas'] = respuestasEncuesta.map((r, index) => {
        return {
          encuestado: `${index + 1}`,
          respuestasOpciones: r.respuestasOpciones.map((ro) => ({
            idPregunta: ro.opcion.pregunta.id,
            textoPregunta: ro.opcion.pregunta.texto,
            opcionSeleccionada: ro.opcion.texto,
          })),
          respuestasAbiertas: r.respuestasAbiertas.map((ra) => ({
            idPregunta: ra.pregunta.id,
            textoPregunta: ra.pregunta.texto,
            textoRespuesta: ra.texto,
          })),
        };
      });

      // Filtrar preguntas solo con aquellas que tienen respuestas
      encuesta.preguntas = encuesta.preguntas.filter((pregunta) =>
        respuestasEncuesta.some(
          (respuesta) =>
            respuesta.respuestasOpciones.some(
              (ro) => ro.opcion.pregunta.id === pregunta.id,
            ) ||
            respuesta.respuestasAbiertas.some(
              (ra) => ra.pregunta.id === pregunta.id,
            ),
        ),
      );
    }

    if (codigoTipo === CodigoTipoEnum.RESULTADOS) {
      encuesta.preguntas = []; // no mostramos las preguntas sueltas en los resultados
    }

    return encuesta;
  }

  async obtenerTodasLasEncuestas(   
  ): Promise<Encuesta[]> {
    return this.encuestasRepository.find({
      relations: {
        preguntas: {
          opciones: true
        }
      },
      order: {
        id: 'ASC',
        preguntas: {
          numero: 'ASC'
        }
      },   
    });
  }

  async eliminarEncuesta(id: number): Promise<{ mensaje: string }> {
    // Primero obtenemos la encuesta con sus relaciones
    const encuesta = await this.encuestasRepository.findOne({
      where: { id },
      relations: ['preguntas', 'preguntas.opciones']
    });
  
    if (!encuesta) {
      throw new NotFoundException(`No se encontró la encuesta con ID: ${id}`);
    }
  
    // Transacion para asegurar la integridad de los datos
    await this.encuestasRepository.manager.transaction(async (transactionalEntityManager) => {
      //Habiendo preguntas se eliminan sus opciones primero
      if (encuesta.preguntas && encuesta.preguntas.length > 0) {
        // Capturamos los id de lasopciones en un array
        const opcionesIds = encuesta.preguntas.flatMap(pregunta => 
          pregunta.opciones ? pregunta.opciones.map(opcion => opcion.id) : []
        );
  
        // Eliminamos las opciones si existen
        if (opcionesIds.length > 0) {
          await transactionalEntityManager.delete('opciones', opcionesIds);
        }
  
        // Eliminamos las preguntas
        await transactionalEntityManager.delete('preguntas', 
          encuesta.preguntas.map(pregunta => pregunta.id)
        );
      }
  
      // Finalmente eliminamos la encuesta
      await transactionalEntityManager.delete('encuestas', id);
    });
    
    return { mensaje: 'Encuesta eliminada correctamente' };
}


  echo(): string {
    return 'La aplicación está funcionando correctamente!!!';
  }
}
