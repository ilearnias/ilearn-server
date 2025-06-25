import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TokenManagementModule } from './AUTH/TOKEN_MANAGEMENT/token_management.module';
import { UsersModule } from './AUTH/USERS/users.module';
import { NestJwtModule } from './AUTH/strategy/jwt_access.strategy';
import { ConfigurationModule } from './CONFIG/config.module';
import { DatabaseModule } from './DATABASE/database.module';
import { UploadModule } from './UPLOAD/upload.module';
import { RoleModule } from './AUTH/ROLES/role.module';
import { PermissionModule } from './AUTH/PERMISSIONS/permission.module';
import { RolePermissionModule } from './AUTH/ROLE_PERMISSION/role_permission.module';
import { SubstanceTypeModule } from './SUBSTANCE_TYPE/substance_type.module';
import { SocialWorkSubstanceUseModule } from './SUBSTANCE_USE/substance_use.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    NestJwtModule,
    CacheModule.register({ isGlobal: true }),
    SubstanceTypeModule,
    SocialWorkSubstanceUseModule,

    UsersModule,
    UploadModule,
    TokenManagementModule,

    // ----------------------------------------

    // Role
    RoleModule,
    PermissionModule,
    RolePermissionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
