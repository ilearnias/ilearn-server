import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'team', paranoid: true })
export class Team extends Model {
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
    allowNull: true,
  })
  designation: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  linkedin: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  twitter: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  facebook: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  instagram: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  order: number;

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
