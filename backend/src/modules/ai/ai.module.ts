import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controller/ai.controller';
import { AiCsvService } from './services/ai-csv.service';
import { ReportesModule } from '../reportes/reportes.module';

@Module({
  controllers: [AiController],
  providers: [AiService, AiCsvService],
  imports: [ReportesModule],
})
export class AiModule {}
