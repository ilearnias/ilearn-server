import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Gallery } from './gallery.entity';
import { CreateGalleryDto } from './dto/create.dto';
import { UpdateGalleryDto } from './dto/update.dto';
import { QueryGalleryDto } from './dto/query.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { UploadService } from '../upload/upload.service';
import { PageOptionsDto } from '../shared/dto/page-option.dto';
import { PaginationGalleryDto } from './dto/pagination.dto';

@Injectable()
export class GalleryService {
  constructor(
    @Inject('GalleryProvider')
    private repository: typeof Gallery,
    private uploadService: UploadService,
  ) {}

  async uploadImages(
    files: Array<Express.Multer.File>,
  ): Promise<DataResponseDto> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }

      const uploadPromises = files.map((file) =>
        this.uploadService.uploadImage(file),
      );
      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.map((result) => result.data);

      return new DataResponseDto(
        uploadedUrls,
        true,
        'Images uploaded successfully',
      );
    } catch (error) {
      console.log('Upload error:', error);
      if (error?.response?.data) {
        console.log('Detailed error:', error.response.data);
      }
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to upload images: ' + error.message,
      );
    }
  }

  async create(createDto: CreateGalleryDto): Promise<DataResponseDto> {
    try {
      const gallery = await this.repository.create({
        ...createDto,
        isActive: createDto.isActive ?? true,
        description: createDto.description,
        images: createDto.images,
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

  async findAll(params: PaginationGalleryDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, title, isActive, description } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
      }
      if (description) {
        whereClause.description = { [Op.iLike]: `%${description}%` };
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

      // Construct plain object for meta (PageOptionsDto properties)
      const pageOptionsDto = {
        page,
        limit,
        query: '',
        offset,
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
      const gallery = await this.repository.findByPk(id);

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

      await gallery.update({
        ...updateDto,
        description: updateDto.description,
        images: updateDto.images,
      });

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
