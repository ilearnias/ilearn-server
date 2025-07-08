import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { galleryProviders } from './gallery.provider';
import { UploadModule } from '../upload/upload.module';
import { ConfigurationModule } from '../config/config.module';

@Module({
  imports: [UploadModule, ConfigurationModule],
  controllers: [GalleryController],
  providers: [GalleryService, ...galleryProviders],
  exports: [GalleryService],
})
export class GalleryModule {}
