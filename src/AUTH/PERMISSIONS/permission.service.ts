import { Injectable, NotFoundException, ConflictException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Permission } from './permission.entity';
import { RolePermission } from '../ROLE_PERMISSION/role_permission.entity';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { CreatePermissionDto, QueryPermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { CreateModulePermissionDto } from './dto/create.dto';

@Injectable()
export class PermissionService {
  constructor(
    @Inject('PermissionProvider')
    private repository: typeof Permission,
  ) {}

  /**
   * Create a new permission
   * @param createDto - Data for creating permission
   * @returns DataResponseDto with newly created Permission
   */
  async create(createDto: CreatePermissionDto) {
    try {
      // Check if permission name already exists
      const existingPermission = await this.repository.findOne({
        where: { name: createDto.name }
      });

      if (existingPermission) {
        throw new ConflictException(`Permission with name ${createDto.name} already exists`);
      }

      // Check if resource-action combination already exists
      const existingResourceAction = await this.repository.findOne({
        where: { 
          resource: createDto.resource,
          action: createDto.action
        }
      });

      if (existingResourceAction) {
        throw new ConflictException(`Permission for action '${createDto.action}' on resource '${createDto.resource}' already exists`);
      }

      // Create new permission
      const permission = await this.repository.create({
        id: uuidv4(),
        ...createDto,
        isActive: createDto.isActive ?? true
      });
      
      return new DataResponseDto(permission, true, "Permission created successfully");

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async createWithRole(createDto: CreateModulePermissionDto) {
    try {
      const actions = ["read","create","update","delete"];

      const resource = createDto.name.toLowerCase().replace(/\s+/g, '_');

      const payload = actions.map((item)=>{
        return {
          id: uuidv4(),
          isActive: true,
          name: `${resource}:${item}`,
          resource: resource,
          action: item,
          description: `Permission to ${item} ${resource}`
        }
      });

      // Create new permissions
      const permission = await this.repository.bulkCreate(payload, { returning: true });
      const permissionIds = permission.map(item => item.id);

      const rolePermissionPayload = permissionIds.map((id)=>{
        return {
          id: uuidv4(),
          roleId: createDto.roleId,
          permissionId: id,
          isActive: true
        }
      })

      const rolePermissions = await RolePermission.bulkCreate(rolePermissionPayload);
      
      return new DataResponseDto(rolePermissions, true, "Permission created successfully");

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
  /**
   * Find all permissions with pagination and filtering
   * @param params - Query parameters for filtering
   * @returns DataResponseDto with rows and count
   */
  async findAll(params: QueryPermissionDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        resource,
        action,
        isActive
      } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};
      
      // Apply search filter if provided
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { resource: { [Op.like]: `%${search}%` } },
          { action: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      // Apply specific filters if provided
      if (resource) {
        whereClause.resource = resource;
      }
      
      if (action) {
        whereClause.action = action;
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
            as: 'rolePermissions'
          }
        ],
        // offset,
        // limit,
        // distinct: true,
        // order: [['resource', 'ASC'], ['action', 'ASC']]
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
   * Find one permission by ID
   * @param id - Permission ID
   * @returns DataResponseDto with Permission entity
   */
  async findOne(id: string) {
    try {
      const permission = await this.findOneEntity(id);
      return new DataResponseDto(permission, true, "Permission fetched successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Helper method to find permission with relations
   * @param id - Permission ID
   * @returns Permission entity with relations
   */
  private async findOneEntity(id: string): Promise<Permission> {
    const permission = await this.repository.findOne({
      where: { id },
      include: [
        {
          model: RolePermission,
          as: 'rolePermissions'
        }
      ]
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  /**
   * Update a permission
   * @param id - Permission ID
   * @param updateDto - Data for updating
   * @returns DataResponseDto with updated Permission
   */
  async update(id: string, updateDto: UpdatePermissionDto) {
    try {
      // Find the permission
      const permission = await this.repository.findByPk(id);
      
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      // Check for duplicate name if name is being updated
      if (updateDto.name && updateDto.name !== permission.name) {
        const existingPermission = await this.repository.findOne({
          where: { 
            name: updateDto.name,
            id: { [Op.ne]: id }
          }
        });

        if (existingPermission) {
          throw new ConflictException(`Permission with name ${updateDto.name} already exists`);
        }
      }

      // Check for duplicate resource-action if either is being updated
      if ((updateDto.resource && updateDto.resource !== permission.resource) || 
          (updateDto.action && updateDto.action !== permission.action)) {
        const resource = updateDto.resource || permission.resource;
        const action = updateDto.action || permission.action;
        
        const existingResourceAction = await this.repository.findOne({
          where: { 
            resource,
            action,
            id: { [Op.ne]: id }
          }
        });

        if (existingResourceAction) {
          throw new ConflictException(`Permission for action '${action}' on resource '${resource}' already exists`);
        }
      }

      // Update the permission
      await permission.update(updateDto);
      
      // Get updated permission with relations
      const updatedPermission = await this.findOneEntity(id);
      
      return new DataResponseDto(updatedPermission, true, "Permission updated successfully");

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Remove a permission
   * @param id - Permission ID
   * @returns DataResponseDto with success message
   */
  async remove(id: string) {
    try {
      const permission = await this.repository.findByPk(id);
      
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      await permission.destroy();
      return new DataResponseDto(permission, true, "Permission deleted successfully");

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find permissions by resource
   * @param resource - Resource name
   * @returns DataResponseDto with array of Permission entities
   */
  async findByResource(resource: string) {
    try {
      const permissions = await this.repository.findAll({
        where: { 
          resource,
          isActive: true 
        },
        order: [['action', 'ASC']]
      });

      return new DataResponseDto(permissions, true, "Permissions fetched successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
  /**
 * Get permissions grouped by resource
 * @returns DataResponseDto with permissions grouped by resource
 */
async getPermissionsByResourceGrouped() {
  try {
    // Get all permissions
    const permissions = await this.repository.findAll({
      where: { isActive: true },
      attributes: ['id', 'resource', 'action'],
      order: [['resource', 'ASC'], ['action', 'ASC']]
    });

    // Group permissions by resource
    const groupedPermissions = permissions.reduce((result, permission) => {
      const resource = permission.resource;
      
      // If resource doesn't exist in result yet, create it
      if (!result[resource]) {
        result[resource] = {
          resource: resource,
          permissions: []
        };
      }
      
      // Add permission to the resource
      result[resource].permissions.push({
        id: permission.id,
        action: permission.action
      });
      
      return result;
    }, {});

    // Convert to array for response
    const resultArray = Object.values(groupedPermissions);
    
    return new DataResponseDto(resultArray, true, "Permissions grouped by resource fetched successfully");
  } catch (error) {
    console.log(error);
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException();
  }
}

}