import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class PdfService {
  async generarPDF(datosReporte: any, res: Response) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // HTML embebido para generación de PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Encuesta</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2 { text-align: center; }
          .pregunta, h3 { margin-bottom: 15px; }
          .respuesta { margin-left: 10px; }
        </style>
      </head>
      <body>
        <h1>Resultados de la Encuesta: ${datosReporte.nombreEncuesta}</h1>
        <h2>Cantidad de encuestados: ${datosReporte.cantidadEncuestados}</h2>

        <div class="seccion-preguntas">
          <h2>Recuento de resultados por preguntas opción múltiple:</h2>
          ${datosReporte.resultadosProcesados
            .filter((pregunta) => pregunta.tipoPregunta !== 'ABIERTA')
            .map(
              (pregunta) => `
              <div class="pregunta">
                <h3>${pregunta.textoPregunta}</h3>
                <p>Tipo: ${pregunta.tipoPregunta}</p>
                <ul>
                  ${pregunta.respuestas.map((respuesta) => `<li class="respuesta">${respuesta}</li>`).join('')}
                </ul>
              </div>
            `,
            )
            .join('')}
        </div>

        <div class="seccion-abiertas">
          <h2>Respuestas abiertas ingresadas por los encuestados:</h2>
          ${datosReporte.resultadosProcesados
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
            .join('')}
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10px', bottom: '10px' },
    });

    await browser.close();

    // Enviar el PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');
    res.send(pdfBuffer);
  }
}
