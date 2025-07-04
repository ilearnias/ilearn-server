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

import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create.dto';
import { QueryGalleryDto } from './dto/query.dto';
import { UpdateGalleryDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@ApiTags('Gallery')
@Controller('gallery')
@ApiBearerAuth()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new gallery item' })
  @ApiResponse({
    status: 201,
    description: 'Gallery item created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createDto: CreateGalleryDto): Promise<DataResponseDto> {
    return await this.galleryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gallery items' })
  @ApiResponse({
    status: 200,
    description: 'List of gallery items retrieved successfully',
  })
  async findAll(@Query() query: QueryGalleryDto): Promise<DataResponseDto> {
    return await this.galleryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gallery item by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery item ID' })
  @ApiResponse({
    status: 200,
    description: 'Gallery item retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.galleryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery item' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery item ID' })
  @ApiResponse({
    status: 200,
    description: 'Gallery item updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGalleryDto,
  ): Promise<DataResponseDto> {
    return await this.galleryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete gallery item' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery item ID' })
  @ApiResponse({
    status: 204,
    description: 'Gallery item deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.galleryService.remove(id);
  }
}
