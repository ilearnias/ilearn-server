import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BlogCategories } from '../blog_categories/blog_categories.entity';

@Table({ tableName: 'blog', paranoid: true })
export class Blog extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => BlogCategories)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  categoryId: string;

  @BelongsTo(() => BlogCategories)
  category: BlogCategories;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  subTitle: string;

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
  tags: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  link: string;

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
