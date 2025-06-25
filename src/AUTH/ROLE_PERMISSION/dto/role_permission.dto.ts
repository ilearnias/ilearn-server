// dto/create-role-permission.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsBoolean, IsOptional, IsInt, Min, IsString, ArrayMinSize, ValidateNested } from 'class-validator';

/**
 * Data Transfer Object for creating a new RolePermission
 */
export class CreateRolePermissionDto {
  @ApiProperty({
    description: 'Role ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID(4)
  roleId: string;

  @ApiProperty({
    description: 'Permission ID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsNotEmpty()
  @IsUUID(4)
  permissionId: string;

  @ApiProperty({
    description: 'Indicates if the role permission is active',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// dto/update-role-permission.dto.ts
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for updating a RolePermission
 * Extends CreateRolePermissionDto but makes all fields optional
 */
export class UpdateRolePermissionDto extends PartialType(CreateRolePermissionDto) {}

// query-role-permission

/**
 * Data Transfer Object for querying RolePermissions
 * Contains optional filter parameters
 */
export class QueryRolePermissionDto {
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
    description: 'Filter by role ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID(4)
  roleId?: string;

  @ApiProperty({
    description: 'Filter by permission ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsOptional()
  @IsUUID(4)
  permissionId?: string;

  @ApiProperty({
    description: 'Filter by resource name',
    required: false,
    example: 'users'
  })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiProperty({
    description: 'Filter by action name',
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

  @ApiProperty({
    description: 'Search term (searches in related role/permission fields)',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;
}

// bulk-create-role-permission


/**
 * Data Transfer Object for bulk creating multiple RolePermissions
 */
export class BulkCreateRolePermissionDto {
  @ApiProperty({
    description: 'Role ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID(4)
  roleId: string;

  @ApiProperty({
    description: 'Array of Permission IDs',
    example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'],
    type: [String]
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @IsUUID(4, { each: true })
  permissionIds: string[];
}
