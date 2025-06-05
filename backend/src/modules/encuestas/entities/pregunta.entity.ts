import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Encuesta } from './encuesta.entity';
import { Exclude } from 'class-transformer';
import { Opcion } from './opcion.entity';
import { tiposRespuestaEnum } from '../enums/tipos-respuesta.enum';

@Entity({ name: 'preguntas' })
export class Pregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: number;

  @Column()
  texto: string;

  @Column()
  tipo: tiposRespuestaEnum;

  @ManyToOne(() => Encuesta)
  @JoinColumn({ name: 'id_encuesta' })
  @Exclude()
  encuesta: Encuesta;

  @OneToMany(() => Opcion, (opcion) => opcion.pregunta, { cascade: ['insert','remove'] })
  opciones: Opcion[];
}
