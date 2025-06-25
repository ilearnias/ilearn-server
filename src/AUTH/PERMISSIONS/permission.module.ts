import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionProvider } from './permission.provider';

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionService,
    ...PermissionProvider,
  ],
  exports: [PermissionService],
})
export class PermissionModule {}
