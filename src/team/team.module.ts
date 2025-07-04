import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { teamProviders } from './team.provider';

@Module({
  imports: [],
  controllers: [TeamController],
  providers: [TeamService, ...teamProviders],
  exports: [TeamService],
})
export class TeamModule {}
