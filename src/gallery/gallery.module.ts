import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { galleryProviders } from './gallery.provider';
import { GalleryController } from './gallery.controller';
import { GalleryTitleModule } from '../gallery_title/gallery_title.module';

@Module({
  imports: [GalleryTitleModule],
  controllers: [GalleryController],
  providers: [GalleryService, ...galleryProviders],
  exports: [GalleryService],
})
export class GalleryModule {}
