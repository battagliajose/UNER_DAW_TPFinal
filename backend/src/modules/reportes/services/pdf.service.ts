import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Response } from 'express';

@Injectable()
export class PdfService {
  async generarPDF(datosReporte: any, res: Response) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Definimos la ruta correcta del template HTML
    const templatePath = path.resolve(
      __dirname.includes('dist')
        ? path.join(__dirname, '../templates/reporte.html') // Producción (dist/)
        : path.join(__dirname, '../../modules/reportes/templates/reporte.html'), // Desarrollo (src/)
    );

    //Validación de que el template HTML existe
    console.log('Ruta final del template:', templatePath);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`No se encontró el template HTML en: ${templatePath}`);
    }

    //Lectura del archivo HTML y compilarlo con Handlebars
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(htmlTemplate);
    const htmlFinal = template(datosReporte); //Insertamos los datos en el template

    await page.setContent(htmlFinal, { waitUntil: 'load' });
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
