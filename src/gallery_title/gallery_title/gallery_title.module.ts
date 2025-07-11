import { Module } from '@nestjs/common';
import { GalleryTitleService } from './gallery_title.service';
import { galleryTitleProviders } from './gallery_title.provider';
import { GalleryTitleController } from './gallery_title.controller';

@Module({
  controllers: [GalleryTitleController],
  providers: [GalleryTitleService, ...galleryTitleProviders],
  exports: [GalleryTitleService],
})
export class GalleryTitleModule {}
