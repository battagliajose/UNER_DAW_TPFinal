import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { EncuestasService } from './encuestas.service';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { Response } from 'express';

@Injectable()
export class PdfRespuestasEncuestasService {
  constructor(private readonly encuestasService: EncuestasService) {}

  async generarPdfRespuestasEncuesta(
    id: number,
    codigo: string,
    res: Response,
  ) {
    // Obtener encuesta con respuestas
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

    // Leer la plantilla HTML
    const templatePath = path.join(
      process.cwd(),
      'dist',
      'modules',
      'encuestas',
      'templates',
      'respuestas-encuestas.html',
    );
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateHtml);

    // 🔹 Datos para Handlebars
    const fechaActual = new Date().toLocaleDateString();
    const htmlFinal = template({
      nombreEncuesta: encuesta.nombre,
      respuestas: encuesta.respuestas,
      fechaActual,
    });

    // Crear instancia de Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Cargar el HTML en la página
    await page.setContent(htmlFinal, { waitUntil: 'load' });

    //Generar el PDF en memoria
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
          Listado respuestas enncuesta - ${encuesta.nombre}
        </div>
      `,
    });

    await browser.close();

    //Enviar el PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="respuestas_encuesta_${id}.pdf"`,
    );
    res.send(pdfBuffer);
  }
}
