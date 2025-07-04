import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResultSummaryDto {
  @ApiProperty({ description: 'Result summary title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Result summary description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Exam name' })
  @IsOptional()
  @IsString()
  examName?: string;

  @ApiPropertyOptional({ description: 'Exam date' })
  @IsOptional()
  @IsDateString()
  examDate?: string;

  @ApiPropertyOptional({ description: 'Total number of students' })
  @IsOptional()
  @IsNumber()
  totalStudents?: number;

  @ApiPropertyOptional({ description: 'Number of passed students' })
  @IsOptional()
  @IsNumber()
  passedStudents?: number;

  @ApiPropertyOptional({ description: 'Number of failed students' })
  @IsOptional()
  @IsNumber()
  failedStudents?: number;

  @ApiPropertyOptional({ description: 'Pass percentage' })
  @IsOptional()
  @IsNumber()
  passPercentage?: number;

  @ApiPropertyOptional({ description: 'Average score' })
  @IsOptional()
  @IsNumber()
  averageScore?: number;

  @ApiPropertyOptional({ description: 'Highest score' })
  @IsOptional()
  @IsNumber()
  highestScore?: number;

  @ApiPropertyOptional({ description: 'Lowest score' })
  @IsOptional()
  @IsNumber()
  lowestScore?: number;

  @ApiPropertyOptional({ description: 'Result summary image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Additional data in JSON format' })
  @IsOptional()
  additionalData?: any;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
