import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateAchieversDto {
  @ApiProperty({
    description: 'Name of the achiever',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'Details of the achiever',
    example: 'Software Engineer at Tech Corp',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  details?: string;

  @ApiProperty({
    description: 'Description of the achiever',
    example: 'Award-winning software engineer with 10+ years of experience',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Image URL of the achiever',
    example: 'https://example.com/image.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;

  @ApiProperty({
    description: 'Order/position of the achiever',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the achiever is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
