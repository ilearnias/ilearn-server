import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Blog } from './blog.entity';
import { BlogCategories } from '../blog_categories/blog_categories.entity';
import { CreateBlogDto } from './dto/create.dto';
import { QueryBlogDto } from './dto/query.dto';
import { UpdateBlogDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

@Injectable()
export class BlogService {
  constructor(
    @Inject('BlogProvider')
    private repository: typeof Blog,
  ) {}

  async create(createDto: CreateBlogDto): Promise<DataResponseDto> {
    try {
      const blog = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
      });
      return new DataResponseDto(blog, true, 'Blog created successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create blog');
    }
  }

  async findAll(params: QueryBlogDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, categoryId, isActive } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { subTitle: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { tags: { [Op.like]: `%${search}%` } },
        ];
      }

      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: BlogCategories,
            as: 'category',
            attributes: ['id', 'title'],
          },
        ],
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
      throw new InternalServerErrorException('Failed to retrieve blogs');
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const blog = await this.repository.findOne({
        where: { id },
        include: [
          {
            model: BlogCategories,
            as: 'category',
            attributes: ['id', 'title'],
          },
        ],
      });
      if (!blog) {
        throw new NotFoundException(`Blog with ID ${id} not found`);
      }
      return new DataResponseDto(blog, true, 'Blog fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve blog');
    }
  }

  async update(id: string, updateDto: UpdateBlogDto): Promise<DataResponseDto> {
    try {
      const blog = await this.repository.findByPk(id);
      if (!blog) {
        throw new NotFoundException(`Blog with ID ${id} not found`);
      }
      await blog.update(updateDto);
      return new DataResponseDto(blog, true, 'Blog updated successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update blog');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const blog = await this.repository.findByPk(id);
      if (!blog) {
        throw new NotFoundException(`Blog with ID ${id} not found`);
      }
      await blog.destroy();
      return new DataResponseDto(null, true, 'Blog deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete blog');
    }
  }
}
