import { PartialType } from '@nestjs/swagger';
import { CreateGalleryDto } from './create.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';
import { GalleryImageDto } from './image.dto';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {
  @ApiPropertyOptional({ description: 'Description of the gallery item' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [GalleryImageDto], description: 'Array of image objects' })
  @IsOptional()
  @IsArray()
  images?: GalleryImageDto[];
}
