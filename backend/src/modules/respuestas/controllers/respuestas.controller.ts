import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RespuestasService } from '../services/respuestas.service';
import { CreateRespuestaDTO } from '../dtos/create-respuesta.dto';

@Controller('/respuestas')
export class RespuestasController {
  constructor(private respuestasService: RespuestasService) {}

  @Post('/responder')
  async crearRespuesta(@Body() dto: CreateRespuestaDTO): Promise<{
    mensaje: string;
    idRespuesta: number;
  }> {
    try {
      return await this.respuestasService.crearRespuesta(dto);
    } catch (exception) {
      throw new HttpException(
        'Error al crear la respuesta',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: exception,
        },
      );
    }
  }

  @Get('/echo')
  async echo(): Promise<string> {
    return this.respuestasService.echo();
  }
}
