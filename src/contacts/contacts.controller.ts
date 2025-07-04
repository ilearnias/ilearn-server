import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

import { ContactsService } from './contacts.service';
import { CreateContactsDto } from './dto/create.dto';
import { QueryContactsDto } from './dto/query.dto';
import { UpdateContactsDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Contacts')
@Controller('admin/contacts')
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createDto: CreateContactsDto): Promise<DataResponseDto> {
    return await this.contactsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({
    status: 200,
    description: 'List of contacts retrieved successfully',
  })
  async findAll(@Query() query: QueryContactsDto): Promise<DataResponseDto> {
    return await this.contactsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.contactsService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update contact' })
  @ApiParam({ name: 'id', type: 'string', description: 'Contact ID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateContactsDto,
  ): Promise<DataResponseDto> {
    return await this.contactsService.update(id, updateDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete contact' })
  @ApiParam({ name: 'id', type: 'string', description: 'Contact ID' })
  @ApiResponse({ status: 204, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.contactsService.remove(id);
  }
}
