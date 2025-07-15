import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'programs', paranoid: true })
export class Program extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  title: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  sub_title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  status: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  order: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  route: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}
