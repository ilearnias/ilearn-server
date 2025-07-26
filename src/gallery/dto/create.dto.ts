import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { GalleryImageDto } from './image.dto';
import { Type } from 'class-transformer';

export class CreateGalleryDto {
  @ApiProperty({ description: 'Title of the gallery item' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the gallery item' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Array of image objects',
    type: [GalleryImageDto],
  })
  @IsArray()
  @IsOptional()
  images: GalleryImageDto[];

  @ApiPropertyOptional({ description: 'Display order of the gallery item' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({ description: 'Active status of the gallery item' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
