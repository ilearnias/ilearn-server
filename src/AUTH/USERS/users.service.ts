import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotEnv from 'dotenv';
import { Op, Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Employee } from '../../HR/EMPLOYEE/employee.entity';
import { DataResponseDto } from '../../SHARED/dto/data-response.dto';
import { Permission } from '../PERMISSIONS/permission.entity';
import { Role } from '../ROLES/role.entity';
import { RolePermission } from '../ROLE_PERMISSION/role_permission.entity';
import { TokenManagementService } from '../TOKEN_MANAGEMENT/token_management.service';
import { CreateUserDto } from './dto/create.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update.dto';
import { Users } from './users.entity';
dotEnv.config();
@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private repository: typeof Users,
    @Inject('CreateToken')
    private createToken: (user: Users, fid: number) => Promise<string | null>,
    @Inject('CreateVerifyToken')
    private createVerifyToken: (email: string) => Promise<string | null>,
    private readonly jwtService: JwtService,
    private readonly tokenManagementService: TokenManagementService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.repository.findOne({
        where: {
          [Op.or]: [
            { email: loginDto.identifier },
            { employee_code: loginDto.identifier },
          ],
        },
        include: [
          {
            model: Employee,
            as: 'employee',
            required: true,
          },
          {
            model: Role,
            where: { isActive: true },
            include: [
              {
                model: RolePermission,
                where: { isActive: true },
                include: [
                  {
                    model: Permission,
                    attributes: ["name", "action", "resource"]
                  },
                ],
              },
            ],
          },
        ],
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

      if (!user?.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      let userPermissions ;
      if(user?.role){
         userPermissions = this.extractAndGroupPermissions(user);
      }

      // Generate access token
      const [refresh, fid] = await this.tokenManagementService.createToken(
        user?.id,
      );

      let access = await this.createToken(user, fid);

      let response = {
        user: {
          user,
          id: user.id,
          name: user.name,
          email: user.email,
          employeeInfo: user.employee,
          permissions: userPermissions
        },
        accessToken: access,
        refreshToken: refresh,
      };

      // Return user data and token
      return new DataResponseDto(response, true, 'User logged in successfully');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.log('error', error);
      throw new InternalServerErrorException('Login failed');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // Check if email already exists
      const existingUser = await this.repository.findOne({
        where: {
          [Op.or]: [
            { email: registerDto.email },
            { employeeId: registerDto.employeeId },
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser.email === registerDto.email
            ? 'Email already in use'
            : 'Employee already has a user account',
        );
      }

      const hashedPassword = await this.hashPassword(registerDto.password);

      const user = await this.repository.create({
        id: uuidv4(),
        ...registerDto,
        password: hashedPassword,
        isActive: true,
        role_id: '900dc8ae-07d3-4a48-9255-cdb97a5e144a',
      });

      // Generate access token
      const [refresh, fid] = await this.tokenManagementService.createToken(
        user.id,
      );
      let access = await this.createToken(user, fid);

      let response = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          employeeId: user.employeeId,
        },
        accessToken: access,
        refreshToken: refresh,
      };

      // Return user data and token
      return new DataResponseDto(
        response,
        true,
        'User registered successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async create(createDto: CreateUserDto) {
    try {
      // Check if email already exists
      const existingUser = await this.repository.findOne({
        where: {
          [Op.or]: [
            { email: createDto.email },
            { employeeId: createDto.employeeId },
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser.email === createDto.email
            ? 'Email already in use'
            : 'Employee already has a user account',
        );
      }

      const hashedPassword = await this.hashPassword(createDto.password);

      const user = await this.repository.create({
        id: uuidv4(),
        employeeId: createDto?.employeeId,
        name: createDto?.name,
        email: createDto?.email,
        role_id: createDto?.roleId,
        password: hashedPassword,
        isActive: true,
      });
      return new DataResponseDto(user, true, 'User created successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    try {
      const { page = 1, limit = 10, search, isActive } = params;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      if (typeof isActive === 'boolean') {
        whereClause.isActive = isActive;
      }

      const { rows, count } = await this.repository.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Employee,
            as: 'employee',
          },
        ],
        attributes: { exclude: ['password'] },
        offset,
        limit,
        distinct: true,
        order: [['name', 'ASC']],
      });

      const pageOptionsDto = {
        page,
        limit,
        query: search || '',
        offset: offset,
      };

      return new DataResponseDto(rows, pageOptionsDto, count);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.repository.findOne({
        where: { id },
        include: [
          {
            model: Employee,
            as: 'employee',
          },
        ],
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return new DataResponseDto(user, true, 'User data fetched successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateDto: UpdateUserDto) {
    const transaction: Transaction =
      await this.repository.sequelize.transaction();

    try {
      const user = await this.repository.findByPk(id, { transaction });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (updateDto.email && updateDto.email !== user.email) {
        const existingUser = await this.repository.findOne({
          where: {
            email: updateDto.email,
            id: { [Op.ne]: id },
          },
          transaction,
        });

        if (existingUser) {
          throw new ConflictException('Email already in use');
        }
      }

      const updateData = { ...updateDto };
      if (updateDto.password) {
        updateData.password = await this.hashPassword(updateDto.password);
      }

      const updatedData = await user.update(updateData, { transaction });
      await transaction.commit();

      return new DataResponseDto(
        updatedData,
        true,
        'User data updated successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const user = await this.repository.findByPk(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await user.destroy();
      return new DataResponseDto(user, true, 'User deleted successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async createNewToken(refreshToken: RefreshTokenDto) {
    try {
      const { refreshToken: oldToken } = refreshToken;
      const verified = this.jwtService.verify(oldToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const [refresh, userId] =
        await this.tokenManagementService.regenerateToken(
          verified?.otp,
          verified?.fid,
        );
      const user = await Users.findOne({
        where: { id: userId },
        attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
      });
      if (!user) throw new NotFoundException('User not Found.');
      const token = await this.createToken(user, verified?.fid);
      return new DataResponseDto(
        { accessToken: token, refreshToken: refresh },
        true,
        'Token refreshed successfully',
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async signoutFromAll(userId: number) {
    try {
      const log = await this.tokenManagementService.signoutFromAll(userId);
      return new DataResponseDto(
        {},
        true,
        `You Are signed out from ${log?.length} Devices.`,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  extractAndGroupPermissions(userData) {
    // Get all the permissions from role.rolePermissions
    const permissions = userData.role.rolePermissions.map(rp => rp.permission);
    
    // Group permissions by resource
    const resourceMap = {};
    
    permissions.forEach(permission => {
      const { resource, name, action, description } = permission;
      
      if (!resourceMap[resource]) {
        resourceMap[resource] = [];
      }
      
      resourceMap[resource].push({
        name,
        action,
        description
      });
    });
    
    // Convert to array format
    const result = Object.keys(resourceMap).map(resource => ({
      resource,
      permissions: resourceMap[resource]
    }));
    
    // Sort by resource name
    return result.sort((a, b) => a.resource.localeCompare(b.resource));
  }
  
}
