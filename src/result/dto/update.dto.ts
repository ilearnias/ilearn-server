import { PartialType } from '@nestjs/swagger';
import { CreateResultDto } from './create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateResultDto extends PartialType(CreateResultDto) {
  @ApiProperty({
    description: 'Thumbnail image URL or path',
    example: 'https://example.com/thumbnail.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail?: string;
}
