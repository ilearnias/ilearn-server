import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleProvider } from './role.provider';
import { PermissionModule } from '../PERMISSIONS/permission.module';

@Module({
  imports:[PermissionModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    ...RoleProvider,
  ],
  exports: [RoleService],
})
export class RoleModule {}
