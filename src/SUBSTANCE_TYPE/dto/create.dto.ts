import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateSubstanceTypeDto {
  @ApiProperty({
    description: 'Name of the substance type',
    example: 'Cannabis/ganja/charas/hashish/bhang',
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the substance type',
    example: 'Cannabis and related substances',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}
