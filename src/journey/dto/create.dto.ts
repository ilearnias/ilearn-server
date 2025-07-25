import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateJourneyDto {
  @ApiProperty({
    description: 'Year of the journey',
    example: '2023',
    maxLength: 4,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  year?: string;

  @ApiProperty({
    description: 'Description of the journey',
    example: 'Our journey began with a vision to transform education',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Media URL for the journey',
    example: 'https://example.com/journey-image.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  media?: string;

  @ApiProperty({
    description: 'Order/position of the journey',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the journey is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Whether the journey is featured',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
