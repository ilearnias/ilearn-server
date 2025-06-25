import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { RolePermission } from '../ROLE_PERMISSION/role_permission.entity';
import {
  CreateRoleDto,
  CreateRoleWithPermissionsDto,
  QueryRoleDto,
  UpdateRoleDto,
  UpdateRoleWithPermissionsDto,
} from './dto/role.dto';
import { Role } from './role.entity';
import { PermissionService } from '../PERMISSIONS/permission.service';

@Injectable()
export class RoleService {
  constructor(
    @Inject('RoleProvider')
    private repository: typeof Role,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private permissionService: PermissionService,
  ) {}

  /**
   * Create a new role
   * @param createDto - Data for creating role
   * @returns DataResponseDto with newly created Role
   */
  async create(createDto: CreateRoleDto) {
    try {
      // Check if role name already exists
      const existingRole = await this.repository.findOne({
        where: { name: createDto.name },
      });

      if (existingRole) {
        throw new ConflictException(
          `Role with name ${createDto.name} already exists`,
        );
      }

      // Create new role
      const role = await this.repository.create({
        id: uuidv4(),
        ...createDto,
        isActive: createDto.isActive ?? true,
      });

      return new DataResponseDto(role, true, 'Role created successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find all roles with pagination and filtering
   * @param params - Query parameters for filtering
   * @returns DataResponseDto with rows and count
   */
  async findAll(params: QueryRoleDto) {
    try {
      const { page = 1, limit = 10, query, isActive } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Apply search filter if provided
      if (query) {
        whereClause[Op.or] = [{ name: { [Op.iLike]: `%${query}%` } }];
      }

      // Apply active status filter if provided
      if (typeof isActive === 'boolean') {
        whereClause.isActive = isActive;
      }

      // Execute query with all filters
      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: RolePermission,
            as: 'rolePermissions',
          },
        ],
        offset,
        limit,
        distinct: true,
        order: [['name', 'ASC']],
      });

      const pageOptionsDto = {
        page,
        limit,
        query,
        offset: offset,
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find one role by ID
   * @param id - Role ID
   * @returns DataResponseDto with Role entity
   */
  async findOne(id: string) {
    try {
      const role = await this.findOneEntity(id);
      return new DataResponseDto(role, true, 'Role fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Helper method to find role with relations
   * @param id - Role ID
   * @returns Role entity with relations
   */
  private async findOneEntity(id: string): Promise<Role> {
    const role = await this.repository.findOne({
      where: { id },
      include: [
        {
          model: RolePermission,
          as: 'rolePermissions',
        },
      ],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  /**
   * Update a role
   * @param id - Role ID
   * @param updateDto - Data for updating
   * @returns DataResponseDto with updated Role
   */
  async update(id: string, updateDto: UpdateRoleDto) {
    try {
      // Find the role
      const role = await this.repository.findByPk(id);

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      // Check for duplicate name if name is being updated
      if (updateDto.name && updateDto.name !== role.name) {
        const existingRole = await this.repository.findOne({
          where: {
            name: updateDto.name,
            id: { [Op.ne]: id },
          },
        });

        if (existingRole) {
          throw new ConflictException(
            `Role with name ${updateDto.name} already exists`,
          );
        }
      }

      // Update the role
      await role.update(updateDto);

      // Get updated role with relations
      const updatedRole = await this.findOneEntity(id);

      return new DataResponseDto(
        updatedRole,
        true,
        'Role updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Remove a role
   * @param id - Role ID
   * @returns DataResponseDto with success message
   */
  async remove(id: string) {
    try {
      const role = await this.repository.findByPk(id);

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      await role.destroy();
      return new DataResponseDto(role, true, 'Role deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Create a new role with permissions
   * @param createDto - Data for creating role with permissions
   * @returns DataResponseDto with newly created Role and its permissions
   */
  async createWithPermissions(createDto: CreateRoleWithPermissionsDto) {
    try {
      return await this.sequelize.transaction(async (transaction) => {
        const existingRole = await this.repository.findOne({
          where: { name: createDto.name },
        });

        if (existingRole) {
          throw new ConflictException(
            `Role with name ${createDto.name} already exists`,
          );
        }
        // Create new role
        const role = await this.repository.create(
          {
            id: uuidv4(),
            name: createDto.name,
            description: createDto.description,
            isActive: true,
          },
          { transaction },
        );

        // If permissions are provided, create role permissions
        if (createDto.permissionIds && createDto.permissionIds.length > 0) {
          // Prepare data for role permissions
          const rolePermissions = createDto.permissionIds.map(
            (permissionId) => ({
              id: uuidv4(),
              roleId: role.id,
              permissionId,
              isActive: true,
            }),
          );

          // Create role permissions
          await RolePermission.bulkCreate(rolePermissions, { transaction });
        }

        return new DataResponseDto(
          role,
          true,
          'Role with permissions created successfully',
        );
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async updateWithPermissions(id: string, updateDto: UpdateRoleWithPermissionsDto) {
    try {
      return await this.sequelize.transaction(async (transaction) => {
        // Check if role exists
        const existingRole = await this.repository.findByPk(id);
        if (!existingRole) {
          throw new NotFoundException(`Role with ID ${id} not found`);
        }
  
        // Check if name is being changed and if it's already taken
        if (updateDto.name && updateDto.name !== existingRole.name) {
          const roleWithSameName = await this.repository.findOne({
            where: { name: updateDto.name },
          });
  
          if (roleWithSameName) {
            throw new ConflictException(
              `Role with name ${updateDto.name} already exists`,
            );
          }
        }
  
        // Update role data
        const updatedData = await this.repository.update(
          {
            name: updateDto.name || existingRole.name,
            description: updateDto.description !== undefined 
              ? updateDto.description 
              : existingRole.description,
          },
          {
            where: { id },
            transaction,
          },
        );
  
        // Handle permissions update
        if (updateDto.permissionIds !== undefined) {
          // First, remove all existing role permissions
          await RolePermission.destroy({
            where: { roleId: id },
            transaction,
          });
  
          // Then, add new permissions if provided
          if (updateDto.permissionIds.length > 0) {
            // Prepare data for role permissions
            const rolePermissions = updateDto.permissionIds.map(
              (permissionId) => ({
                id: uuidv4(),
                roleId: id,
                permissionId,
                isActive: true,
              }),
            );
  
            // Create role permissions
            await RolePermission.bulkCreate(rolePermissions, { transaction });
          }
        }
  
        return new DataResponseDto(
          updatedData,
          true,
          'Role with permissions updated successfully',
        );
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async findOneWithPermission(id: string) {
    try {
      const role = await this.findOneEntity(id);
      const permissions = await this.permissionService.getPermissionsByResourceGrouped();

      const permissionValues: any = {};
      permissions.data.forEach(resource => {
        permissionValues[resource.resource] = {};
        resource.permissions.forEach(permission => {
          const isPermissionGranted = role?.rolePermissions?.some(
            (p: any) => p.permissionId === permission.id
          );
          permissionValues[resource.resource][permission.action] = isPermissionGranted;
        });
      });

      return new DataResponseDto({role,permissionValues}, true, 'Role fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
}
