import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CsvReportesService {
  async generarCSV(datosReporte: any, res: Response) {
    const resultados =
      datosReporte.resumenEstadistico?.resultadosProcesados || [];

    // Definir encabezados
    const encabezados = [
      'Tipo Pregunta',
      'Texto Pregunta',
      'Respuesta',
      'Cantidad Veces Seleccionada',
      'Porcentaje Selección',
    ];
    let contenidoCSV = encabezados.join(',') + '\n';

    resultados.forEach((pregunta) => {
      if (pregunta.tipoPregunta === 'ABIERTA') {
        pregunta.respuestas.forEach((respuesta) => {
          contenidoCSV += `"${pregunta.tipoPregunta}","${pregunta.textoPregunta}","${respuesta}","",""\n`;
        });
      } else {
        pregunta.opciones.forEach((op) => {
          contenidoCSV += `"${pregunta.tipoPregunta}","${pregunta.textoPregunta}","${op.textoOpcion}","${op.cantidadVecesSeleccionada}","${op.porcentajeSeleccion}"\n`;
        });
      }
    });

    const filePath = path.join(
      process.cwd(),
      'exports',
      'reporte-estadistica-encuesta.csv',
    );
    //el csv se guardará en el archivo exports,csv dentro de exports/
    fs.writeFileSync(filePath, contenidoCSV);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte-estadistica.encuestas.csv"',
    );
    res.send(contenidoCSV);
  }
}
