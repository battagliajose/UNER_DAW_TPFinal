import { Module } from '@nestjs/common';
import { EncuestasController } from './controllers/encuestas.controller';
import { EncuestasService } from './services/encuestas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuesta } from './entities/encuesta.entity';
import { Pregunta } from './entities/pregunta.entity';
import { Opcion } from './entities/opcion.entity';
import { RespuestaEncuesta } from '../respuestas/entities/respuesta-encuesta.entity';
import { PdfRespuestasEncuestasService } from './services/pdf-respuestas-encuestas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Encuesta,
      Pregunta,
      Opcion,
      RespuestaEncuesta,
      PdfRespuestasEncuestasService,
    ]),
  ],
  controllers: [EncuestasController],
  providers: [EncuestasService, PdfRespuestasEncuestasService],
})
export class EncuestasModule {}
