import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RespuestaEncuesta } from './respuesta-encuesta.entity';
import { Pregunta } from 'src/modules/encuestas/entities/pregunta.entity';

@Entity({ name: 'respuestas_abiertas' })
export class RespuestaAbierta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @ManyToOne(() => Pregunta)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;

  @ManyToOne(() => RespuestaEncuesta)
  @JoinColumn({ name: 'id_respuesta' })
  respuestaEncuesta: RespuestaEncuesta;
}
