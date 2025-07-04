import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadProvider } from './upload.provider';

@Module({
  controllers: [UploadController],
  providers: [UploadService,...UploadProvider],
  exports: [UploadService],
})
export class UploadModule {}
