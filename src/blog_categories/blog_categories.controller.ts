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

import { BlogCategoriesService } from './blog_categories.service';
import { CreateBlogCategoriesDto } from './dto/create.dto';
import { QueryBlogCategoriesDto } from './dto/query.dto';
import { UpdateBlogCategoriesDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { Public } from 'src/shared/decorators/public.decorator'

@ApiTags('Blog Categories')
@Controller('admin/blog/categories')
@ApiBearerAuth()
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) { }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new blog category' })
  @ApiResponse({
    status: 201,
    description: 'Blog category created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(
    @Body() createDto: CreateBlogCategoriesDto,
  ): Promise<DataResponseDto> {
    return await this.blogCategoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({
    status: 200,
    description: 'List of blog categories retrieved successfully',
  })
  async findAll(
    @Query() query: QueryBlogCategoriesDto,
  ): Promise<DataResponseDto> {
    return await this.blogCategoriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog category by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Blog category ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog category retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Blog category not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.blogCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update blog category' })
  @ApiParam({ name: 'id', type: 'string', description: 'Blog category ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog category updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Blog category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBlogCategoriesDto,
  ): Promise<DataResponseDto> {
    return await this.blogCategoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete blog category' })
  @ApiParam({ name: 'id', type: 'string', description: 'Blog category ID' })
  @ApiResponse({
    status: 204,
    description: 'Blog category deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Blog category not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.blogCategoriesService.remove(id);
  }
}
