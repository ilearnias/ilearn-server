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

import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dto/create.dto';
import { QueryJourneyDto } from './dto/query.dto';
import { UpdateJourneyDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { Public } from '../shared/decorators/public.decorator';

/**
 * Controller for managing journey entries
 * Provides CRUD operations for journey entity
 */
@ApiTags('Journey')
@Controller('journey')
@ApiBearerAuth()
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  /**
   * Create a new journey entry
   * @param createDto - DTO containing journey data
   * @returns newly created journey entry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new journey entry' })
  @ApiResponse({
    status: 201,
    description: 'Journey entry created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createDto: CreateJourneyDto): Promise<DataResponseDto> {
    return await this.journeyService.create(createDto);
  }

  /**
   * Get all journey entries with pagination
   * @param query - Query parameters for filtering and pagination
   * @returns paginated list of journey entries
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all journey entries' })
  @ApiResponse({
    status: 200,
    description: 'List of journey entries retrieved successfully',
  })
  async findAll(@Query() query: QueryJourneyDto): Promise<DataResponseDto> {
    return await this.journeyService.findAll(query);
  }

  /**
   * Get journey entry by id
   * @param id - Journey entry ID
   * @returns journey entry details
   */
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get journey entry by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Journey entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Journey entry retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Journey entry not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.journeyService.findOne(id);
  }

  /**
   * Update journey entry
   * @param id - Journey entry ID
   * @param updateDto - DTO containing fields to update
   * @returns updated journey entry
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update journey entry' })
  @ApiParam({ name: 'id', type: 'string', description: 'Journey entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Journey entry updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Journey entry not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateJourneyDto,
  ): Promise<DataResponseDto> {
    return await this.journeyService.update(id, updateDto);
  }

  /**
   * Delete journey entry
   * @param id - Journey entry ID
   * @returns success response
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete journey entry' })
  @ApiParam({ name: 'id', type: 'string', description: 'Journey entry ID' })
  @ApiResponse({
    status: 204,
    description: 'Journey entry deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Journey entry not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.journeyService.remove(id);
  }
}
