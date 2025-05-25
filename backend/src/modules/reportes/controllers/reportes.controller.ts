import { Controller, Get, Param } from '@nestjs/common';
import { ReportesService } from '../services/reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('/prueba/:id/:codigo')
  async probarReporte(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
  ) {
    return this.reportesService.generarReporteResultados(id, codigo);
  }
}
