import { Injectable } from '@nestjs/common';
import { ReportesService } from '../../reportes/services/reportes.service'; // ajustar path
import { Parser } from 'json2csv';

@Injectable()
export class AiCsvService {
  constructor(private readonly reportesService: ReportesService) {}

  async generarCSVBuffer(encuestaId: number, codigo: string): Promise<Buffer> {
    const datos = await this.reportesService.generarReporteResultados(
      encuestaId,
      codigo,
    );

    // Suponiendo que datos es un array de objetos
    const parser = new Parser();
    const csv = parser.parse(datos);

    return Buffer.from(csv, 'utf-8');
  }
}
