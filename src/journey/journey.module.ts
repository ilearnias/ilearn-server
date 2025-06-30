import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { journeyProviders } from './journey.provider';
import { JourneyController } from './journey.controller';

@Module({
  controllers: [JourneyController],
  providers: [JourneyService, ...journeyProviders],
  exports: [JourneyService],
})
export class JourneyModule {}
