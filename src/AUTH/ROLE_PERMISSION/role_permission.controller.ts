import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { BulkCreateRolePermissionDto, CreateRolePermissionDto, QueryRolePermissionDto, UpdateRolePermissionDto } from './dto/role_permission.dto';
import { RolePermissionService } from './role_permission.service';
import { Permissions } from '../../SHARED/decorators/permission.decorator';
  @ApiTags('Role Permissions')
  @Controller('role-permissions')
  @ApiBearerAuth()
  export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}
  
    /**
     * Create a new role permission
     * @param createDto - Data for creating role permission
     * @returns Response with created role permission
     */
    @Post()
    @Permissions('role_permissions:create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new role permission assignment' })
    @ApiBody({ type: CreateRolePermissionDto })
    async create(@Body() createDto: CreateRolePermissionDto) {
      return await this.rolePermissionService.create(createDto);
    }
  
    /**
     * Bulk create role permissions
     * @param bulkCreateDto - Data for bulk creating role permissions
     * @returns Response with created role permissions
     */
    @Post('bulk')
    @Permissions('role_permissions:create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Assign multiple permissions to a role' })
    @ApiBody({ type: BulkCreateRolePermissionDto })
    async bulkCreate(@Body() bulkCreateDto: any) {
      return await this.rolePermissionService.bulkCreate(bulkCreateDto);
    }
  
    /**
     * Get all role permissions with pagination and filtering
     * @param query - Query parameters for filtering
     * @returns Response with role permissions
     */
    @Get()
    @Permissions('role_permissions:read')
    @ApiOperation({ summary: 'Get all role permissions' })
    async findAll(@Query() query: QueryRolePermissionDto): Promise<DataResponseDto> {
      return await this.rolePermissionService.findAll(query);
    }
  
    /**
     * Get role permission by ID
     * @param id - RolePermission ID
     * @returns Response with role permission
     */
    @Get(':id')
    @Permissions('role_permissions:read')
    @ApiOperation({ summary: 'Get role permission by ID' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    async findOne(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
    ): Promise<DataResponseDto> {
      return await this.rolePermissionService.findOne(id);
    }
  
    /**
     * Get role permissions by role ID
     * @param roleId - Role ID
     * @returns Response with role permissions
     */
    @Get('role/:roleId')
    @Permissions('role_permissions:read')
    @ApiOperation({ summary: 'Get all permissions assigned to a role' })
    @ApiParam({ name: 'roleId', type: 'string', format: 'uuid' })
    async findByRoleId(
      @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string
    ): Promise<DataResponseDto> {
      return await this.rolePermissionService.findByRoleId(roleId);
    }
  
    /**
     * Update a role permission
     * @param id - RolePermission ID
     * @param updateDto - Data for updating
     * @returns Response with updated role permission
     */
    @Patch(':id')
    @Permissions('role_permissions:update')
    @ApiOperation({ summary: 'Update a role permission' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiBody({ type: UpdateRolePermissionDto })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateDto: UpdateRolePermissionDto
    ): Promise<DataResponseDto> {
      return await this.rolePermissionService.update(id, updateDto);
    }
  
    /**
     * Delete a role permission
     * @param id - RolePermission ID
     * @returns Response with success message
     */
    @Delete(':id')
    @Permissions('role_permissions:delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a role permission' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    async remove(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
    ): Promise<DataResponseDto> {
      return await this.rolePermissionService.remove(id);
    }
  
    /**
     * Remove permissions from a role
     * @param roleId - Role ID
     * @param body - Object containing permission IDs to remove
     * @returns Response with success message
     */
    @Delete('role/:roleId/permissions')
    @Permissions('role_permissions:delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove permissions from a role' })
    @ApiParam({ name: 'roleId', type: 'string', format: 'uuid' })
    @ApiBody({ 
      schema: {
        type: 'object',
        properties: {
          permissionIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            }
          }
        }
      }
    })
    async removeFromRole(
      @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
      @Body() body: { permissionIds: string[] }
    ): Promise<DataResponseDto> {
      return await this.rolePermissionService.removeByRoleAndPermissions(roleId, body.permissionIds);
    }
  }