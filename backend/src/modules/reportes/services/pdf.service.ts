import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Injectable()
export class PdfService {
  async generarPDF(datosReporte: any, res: Response) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Cargar el HTML desde la carpeta templates
    const templatePath = path.join(__dirname, '../templates/reporte.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Reemplazar datos en el HTML
    htmlContent = htmlContent.replace(
      '{{nombreEncuesta}}',
      datosReporte.nombreEncuesta,
    );

    const preguntasHTML = datosReporte.resultadosProcesados
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
      .join('');

    htmlContent = htmlContent.replace('{{preguntas}}', preguntasHTML);

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    //Enviar el PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');
    res.send(pdfBuffer);
  }
}
