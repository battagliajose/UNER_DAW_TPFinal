import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class PdfService {
  async generarPDF(datosReporte: any, res: Response) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //HTML embebido para generación de PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Encuesta</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          .pregunta { margin-bottom: 15px; }
          .respuesta { margin-left: 10px; }
        </style>
      </head>
      <body>
        <h1>Reporte datos procesados de encuesta: ${datosReporte.nombreEncuesta} </h1>
        ${datosReporte.resultadosProcesados
          .map(
            (pregunta) => `
          <div class="pregunta">
            <h2>${pregunta.textoPregunta}</h2>
            <p>Tipo: ${pregunta.tipoPregunta}</p>
            <ul>
              ${pregunta.respuestas.map((respuesta) => `<li class="respuesta">${respuesta}</li>`).join('')}
            </ul>
          </div>
        `,
          )
          .join('')}
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

    //Enviar el PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');
    res.send(pdfBuffer);
  }
}
