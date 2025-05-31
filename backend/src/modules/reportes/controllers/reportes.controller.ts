import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportesService } from '../services/reportes.service';
import { PdfService } from '../services/pdf.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService,
    private readonly pdfService: PdfService,
  ) {}

  @Get('/pdf/:id/:codigo')
  async generarPDF(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
    @Res() res: Response,
  ) {
    const datosReporte = await this.reportesService.generarReporteResultados(
      id,
      codigo,
    );
    return this.pdfService.generarPDF(datosReporte, res);
  }

  @Get(':id/:codigo')
  async generarReporteResultados(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
  ) {
    return this.reportesService.generarReporteResultados(id, codigo);
  }
}
