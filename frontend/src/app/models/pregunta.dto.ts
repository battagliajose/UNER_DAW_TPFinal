import { TipoRespuestaEnum } from '../enums/tipo-pregunta.enum';
import { OpcionDTO } from './opcion.dto';

export interface PreguntaDTO {
  id: number;
  numero: number;
  texto: string;
  tipo: TipoRespuestaEnum;
  opciones?: OpcionDTO[];
}
