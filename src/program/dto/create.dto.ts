import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgramDto {
  @ApiProperty({
    description: 'Title of the program',
    example: 'Advanced Web Development',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Status of the program',
    example: 'Active',
    enum: ['Active', 'Inactive', 'Upcoming'],
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Order/position of the program',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  order: number;

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
    description: 'Sub title of the program',
    example: 'Web Dev Basics',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  sub_title?: string;

  @ApiProperty({
    description: 'Whether the program is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
