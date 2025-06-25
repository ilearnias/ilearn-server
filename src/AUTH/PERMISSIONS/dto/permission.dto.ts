// dto/create-permission.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength, IsInt, Min } from 'class-validator';

/**
 * Data Transfer Object for creating a new Permission
 */
export class CreatePermissionDto {
  @ApiProperty({
    description: 'Permission name',
    example: 'create_user'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Resource that permission applies to',
    example: 'users'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  resource: string;

  @ApiProperty({
    description: 'Action that can be performed on the resource',
    example: 'create'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  action: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows creating new users',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Indicates if the permission is active',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// dto/update-permission.dto.ts
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for updating a Permission
 * Extends CreatePermissionDto but makes all fields optional
 */
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}


/**
 * Data Transfer Object for querying Permissions
 * Contains optional filter parameters
 */
export class QueryPermissionDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Search term (searches in name, resource, action, and description)',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by resource',
    required: false,
    example: 'users'
  })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiProperty({
    description: 'Filter by action',
    required: false,
    example: 'create'
  })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({
    description: 'Filter by active status',
    required: false,
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}