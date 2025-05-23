import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { RespuestaEncuesta } from './respuesta-encuesta.entity';
import { Opcion } from 'src/modules/encuestas/entities/opcion.entity';

@Entity({ name: 'respuestas_opciones' })
export class RespuestaOpcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RespuestaEncuesta)
  @JoinColumn({ name: 'id_respuesta' })
  respuestaEncuesta: RespuestaEncuesta;

  @ManyToOne(() => Opcion)
  @JoinColumn({ name: 'id_opcion' })
  opcion: Opcion;
}
