// create.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsDate, IsObject, IsISO8601 } from 'class-validator';
import { TreatmentPhase } from '../substance_use.entity';

export class CreateSocialWorkSubstanceUseDto {
  @ApiProperty({
    description: 'Patient ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID('4')
  patientId: string;

  @ApiPropertyOptional({
    description: 'Treatment plan start date',
    example: '2023-01-01'
  })
  @IsOptional()
  @IsISO8601()
  treatment_plan_start_date?: string;

  @ApiPropertyOptional({
    description: 'Treatment plan review date',
    example: '2023-02-01'
  })
  @IsOptional()
  @IsISO8601()
  treatment_plan_review_date?: string;

  @ApiPropertyOptional({
    description: 'Treatment phase',
    enum: TreatmentPhase,
    example: TreatmentPhase.ACUTE
  })
  @IsOptional()
  @IsEnum(TreatmentPhase)
  Treatment_phase?: TreatmentPhase;

  @ApiPropertyOptional({
    description: 'Current medical conditions',
    example: 'Hypertension, Diabetes'
  })
  @IsOptional()
  @IsString()
  current_medical_conditions?: string;

  @ApiPropertyOptional({
    description: 'Past medical conditions',
    example: 'Asthma, Allergies'
  })
  @IsOptional()
  @IsString()
  past_medical_conditions?: string;

  @ApiPropertyOptional({
    description: 'Psychiatric complications',
    example: { depression: true, anxiety: true, bipolar: false }
  })
  @IsOptional()
  @IsObject()
  psychiatric_complications?: object;

  @ApiPropertyOptional({
    description: 'Chronic health problems',
    example: { hypertension: true, diabetes: false, heart_disease: true }
  })
  @IsOptional()
  @IsObject()
  chronic_health_problems?: object;

  @ApiPropertyOptional({
    description: 'Medical problems history',
    example: { surgeries: ['Appendectomy 2015'], hospitalizations: ['Pneumonia 2020'] }
  })
  @IsOptional()
  @IsObject()
  medical_problems_history?: object;

  @ApiPropertyOptional({
    description: 'Alcohol withdrawal symptoms',
    example: { tremors: true, anxiety: true, insomnia: true, seizures: false }
  })
  @IsOptional()
  @IsObject()
  alcohol_withdrawal_symptoms?: object;

  @ApiPropertyOptional({
    description: 'Drug withdrawal symptoms',
    example: { nausea: true, muscle_pain: true, agitation: true, hallucinations: false }
  })
  @IsOptional()
  @IsObject()
  drug_withdrawal_symptoms?: object;

  @ApiPropertyOptional({
    description: 'Attempts to quit',
    example: 'Two previous rehabilitation attempts in 2019 and 2021'
  })
  @IsOptional()
  @IsString()
  attempts_to_quit?: string;

  @ApiPropertyOptional({
    description: 'Triggers for use',
    example: 'Stress, social gatherings, conflict'
  })
  @IsOptional()
  @IsString()
  triggers_for_use?: string;

  @ApiPropertyOptional({
    description: 'Use of tobacco products',
    example: { cigarettes: true, vaping: false, duration_years: 15 }
  })
  @IsOptional()
  @IsObject()
  use_of_tobacco_products?: object;

  @ApiPropertyOptional({
    description: 'Allergy information',
    example: 'Penicillin, shellfish'
  })
  @IsOptional()
  @IsString()
  allergy_information?: string;
}