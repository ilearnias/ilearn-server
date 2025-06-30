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

import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create.dto';
import { QueryMediaDto } from './dto/query.dto';
import { UpdateMediaDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

/**
 * Controller for managing media entries
 * Provides CRUD operations for media entity
 */
@ApiTags('Media')
@Controller('media')
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Create a new media entry
   * @param createDto - DTO containing media data
   * @returns newly created media entry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new media entry' })
  @ApiResponse({
    status: 201,
    description: 'Media entry created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createDto: CreateMediaDto): Promise<DataResponseDto> {
    return await this.mediaService.create(createDto);
  }

  /**
   * Get all media entries with pagination
   * @param query - Query parameters for filtering and pagination
   * @returns paginated list of media entries
   */
  @Get()
  @ApiOperation({ summary: 'Get all media entries' })
  @ApiResponse({
    status: 200,
    description: 'List of media entries retrieved successfully',
  })
  async findAll(@Query() query: QueryMediaDto): Promise<DataResponseDto> {
    return await this.mediaService.findAll(query);
  }

  /**
   * Get media entry by id
   * @param id - Media entry ID
   * @returns media entry details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get media entry by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Media entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Media entry retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Media entry not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.mediaService.findOne(id);
  }

  /**
   * Update media entry
   * @param id - Media entry ID
   * @param updateDto - DTO containing fields to update
   * @returns updated media entry
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update media entry' })
  @ApiParam({ name: 'id', type: 'string', description: 'Media entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Media entry updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Media entry not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMediaDto,
  ): Promise<DataResponseDto> {
    return await this.mediaService.update(id, updateDto);
  }

  /**
   * Delete media entry
   * @param id - Media entry ID
   * @returns success response
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete media entry' })
  @ApiParam({ name: 'id', type: 'string', description: 'Media entry ID' })
  @ApiResponse({
    status: 204,
    description: 'Media entry deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Media entry not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.mediaService.remove(id);
  }
}
