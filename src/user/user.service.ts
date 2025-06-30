import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Op } from 'sequelize';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create.dto';
import { QueryUserDto } from './dto/query.dto';
import { UpdateUserDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserProvider')
    private repository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<DataResponseDto> {
    try {
      const user = await this.repository.create({
        ...createUserDto,
        isActive: createUserDto.isActive ?? true,
        role: createUserDto.role ?? 'student',
      });

      return new DataResponseDto(user, true, 'User created successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(params: QueryUserDto): Promise<DataResponseDto> {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        email,
        phone,
        role,
        isActive,
      } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (name) {
        whereClause.name = { [Op.iLike]: `%${name}%` };
      }

      if (email) {
        whereClause.email = { [Op.iLike]: `%${email}%` };
      }

      if (phone) {
        whereClause.phone = { [Op.iLike]: `%${phone}%` };
      }

      if (role) {
        whereClause.role = role;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        distinct: true,
        order: [['createdAt', 'DESC']],
      });

      const pageOptionsDto = {
        page,
        limit,
        query: name || email || phone || '',
        offset: offset,
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const user = await this.repository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return new DataResponseDto(user, true, 'User fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<DataResponseDto> {
    try {
      const user = await this.repository.findByPk(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await user.update(updateUserDto);

      return new DataResponseDto(user, true, 'User updated successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const user = await this.repository.findByPk(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await user.destroy();

      return new DataResponseDto(null, true, 'User deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async softDelete(id: string): Promise<DataResponseDto> {
    try {
      const user = await this.repository.findByPk(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await user.destroy();

      return new DataResponseDto(null, true, 'User soft deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to soft delete user');
    }
  }

  async restore(id: string): Promise<DataResponseDto> {
    try {
      const user = await this.repository.findByPk(id, { paranoid: false });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await user.restore();

      return new DataResponseDto(user, true, 'User restored successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to restore user');
    }
  }
}
