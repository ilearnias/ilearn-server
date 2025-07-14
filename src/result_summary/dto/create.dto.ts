import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateResultSummaryDto {
  @ApiProperty({
    description: 'Year of the result summary',
    example: '2023',
    maxLength: 4,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  year?: string;

  @ApiProperty({
    description: 'Total number of selections',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalSelection?: number;

  @ApiProperty({
    description: 'Number of top ranks',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  topRanks?: number;

  @ApiProperty({
    description: 'Order/position of the result summary',
    example: 1.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Number of PCM classroom students',
    example: 80,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pcmClassroom?: number;

  @ApiProperty({
    description: 'Number of first attempt students',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  firstAttempt?: number;
}
