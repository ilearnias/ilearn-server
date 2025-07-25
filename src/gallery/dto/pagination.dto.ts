import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '../../shared/dto/page-option.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class PaginationGalleryDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search by title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Search by description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 