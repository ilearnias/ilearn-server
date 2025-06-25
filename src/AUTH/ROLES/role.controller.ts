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
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import {
  CreateRoleDto,
  CreateRoleWithPermissionsDto,
  QueryRoleDto,
  UpdateRoleDto,
  UpdateRoleWithPermissionsDto,
} from './dto/role.dto';
import { Public } from '../../SHARED/decorators/public.decorator';
import { Permissions } from '../../SHARED/decorators/permission.decorator';

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth()
@Public()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Create a new role
   * @param createDto - Data for creating role
   * @returns Response with created role
   */
  @Post()
  @Permissions('roles:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  async create(@Body() createDto: CreateRoleDto) {
    return await this.roleService.create(createDto);
  }

  /**
   * Get all roles with pagination and filtering
   * @param query - Query parameters for filtering
   * @returns Response with roles
   */
  @Get()
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get all roles' })
  async findAll(@Query() query: QueryRoleDto): Promise<DataResponseDto> {
    return await this.roleService.findAll(query);
  }

  /**
   * Get role by ID
   * @param id - Role ID
   * @returns Response with role
   */
  @Get(':id')
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<DataResponseDto> {
    return await this.roleService.findOne(id);
  }

  /**
   * Update a role
   * @param id - Role ID
   * @param updateDto - Data for updating
   * @returns Response with updated role
   */
  @Patch(':id')
  @Permissions('roles:update')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateRoleDto,
  ): Promise<DataResponseDto> {
    return await this.roleService.update(id, updateDto);
  }

  /**
   * Delete a role
   * @param id - Role ID
   * @returns Response with success message
   */
  @Delete(':id')
  @Permissions('roles:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<DataResponseDto> {
    return await this.roleService.remove(id);
  }

  @Get('with-permissions/:id')
  @Permissions('roles:read')
  async findOneWithPermission(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.roleService.findOneWithPermission(id);
  }

  @Post('with-permissions')
  @Permissions('roles:create')
  async createWithPermissions(
    @Body() createRoleWithPermissionsDto: CreateRoleWithPermissionsDto,
  ) {
    return this.roleService.createWithPermissions(createRoleWithPermissionsDto);
  }

  @Put('with-permissions/:id')
  @Permissions('roles:update')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async updateWithPermissions(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateRoleWithPermissionsDto,
  ) {
    return this.roleService.updateWithPermissions(id, updateDto);
  }
}
