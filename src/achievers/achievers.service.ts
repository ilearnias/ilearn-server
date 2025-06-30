import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Achievers } from './achievers.entity';
import { CreateAchieversDto } from './dto/create.dto';
import { QueryAchieversDto } from './dto/query.dto';
import { UpdateAchieversDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

/**
 * Service responsible for handling achievers operations
 * Includes create, read, update, and delete functionality
 */
@Injectable()
export class AchieversService {
  constructor(
    @Inject('AchieversProvider')
    private repository: typeof Achievers,
  ) {}

  /**
   * Creates a new achiever
   * @param createDto - Data for the new achiever
   * @returns newly created achiever
   */
  async create(createDto: CreateAchieversDto): Promise<DataResponseDto> {
    try {
      // Create new achiever
      const achiever = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
      });

      return new DataResponseDto(
        achiever,
        true,
        'Achiever created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create achiever');
    }
  }

  /**
   * Retrieves all achievers with pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns paginated list of achievers
   */
  async findAll(params: QueryAchieversDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, isActive } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Add search filter if provided
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { details: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      // Add active status filter if provided
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      // Find achievers with pagination
      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        distinct: true,
        order: [
          ['order', 'ASC'],
          ['createdAt', 'DESC'],
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
      throw new InternalServerErrorException('Failed to retrieve achievers');
    }
  }

  /**
   * Retrieves a single achiever by ID
   * @param id - Achiever ID
   * @returns achiever details
   * @throws NotFoundException if achiever not found
   */
  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const achiever = await this.repository.findOne({
        where: { id },
      });

      if (!achiever) {
        throw new NotFoundException(`Achiever with ID ${id} not found`);
      }

      return new DataResponseDto(
        achiever,
        true,
        'Achiever fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve achiever');
    }
  }

  /**
   * Updates an existing achiever
   * @param id - Achiever ID
   * @param updateDto - Data to update
   * @returns updated achiever
   * @throws NotFoundException if achiever not found
   */
  async update(
    id: string,
    updateDto: UpdateAchieversDto,
  ): Promise<DataResponseDto> {
    try {
      const achiever = await this.repository.findByPk(id);

      if (!achiever) {
        throw new NotFoundException(`Achiever with ID ${id} not found`);
      }

      // Update achiever
      await achiever.update(updateDto);

      return new DataResponseDto(
        achiever,
        true,
        'Achiever updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update achiever');
    }
  }

  /**
   * Soft deletes an achiever
   * @param id - Achiever ID
   * @returns success response
   * @throws NotFoundException if achiever not found
   */
  async remove(id: string): Promise<DataResponseDto> {
    try {
      const achiever = await this.repository.findByPk(id);

      if (!achiever) {
        throw new NotFoundException(`Achiever with ID ${id} not found`);
      }

      // Soft delete the achiever (due to paranoid:true in entity)
      await achiever.destroy();

      return new DataResponseDto(null, true, 'Achiever deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete achiever');
    }
  }
}
