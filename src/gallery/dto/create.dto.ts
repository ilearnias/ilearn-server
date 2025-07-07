import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({ description: 'Title of the gallery item' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Array of image URLs/paths', type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiPropertyOptional({ description: 'Display order of the gallery item' })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({ description: 'Active status of the gallery item' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
