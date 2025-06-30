import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { BlogCategories } from './blog_categories.entity';
import { CreateBlogCategoriesDto } from './dto/create.dto';
import { QueryBlogCategoriesDto } from './dto/query.dto';
import { UpdateBlogCategoriesDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class BlogCategoriesService {
  constructor(
    @Inject('BlogCategoriesProvider')
    private repository: typeof BlogCategories,
  ) { }

  async create(createDto: CreateBlogCategoriesDto): Promise<DataResponseDto> {
    try {
      const blogCategory = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
      });
      return new DataResponseDto(
        blogCategory,
        true,
        'Blog category created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create blog category');
    }
  }

  async findAll(params: QueryBlogCategoriesDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, isActive } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (search) {
        whereClause[Op.or] = [{ title: { [Op.like]: `%${search}%` } }];
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
        'Failed to retrieve blog categories',
      );
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const blogCategory = await this.repository.findOne({ where: { id } });
      if (!blogCategory) {
        throw new NotFoundException(`Blog category with ID ${id} not found`);
      }
      return new DataResponseDto(
        blogCategory,
        true,
        'Blog category fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve blog category',
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateBlogCategoriesDto,
  ): Promise<DataResponseDto> {
    try {
      const blogCategory = await this.repository.findByPk(id);
      if (!blogCategory) {
        throw new NotFoundException(`Blog category with ID ${id} not found`);
      }
      await blogCategory.update(updateDto);
      return new DataResponseDto(
        blogCategory,
        true,
        'Blog category updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update blog category');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const blogCategory = await this.repository.findByPk(id);
      if (!blogCategory) {
        throw new NotFoundException(`Blog category with ID ${id} not found`);
      }
      await blogCategory.destroy();
      return new DataResponseDto(
        null,
        true,
        'Blog category deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete blog category');
    }
  }
}
