import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Program } from './program.entity';
import { CreateProgramDto } from './dto/create.dto';
import { QueryProgramDto } from './dto/query.dto';
import { UpdateProgramDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class ProgramService {
  constructor(
    @Inject('ProgramProvider')
    private repository: typeof Program,
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<DataResponseDto> {
    try {
      const program = await this.repository.create({
        ...createProgramDto,
        isActive: createProgramDto.isActive ?? true,
      });

      return new DataResponseDto(program, true, 'Program created successfully');
    } catch (error) {
      console.log('---------Create program---------', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create program');
    }
  }

  async findAll(params: QueryProgramDto): Promise<DataResponseDto> {
    try {
      const {
        page = 1,
        limit = 10,
        title,
        status,
        minPrice,
        maxPrice,
        isActive,
      } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
      }

      if (status) {
        whereClause.status = status;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        whereClause.price = {};
        if (minPrice !== undefined) {
          whereClause.price[Op.gte] = minPrice;
        }
        if (maxPrice !== undefined) {
          whereClause.price[Op.lte] = maxPrice;
        }
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
        query: title || '',
        offset: offset,
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve programs');
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const program = await this.repository.findOne({
        where: { id },
      });

      if (!program) {
        throw new NotFoundException(`Program with ID ${id} not found`);
      }

      return new DataResponseDto(program, true, 'Program fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve program');
    }
  }

  async update(
    id: string,
    updateProgramDto: UpdateProgramDto,
  ): Promise<DataResponseDto> {
    try {
      const program = await this.repository.findByPk(id);

      if (!program) {
        throw new NotFoundException(`Program with ID ${id} not found`);
      }

      await program.update(updateProgramDto);

      return new DataResponseDto(program, true, 'Program updated successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update program');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const program = await this.repository.findByPk(id);

      if (!program) {
        throw new NotFoundException(`Program with ID ${id} not found`);
      }

      await program.destroy({ force: true });

      return new DataResponseDto(null, true, 'Program deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete program');
    }
  }
}
