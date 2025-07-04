import { Module } from '@nestjs/common';
import { AchieversService } from './achievers.service';
import { achieversProviders } from './achievers.provider';
import { AchieversController } from './achievers.controller';

@Module({
  controllers: [AchieversController],
  providers: [AchieversService, ...achieversProviders],
  exports: [AchieversService],
})
export class AchieversModule {}
