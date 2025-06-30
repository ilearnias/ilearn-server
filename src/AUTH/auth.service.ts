import {
  Injectable,
  UnauthorizedException,
  HttpException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { DataResponseDto } from '../shared/dto/data-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserProvider')
    private userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async login(loginDto: LoginDto): Promise<DataResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      const tokens = await this.generateToken(user);

      const response = {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };

      return new DataResponseDto(response, true, 'User logged in successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Login failed');
    }
  }

  async register(registerDto: RegisterDto): Promise<DataResponseDto> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: {
          [Op.or]: [{ email: registerDto.email }, { phone: registerDto.phone }],
        },
      });

      if (existingUser) {
        throw new UnauthorizedException(
          existingUser.email === registerDto.email
            ? 'Email already in use'
            : 'Phone number already in use',
        );
      }

      const hashedPassword = await this.hashPassword(registerDto.password);

      const user = await this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        isActive: true,
        role: registerDto.role || 'student',
      });

      const tokens = await this.generateToken(user);

      const response = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };

      return new DataResponseDto(
        response,
        true,
        'User registered successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async refreshToken(refreshToken: string): Promise<DataResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.userRepository.findByPk(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateToken(user);

      const response = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };

      return new DataResponseDto(
        response,
        true,
        'Token refreshed successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
