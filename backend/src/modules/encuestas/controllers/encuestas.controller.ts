import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { EncuestasService } from '../services/encuestas.service';
import { createEncuestaDto } from '../dtos/create-encuesta.dto';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { Encuesta } from '../entities/encuesta.entity';
import { CsvEncuestasService } from '../services/csv-respuestas-encuestas.service';
import { PdfRespuestasEncuestasService } from '../services/pdf-respuestas-encuestas.service';

@Controller('/encuestas')
export class EncuestasController {
  constructor(
    private readonly encuestasService: EncuestasService,
    private readonly csvEncuestasService: CsvEncuestasService,
    private readonly pdfRespuestasEncuestasService: PdfRespuestasEncuestasService,
  ) {}

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
        { cause: exception },
      );
    }
  }

  @Get('/obtener-todas')
  async obtenerTodasLasEncuestas(): Promise<Encuesta[]> {
    try {
      return await this.encuestasService.obtenerTodasLasEncuestas();       
    } catch (exception) {
      throw new HttpException(
        'Error al obtener las encuestas',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: exception },
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
        { cause: exception },
      );
    }
  }

  
  // Endpoint para exportar respuestas de encuesta a CSV
  @Get('/csv/:id/:codigo')
  async exportarCsvRespuestas(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Res() res: Response,
  ) {
    await this.csvEncuestasService.exportCsvRespuestasEncuesta(id, codigo, res);
  }
  
  @Get('/pdf/:id/:codigo')
  async exportarPdfRespuestas(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Res() res: Response,
  ) {
    await this.pdfRespuestasEncuestasService.generarPdfRespuestasEncuesta(
      id,
      codigo,
      res,
    );
  }


  @Delete('/eliminar/:id')
  async eliminarEncuesta(@Param('id') id: number): Promise<{message: string}> {
    try {
      const message = await this.encuestasService.eliminarEncuesta(id);
      return {message};
    } catch (exception) {
      throw new HttpException(
        'Error al eliminar la encuesta',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: exception },
      );
    }
  }

  @Get('/echo')
  async echo(): Promise<string> {
    return this.encuestasService.echo();
  }
}
