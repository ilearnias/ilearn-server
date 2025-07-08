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
  ApiQuery,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create.dto';
import { QueryProgramDto } from './dto/query.dto';
import { UpdateProgramDto } from './dto/update.dto';
import { DataResponseDto } from 'src/shared/dto/data-response.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('Programs')
@Controller('admin/programs')
@ApiBearerAuth()
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new program' })    
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Program created successfully',
    type: DataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input - check validation errors',
  })
  async create(@Body() createDto: CreateProgramDto): Promise<DataResponseDto> {
    return await this.programService.create(createDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all programs with filters' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by program title' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by program category' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by program status (active/inactive/upcoming)' })
  @ApiQuery({ name: 'minPrice', required: false, type: 'number', description: 'Filter by minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: 'number', description: 'Filter by maximum price' })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Number of items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programs retrieved successfully',
    type: DataResponseDto,
  })
  async findAll(@Query() query: QueryProgramDto): Promise<DataResponseDto> {
    return await this.programService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get program by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Program ID (UUID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Program retrieved successfully',
    type: DataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  async findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return await this.programService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update program' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Program ID (UUID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Program updated successfully',
    type: DataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Program not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input - check validation errors',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProgramDto,
  ): Promise<DataResponseDto> {
    return await this.programService.update(id, updateDto);
  }

@Delete(':id')
@Public()
@ApiOperation({ summary: 'Delete program' })
@ApiParam({
  name: 'id',
  type: 'string',
  description: 'Program ID (UUID)',
})

async remove(@Param('id') id: string): Promise<DataResponseDto> {
  return await this.programService.remove(id);
}

  
}
