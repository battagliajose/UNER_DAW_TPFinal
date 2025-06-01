import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { EncuestasService } from './encuestas.service';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';

@Injectable()
export class CsvEncuestasService {
  constructor(private readonly encuestasService: EncuestasService) {}

  async exportCsvRespuestasEncuesta(
    id: number,
    codigo: string,
    res: Response,
  ): Promise<void> {
    // **Reutilizando `obtenerEncuesta()`**
    const encuesta = await this.encuestasService.obtenerEncuesta(
      id,
      codigo,
      CodigoTipoEnum.RESULTADOS,
    );

    if (
      !encuesta ||
      !('respuestas' in encuesta) ||
      !Array.isArray((encuesta as any).respuestas)
    ) {
      throw new Error('No se encontraron respuestas para la encuesta.');
    }

    // **Encabezados**
    let contenidoCSV = 'Encuestado,ID Pregunta,Texto Pregunta,Respuesta\n';

    // **Recorrer respuestas y agregarlas al CSV**
    (encuesta as { respuestas: any[] }).respuestas.forEach((respuesta) => {
      const encuestado = respuesta.encuestado;

      respuesta.respuestasOpciones.forEach((ro) => {
        contenidoCSV += `${encuestado},${ro.idPregunta},"${ro.textoPregunta}","${ro.opcionSeleccionada}"\n`;
      });

      respuesta.respuestasAbiertas.forEach((ra) => {
        contenidoCSV += `${encuestado},${ra.idPregunta},"${ra.textoPregunta}","${ra.textoRespuesta}"\n`;
      });
    });

    // **Guardar archivo carpeta exports**
    const dir = path.join(process.cwd(), 'exports');

    // Si la carpeta no existe, la creamos
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `encuesta_${id}.csv`);

    fs.writeFileSync(filePath, contenidoCSV);

    // **Enviar CSV como respuesta**
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.csv"');
    res.send(contenidoCSV);
  }
}
