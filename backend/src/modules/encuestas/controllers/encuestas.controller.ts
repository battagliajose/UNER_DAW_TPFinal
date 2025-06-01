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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EncuestasService } from '../services/encuestas.service';
import { createEncuestaDto } from '../dtos/create-encuesta.dto';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { ObtenerTodasEncuestasDto } from '../dtos/obtener-todas-encuestas.dto';
import { Encuesta } from '../entities/encuesta.entity';
import { Response } from 'express';
import { PdfRespuestasEncuestasService } from '../services/pdf-respuestas-encuestas.service';

@Controller('/encuestas')
export class EncuestasController {
  constructor(
    private encuestasService: EncuestasService,
    private pdfRespuestasEncuestasService: PdfRespuestasEncuestasService,
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
  async obtenerTodasLasEncuestas(
    @Query() dto: ObtenerTodasEncuestasDto,
  ): Promise<[Encuesta[], number]> {
    try {
      return await this.encuestasService.obtenerTodasLasEncuestas(
        dto.skip,
        dto.take,
      );
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
        {
          cause: exception,
        },
      );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="respuestas_encuesta_${id}.pdf"`,
    );
    res.sendFile(pdfPath);
  }

  @Get('/pdf/:id/:codigo')
  async exportarPdfRespuestas(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Res() res: Response,
  ) {
    const pdfPath =
      await this.pdfRespuestasEncuestasService.generarPdfRespuestasEncuesta(
        id,
        codigo,
      );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="respuestas_encuesta_${id}.pdf"`,
    );
    res.sendFile(pdfPath);
  }

  @Get('/echo')
  async echo(): Promise<string> {
    return this.encuestasService.echo();
  }

  // ✅ Método dentro de la clase
  @Get('/csv/:id/:codigo')
  async exportarCsvRespuestas(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Res() res: Response,
  ) {
    await this.csvEncuestasService.exportCsvRespuestasEncuesta(id, codigo, res);
  }
}
