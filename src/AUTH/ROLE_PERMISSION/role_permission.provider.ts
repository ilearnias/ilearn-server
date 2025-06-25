import { RolePermission } from "./role_permission.entity";


export const RolePermissionProvider = [
  {
    provide: 'RolePermissionProvider',
    useValue: RolePermission,
  },
];
