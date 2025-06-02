import { Module } from '@nestjs/common';
import { EncuestasController } from './controllers/encuestas.controller';
import { EncuestasService } from './services/encuestas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuesta } from './entities/encuesta.entity';
import { Pregunta } from './entities/pregunta.entity';
import { Opcion } from './entities/opcion.entity';
import { RespuestaEncuesta } from '../respuestas/entities/respuesta-encuesta.entity';
import { CsvEncuestasService } from './services/csv-respuestas-encuestas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Encuesta,
      Pregunta,
      Opcion,
      RespuestaEncuesta,
      CsvEncuestasService,
    ]),
  ],
  controllers: [EncuestasController],
  providers: [EncuestasService, CsvEncuestasService],
})
export class EncuestasModule {}
