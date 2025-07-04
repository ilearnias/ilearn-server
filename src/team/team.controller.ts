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
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create.dto';
import { UpdateTeamDto } from './dto/update.dto';
import { QueryTeamDto } from './dto/query.dto';
import { Team } from './team.entity';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('Team')
@Controller('admin/team')
@UseGuards(AuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new team member' })
  @ApiResponse({
    status: 201,
    description: 'Team member created successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTeamDto: CreateTeamDto): Promise<DataResponseDto> {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all team members with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Team members retrieved successfully',
    type: DataResponseDto,
  })
  findAll(@Query() queryDto: QueryTeamDto): Promise<DataResponseDto> {
    return this.teamService.findAll(queryDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a team member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Team member retrieved successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a team member' })
  @ApiResponse({
    status: 200,
    description: 'Team member updated successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<DataResponseDto> {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a team member' })
  @ApiResponse({
    status: 200,
    description: 'Team member deleted successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  remove(@Param('id') id: string): Promise<DataResponseDto> {
    return this.teamService.remove(id);
  }

  @Delete(':id/soft')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a team member' })
  @ApiResponse({
    status: 200,
    description: 'Team member soft deleted successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  softDelete(@Param('id') id: string): Promise<DataResponseDto> {
    return this.teamService.softDelete(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore a soft deleted team member' })
  @ApiResponse({
    status: 200,
    description: 'Team member restored successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  restore(@Param('id') id: string): Promise<DataResponseDto> {
    return this.teamService.restore(id);
  }
}

