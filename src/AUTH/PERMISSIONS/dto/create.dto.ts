import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateModulePermissionDto {
  @ApiProperty({
    description: 'module name',
    example: 'create_user'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Role ID',
    example: '900dc8ae-07d3-4a48-9255-cdb97a5e144a'
  })
  @IsNotEmpty()
  @IsUUID(4)
  roleId: string;
}