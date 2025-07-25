import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'journey', paranoid: true })
export class Journey extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(4),
    allowNull: true,
  })
  year: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  media: string;

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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isFeatured: boolean;
}
