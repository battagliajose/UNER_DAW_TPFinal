import {
  Controller,
  Get,
  Param,
  Res,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ReportesService } from '../services/reportes.service';
import { PdfService } from '../services/pdf.service';
import { CsvReportesService } from '../services/csv-reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService,
    private readonly pdfService: PdfService,
    private readonly csvReportesService: CsvReportesService,
  ) {}

  @Get('/pdf/:id/:codigo')
  async generarPDF(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Res() res: Response,
    @Query('tipo') tipo: string,
  ) {
    if (tipo !== 'RESULTADOS') {
      throw new BadRequestException('El parámetro "tipo" debe ser RESULTADOS');
    }
    const datosReporte = await this.reportesService.generarReporteResultados(
      id,
      codigo,
    );
    return this.pdfService.generarPDF(datosReporte, res);
  }

  @Get('/csv/:id/:codigo')
  async generarCSV(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Res() res: Response,
    @Query('tipo') tipo: string,
  ) {
    if (tipo !== 'RESULTADOS') {
      throw new BadRequestException('El parámetro "tipo" debe ser RESULTADOS');
    }
    const datosReporte = await this.reportesService.generarReporteResultados(
      id,
      codigo,
    );
    return this.csvReportesService.generarCSV(datosReporte, res);
  }

  @Get(':id/:codigo')
  async generarReporteResultados(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Query('tipo') tipo: string,
  ) {
    if (tipo !== 'RESULTADOS') {
      throw new BadRequestException('El parámetro "tipo" debe ser RESULTADOS');
    }
    return this.reportesService.generarReporteResultados(id, codigo);
  }
}
