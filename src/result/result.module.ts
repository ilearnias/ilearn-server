import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { resultProviders } from './result.provider';
import { ResultController } from './result.controller';

@Module({
  controllers: [ResultController],
  providers: [ResultService, ...resultProviders],
  exports: [ResultService],
})
export class ResultModule {}
