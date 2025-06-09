import { Body, Controller, Post, Param, Get, Header } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { AutocompletarDto } from '../dto/autocompletado.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('informeencuesta/:id/:codigo')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async generarInformeEncuesta(
    @Param('id') id: string,
    @Param('codigo') codigo: string,
  ): Promise<string> {
    console.log(`Generando informe para encuesta ID: ${id}, Código: ${codigo}`);
    return this.aiService.generarInformeEncuesta(+id, codigo);
  }

  @Post('autocompletar')
  async autocompletar(@Body() dto: AutocompletarDto): Promise<string> {
    return this.aiService.autocompletarRespuesta(dto);
  }
}
