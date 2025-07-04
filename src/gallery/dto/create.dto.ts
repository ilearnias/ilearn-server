import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({
    description: 'Gallery title ID (foreign key)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  titleId?: string;

  @ApiProperty({
    description: 'Tags for the gallery item',
    example: 'event,2023',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  tags?: string;

  @ApiProperty({
    description: 'Media URL for the gallery item',
    example: 'https://example.com/gallery-image.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  media?: string;

  @ApiProperty({
    description: 'Order/position of the gallery item',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the gallery item is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
