import { Injectable, NotFoundException, ConflictException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { SubstanceType } from './substance_type.entity';
import { CreateSubstanceTypeDto } from './dto/create.dto';
import { QuerySubstanceTypeDto } from './dto/query.dto';
import { UpdateSubstanceTypeDto } from './dto/update.dto';

/**
 * Service responsible for handling substance type operations
 * Includes create, read, update, and delete functionality
 */
@Injectable()
export class SubstanceTypeService {
  constructor(
    @Inject('SubstanceTypeProvider')
    private repository: typeof SubstanceType,
  ) {}

  /**
   * Creates a new substance type
   * @param createDto - Data for the new substance type
   * @returns newly created substance type
   * @throws ConflictException if substance type with the same name already exists
   */
  async create(createDto: CreateSubstanceTypeDto): Promise<DataResponseDto> {
    try {
      // Check if substance type name already exists
      const existingSubstanceType = await this.repository.findOne({
        where: { name: createDto.name }
      });

      if (existingSubstanceType) {
        throw new ConflictException(`Substance type with name ${createDto.name} already exists`);
      }

      // Create new substance type
      const substanceType = await this.repository.create({
        ...createDto,
        isActive: true
      });

      return new DataResponseDto(substanceType, true, "Substance type created successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create substance type');
    }
  }

  /**
   * Retrieves all substance types with pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns paginated list of substance types
   */
  async findAll(params: QuerySubstanceTypeDto): Promise<DataResponseDto> {
    try {
      const {
        page = 1,
        limit = 10,
        search
      } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};
      
      // Add search filter if provided
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      // Find substance types with pagination
      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        distinct: true,
        order: [['name', 'ASC']]
      });

      const pageOptionsDto = {
        page,
        limit,
        query: search || '',
        offset: offset
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve substance types');
    }
  }

  /**
   * Retrieves a single substance type by ID
   * @param id - Substance type ID
   * @returns substance type details
   * @throws NotFoundException if substance type not found
   */
  async findOne(id: number): Promise<DataResponseDto> {
    try {
      const substanceType = await this.repository.findOne({
        where: { id }
      });

      if (!substanceType) {
        throw new NotFoundException(`Substance type with ID ${id} not found`);
      }

      return new DataResponseDto(substanceType, true, "Substance type fetched successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve substance type');
    }
  }

  /**
   * Updates an existing substance type
   * @param id - Substance type ID
   * @param updateDto - Data to update
   * @returns updated substance type
   * @throws NotFoundException if substance type not found
   * @throws ConflictException if updated name already exists
   */
  async update(id: number, updateDto: UpdateSubstanceTypeDto): Promise<DataResponseDto> {
    try {
      const substanceType = await this.repository.findByPk(id);
      
      if (!substanceType) {
        throw new NotFoundException(`Substance type with ID ${id} not found`);
      }

      // Check if name is being updated and if it already exists
      if (updateDto.name && updateDto.name !== substanceType.name) {
        const existingSubstanceType = await this.repository.findOne({
          where: { 
            name: updateDto.name,
            id: { [Op.ne]: id }
          }
        });

        if (existingSubstanceType) {
          throw new ConflictException(`Substance type with name ${updateDto.name} already exists`);
        }
      }

      // Update substance type
      await substanceType.update(updateDto);
      
      return new DataResponseDto(substanceType, true, "Substance type updated successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update substance type');
    }
  }

  /**
   * Soft deletes a substance type
   * @param id - Substance type ID
   * @returns success response
   * @throws NotFoundException if substance type not found
   */
  async remove(id: number): Promise<DataResponseDto> {
    try {
      const substanceType = await this.repository.findByPk(id);
      
      if (!substanceType) {
        throw new NotFoundException(`Substance type with ID ${id} not found`);
      }

      // Soft delete the substance type (due to paranoid:true in entity)
      await substanceType.destroy();
      
      return new DataResponseDto(null, true, "Substance type deleted successfully");
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete substance type');
    }
  }
}