import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { RolePermission } from '../ROLE_PERMISSION/role_permission.entity';

/**
 * Permission Entity
 * Represents a permission in the system which can be assigned to roles
 * and defines what actions can be performed on specific resources
 */
@Table({ tableName: 'permissions', paranoid: true })
export class Permission extends Model<Permission> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  resource: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  action: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];
}