import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({
    description: 'Title of the program',
    example: 'Computer Science',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    description: 'Subtitle of the program',
    example: 'Bachelor of Science in Computer Science',
    required: false,
  })
  @IsOptional()
  @IsString()
  subTitle?: string;

  @ApiProperty({
    description: 'Description of the program',
    example:
      'A comprehensive program covering software development, algorithms, and computer systems',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Order/position of the program',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the program is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
