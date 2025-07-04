import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { mediaProviders } from './media.provider';
import { MediaController } from './media.controller';

@Module({
  controllers: [MediaController],
  providers: [MediaService, ...mediaProviders],
  exports: [MediaService],
})
export class MediaModule {}
