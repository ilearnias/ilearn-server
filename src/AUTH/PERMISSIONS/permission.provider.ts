import { Permission } from "./permission.entity";


export const PermissionProvider = [
  {
    provide: 'PermissionProvider',
    useValue: Permission,
  },
];
