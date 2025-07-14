import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'result_summary', paranoid: true })
export class ResultSummary extends Model {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalSelection: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  topRanks: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  order: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  pcmClassroom: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  firstAttempt: number;

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
