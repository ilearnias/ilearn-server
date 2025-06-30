import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Op } from 'sequelize';

import { ResultSummary } from './result_summary.entity';
import { CreateResultSummaryDto } from './dto/create.dto';
import { QueryResultSummaryDto } from './dto/query.dto';
import { UpdateResultSummaryDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class ResultSummaryService {
  constructor(
    @Inject('ResultSummaryProvider')
    private repository: typeof ResultSummary,
  ) {}

  async create(
    createResultSummaryDto: CreateResultSummaryDto,
  ): Promise<DataResponseDto> {
    try {
      const resultSummary = await this.repository.create({
        ...createResultSummaryDto,
        isActive: createResultSummaryDto.isActive ?? true,
      });

      return new DataResponseDto(
        resultSummary,
        true,
        'Result summary created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create result summary');
    }
  }

  async findAll(params: QueryResultSummaryDto): Promise<DataResponseDto> {
    try {
      const {
        page = 1,
        limit = 10,
        title,
        examName,
        examDate,
        minPassPercentage,
        maxPassPercentage,
        isActive,
      } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
      }

      if (examName) {
        whereClause.examName = { [Op.iLike]: `%${examName}%` };
      }

      if (examDate) {
        whereClause.examDate = examDate;
      }

      if (minPassPercentage !== undefined) {
        whereClause.passPercentage = { [Op.gte]: minPassPercentage };
      }

      if (maxPassPercentage !== undefined) {
        if (whereClause.passPercentage) {
          whereClause.passPercentage = {
            ...whereClause.passPercentage,
            [Op.lte]: maxPassPercentage,
          };
        } else {
          whereClause.passPercentage = { [Op.lte]: maxPassPercentage };
        }
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
        query: title || examName || '',
        offset: offset,
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve result summaries',
      );
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const resultSummary = await this.repository.findOne({
        where: { id },
      });

      if (!resultSummary) {
        throw new NotFoundException(`Result summary with ID ${id} not found`);
      }

      return new DataResponseDto(
        resultSummary,
        true,
        'Result summary fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve result summary',
      );
    }
  }

  async update(
    id: string,
    updateResultSummaryDto: UpdateResultSummaryDto,
  ): Promise<DataResponseDto> {
    try {
      const resultSummary = await this.repository.findByPk(id);

      if (!resultSummary) {
        throw new NotFoundException(`Result summary with ID ${id} not found`);
      }

      await resultSummary.update(updateResultSummaryDto);

      return new DataResponseDto(
        resultSummary,
        true,
        'Result summary updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update result summary');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const resultSummary = await this.repository.findByPk(id);

      if (!resultSummary) {
        throw new NotFoundException(`Result summary with ID ${id} not found`);
      }

      await resultSummary.destroy();

      return new DataResponseDto(
        null,
        true,
        'Result summary deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete result summary');
    }
  }

  async softDelete(id: string): Promise<DataResponseDto> {
    try {
      const resultSummary = await this.repository.findByPk(id);

      if (!resultSummary) {
        throw new NotFoundException(`Result summary with ID ${id} not found`);
      }

      await resultSummary.destroy();

      return new DataResponseDto(
        null,
        true,
        'Result summary soft deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to soft delete result summary',
      );
    }
  }

  async restore(id: string): Promise<DataResponseDto> {
    try {
      const resultSummary = await this.repository.findByPk(id, {
        paranoid: false,
      });

      if (!resultSummary) {
        throw new NotFoundException(`Result summary with ID ${id} not found`);
      }

      await resultSummary.restore();

      return new DataResponseDto(
        resultSummary,
        true,
        'Result summary restored successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to restore result summary',
      );
    }
  }
}
