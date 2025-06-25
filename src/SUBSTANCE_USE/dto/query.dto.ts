import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { TreatmentPhase } from '../substance_use.entity';

export class QuerySocialWorkSubstanceUseDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by patient ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID('4')
  patientId?: string;

  @ApiPropertyOptional({
    description: 'Filter by treatment phase',
    enum: TreatmentPhase,
    example: TreatmentPhase.ACUTE
  })
  @IsOptional()
  @IsEnum(TreatmentPhase)
  treatmentPhase?: TreatmentPhase;

  @ApiProperty({
    description: 'Search query',
    required: false
  })
  @IsOptional()
  query?: string;
}