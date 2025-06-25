import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ImageResponseDto } from './dto/response.dto';
import path from 'path';
import core from 'file-type/core';
import { DataResponseDto } from '../SHARED/dto/data-response.dto';
import { ConfigurationService } from 'src/CONFIG/config.service';
import generateRandom from '../SHARED/helpers/generate.random';

@Injectable()
export class UploadService {
  private s3: AWS.S3;

  constructor(
    configService: ConfigurationService,
    @Inject('imageMimeTypes') private imageMimeTypes: string[],
    @Inject('compressImage')
    private compressImage: (file: Express.Multer.File) => Promise<Buffer>,
    @Inject('getMime')
    private getFormat: (
      file: Express.Multer.File,
    ) => Promise<core.FileTypeResult>
  ) {
    this.s3 = new AWS.S3(configService.s3Config);
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const fileFormat = await this.getFormat(file);
      if (!this.imageMimeTypes.includes(fileFormat?.mime)) {
        throw new BadRequestException('Invalid file type');
      }

      const resizedImg = await this.compressImage(file);
      const fileName = `${generateRandom(2)}${path.parse(file?.originalname)?.name}.${fileFormat?.ext}`;

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DIRECTORY}/${fileName}`,
        Body: resizedImg,
        ACL: 'public-read',
        ContentType: fileFormat?.mime,
      };

      const data = await this.s3.upload(params).promise();
      return new DataResponseDto(data?.Location, true, 'Image uploaded successfully');
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.log("errerrerrerr",err.message)
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  async fileUpload(file: Express.Multer.File) {
    try {
      const fileFormat = await this.getFormat(file);
      const fileName = `${Date.now()}.${fileFormat?.ext}`;

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DIRECTORY}/${fileName}`,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: fileFormat?.mime,
      };

      const data = await this.s3.upload(params).promise();
      return new DataResponseDto(new ImageResponseDto(data), true, 'File uploaded successfully');
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async deleteFromS3(url: string) {
    try {
      const key = url?.split(`${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/`)[1];
      
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
      return { success: true, message: 'File deleted successfully' };
    } catch (err) {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}