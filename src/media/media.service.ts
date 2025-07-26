import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Media } from './media.entity';
import { CreateMediaDto } from './dto/create.dto';
import { QueryMediaDto } from './dto/query.dto';
import { UpdateMediaDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

/**
 * Service responsible for handling media operations
 * Includes create, read, update, and delete functionality
 */
@Injectable()
export class MediaService {
  constructor(
    @Inject('MediaProvider')
    private repository: typeof Media,
  ) {}

  /**
   * Creates a new media entry
   * @param createDto - Data for the new media entry
   * @returns newly created media entry
   */
  async create(createDto: CreateMediaDto): Promise<DataResponseDto> {
    try {
      // Create new media entry
      const media = await this.repository.create({
        ...createDto,
        thumbnail: createDto.thumbnail,
        isActive: createDto.isActive ?? true,
      });

      return new DataResponseDto(
        media,
        true,
        'Media entry created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create media entry');
    }
  }

  /**
   * Retrieves all media entries with pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns paginated list of media entries
   */
  async findAll(params: QueryMediaDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, isActive, isTestimonial } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Add search filter if provided
      if (search) {
        whereClause[Op.or] = [
          { description: { [Op.iLike]: `%${search}%` } },
          { video: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Add active status filter if provided
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      // Add testimonial status filter if provided
      if (isTestimonial !== undefined) {
        whereClause.isTestimonial = isTestimonial;
      }

      // Find media entries with pagination
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
      throw new InternalServerErrorException(
        'Failed to retrieve media entries',
      );
    }
  }

  /**
   * Retrieves a single media entry by ID
   * @param id - Media entry ID
   * @returns media entry details
   * @throws NotFoundException if media entry not found
   */
  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const media = await this.repository.findOne({
        where: { id },
      });

      if (!media) {
        throw new NotFoundException(`Media entry with ID ${id} not found`);
      }

      return new DataResponseDto(
        media,
        true,
        'Media entry fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve media entry');
    }
  }

  /**
   * Updates an existing media entry
   * @param id - Media entry ID
   * @param updateDto - Data to update
   * @returns updated media entry
   * @throws NotFoundException if media entry not found
   */
  async update(
    id: string,
    updateDto: UpdateMediaDto,
  ): Promise<DataResponseDto> {
    try {
      const media = await this.repository.findByPk(id);

      if (!media) {
        throw new NotFoundException(`Media entry with ID ${id} not found`);
      }

      // Update media entry
      await media.update({
        ...updateDto,
        thumbnail: updateDto.thumbnail,
      });

      return new DataResponseDto(
        media,
        true,
        'Media entry updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update media entry');
    }
  }

  /**
   * Soft deletes a media entry
   * @param id - Media entry ID
   * @returns success response
   * @throws NotFoundException if media entry not found
   */
  async remove(id: string): Promise<DataResponseDto> {
    try {
      const media = await this.repository.findByPk(id);

      if (!media) {
        throw new NotFoundException(`Media entry with ID ${id} not found`);
      }

      // Soft delete the media entry (due to paranoid:true in entity)
      await media.destroy();

      return new DataResponseDto(
        null,
        true,
        'Media entry deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete media entry');
    }
  }
}
