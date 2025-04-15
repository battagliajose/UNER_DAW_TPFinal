import { Controller, Get, Post, Param } from '@nestjs/common';
import { EncuestasService } from '../services/encuestas.service';

@Controller('/encuestas')
export class EncuestasController {
  constructor(private encuestasService: EncuestasService) {}


  @Get('/echo')
  async echo(): Promise<string> {
    return this.encuestasService.echo();
  }

  @Get(':id')
  async getEncuestas(@Param('id') id: string): Promise<string> {
    return this.encuestasService.getEncuestaPorId(id);
  }

  @Post('')
  async crearEncuesta(): Promise<string> {
    return this.encuestasService.crearEncuesta();
  }
}
