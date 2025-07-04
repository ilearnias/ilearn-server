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

import { SuccessStoriesService } from './success_stories.service';
import { CreateSuccessStoriesDto } from './dto/create.dto';
import { QuerySuccessStoriesDto } from './dto/query.dto';
import { UpdateSuccessStoriesDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Success Stories')
@Controller('admin/success-stories')
@ApiBearerAuth()
export class SuccessStoriesController {
  constructor(private readonly successStoriesService: SuccessStoriesService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new success story' })
  @ApiResponse({
    status: 201,
    description: 'Success story created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(
    @Body() createDto: CreateSuccessStoriesDto,
  ): Promise<DataResponseDto> {
    return await this.successStoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all success stories' })
  @ApiResponse({
    status: 200,
    description: 'List of success stories retrieved successfully',
  })
  async findAll(
    @Query() query: QuerySuccessStoriesDto,
  ): Promise<DataResponseDto> {
    return await this.successStoriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get success story by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Success story ID' })
  @ApiResponse({
    status: 200,
    description: 'Success story retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Success story not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.successStoriesService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update success story' })
  @ApiParam({ name: 'id', type: 'string', description: 'Success story ID' })
  @ApiResponse({
    status: 200,
    description: 'Success story updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Success story not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSuccessStoriesDto,
  ): Promise<DataResponseDto> {
    return await this.successStoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete success story' })
  @ApiParam({ name: 'id', type: 'string', description: 'Success story ID' })
  @ApiResponse({
    status: 204,
    description: 'Success story deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Success story not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.successStoriesService.remove(id);
  }
}
