import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Description of the media',
    example: 'Educational video about mathematics',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Video ID',
    example: '1234567890',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  video?: string;

  @ApiProperty({
    description: 'Order/position of the media',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the media is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Whether the media is a testimonial',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isTestimonial?: boolean;
}
