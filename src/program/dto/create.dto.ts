import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsPositive,
  Min,
  IsNotEmpty,
} from 'class-validator';

enum ProgramStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  UPCOMING = 'Upcoming',
}

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
    description: 'Category of the program',
    example: 'Web Development',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiProperty({
    description: 'Duration of the program',
    example: '6 months',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  duration: string;

  @ApiProperty({
    description: 'Status of the program',
    example: 'active',
    enum: ProgramStatus,
    default: ProgramStatus.ACTIVE,
  })
  @IsNotEmpty()
  @IsEnum(ProgramStatus)
  status: ProgramStatus;

  @ApiProperty({
    description: 'Number of enrollments in the program',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  enrollments?: number;

  @ApiProperty({
    description: 'Price of the program',
    example: 499.99,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Description of the program',
    example: 'A comprehensive program covering modern web development technologies',
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
