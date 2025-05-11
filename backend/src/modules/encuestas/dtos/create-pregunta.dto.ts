import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { tiposRespuestaEnum } from '../enums/tipos-respuesta.enum';
import { CreateOpcionDto } from './create-opcion.dto';
import { Type } from 'class-transformer';

export class CreatePreguntaDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numero: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({ enum: tiposRespuestaEnum })
  @IsEnum(tiposRespuestaEnum)
  @IsNotEmpty()
  tipo: tiposRespuestaEnum;

  @ApiProperty({ type: [CreateOpcionDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  opciones?: CreateOpcionDto[];
}
