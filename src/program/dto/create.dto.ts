import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({
    description: 'Title of the program',
    example: 'Advanced Web Development',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Sub title of the program',
    example: 'Advanced Web Development',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sub_title: string;

  @ApiProperty({
    description: 'Route of the program',
    example: 'route-of-the-program',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  route: string;

  @ApiProperty({
    description: 'Status of the program',
    example: 'Ongoing',
  })
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Description of the program',
    example:
      'A comprehensive program covering modern web development technologies',
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
