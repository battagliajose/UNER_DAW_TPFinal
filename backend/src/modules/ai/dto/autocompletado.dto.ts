import { IsNotEmpty, IsString } from 'class-validator';

export class AutocompletarDto {
  @IsString()
  @IsNotEmpty()
  tituloEncuesta: string;

  @IsString()
  @IsNotEmpty()
  pregunta: string;

  @IsString()
  @IsNotEmpty()
  textoParcial: string;
}
