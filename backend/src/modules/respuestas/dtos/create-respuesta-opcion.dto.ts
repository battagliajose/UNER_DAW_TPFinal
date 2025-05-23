import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRespuestaOpcionDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  preguntaId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  opcionId: number;
}
