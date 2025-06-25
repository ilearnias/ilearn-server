import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Registration } from '../../FRONT_OFFICE/REGISTRATION/registration.entity';

export enum TreatmentPhase {
  ACUTE = 'ACUTE',
  STABILIZATION = 'STABILIZATION',
  MAINTENANCE = 'MAINTENANCE',
  DISCHARGE_PLANNING = 'DISCHARGE_PLANNING',
}

@Table({
  tableName: 'social_work_substance_use',
  paranoid: true,
})
export class SocialWorkSubstanceUse extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Registration)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'patient_id',
  })
  patientId: string;

  @Column({
    type: DataType.DATE,
  })
  treatment_plan_start_date: Date;
  @Column({
    type: DataType.DATE,
  })
  treatment_plan_review_date: Date;

  @Column({
    type: DataType.ENUM(...Object.values(TreatmentPhase)),
    allowNull: true,
  })
  Treatment_phase: TreatmentPhase;

  @Column({
    type: DataType.TEXT,
  })
  current_medical_conditions: string;

  @Column({
    type: DataType.TEXT,
  })
  past_medical_conditions: string;

  @Column({
    type: DataType.JSON,
  })
  psychiatric_complications: object;
  @Column({
    type: DataType.JSON,
  })
  chronic_health_problems: object;

  @Column({
    type: DataType.JSON,
  })
  medical_problems_history: object;

  @Column({
    type: DataType.JSON,
  })
  alcohol_withdrawal_symptoms: object;

  @Column({
    type: DataType.JSON,
  })
  drug_withdrawal_symptoms: object;

  @Column({
    type: DataType.TEXT,
  })
  attempts_to_quit: string;
  @Column({
    type: DataType.TEXT,
  })
  triggers_for_use: string;
  @Column({
    type: DataType.JSON,
  })
  use_of_tobacco_products: object;
  @Column({
    type: DataType.TEXT,
  })
  allergy_information: string;

  @BelongsTo(() => Registration)
  patient: Registration;
}
