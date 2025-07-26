import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Result } from './result.entity';
import { CreateResultDto } from './dto/create.dto';
import { QueryResultDto } from './dto/query.dto';
import { UpdateResultDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

@Injectable()
export class ResultService {
  constructor(
    @Inject('ResultProvider')
    private repository: typeof Result,
  ) {}

  async create(createDto: CreateResultDto): Promise<DataResponseDto> {
    try {
      const result = await this.repository.create({
        ...createDto,
        thumbnail: createDto.thumbnail,
        isActive: createDto.isActive ?? true,
      });
      return new DataResponseDto(result, true, 'Result created successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create result');
    }
  }

  async findAll(params: QueryResultDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, year, isActive } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { year: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { media: { [Op.iLike]: `%${search}%` } },
        ];
      }
      if (year) {
        whereClause.year = year;
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
      throw new InternalServerErrorException('Failed to retrieve results');
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const result = await this.repository.findOne({ where: { id } });
      if (!result) {
        throw new NotFoundException(`Result with ID ${id} not found`);
      }
      return new DataResponseDto(result, true, 'Result fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve result');
    }
  }

  async update(
    id: string,
    updateDto: UpdateResultDto,
  ): Promise<DataResponseDto> {
    try {
      const result = await this.repository.findByPk(id);
      if (!result) {
        throw new NotFoundException(`Result with ID ${id} not found`);
      }
      await result.update({
        ...updateDto,
        thumbnail: updateDto.thumbnail,
      });
      return new DataResponseDto(result, true, 'Result updated successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update result');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const result = await this.repository.findByPk(id);
      if (!result) {
        throw new NotFoundException(`Result with ID ${id} not found`);
      }
      await result.destroy();
      return new DataResponseDto(null, true, 'Result deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete result');
    }
  }
}
