import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
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
    return await this.encuestasService.crearEncuesta(dto);
  }

  @Get(':id')
  async obtenerEncuesta(
    @Param('id') id: number,
    @Query() dto: ObtenerEncuestaDto,
  ): Promise<Encuesta> {
    return await this.encuestasService.obtenerEncuesta(
      id,
      dto.codigo,
      dto.tipo,
    );
  }
}
