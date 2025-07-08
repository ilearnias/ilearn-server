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
      const { page = 1, limit = 10, title, isActive } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
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

      return new DataResponseDto(rows, true, `Found ${count} gallery items`);
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
