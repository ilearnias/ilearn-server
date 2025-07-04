import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { SuccessStories } from './success_stories.entity';
import { CreateSuccessStoriesDto } from './dto/create.dto';
import { QuerySuccessStoriesDto } from './dto/query.dto';
import { UpdateSuccessStoriesDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

@Injectable()
export class SuccessStoriesService {
  constructor(
    @Inject('SuccessStoriesProvider')
    private repository: typeof SuccessStories,
  ) {}

  async create(createDto: CreateSuccessStoriesDto): Promise<DataResponseDto> {
    try {
      const story = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
      });
      return new DataResponseDto(
        story,
        true,
        'Success story created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create success story');
    }
  }

  async findAll(params: QuerySuccessStoriesDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, isActive } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { details: { [Op.like]: `%${search}%` } },
        ];
      }
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }
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
        'Failed to retrieve success stories',
      );
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const story = await this.repository.findOne({ where: { id } });
      if (!story) {
        throw new NotFoundException(`Success story with ID ${id} not found`);
      }
      return new DataResponseDto(
        story,
        true,
        'Success story fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve success story',
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateSuccessStoriesDto,
  ): Promise<DataResponseDto> {
    try {
      const story = await this.repository.findByPk(id);
      if (!story) {
        throw new NotFoundException(`Success story with ID ${id} not found`);
      }
      await story.update(updateDto);
      return new DataResponseDto(
        story,
        true,
        'Success story updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update success story');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const story = await this.repository.findByPk(id);
      if (!story) {
        throw new NotFoundException(`Success story with ID ${id} not found`);
      }
      await story.destroy();
      return new DataResponseDto(
        null,
        true,
        'Success story deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete success story');
    }
  }
}
