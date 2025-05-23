import { Module } from '@nestjs/common';
import { RespuestasService } from './services/respuestas.service';
import { RespuestasController } from './controllers/respuestas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaEncuesta } from './entities/respuesta-encuesta.entity';
import { RespuestaOpcion } from './entities/respuesta-opcion.entity';
import { RespuestaAbierta } from './entities/respuesta-abierta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RespuestaEncuesta,
      RespuestaOpcion,
      RespuestaAbierta,
    ]),
  ],
  providers: [RespuestasService],
  controllers: [RespuestasController],
})
export class RespuestasModule {}
