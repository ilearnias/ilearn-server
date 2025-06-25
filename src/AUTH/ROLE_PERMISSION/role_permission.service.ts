import { Injectable, NotFoundException, ConflictException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../ROLES/role.entity';
import { Permission } from '../PERMISSIONS/permission.entity';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { RolePermission } from './role_permission.entity';
import { BulkCreateRolePermissionDto, CreateRolePermissionDto, QueryRolePermissionDto, UpdateRolePermissionDto } from './dto/role_permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @Inject('RolePermissionProvider')
    private repository: typeof RolePermission,
  ) {}

  /**
   * Create a new role permission
   * @param createDto - Data for creating role permission
   * @returns DataResponseDto with newly created RolePermission
   */
  async create(createDto: CreateRolePermissionDto) {
    try {
      // Check if the role-permission combination already exists
      const existingRolePermission = await this.repository.findOne({
        where: { 
          roleId: createDto.roleId,
          permissionId: createDto.permissionId
        }
      });

      if (existingRolePermission) {
        throw new ConflictException(`Permission is already assigned to this role`);
      }

      // Create new role permission
      const rolePermission = await this.repository.create({
        id: uuidv4(),
        ...createDto,
        isActive: createDto.isActive ?? true
      });
      
      // Find the created role permission with relations
      const rolePermissionWithRelations = await this.findOneEntity(rolePermission.id);
      
      return new DataResponseDto(rolePermissionWithRelations, true, "Role permission created successfully");

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Bulk create role permissions
   * @param bulkCreateDto - Data for bulk creating role permissions
   * @returns DataResponseDto with created RolePermissions
   */
  async bulkCreate(bulkCreateDto: BulkCreateRolePermissionDto) {
    try {
      const { roleId, permissionIds } = bulkCreateDto;
      
      // Check which permissions are already assigned to the role
      const existingRolePermissions = await this.repository.findAll({
        where: { 
          roleId,
          permissionId: { [Op.in]: permissionIds }
        }
      });
      
      // Filter out already assigned permissions
      const existingPermissionIds = existingRolePermissions.map(rp => rp.permissionId);
      const newPermissionIds = permissionIds.filter(id => !existingPermissionIds.includes(id));
      
      if (newPermissionIds.length === 0) {
        throw new ConflictException(`All specified permissions are already assigned to this role`);
      }
      
      // Prepare data for bulk creation
      const rolePermissionsToCreate = newPermissionIds.map(permissionId => ({
        id: uuidv4(),
        roleId,
        permissionId,
        isActive: true
      }));
      
      // Bulk create role permissions
      const createdRolePermissions = await this.repository.bulkCreate(rolePermissionsToCreate);
      
      // Get role permissions with relations
      const rolePermissions = await this.repository.findAll({
        where: { 
          id: { [Op.in]: createdRolePermissions.map(rp => rp.id) }
        },
        include: [
          {
            model: Role,
            as: 'role'
          },
          {
            model: Permission,
            as: 'permission'
          }
        ]
      });
      
      return new DataResponseDto(
        rolePermissions, 
        true, 
        `${rolePermissions.length} permissions assigned to role successfully`
      );

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find all role permissions with pagination and filtering
   * @param params - Query parameters for filtering
   * @returns DataResponseDto with rows and count
   */
  async findAll(params: QueryRolePermissionDto) {
    try {
      const {
        page = 1,
        limit = 10,
        roleId,
        permissionId,
        resource,
        action,
        isActive,
        search
      } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};
      
      // Apply direct filters if provided
      if (roleId) {
        whereClause.roleId = roleId;
      }
      
      if (permissionId) {
        whereClause.permissionId = permissionId;
      }
      
      if (typeof isActive === 'boolean') {
        whereClause.isActive = isActive;
      }

      // Include configuration
      const includeConfig: any = [
        {
          model: Role,
          as: 'role'
        },
        {
          model: Permission,
          as: 'permission'
        }
      ];

      // Add search and resource/action filtering
      if (search || resource || action) {
        includeConfig[1].where = {};
        
        if (search) {
          includeConfig[0].where = {
            name: { [Op.like]: `%${search}%` }
          };
          
          includeConfig[1].where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { resource: { [Op.like]: `%${search}%` } },
            { action: { [Op.like]: `%${search}%` } }
          ];
        }
        
        if (resource) {
          includeConfig[1].where.resource = resource;
        }
        
        if (action) {
          includeConfig[1].where.action = action;
        }
      }

      // Execute query with all filters and includes
      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        include: includeConfig,
        offset,
        limit,
        distinct: true,
        order: [['createdAt', 'DESC']]
      });

      const pageOptionsDto = {
        page,
        limit,
        query: search || '',
        offset: offset
      };

      return new DataResponseDto(rows, pageOptionsDto, count);

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find one role permission by ID
   * @param id - RolePermission ID
   * @returns DataResponseDto with RolePermission entity
   */
  async findOne(id: string) {
    try {
      const rolePermission = await this.findOneEntity(id);
      return new DataResponseDto(rolePermission, true, "Role permission fetched successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Helper method to find role permission with relations
   * @param id - RolePermission ID
   * @returns RolePermission entity with relations
   */
  private async findOneEntity(id: string): Promise<RolePermission> {
    const rolePermission = await this.repository.findOne({
      where: { id },
      include: [
        {
          model: Role,
          as: 'role'
        },
        {
          model: Permission,
          as: 'permission'
        }
      ]
    });

    if (!rolePermission) {
      throw new NotFoundException(`Role permission with ID ${id} not found`);
    }

    return rolePermission;
  }

  /**
   * Update a role permission
   * @param id - RolePermission ID
   * @param updateDto - Data for updating
   * @returns DataResponseDto with updated RolePermission
   */
  async update(id: string, updateDto: UpdateRolePermissionDto) {
    try {
      // Find the role permission
      const rolePermission = await this.repository.findByPk(id);
      
      if (!rolePermission) {
        throw new NotFoundException(`Role permission with ID ${id} not found`);
      }

      // Check for duplicate if both roleId and permissionId are being updated
      if (updateDto.roleId && updateDto.permissionId && 
         (updateDto.roleId !== rolePermission.roleId || updateDto.permissionId !== rolePermission.permissionId)) {
        const existingRolePermission = await this.repository.findOne({
          where: { 
            roleId: updateDto.roleId,
            permissionId: updateDto.permissionId,
            id: { [Op.ne]: id }
          }
        });

        if (existingRolePermission) {
          throw new ConflictException(`Permission is already assigned to this role`);
        }
      }

      // Update the role permission
      await rolePermission.update(updateDto);
      
      // Get updated role permission with relations
      const updatedRolePermission = await this.findOneEntity(id);
      
      return new DataResponseDto(updatedRolePermission, true, "Role permission updated successfully");

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Remove a role permission
   * @param id - RolePermission ID
   * @returns DataResponseDto with success message
   */
  async remove(id: string) {
    try {
      const rolePermission = await this.repository.findByPk(id);
      
      if (!rolePermission) {
        throw new NotFoundException(`Role permission with ID ${id} not found`);
      }

      await rolePermission.destroy();
      return new DataResponseDto(rolePermission, true, "Role permission deleted successfully");

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
  
  /**
   * Find role permissions by role ID
   * @param roleId - Role ID
   * @returns DataResponseDto with array of RolePermission entities
   */
  async findByRoleId(roleId: string) {
    try {
      const rolePermissions = await this.repository.findAll({
        where: { 
          roleId,
          isActive: true 
        },
        include: [
          {
            model: Permission,
            as: 'permission'
          }
        ],
        order: [
          [{ model: Permission, as: 'permission' }, 'resource', 'ASC'],
          [{ model: Permission, as: 'permission' }, 'action', 'ASC']
        ]
      });

      return new DataResponseDto(rolePermissions, true, "Role permissions fetched successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Remove role permissions by role ID and permission IDs
   * @param roleId - Role ID
   * @param permissionIds - Array of Permission IDs
   * @returns DataResponseDto with success message
   */
  async removeByRoleAndPermissions(roleId: string, permissionIds: string[]) {
    try {
      const rolePermissions = await this.repository.findAll({
        where: { 
          roleId,
          permissionId: { [Op.in]: permissionIds }
        }
      });
      
      if (rolePermissions.length === 0) {
        throw new NotFoundException(`No matching role permissions found`);
      }

      // Soft delete all matching role permissions
      await this.repository.destroy({
        where: {
          id: { [Op.in]: rolePermissions.map(rp => rp.id) }
        }
      });
      
      return new DataResponseDto(
        null, 
        true, 
        `${rolePermissions.length} permissions removed from role successfully`
      );

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
}