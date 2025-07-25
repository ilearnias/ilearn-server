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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create.dto';
import { QueryGalleryDto } from './dto/query.dto';
import { UpdateGalleryDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { Public } from '../shared/decorators/public.decorator';
import { PaginationGalleryDto } from './dto/pagination.dto';

@ApiTags('Gallery')
@Controller('admin/gallery')
@ApiBearerAuth()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload gallery images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Images uploaded successfully',
    type: DataResponseDto,
  })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<DataResponseDto> {
    return await this.galleryService.uploadImages(files);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new gallery item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Gallery item created successfully',
    type: DataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation error',
  })
  async create(@Body() createDto: CreateGalleryDto): Promise<DataResponseDto> {
    return await this.galleryService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all gallery items' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gallery items retrieved successfully',
    type: DataResponseDto,
  })
  async findAll(@Query() query: PaginationGalleryDto): Promise<DataResponseDto> {
    return await this.galleryService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get gallery item by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gallery item retrieved successfully',
    type: DataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Gallery item not found',
  })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.galleryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery item' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gallery item updated successfully',
    type: DataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Gallery item not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGalleryDto,
  ): Promise<DataResponseDto> {
    return await this.galleryService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gallery item' })
  @ApiParam({ name: 'id', type: 'string', description: 'Gallery item ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Gallery item deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Gallery item not found',
  })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.galleryService.remove(id);
  }
}
