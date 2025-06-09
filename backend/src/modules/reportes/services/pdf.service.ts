import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class PdfService {
  async generarPDF(datosReporte: any, res: Response) {
    const templatePath = path.join(
      process.cwd(),
      'backend',
      'dist',
      'modules',
      'reportes',
      'templates',
      'reporte.html',
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Error: No se encontró el template HTML en: ${templatePath}`,
      );
    }

    let htmlTemplateContent: string;
    try {
      htmlTemplateContent = fs.readFileSync(templatePath, 'utf8');
    } catch (readError) {
      throw new Error(`Error al leer el template HTML: ${readError.message}`);
    }

    const resultados =
      datosReporte.resumenEstadistico?.resultadosProcesados || [];

    const graficosData: any[] = [];
    let graficoIdx = 0;

    const preguntasMultiplesHtml = resultados
      .filter((pregunta) => pregunta.tipoPregunta !== 'ABIERTA')
      .map((pregunta) => {
        const labels = pregunta.opciones?.map((op) => op.textoOpcion) || [];
        const data =
          pregunta.opciones?.map((op) => op.cantidadVecesSeleccionada) || [];
        graficosData.push({ labels, data });

        return `
          <div class="pregunta">
            <h3>${pregunta.textoPregunta}</h3>
            <div class="grafico-pregunta">
              <canvas id="grafico-${graficoIdx++}" width="320" height="220"></canvas>
            </div>
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
        `;
      })
      .join('');

    const preguntasAbiertasHtml = resultados
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

    const dataForTemplate = {
      nombreEncuesta: datosReporte.nombreEncuesta || 'N/A',
      cantidadEncuestasProcesadas:
        datosReporte.resumenEstadistico?.cantidadEncuestasProcesadas || 0,
      totalPreguntas: datosReporte.resumenEstadistico?.totalPreguntas || 0,
      totalRespuestasAnalizadas:
        datosReporte.resumenEstadistico?.totalRespuestasAnalizadas || 0,
      preguntasMultiples: preguntasMultiplesHtml,
      preguntasAbiertas: preguntasAbiertasHtml,
      graficosJSON: JSON.stringify(graficosData),
    };

    const template = handlebars.compile(htmlTemplateContent);
    const finalHtml = template(dataForTemplate);

    let browser;
    try {
      // Iniciar Puppeteer
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.setViewport({ width: 800, height: 1000 });

      // Cargar el HTML generado
      await page.setContent(finalHtml, { waitUntil: 'domcontentloaded' }); // Cambiado a 'domcontentloaded' para ser más rápido

      // Inyectar Chart.js después de que el DOM esté cargado
      await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/npm/chart.js',
      });

      // Ejecutar el script para renderizar los gráficos
      await page.evaluate((graficosDataJson) => {
        // La coerción a 'any' es para evitar errores de TypeScript en el contexto del navegador
        const Chart = (window as any).Chart;
        if (typeof Chart === 'undefined') {
          console.error('Chart.js no está cargado después de la inyección.');
          return;
        }

        const graficos = JSON.parse(graficosDataJson);
        let renderedCharts = 0;

        // Establece el flag global para Puppeteer
        (window as any).graficosRenderizados = false;

        if (graficos.length === 0) {
          (window as any).graficosRenderizados = true; // No hay gráficos, marca como listo
          return;
        }

        graficos.forEach((grafico: any, idx: number) => {
          const canvas = document.getElementById(
            'grafico-' + idx,
          ) as HTMLCanvasElement | null;

          if (canvas) {
            new Chart(canvas.getContext('2d'), {
              type: 'pie',
              data: {
                labels: grafico.labels,
                datasets: [
                  {
                    data: grafico.data,
                    backgroundColor: [
                      '#42A5F5',
                      '#66BB6A',
                      '#FFA726',
                      '#AB47BC',
                      '#FF7043',
                      '#26A69A',
                      '#D4E157',
                      '#EC407A',
                    ],
                  },
                ],
              },
              options: {
                plugins: {
                  legend: { position: 'bottom' },
                },
                animation: {
                  onComplete: () => {
                    renderedCharts++;
                    if (renderedCharts === graficos.length) {
                      (window as any).graficosRenderizados = true;
                    }
                  },
                },
              },
            });
          } else {
            console.warn(`Canvas con ID 'grafico-${idx}' no encontrado.`);
            renderedCharts++;
            if (renderedCharts === graficos.length) {
              (window as any).graficosRenderizados = true;
            }
          }
        });
      }, dataForTemplate.graficosJSON);

      // Espera para a que la bandera global `window.graficosRenderizados` sea true
      // para asegurar que todos los gráficos se hayan renderizado
      await page.waitForFunction('window.graficosRenderizados === true', {
        timeout: 30000,
      });

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
            Reporte de Encuesta - ${dataForTemplate.nombreEncuesta}
          </div>
        `,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="reporte_encuesta_${dataForTemplate.nombreEncuesta.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`,
      );
      res.send(pdfBuffer);
    } catch (puppeteerError) {
      console.error(
        'Error en Puppeteer durante la generación del PDF:',
        puppeteerError,
      );
      res.status(500).send('Error al generar el PDF del reporte.');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
