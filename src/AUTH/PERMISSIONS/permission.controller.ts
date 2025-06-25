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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Permissions } from '../../SHARED/decorators/permission.decorator';
import { Public } from '../../SHARED/decorators/public.decorator';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { CreateModulePermissionDto } from './dto/create.dto';
import { CreatePermissionDto, QueryPermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  /**
   * Create a new permission
   * @param createDto - Data for creating permission
   * @returns Response with created permission
   */
  @Post()
  @ApiBearerAuth()
  @Permissions('permissions:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new permission' })
  async create(@Body() createDto: CreatePermissionDto) {
    return await this.permissionService.create(createDto);
  }

  @Post('create')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create permissions for a module and assign to role' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Permissions created and assigned successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createWithRole(@Body() createDto: CreateModulePermissionDto): Promise<DataResponseDto> {
    return await this.permissionService.createWithRole(createDto);
  }

  /**
   * Get all permissions with pagination and filtering
   * @param query - Query parameters for filtering
   * @returns Response with permissions
   */
  @Get()
  @ApiBearerAuth()
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll(@Query() query: QueryPermissionDto): Promise<DataResponseDto> {
    return await this.permissionService.findAll(query);
  }

  /**
   * Get permission by ID
   * @param id - Permission ID
   * @returns Response with permission
   */
  @Get(':id')
  @ApiBearerAuth()
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<DataResponseDto> {
    return await this.permissionService.findOne(id);
  }

  /**
   * Get permissions by resource
   * @param resource - Resource name
   * @returns Response with permissions
   */
  @Get('resource/:resource')
  @ApiBearerAuth()
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get permissions by resource' })
  @ApiParam({ name: 'resource', type: 'string' })
  async findByResource(
    @Param('resource') resource: string
  ): Promise<DataResponseDto> {
    return await this.permissionService.findByResource(resource);
  }

  /**
   * Update a permission
   * @param id - Permission ID
   * @param updateDto - Data for updating
   * @returns Response with updated permission
   */
  @Patch(':id')
  @ApiBearerAuth()
  @Permissions('permissions:update')
  @ApiOperation({ summary: 'Update a permission' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdatePermissionDto
  ): Promise<DataResponseDto> {
    return await this.permissionService.update(id, updateDto);
  }

  /**
   * Delete a permission
   * @param id - Permission ID
   * @returns Response with success message
   */
  @Delete(':id')
  @ApiBearerAuth()
  @Permissions('permissions:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<DataResponseDto> {
    return await this.permissionService.remove(id);
  }

  /**
* Get permissions grouped by resource
* @returns Response with permissions grouped by resource
*/
  @Get('grouped/by-resource')
  @ApiBearerAuth()
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get permissions grouped by resource' })
  async getPermissionsByResourceGrouped(): Promise<DataResponseDto> {
    return await this.permissionService.getPermissionsByResourceGrouped();
  }
}