import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AutocompletarDto } from '../dto/autocompletado.dto';
import { ReportesService } from '../../reportes/services/reportes.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private readonly reportesService: ReportesService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async autocompletarRespuesta(dto: AutocompletarDto): Promise<string> {
    const { tituloEncuesta, pregunta, textoParcial } = dto;

    const prompt = `En la encuesta "${tituloEncuesta}", para la pregunta "${pregunta}",
                    completá la siguiente respuesta con solo 2 o 3 palabras posibles que
                    puedan continuar esta frase:\n"${textoParcial}"\n No des más de una opción,
                    no uses comillas, no uses punto final y devolvé solo el texto que complete
                    la frase, listo para agregarse directamente.`;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0.7,
    });

    const mensaje = response.choices[0].message?.content;
    if (!mensaje) {
      throw new Error('La respuesta de la IA no contiene texto');
    }

    return mensaje.trim();
  }

  async generarInformeEncuesta(id: number, codigo: string): Promise<string> {
    const resultados = await this.reportesService.generarReporteResultados(
      id,
      codigo,
    );

    const resultadosString = JSON.stringify(resultados, null, 2);

    const prompt = `Sos un asistente experto en análisis de encuestas. A continuación vas a recibir una encuesta y las respuestas de los encuestados. 
          El contenido incluye preguntas (abiertas, de opción simple y de opción múltiple), respuestas seleccionadas por los encuestados y respuetas abiertas.
          
          Tu tarea es generar un informe interpretativo en **formato HTML**, sin encabezados ni etiquetas <html> o <body>. Solo usá etiquetas como <div>, <h2>, <p>, <ul>, <li>, en lenguaje natural y claro, que resuma lo siguiente:
          1. Las tendencias generales observadas en las respuestas.
          2. Qué aspectos son más valorados o problemáticos según los porcentajes.
          3. Si hay preguntas abiertas, mencioná los temas más frecuentes o comentarios destacados (evitá repetirlos todos).
          4. Un listado de las preguntas con un resumen breve de las respuestad de cada una.

          No muestres el JSON ni repitas todos los porcentajes como lista. En cambio, redactá un análisis tipo informe profesional, como si lo 
          presentaras ante directivos.

          Comenzá el informe con una frase introductoria breve como: “A continuación se detallan los resultados de la encuesta realizada...`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Sos un asistente que analiza encuestas.',
        },
        {
          role: 'user',
          content: `${prompt}\n\nResumen estadístico:\n${resultadosString}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 1800,
    });

    return response.choices[0].message?.content?.trim() || 'Sin respuesta';
  }
}
