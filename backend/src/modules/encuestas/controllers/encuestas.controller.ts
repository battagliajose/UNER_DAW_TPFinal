import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EncuestasService } from '../services/encuestas.service';
import { createEncuestaDto } from '../dtos/create-encuesta.dto';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { Encuesta } from '../entities/encuesta.entity';

@Controller('/encuestas')
export class EncuestasController {
  constructor(private encuestasService: EncuestasService) {}

  @Post('')
  async crearEncuesta(@Body() dto: createEncuestaDto): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    try {
      return await this.encuestasService.crearEncuesta(dto);
    } catch (exception) {
      throw new HttpException(
        'Error al crear la encuesta',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: exception,
        },
      );
    }
  }

  @Get(':id')
  async obtenerEncuesta(
    @Param('id') id: number,
    @Query() dto: ObtenerEncuestaDto,
  ): Promise<Encuesta> {
    try {
      return await this.encuestasService.obtenerEncuesta(
        id,
        dto.codigo,
        dto.tipo,
      );
    } catch (exception) {
      throw new HttpException(
        'Error al obtener la encuesta',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: exception,
        },
      );
    }
  }

  @Get('/echo')
  async echo(): Promise<string> {
    return this.encuestasService.echo();
  }
}
