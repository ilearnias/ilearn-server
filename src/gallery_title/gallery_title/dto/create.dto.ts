import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateGalleryTitleDto {
  @ApiProperty({
    description: 'Title of the gallery section',
    example: 'Annual Event',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    description: 'Order/position of the gallery title',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the gallery title is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
