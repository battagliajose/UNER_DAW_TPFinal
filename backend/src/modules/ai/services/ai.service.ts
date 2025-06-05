import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AutocompletarDto } from '../dto/autocompletado.dto';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async autocompletarRespuesta(dto: AutocompletarDto): Promise<string> {
    const { textoParcial } = dto;

    const prompt = `Completá solo con 2 o 3 palabras posibles que continúen esta frase:\n"${textoParcial}"`;

    const response = await this.openai.chat.completions.create({
      //model: 'gpt-3.5-turbo',
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10, // máximo 2 o 3 palabras
      temperature: 0.7,
    });

    const mensaje = response.choices[0].message?.content;
    if (!mensaje) {
      throw new Error('La respuesta de la IA no contiene texto');
    }

    return mensaje.trim();
  }
}
