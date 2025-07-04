import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Op } from 'sequelize';

import { Team } from './team.entity';
import { CreateTeamDto } from './dto/create.dto';
import { QueryTeamDto } from './dto/query.dto';
import { UpdateTeamDto } from './dto/update.dto';
import { DataResponseDto } from '@/shared/dto/data-response.dto';

@Injectable()
export class TeamService {
  constructor(
    @Inject('TeamProvider')
    private repository: typeof Team,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<DataResponseDto> {
    try {
      const team = await this.repository.create({
        ...createTeamDto,
        isActive: createTeamDto.isActive ?? true,
      });

      return new DataResponseDto(
        team,
        true,
        'Team member created successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create team member');
    }
  }

  async findAll(params: QueryTeamDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, name, designation, isActive } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (name) {
        whereClause.name = { [Op.iLike]: `%${name}%` };
      }

      if (designation) {
        whereClause.designation = { [Op.iLike]: `%${designation}%` };
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
        query: name || designation || '',
        offset: offset,
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve team members');
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const team = await this.repository.findOne({
        where: { id },
      });

      if (!team) {
        throw new NotFoundException(`Team member with ID ${id} not found`);
      }

      return new DataResponseDto(
        team,
        true,
        'Team member fetched successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve team member');
    }
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<DataResponseDto> {
    try {
      const team = await this.repository.findByPk(id);

      if (!team) {
        throw new NotFoundException(`Team member with ID ${id} not found`);
      }

      await team.update(updateTeamDto);

      return new DataResponseDto(
        team,
        true,
        'Team member updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update team member');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const team = await this.repository.findByPk(id);

      if (!team) {
        throw new NotFoundException(`Team member with ID ${id} not found`);
      }

      await team.destroy();

      return new DataResponseDto(
        null,
        true,
        'Team member deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete team member');
    }
  }

  async softDelete(id: string): Promise<DataResponseDto> {
    try {
      const team = await this.repository.findByPk(id);

      if (!team) {
        throw new NotFoundException(`Team member with ID ${id} not found`);
      }

      await team.destroy();

      return new DataResponseDto(
        null,
        true,
        'Team member soft deleted successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to soft delete team member',
      );
    }
  }

  async restore(id: string): Promise<DataResponseDto> {
    try {
      const team = await this.repository.findByPk(id, { paranoid: false });

      if (!team) {
        throw new NotFoundException(`Team member with ID ${id} not found`);
      }

      await team.restore();

      return new DataResponseDto(
        team,
        true,
        'Team member restored successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to restore team member');
    }
  }
}
