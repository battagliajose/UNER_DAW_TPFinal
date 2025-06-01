import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { EncuestasService } from './encuestas.service';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';

@Injectable()
export class PdfRespuestasEncuestasService {
  constructor(private readonly encuestasService: EncuestasService) {}

  async generarPdfRespuestasEncuesta(
    id: number,
    codigo: string,
  ): Promise<string> {
    //Obtener encuesta con respuestas
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

    //Leer la plantilla HTML
    const templatePath = path.join(
      process.cwd(),
      'backend',
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

    //Crear instancia de Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Cargar el HTML en la página
    await page.setContent(htmlFinal, { waitUntil: 'load' });

    //Ruta para guardar el PDF
    const dir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const pdfPath = path.join(dir, `respuestas_encuesta_${id}.pdf`);

    //Generar el PDF
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();

    return pdfPath; //Retorna la ruta del PDF generado
  }
}
