// dto/create-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength, IsInt, Min, IsArray, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for creating a new Role
 */
export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator with full access to all features',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Indicates if the role is active',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// dto/update-role.dto.ts
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for updating a Role
 * Extends CreateRoleDto but makes all fields optional
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}


/**
 * Data Transfer Object for querying Roles
 * Contains optional filter parameters
 */
export class QueryRoleDto {
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
    description: 'Search term (searches in name and description)',
    required: false
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({
    description: 'Filter by active status',
    required: false,
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


export class CreateRoleWithPermissionsDto {
  /**
   * Array of permission IDs to associate with the role
   */
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  permissionIds: string[];

  @ApiProperty({
    description: 'Role name',
    required: false
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Role description',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

}

export class UpdateRoleWithPermissionsDto extends PartialType(CreateRoleWithPermissionsDto) {}