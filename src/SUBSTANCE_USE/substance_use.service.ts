import { HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Registration } from '../../FRONT_OFFICE/REGISTRATION/registration.entity';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { CreateSocialWorkSubstanceUseDto } from './dto/create.dto';
import { UpdateSocialWorkSubstanceUseDto } from './dto/update.dto';
import { SocialWorkSubstanceUse } from './substance_use.entity';
import { QuerySocialWorkSubstanceUseDto } from './dto/query.dto';

@Injectable()
export class SocialWorkSubstanceUseService {
  constructor(
    @Inject('SocialWorkSubstanceUseProvider')
    private repository: typeof SocialWorkSubstanceUse,
  ) {}

  /**
   * Create a new social work substance use record
   * @param createDto - Data transfer object containing record details
   * @returns Created social work substance use record
   */
  async create(createDto: CreateSocialWorkSubstanceUseDto) {
    try {
      // Check if patient exists
      const existingPatient = await Registration.findByPk(createDto.patientId);
      if (!existingPatient) {
        throw new NotFoundException(`Patient with ID ${createDto.patientId} not found`);
      }

      // Create the substance use record
      const record = await this.repository.create({
        id: uuidv4(),
        ...createDto
      });

      return new DataResponseDto(record, true, "Social work substance use record created successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Failed to create social work substance use record");
    }
  }

  /**
   * Find all social work substance use records with optional filtering
   * @param params - Query parameters for pagination, search, and filtering
   * @returns List of social work substance use records
   */
  async findAll(params: QuerySocialWorkSubstanceUseDto) {
    try {
      const {
        page = 1,
        limit = 10,
        patientId,
        treatmentPhase,
        query
      } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};
      
      if (patientId) {
        whereClause.patientId = patientId;
      }
      
      if (treatmentPhase) {
        whereClause.Treatment_phase = treatmentPhase;
      }

      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Registration,
            as: 'patient'
          }
        ],
        offset,
        limit,
        distinct: true,
        order: [['createdAt', 'DESC']]
      });

      const pageOptionsDto = {
        page,
        limit,
        offset: offset,
        query
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Failed to fetch social work substance use records");
    }
  }

  /**
   * Find a social work substance use record by ID
   * @param id - UUID of the record to find
   * @returns Found social work substance use record
   */
  async findOne(id: string) {
    try {
      const record = await this.repository.findOne({
        where: { id },
        include: [
          {
            model: Registration,
            as: 'patient'
          }
        ]
      });

      if (!record) {
        throw new NotFoundException(`Social work substance use record with ID ${id} not found`);
      }

      return new DataResponseDto(record, true, "Social work substance use record fetched successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Failed to fetch social work substance use record");
    }
  }

  /**
   * Find all social work substance use records for a specific patient
   * @param patientId - UUID of the patient
   * @returns List of social work substance use records for the patient
   */
  async findByPatientId(patientId: string) {
    try {
      const records = await this.repository.findAll({
        where: { patientId },
        include: [
          {
            model: Registration,
            as: 'patient'
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return new DataResponseDto(records, true, "Patient's substance use records fetched successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Failed to fetch patient's substance use records");
    }
  }

  /**
   * Update a social work substance use record
   * @param id - UUID of the record to update
   * @param updateDto - Data transfer object containing updated record details
   * @returns Updated social work substance use record
   */
  async update(id: string, updateDto: UpdateSocialWorkSubstanceUseDto) {    
    try {
      const record = await this.repository.findByPk(id);
      
      if (!record) {
        throw new NotFoundException(`Social work substance use record with ID ${id} not found`);
      }

      // If patientId is being updated, check if the new patient exists
      if (updateDto.patientId && updateDto.patientId !== record.patientId) {
        const existingPatient = await Registration.findByPk(updateDto.patientId);
        if (!existingPatient) {
          throw new NotFoundException(`Patient with ID ${updateDto.patientId} not found`);
        }
      }

      await record.update(updateDto);
      return new DataResponseDto(record, true, "Social work substance use record updated successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Failed to update social work substance use record");
    }
  }

  /**
   * Remove a social work substance use record
   * @param id - UUID of the record to remove
   * @returns Removed social work substance use record
   */
  async remove(id: string) {
    try {
      const record = await this.repository.findByPk(id);
      
      if (!record) {
        throw new NotFoundException(`Social work substance use record with ID ${id} not found`);
      }

      await record.destroy();
      return new DataResponseDto(record, true, "Social work substance use record deleted successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Failed to delete social work substance use record");
    }
  }
}