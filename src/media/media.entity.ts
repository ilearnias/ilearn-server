import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'media', paranoid: true })
export class Media extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  video: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  thumbnail: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isTestimonial: boolean;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  order: number;

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
