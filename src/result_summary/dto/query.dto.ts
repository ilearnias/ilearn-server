import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, IsNumber } from 'class-validator';

export class QueryResultSummaryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term for filtering result summaries',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by year',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({
    description: 'Filter by minimum total selection',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotalSelection?: number;

  @ApiProperty({
    description: 'Filter by maximum total selection',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotalSelection?: number;
}
