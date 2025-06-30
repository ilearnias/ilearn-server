import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { GalleryTitle } from './gallery_title.entity';
import { CreateGalleryTitleDto } from './dto/create.dto';
import { QueryGalleryTitleDto } from './dto/query.dto';
import { UpdateGalleryTitleDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class GalleryTitleService {
  constructor(
    @Inject('GalleryTitleProvider')
    private repository: typeof GalleryTitle,
  ) { }

  async create(createDto: CreateGalleryTitleDto): Promise<DataResponseDto> {
    try {
      const galleryTitle = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
      });
      return new DataResponseDto(
        galleryTitle,
        true,
        'Gallery title created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create gallery title');
    }
  }

  async findAll(params: QueryGalleryTitleDto): Promise<DataResponseDto> {
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
        'Failed to retrieve gallery titles',
      );
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const galleryTitle = await this.repository.findOne({ where: { id } });
      if (!galleryTitle) {
        throw new NotFoundException(`Gallery title with ID ${id} not found`);
      }
      return new DataResponseDto(
        galleryTitle,
        true,
        'Gallery title fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve gallery title',
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateGalleryTitleDto,
  ): Promise<DataResponseDto> {
    try {
      const galleryTitle = await this.repository.findByPk(id);
      if (!galleryTitle) {
        throw new NotFoundException(`Gallery title with ID ${id} not found`);
      }
      await galleryTitle.update(updateDto);
      return new DataResponseDto(
        galleryTitle,
        true,
        'Gallery title updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update gallery title');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const galleryTitle = await this.repository.findByPk(id);
      if (!galleryTitle) {
        throw new NotFoundException(`Gallery title with ID ${id} not found`);
      }
      await galleryTitle.destroy();
      return new DataResponseDto(
        null,
        true,
        'Gallery title deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete gallery title');
    }
  }
}
