import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controller/ai.controller';
import { ReportesModule } from '../reportes/reportes.module';

@Module({
  controllers: [AiController],
  providers: [AiService],
  imports: [ReportesModule],
})
export class AiModule {}
