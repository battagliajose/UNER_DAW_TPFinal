import { IsNotEmpty, IsString } from 'class-validator';

export class AutocompletarDto {
  @IsString()
  @IsNotEmpty()
  pregunta: string;

  @IsString()
  @IsNotEmpty()
  textoParcial: string;
}
