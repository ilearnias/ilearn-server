import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersProvider } from './users.provider';
import { TokenManagementModule } from '../TOKEN_MANAGEMENT/token_management.module';
import { AuthController } from '../auth.controller';

@Module({
  imports: [TokenManagementModule],
  controllers: [UsersController,AuthController],
  providers: [UsersService, ...UsersProvider],
  exports: [UsersService]
})
export class UsersModule {}