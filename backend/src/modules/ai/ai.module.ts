import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controller/ai.controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
