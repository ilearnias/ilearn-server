import { PartialType } from '@nestjs/swagger';
import { CreateJourneyDto } from './create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateJourneyDto extends PartialType(CreateJourneyDto) {
  @ApiProperty({
    description: 'Title of the journey',
    example: 'Our First Milestone',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}
