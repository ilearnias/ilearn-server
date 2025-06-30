import { Module } from '@nestjs/common';
import { SuccessStoriesService } from './success_stories.service';
import { successStoriesProviders } from './success_stories.provider';
import { SuccessStoriesController } from './success_stories.controller';

@Module({
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService, ...successStoriesProviders],
  exports: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
