import { BelongsTo, BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { RolePermission } from '../ROLE_PERMISSION/role_permission.entity';
import { Users } from '../USERS/users.entity';

/**
 * Role Entity
 * Represents a role in the system which can be assigned to users
 * and contains permissions
 */
@Table({ tableName: 'roles', paranoid: true })
export class Role extends Model<Role> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

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

  @HasMany(() => Users)
  users: Users[];

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];
}