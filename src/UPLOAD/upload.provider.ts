import { InternalServerErrorException } from '@nestjs/common';
import core from 'file-type/core';
import * as fileType from 'file-type';
import sharp from 'sharp';

export const UploadProvider = [
  {
    provide: 'imageMimeTypes',
    useValue: [
      'image/jpeg', // JPEG images
      'image/png', // PNG images
      'image/webp', // WebP images
    ],
  },
  {
    provide: 'getMime',
    useFactory:
      () =>
      async (file: Express.Multer.File): Promise<core.FileTypeResult> => {
        try {
          const fileFormat: core.FileTypeResult = await fileType.fromBuffer(
            file.buffer,
          );
          return fileFormat;
        } catch (err) {
          throw new InternalServerErrorException();
        }
      },
  },
  {
    provide: 'compressImage',
    useFactory:
      () =>
      async (file: Express.Multer.File): Promise<Buffer> => {
        try {
            // const fileFormat = await fileType.fromBuffer(file.buffer);
            // const outputSharp = sharp(file.buffer);
            // if (fileFormat?.mime == 'image/png') {
            //   outputSharp.png({ compressionLevel: 9 });
            // } else {
            //   outputSharp.webp({ quality: 80 });
            // }
            // const resizedImg = await outputSharp.toBuffer();
            // return resizedImg;
          return file.buffer;
        } catch (err) {
          console.log("err==>",err)
          throw new InternalServerErrorException();
        }
      },
  },
];
