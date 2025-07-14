import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateResultDto {
  @ApiProperty({
    description: 'Year of the result',
    example: '2023',
    maxLength: 4,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  year?: string;

  @ApiProperty({
    description: 'Description of the result',
    example: 'Outstanding performance in competitive exams',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Media URL for the result',
    example: 'https://example.com/result-image.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  media?: string;

  @ApiProperty({
    description: 'Order/position of the result',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the result is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
