import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Encuesta } from '../../encuestas/entities/encuesta.entity';
import { RespuestaAbierta } from './respuesta-abierta.entity';
import { RespuestaOpcion } from './respuesta-opcion.entity';

@Entity({ name: 'respuestas' })
export class RespuestaEncuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Encuesta)
  @JoinColumn({ name: 'id_encuesta' })
  encuesta: Encuesta;

  @OneToMany(
    () => RespuestaAbierta,
    (respuestaAbierta) => respuestaAbierta.respuestaEncuesta,
    {
      cascade: ['insert'],
    },
  )
  respuestasAbiertas: RespuestaAbierta[];

  @OneToMany(
    () => RespuestaOpcion,
    (respuestaOpcion) => respuestaOpcion.respuestaEncuesta,
    {
      cascade: ['insert'],
    },
  )
  respuestasOpciones: RespuestaOpcion[];
}
