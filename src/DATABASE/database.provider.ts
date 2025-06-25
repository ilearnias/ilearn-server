import { Sequelize } from 'sequelize-typescript';
import { Permission } from '../AUTH/PERMISSIONS/permission.entity';
import { RolePermission } from '../AUTH/ROLE_PERMISSION/role_permission.entity';
import { Role } from '../AUTH/ROLES/role.entity';
import { TokenManagement } from '../AUTH/TOKEN_MANAGEMENT/token_management.entity';
import { Users } from '../AUTH/USERS/users.entity';
import { ConfigurationService } from '../CONFIG/config.service';

import { SubstanceType } from 'src/SUBSTANCE_TYPE/substance_type.entity';
import { SocialWorkSubstanceUse } from 'src/SUBSTANCE_USE/substance_use.entity';

export const databaseProvider = {
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigurationService) => {
    const sequelize = new Sequelize(configService.sequelizeOrmConfig);
    sequelize.addModels([
      SubstanceType,
      SocialWorkSubstanceUse,

      // ----------------------------------------

      Users,
      TokenManagement,
      Role,
      Permission,
      RolePermission,
    ]);
    await sequelize.sync();
    return sequelize;
  },
  inject: [ConfigurationService],
};
