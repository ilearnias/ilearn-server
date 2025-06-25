import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { SubstanceUseHistory } from '../SUBSTANCE_USE_HISTORY/substance_use_history.entity';


@Table({ tableName: 'social_work_substance_types', paranoid: true })
export class SubstanceType extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
      })
      id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  description: string;

  @HasMany(() => SubstanceUseHistory)
  substanceUseHistories: SubstanceUseHistory[];
}