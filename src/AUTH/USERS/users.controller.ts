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
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { Public } from '../../SHARED/decorators/public.decorator';
import { CreateUserDto } from './dto/create.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UsersService } from './users.service';
import { Permissions } from '../../SHARED/decorators/permission.decorator';

@ApiTags('Users')
@Controller('users')
@Public()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions('users:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use or employee already has account',
  })
  async create(
    @Body() createDto: CreateUserDto,
  ): Promise<DataResponseDto> {
      return await this.usersService.create(createDto);
  }

  @Get()
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<DataResponseDto> {
     return await this.usersService.findAll({
        page,
        limit,
        search,
        isActive: isActive === undefined ? undefined : isActive === true,
      });
  }

  @Get(':id')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<DataResponseDto> {
      return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @Permissions('users:update')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<DataResponseDto> {
      return await this.usersService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('users:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<DataResponseDto> {
      return await this.usersService.remove(id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<DataResponseDto> {
      return await this.usersService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration successful',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<DataResponseDto> {
      return await this.usersService.register(registerDto);
  }
}
