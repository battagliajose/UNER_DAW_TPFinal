import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { AutocompletarDto } from '../dto/autocompletado.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('autocompletar')
  async autocompletar(@Body() dto: AutocompletarDto): Promise<string> {
    return this.aiService.autocompletarRespuesta(dto);
  }
}
