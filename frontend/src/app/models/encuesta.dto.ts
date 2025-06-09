import { PreguntaDTO } from './pregunta.dto';

export interface EncuestaDTO {
  id: number;
  nombre: string;
  preguntas: PreguntaDTO[];
  codigoRespuesta: string;
}
//juego de datos del mismo estilo que el enviado por el backend:
//Una tupla de Array de Encuesta y el total de las mismas

export type EncuestaResponse = EncuestaDTO[];
