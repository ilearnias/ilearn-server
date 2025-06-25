import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Public } from 'src/SHARED/decorators/public.decorator';
import { DataResponseDto } from '../SHARED/dto/data-response.dto';
import { LoginDto } from './USERS/dto/login.dto';
import { RefreshTokenDto } from './USERS/dto/refresh_token.dto';
import { UsersService } from './USERS/users.service';
  
  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post('login')
    @Public()
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

    @Post("refresh")
    @Public()
    @ApiOperation({
      summary: "Refresh Authentication Token",
      description:
        "Accepts a refresh token to regenerate new access and refresh tokens for the user.",
    })
    @ApiBody({
      type: RefreshTokenDto,
      description:
        "The refresh token to generate a new set of access and refresh tokens.",
    })
    async refreshToken(@Body() refreshToken: RefreshTokenDto) {
      return await this.usersService.createNewToken(refreshToken);
  
    }
  }
  