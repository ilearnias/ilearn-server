import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags
  } from '@nestjs/swagger';
  import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
  import { CreateSocialWorkSubstanceUseDto } from './dto/create.dto';
  import { UpdateSocialWorkSubstanceUseDto } from './dto/update.dto';
import { SocialWorkSubstanceUseService } from './substance_use.service';
import { QuerySocialWorkSubstanceUseDto } from './dto/query.dto';
  
  @ApiTags('Social Work Substance Use')
  @Controller('social-work-substance-use')
  @ApiBearerAuth()
  export class SocialWorkSubstanceUseController {
    constructor(private readonly socialWorkSubstanceUseService: SocialWorkSubstanceUseService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new social work substance use record' })
    async create(@Body() createDto: CreateSocialWorkSubstanceUseDto): Promise<DataResponseDto> {
      return await this.socialWorkSubstanceUseService.create(createDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all social work substance use records' })
    async findAll(@Query() query: QuerySocialWorkSubstanceUseDto): Promise<DataResponseDto> {
      return await this.socialWorkSubstanceUseService.findAll(query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get social work substance use record by id' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    async findOne(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
    ): Promise<DataResponseDto> {
      return await this.socialWorkSubstanceUseService.findOne(id);
    }
  
    @Get('patient/:patientId')
    @ApiOperation({ summary: 'Get social work substance use records by patient id' })
    @ApiParam({ name: 'patientId', type: 'string', format: 'uuid' })
    async findByPatientId(
      @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string
    ): Promise<DataResponseDto> {
      return await this.socialWorkSubstanceUseService.findByPatientId(patientId);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update social work substance use record' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateDto: UpdateSocialWorkSubstanceUseDto
    ): Promise<DataResponseDto> {
      return await this.socialWorkSubstanceUseService.update(id, updateDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete social work substance use record' })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    async remove(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
    ): Promise<DataResponseDto> {
      return await this.socialWorkSubstanceUseService.remove(id);
    }
  }