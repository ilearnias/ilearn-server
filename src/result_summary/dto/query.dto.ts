import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '../../shared/dto/page-option.dto';

export class QueryResultSummaryDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search by title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Search by exam name' })
  @IsOptional()
  @IsString()
  examName?: string;

  @ApiPropertyOptional({ description: 'Filter by exam date' })
  @IsOptional()
  @IsString()
  examDate?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum pass percentage' })
  @IsOptional()
  @IsNumber()
  minPassPercentage?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum pass percentage' })
  @IsOptional()
  @IsNumber()
  maxPassPercentage?: number;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
