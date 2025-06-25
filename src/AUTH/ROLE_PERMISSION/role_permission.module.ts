import { Module } from '@nestjs/common';
import { RolePermissionController } from './role_permission.controller';
import { RolePermissionService } from './role_permission.service';
import { RolePermissionProvider } from './role_permission.provider';

@Module({
  controllers: [RolePermissionController],
  providers: [
    RolePermissionService,
    ...RolePermissionProvider,
  ],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
