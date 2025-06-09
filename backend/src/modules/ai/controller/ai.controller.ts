import { Body, Controller, Post, Param } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { AutocompletarDto } from '../dto/autocompletado.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('autocompletar')
  async autocompletar(@Body() dto: AutocompletarDto): Promise<string> {
    return this.aiService.autocompletarRespuesta(dto);
  }

  @Post('informeEncuesta/:id/:codigo')
  async generarInformeEncuesta(
    @Param('id') id: number,
    @Param('codigo') codigo: string,
  ): Promise<string> {
    return this.aiService.generarInformeEncuesta(id, codigo);
  }
}
