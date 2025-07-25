import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GalleryImageDto {
  @ApiProperty({ description: 'Subtitle of the image' })
  @IsString()
  subtitle: string;

  @ApiProperty({ description: 'Description of the image' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Image URL or path' })
  @IsString()
  image: string;
} 