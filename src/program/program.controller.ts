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

import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create.dto';
import { QueryProgramDto } from './dto/query.dto';
import { UpdateProgramDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';

@ApiTags('Program')
@Controller('program')
@ApiBearerAuth()
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new program' })
  @ApiResponse({ status: 201, description: 'Program created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createDto: CreateProgramDto): Promise<DataResponseDto> {
    return await this.programService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  @ApiResponse({
    status: 200,
    description: 'List of programs retrieved successfully',
  })
  async findAll(@Query() query: QueryProgramDto): Promise<DataResponseDto> {
    return await this.programService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Program ID' })
  @ApiResponse({ status: 200, description: 'Program retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.programService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update program' })
  @ApiParam({ name: 'id', type: 'string', description: 'Program ID' })
  @ApiResponse({ status: 200, description: 'Program updated successfully' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProgramDto,
  ): Promise<DataResponseDto> {
    return await this.programService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete program' })
  @ApiParam({ name: 'id', type: 'string', description: 'Program ID' })
  @ApiResponse({ status: 204, description: 'Program deleted successfully' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  async remove(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.programService.remove(id);
  }
}
