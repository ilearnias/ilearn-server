import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, IsBoolean } from 'class-validator';

export class QueryResultDto {
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
    description: 'Search term for filtering results',
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
    description: 'Filter by active status',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Filter by aspect ratio',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiProperty({
    description: 'Filter by title',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string;
}
