import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiResponse
  } from '@nestjs/swagger';
  import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { SubstanceTypeService } from './substance_type.service';
import { CreateSubstanceTypeDto } from './dto/create.dto';
import { QuerySubstanceTypeDto } from './dto/query.dto';
import { UpdateSubstanceTypeDto } from './dto/update.dto';
import { Permissions } from '../../SHARED/decorators/permission.decorator';
  
  /**
   * Controller for managing substance types
   * Provides CRUD operations for substance types entity
   */
  @ApiTags('Substance Types')
  @Controller('substance-types')
  @ApiBearerAuth()
  export class SubstanceTypeController {
    constructor(private readonly substanceTypeService: SubstanceTypeService) {}
  
    /**
     * Create a new substance type
     * @param createDto - DTO containing substance type data
     * @returns newly created substance type
     */
    @Post()
    @Permissions('social_work:create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new substance type' })
    @ApiResponse({ status: 201, description: 'Substance type created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 409, description: 'Conflict - substance type already exists' })
    async create(@Body() createDto: CreateSubstanceTypeDto): Promise<DataResponseDto> {
      return await this.substanceTypeService.create(createDto);
    }
  
    /**
     * Get all substance types with pagination
     * @param query - Query parameters for filtering and pagination
     * @returns paginated list of substance types
     */
    @Get()
    @Permissions('social_work:create')
    @ApiOperation({ summary: 'Get all substance types' })
    @ApiResponse({ status: 200, description: 'List of substance types retrieved successfully' })
    async findAll(@Query() query: QuerySubstanceTypeDto): Promise<DataResponseDto> {
      return await this.substanceTypeService.findAll(query);
    }
  
    /**
     * Get substance type by id
     * @param id - Substance type ID
     * @returns substance type details
     */
    @Get(':id')
    @Permissions('social_work:create')
    @ApiOperation({ summary: 'Get substance type by id' })
    @ApiParam({ name: 'id', type: 'number', description: 'Substance type ID' })
    @ApiResponse({ status: 200, description: 'Substance type retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Substance type not found' })
    async findOne(
      @Param('id', new ParseIntPipe()) id: number
    ): Promise<DataResponseDto> {
      return await this.substanceTypeService.findOne(id);
    }
  
    /**
     * Update substance type
     * @param id - Substance type ID
     * @param updateDto - DTO containing fields to update
     * @returns updated substance type
     */
    @Patch(':id')
    @Permissions('social_work:create')
    @ApiOperation({ summary: 'Update substance type' })
    @ApiParam({ name: 'id', type: 'number', description: 'Substance type ID' })
    @ApiResponse({ status: 200, description: 'Substance type updated successfully' })
    @ApiResponse({ status: 404, description: 'Substance type not found' })
    @ApiResponse({ status: 409, description: 'Conflict - substance type name already exists' })
    async update(
      @Param('id', new ParseIntPipe()) id: number,
      @Body() updateDto: UpdateSubstanceTypeDto
    ): Promise<DataResponseDto> {
      return await this.substanceTypeService.update(id, updateDto);
    }
  
    /**
     * Delete substance type
     * @param id - Substance type ID
     * @returns success response
     */
    @Delete(':id')
    @Permissions('social_work:create')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete substance type' })
    @ApiParam({ name: 'id', type: 'number', description: 'Substance type ID' })
    @ApiResponse({ status: 204, description: 'Substance type deleted successfully' })
    @ApiResponse({ status: 404, description: 'Substance type not found' })
    async remove(
      @Param('id', new ParseIntPipe()) id: number
    ): Promise<DataResponseDto> {
      return await this.substanceTypeService.remove(id);
    }
  }