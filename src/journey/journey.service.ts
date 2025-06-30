import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Journey } from './journey.entity';
import { CreateJourneyDto } from './dto/create.dto';
import { QueryJourneyDto } from './dto/query.dto';
import { UpdateJourneyDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

/**
 * Service responsible for handling journey operations
 * Includes create, read, update, and delete functionality
 */
@Injectable()
export class JourneyService {
  constructor(
    @Inject('JourneyProvider')
    private repository: typeof Journey,
  ) {}

  /**
   * Creates a new journey entry
   * @param createDto - Data for the new journey entry
   * @returns newly created journey entry
   */
  async create(createDto: CreateJourneyDto): Promise<DataResponseDto> {
    try {
      // Create new journey entry
      const journey = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
      });

      return new DataResponseDto(
        journey,
        true,
        'Journey entry created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create journey entry');
    }
  }

  /**
   * Retrieves all journey entries with pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns paginated list of journey entries
   */
  async findAll(params: QueryJourneyDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, year, isActive } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Add search filter if provided
      if (search) {
        whereClause[Op.or] = [
          { year: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      // Add year filter if provided
      if (year) {
        whereClause.year = year;
      }

      // Add active status filter if provided
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      // Find journey entries with pagination
      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        distinct: true,
        order: [
          ['order', 'ASC'],
          ['year', 'DESC'],
        ],
      });

      const pageOptionsDto = {
        page,
        limit,
        query: search || '',
        offset: offset,
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve journey entries',
      );
    }
  }

  /**
   * Retrieves a single journey entry by ID
   * @param id - Journey entry ID
   * @returns journey entry details
   * @throws NotFoundException if journey entry not found
   */
  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const journey = await this.repository.findOne({
        where: { id },
      });

      if (!journey) {
        throw new NotFoundException(`Journey entry with ID ${id} not found`);
      }

      return new DataResponseDto(
        journey,
        true,
        'Journey entry fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve journey entry',
      );
    }
  }

  /**
   * Updates an existing journey entry
   * @param id - Journey entry ID
   * @param updateDto - Data to update
   * @returns updated journey entry
   * @throws NotFoundException if journey entry not found
   */
  async update(
    id: string,
    updateDto: UpdateJourneyDto,
  ): Promise<DataResponseDto> {
    try {
      const journey = await this.repository.findByPk(id);

      if (!journey) {
        throw new NotFoundException(`Journey entry with ID ${id} not found`);
      }

      // Update journey entry
      await journey.update(updateDto);

      return new DataResponseDto(
        journey,
        true,
        'Journey entry updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update journey entry');
    }
  }

  /**
   * Soft deletes a journey entry
   * @param id - Journey entry ID
   * @returns success response
   * @throws NotFoundException if journey entry not found
   */
  async remove(id: string): Promise<DataResponseDto> {
    try {
      const journey = await this.repository.findByPk(id);

      if (!journey) {
        throw new NotFoundException(`Journey entry with ID ${id} not found`);
      }

      // Soft delete the journey entry (due to paranoid:true in entity)
      await journey.destroy();

      return new DataResponseDto(
        null,
        true,
        'Journey entry deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete journey entry');
    }
  }
}
