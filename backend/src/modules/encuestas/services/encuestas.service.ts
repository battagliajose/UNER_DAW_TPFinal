import { BadRequestException, Injectable } from '@nestjs/common';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Encuesta } from '../entities/encuesta.entity';
import { Repository } from 'typeorm';
import { createEncuestaDto } from '../dtos/create-encuesta.dto';
import { v4 } from 'uuid';

@Injectable()
export class EncuestasService {
  constructor(
    @InjectRepository(Encuesta)
    private encuestasRepository: Repository<Encuesta>,
  ) {}

  /**
   * Crea una nueva encuesta en la base de datos
   * @param dto - DTO con los datos necesarios para crear la encuesta
   * @returns Objeto con el id y códigos de la encuesta creada
   */
  async crearEncuesta(dto: createEncuestaDto): Promise<{
    id: number;
    codigoRespuesta: string; // Código único para responder la encuesta
    codigoResultados: string; // Código único para ver resultados
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
      throw new BadRequestException('Datos de encuesta no válidos');
    }
    return encuesta;
  }

  async obtenerTodasLasEncuestas(
    skip: number = 0,
    take: number = 10
  ): Promise<[Encuesta[], number]> {
    return this.encuestasRepository.findAndCount({
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
      skip,
      take
    });
  }


  echo(): string {
    return 'La aplicación está funcionando correctamente!!!';
  }
}
