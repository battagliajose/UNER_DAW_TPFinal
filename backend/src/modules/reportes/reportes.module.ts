import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './services/reportes.service';
import { ReportesController } from './controllers/reportes.controller';
import { Encuesta } from '../encuestas/entities/encuesta.entity';
import { Pregunta } from '../encuestas/entities/pregunta.entity';
import { RespuestaEncuesta } from '../respuestas/entities/respuesta-encuesta.entity';
import { RespuestaAbierta } from '../respuestas/entities/respuesta-abierta.entity';
import { RespuestaOpcion } from '../respuestas/entities/respuesta-opcion.entity';
import { PdfService } from './services/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Encuesta,
      Pregunta,
      RespuestaEncuesta,
      RespuestaAbierta,
      RespuestaOpcion,
    ]),
  ],
  providers: [ReportesService, PdfService],
  controllers: [ReportesController],
  exports: [ReportesService, PdfService],
})
export class ReportesModule {}
