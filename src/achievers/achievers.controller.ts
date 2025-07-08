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

import { AchieversService } from './achievers.service';
import { CreateAchieversDto } from './dto/create.dto';
import { QueryAchieversDto } from './dto/query.dto';
import { UpdateAchieversDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { Public } from 'src/shared/decorators/public.decorator';



/**
 * Controller for managing achievers
 * Provides CRUD operations for achievers entity
 */
@ApiTags('Achievers')
@Controller('/admin/achievers')
@ApiBearerAuth()
export class AchieversController {
  constructor(private readonly achieversService: AchieversService) { }

  /**
   * Create a new achiever
   * @param createDto - DTO containing achiever data
   * @returns newly created achiever
   */
  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new achiever' })
  @ApiResponse({
    status: 201,
    description: 'Achiever created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(
    @Body() createDto: CreateAchieversDto,
  ): Promise<DataResponseDto> {
    return await this.achieversService.create(createDto);
  }

  /**
   * Get all achievers with pagination
   * @param query - Query parameters for filtering and pagination
   * @returns paginated list of achievers
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all achievers' })
  @ApiResponse({
    status: 200,
    description: 'List of achievers retrieved successfully',
  })
  async findAll(@Query() query: QueryAchieversDto): Promise<DataResponseDto> {
    return await this.achieversService.findAll(query);
  }

  /**
   * Get achiever by id
   * @param id - Achiever ID
   * @returns achiever details
   */
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get achiever by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Achiever ID' })
  @ApiResponse({
    status: 200,
    description: 'Achiever retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Achiever not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.achieversService.findOne(id);
  }

  /**
   * Update achiever
   * @param id - Achiever ID
   * @param updateDto - DTO containing fields to update
   * @returns updated achiever
   */
  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update achiever' })
  @ApiParam({ name: 'id', type: 'string', description: 'Achiever ID' })
  @ApiResponse({
    status: 200,
    description: 'Achiever updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Achiever not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAchieversDto,
  ): Promise<DataResponseDto> {
    return await this.achieversService.update(id, updateDto);
  }

  /**
   * Delete achiever
   * @param id - Achiever ID
   * @returns success response
   */
  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete achiever' })
  @ApiParam({ name: 'id', type: 'string', description: 'Achiever ID' })
  @ApiResponse({
    status: 204,
    description: 'Achiever deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Achiever not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.achieversService.remove(id);
  }
}
