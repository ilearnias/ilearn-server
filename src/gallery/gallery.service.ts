import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Gallery } from './gallery.entity';
import { GalleryTitle } from '../gallery_title/gallery_title.entity';
import { CreateGalleryDto } from './dto/create.dto';
import { QueryGalleryDto } from './dto/query.dto';
import { UpdateGalleryDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class GalleryService {
  constructor(
    @Inject('GalleryProvider')
    private repository: typeof Gallery,
  ) {}

  async create(createDto: CreateGalleryDto): Promise<DataResponseDto> {
    try {
      const gallery = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
      });
      return new DataResponseDto(
        gallery,
        true,
        'Gallery item created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create gallery item');
    }
  }

  async findAll(params: QueryGalleryDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, titleId, isActive } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { tags: { [Op.like]: `%${search}%` } },
          { media: { [Op.like]: `%${search}%` } },
        ];
      }
      if (titleId) {
        whereClause.titleId = titleId;
      }
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }
      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: GalleryTitle,
            as: 'title',
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
      throw new InternalServerErrorException(
        'Failed to retrieve gallery items',
      );
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const gallery = await this.repository.findOne({
        where: { id },
        include: [
          {
            model: GalleryTitle,
            as: 'title',
            attributes: ['id', 'title'],
          },
        ],
      });
      if (!gallery) {
        throw new NotFoundException(`Gallery item with ID ${id} not found`);
      }
      return new DataResponseDto(
        gallery,
        true,
        'Gallery item fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve gallery item');
    }
  }

  async update(
    id: string,
    updateDto: UpdateGalleryDto,
  ): Promise<DataResponseDto> {
    try {
      const gallery = await this.repository.findByPk(id);
      if (!gallery) {
        throw new NotFoundException(`Gallery item with ID ${id} not found`);
      }
      await gallery.update(updateDto);
      return new DataResponseDto(
        gallery,
        true,
        'Gallery item updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update gallery item');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const gallery = await this.repository.findByPk(id);
      if (!gallery) {
        throw new NotFoundException(`Gallery item with ID ${id} not found`);
      }
      await gallery.destroy();
      return new DataResponseDto(
        null,
        true,
        'Gallery item deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete gallery item');
    }
  }
}
