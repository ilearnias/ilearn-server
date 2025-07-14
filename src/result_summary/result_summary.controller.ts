import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResultSummaryService } from './result_summary.service';
import { CreateResultSummaryDto } from './dto/create.dto';
import { UpdateResultSummaryDto } from './dto/update.dto';
import { QueryResultSummaryDto } from './dto/query.dto';
import { DataResponseDto } from '@/shared/dto/data-response.dto';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { Public } from '@/shared/decorators/public.decorator';

@ApiTags('Result Summary')
@Controller('result-summary')
@UseGuards(AuthGuard)
export class ResultSummaryController {
  constructor(private readonly resultSummaryService: ResultSummaryService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new result summary' })
  @ApiResponse({
    status: 201,
    description: 'Result summary created successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(
    @Body() createResultSummaryDto: CreateResultSummaryDto,
  ): Promise<DataResponseDto> {
    return this.resultSummaryService.create(createResultSummaryDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all result summaries with pagination and search',
  })
  @ApiResponse({
    status: 200,
    description: 'Result summaries retrieved successfully',
    type: DataResponseDto,
  })
  findAll(@Query() queryDto: QueryResultSummaryDto): Promise<DataResponseDto> {
    return this.resultSummaryService.findAll(queryDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a result summary by ID' })
  @ApiResponse({
    status: 200,
    description: 'Result summary retrieved successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Result summary not found' })
  findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return this.resultSummaryService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a result summary' })
  @ApiResponse({
    status: 200,
    description: 'Result summary updated successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Result summary not found' })
  update(
    @Param('id') id: string,
    @Body() updateResultSummaryDto: UpdateResultSummaryDto,
  ): Promise<DataResponseDto> {
    return this.resultSummaryService.update(id, updateResultSummaryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a result summary' })
  @ApiResponse({
    status: 200,
    description: 'Result summary deleted successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Result summary not found' })
  remove(@Param('id') id: string): Promise<DataResponseDto> {
    return this.resultSummaryService.remove(id);
  }

  @Delete(':id/soft')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a result summary' })
  @ApiResponse({
    status: 200,
    description: 'Result summary soft deleted successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Result summary not found' })
  softDelete(@Param('id') id: string): Promise<DataResponseDto> {
    return this.resultSummaryService.remove(id);
  }
}
