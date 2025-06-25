import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Employee } from '../../HR/EMPLOYEE/employee.entity';
import { Role } from '../ROLES/role.entity';

@Table({ tableName: 'users', paranoid: true })
export class Users extends Model<Users> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true
  })
  employeeId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  employee_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID
  })
  role_id: string;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Employee)
  employee: Employee;
}