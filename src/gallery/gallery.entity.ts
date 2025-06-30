import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GalleryTitle } from '../gallery_title/gallery_title.entity';

@Table({ tableName: 'gallery', paranoid: true })
export class Gallery extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => GalleryTitle)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  titleId: string;

  @BelongsTo(() => GalleryTitle)
  title: GalleryTitle;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  tags: string;

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
}
