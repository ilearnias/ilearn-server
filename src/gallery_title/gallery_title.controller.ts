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

import { GalleryTitleService } from './gallery_title.service';
import { CreateGalleryTitleDto } from './dto/create.dto';
import { QueryGalleryTitleDto } from './dto/query.dto';
import { UpdateGalleryTitleDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

@ApiTags('Gallery Title')
@Controller('gallery-title')
@ApiBearerAuth()
export class GalleryTitleController {
  constructor(private readonly galleryTitleService: GalleryTitleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new gallery title' })
  @ApiResponse({
    status: 201,
    description: 'Gallery title created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(
    @Body() createDto: CreateGalleryTitleDto,
  ): Promise<DataResponseDto> {
    return await this.galleryTitleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gallery titles' })
  @ApiResponse({
    status: 200,
    description: 'List of gallery titles retrieved successfully',
  })
  async findAll(
    @Query() query: QueryGalleryTitleDto,
  ): Promise<DataResponseDto> {
    return await this.galleryTitleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gallery title by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery title ID' })
  @ApiResponse({
    status: 200,
    description: 'Gallery title retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery title not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.galleryTitleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery title' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery title ID' })
  @ApiResponse({
    status: 200,
    description: 'Gallery title updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery title not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGalleryTitleDto,
  ): Promise<DataResponseDto> {
    return await this.galleryTitleService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete gallery title' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery title ID' })
  @ApiResponse({
    status: 204,
    description: 'Gallery title deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Gallery title not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.galleryTitleService.remove(id);
  }
}
