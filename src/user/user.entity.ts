import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', paranoid: true })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  city: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  state: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  country: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  zipCode: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  profileImage: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bio: string;

  @Column({
    type: DataType.ENUM('student', 'teacher', 'admin', 'parent'),
    allowNull: false,
    defaultValue: 'student',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date;
}
