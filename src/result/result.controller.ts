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

import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create.dto';
import { QueryResultDto } from './dto/query.dto';
import { UpdateResultDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';
import { Public } from 'src/shared/decorators/public.decorator';


@ApiTags('Result')
@Controller('admin/results')
@ApiBearerAuth()
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new result' })
  @ApiResponse({ status: 201, description: 'Result created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createDto: CreateResultDto): Promise<DataResponseDto> {
    return await this.resultService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all results' })
  @ApiResponse({
    status: 200,
    description: 'List of results retrieved successfully',
  })
  async findAll(@Query() query: QueryResultDto): Promise<DataResponseDto> {
    return await this.resultService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get result by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Result ID' })
  @ApiResponse({ status: 200, description: 'Result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Result not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.resultService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update result' })
  @ApiParam({ name: 'id', type: 'string', description: 'Result ID' })
  @ApiResponse({ status: 200, description: 'Result updated successfully' })
  @ApiResponse({ status: 404, description: 'Result not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateResultDto,
  ): Promise<DataResponseDto> {
    return await this.resultService.update(id, updateDto);
  }

  @Delete(':id')
  @Public()

  @ApiOperation({ summary: 'Delete result' })
  @ApiParam({ name: 'id', type: 'string', description: 'Result ID' })
  @ApiResponse({ status: 204, description: 'Result deleted successfully' })
  @ApiResponse({ status: 404, description: 'Result not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.resultService.remove(id);
  }
}
