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

import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create.dto';
import { QueryBlogDto } from './dto/query.dto';
import { UpdateBlogDto } from './dto/update.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { Public } from 'src/shared/decorators/public.decorator'

@ApiTags('Blog')
@Controller('admin/blog/posts')
@ApiBearerAuth()
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createDto: CreateBlogDto): Promise<DataResponseDto> {
    return await this.blogService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({
    status: 200,
    description: 'List of blogs retrieved successfully',
  })
  async findAll(@Query() query: QueryBlogDto): Promise<DataResponseDto> {
    return await this.blogService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get blog by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.blogService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update blog' })
  @ApiParam({ name: 'id', type: 'string', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBlogDto,
  ): Promise<DataResponseDto> {
    return await this.blogService.update(id, updateDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete blog' })
  @ApiParam({ name: 'id', type: 'string', description: 'Blog ID' })
  @ApiResponse({ status: 204, description: 'Blog deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.blogService.remove(id);
  }
}
