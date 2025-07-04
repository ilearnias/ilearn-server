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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { QueryUserDto } from './dto/query.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto): Promise<DataResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all users with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: DataResponseDto,
  })
  findAll(@Query() queryDto: QueryUserDto): Promise<DataResponseDto> {
    return this.userService.findAll(queryDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): Promise<DataResponseDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<DataResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string): Promise<DataResponseDto> {
    return this.userService.remove(id);
  }

  @Delete(':id/soft')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User soft deleted successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  softDelete(@Param('id') id: string): Promise<DataResponseDto> {
    return this.userService.softDelete(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore a soft deleted user' })
  @ApiResponse({
    status: 200,
    description: 'User restored successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  restore(@Param('id') id: string): Promise<DataResponseDto> {
    return this.userService.restore(id);
  }
}
