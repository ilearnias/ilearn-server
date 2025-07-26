import { ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { PageOptionsDto } from '../../shared/dto/page-option.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationGalleryDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search across title and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  // Hide searchField from Swagger
  @ApiHideProperty()
  searchField?: string;
} 