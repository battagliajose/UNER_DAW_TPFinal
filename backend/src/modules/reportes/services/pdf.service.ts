import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generarPDF(datosReporte: any, res: Response) {
    const templatePath = path.join(
      process.cwd(),
      'dist',
      'modules',
      'reportes',
      'templates',
      'reporte.html',
    );
    //dist/modules/reportes/templates/reporte.html
    //asegurarse de copiar el archivo html al directorio dist antes de ejecutar el servidor
    //copiarlo desde reportes/templates/reporte.html

    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    const resultados =
      datosReporte.resumenEstadistico?.resultadosProcesados || [];

    const preguntasMultiples = resultados
      .filter((pregunta) => pregunta.tipoPregunta !== 'ABIERTA')
      .map(
        (pregunta) => `
        <div class="pregunta">
          <h3>${pregunta.textoPregunta}</h3>
          <p>Tipo: ${pregunta.tipoPregunta}</p>
          <ul>
            ${
              pregunta.opciones
                ?.map(
                  (op) =>
                    `<li class="respuesta">${op.textoOpcion}: ${op.cantidadVecesSeleccionada} veces (${op.porcentajeSeleccion})</li>`,
                )
                .join('') || ''
            }
          </ul>
        </div>
      `,
      )
      .join('');

    const preguntasAbiertas = resultados
      .filter((pregunta) => pregunta.tipoPregunta === 'ABIERTA')
      .map(
        (pregunta) => `
        <div class="pregunta">
          <h3>${pregunta.textoPregunta}</h3>
          <ul>
            ${pregunta.respuestas.map((respuesta) => `<li class="respuesta">${respuesta}</li>`).join('')}
          </ul>
        </div>
      `,
      )
      .join('');

    const htmlContent = htmlTemplate
      .replace('{{ nombreEncuesta }}', datosReporte.nombreEncuesta)
      .replace(
        '{{ cantidadEncuestasProcesadas }}',
        datosReporte.resumenEstadistico.cantidadEncuestasProcesadas,
      )
      .replace(
        '{{ totalPreguntas }}',
        datosReporte.resumenEstadistico.totalPreguntas,
      )
      .replace(
        '{{ totalRespuestasAnalizadas }}',
        datosReporte.resumenEstadistico.totalRespuestasAnalizadas,
      )
      .replace('{{ preguntasMultiples }}', preguntasMultiples)
      .replace('{{ preguntasAbiertas }}', preguntasAbiertas);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', bottom: '40px' },
      displayHeaderFooter: true,
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 12px; padding: 5px;">
          Página <span class="pageNumber"></span> de <span class="totalPages"></span>
        </div>
      `,
      headerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 12px; padding: 5px;">
          Reporte de Encuesta - ${datosReporte.nombreEncuesta}
        </div>
      `,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');
    res.send(pdfBuffer);
  }
}
