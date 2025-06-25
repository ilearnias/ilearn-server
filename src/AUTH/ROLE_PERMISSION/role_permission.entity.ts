import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from '../ROLES/role.entity';
import { Permission } from '../PERMISSIONS/permission.entity';

@Table({ tableName: 'role_permissions', paranoid: true })
export class RolePermission extends Model<RolePermission> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  roleId: string;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  permissionId: string;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Permission)
  permission: Permission;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;
}