import {
  Injectable,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { Contacts } from './contacts.entity';
import { CreateContactsDto } from './dto/create.dto';
import { QueryContactsDto } from './dto/query.dto';
import { UpdateContactsDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('ContactsProvider')
    private repository: typeof Contacts,
  ) { }

  async create(createDto: CreateContactsDto): Promise<DataResponseDto> {
    try {
      const contact = await this.repository.create({
        ...createDto,
      });
      return new DataResponseDto(contact, true, 'Contact created successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create contact');
    }
  }

  async findAll(params: QueryContactsDto): Promise<DataResponseDto> {
    try {
      const { page = 1, limit = 10, search, status } = params;
      const offset = (page - 1) * limit;
      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }
      if (status) {
        whereClause.status = status;
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
        query: search || '',
        offset: offset,
      };
      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve contacts');
    }
  }

  async findOne(id: string): Promise<DataResponseDto> {
    try {
      const contact = await this.repository.findOne({ where: { id } });
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      return new DataResponseDto(contact, true, 'Contact fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to retrieve contact');
    }
  }

  async update(
    id: string,
    updateDto: UpdateContactsDto,
  ): Promise<DataResponseDto> {
    try {
      const contact = await this.repository.findByPk(id);
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      await contact.update(updateDto);
      return new DataResponseDto(contact, true, 'Contact updated successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update contact');
    }
  }

  async remove(id: string): Promise<DataResponseDto> {
    try {
      const contact = await this.repository.findByPk(id);
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      await contact.destroy();
      return new DataResponseDto(null, true, 'Contact deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete contact');
    }
  }
}
