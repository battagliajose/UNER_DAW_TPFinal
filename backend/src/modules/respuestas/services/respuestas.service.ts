import { Injectable } from '@nestjs/common';
import { RespuestaEncuesta } from '../entities/respuesta-encuesta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRespuestaDTO } from '../dtos/create-respuesta.dto';
import { RespuestaAbierta } from '../entities/respuesta-abierta.entity';
import { RespuestaOpcion } from '../entities/respuesta-opcion.entity';

@Injectable()
export class RespuestasService {
  constructor(
    @InjectRepository(RespuestaEncuesta)
    private respuestaEncuestaRepository: Repository<RespuestaEncuesta>,
    @InjectRepository(RespuestaAbierta)
    private respuestaAbiertaRepository: Repository<RespuestaAbierta>,
    @InjectRepository(RespuestaOpcion)
    private respuestaOpcionRepository: Repository<RespuestaOpcion>,
  ) {}

  async crearRespuesta(dto: CreateRespuestaDTO): Promise<{
    mensaje: string;
    idRespuesta: number;
  }> {
    const respuesta: RespuestaEncuesta =
      this.respuestaEncuestaRepository.create({
        encuesta: { id: dto.encuestaId },
      });

    // Armar las respuestas abiertas (si vienen)
    respuesta.respuestasAbiertas =
      dto.abiertas?.map((abierta) =>
        this.respuestaAbiertaRepository.create({
          texto: abierta.texto,
          pregunta: { id: abierta.preguntaId },
        }),
      ) ?? [];

    // Armar las respuestas de opción (si vienen)
    respuesta.respuestasOpciones =
      dto.opciones?.map((opcion) =>
        this.respuestaOpcionRepository.create({
          opcion: { id: opcion.opcionId },
        }),
      ) ?? [];

    const respuestaGuardada =
      await this.respuestaEncuestaRepository.save(respuesta);

    return {
      mensaje: 'Respuesta guardada correctamente',
      idRespuesta: respuestaGuardada.id,
    };
  }

  echo(): string {
    return 'La aplicación está funcionando correctamente!!!';
  }
}
