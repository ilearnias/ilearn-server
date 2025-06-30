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
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  examName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  examDate: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalStudents: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  passedStudents: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  failedStudents: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  passPercentage: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  averageScore: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  highestScore: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  lowestScore: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  additionalData: any;

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
