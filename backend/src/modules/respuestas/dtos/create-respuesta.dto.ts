import { ApiProperty } from '@nestjs/swagger';
import { CreateRespuestaAbiertaDTO } from './create-respuesta-abierta.dto';
import { CreateRespuestaOpcionDTO } from './create-respuesta-opcion.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRespuestaDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  encuestaId: number;

  @ApiProperty({ type: [CreateRespuestaAbiertaDTO] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateRespuestaAbiertaDTO)
  abiertas?: CreateRespuestaAbiertaDTO[];

  @ApiProperty({ type: [CreateRespuestaOpcionDTO] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateRespuestaOpcionDTO)
  opciones?: CreateRespuestaOpcionDTO[];
}
