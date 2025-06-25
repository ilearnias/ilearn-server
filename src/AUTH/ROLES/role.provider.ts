import { Role } from "./role.entity";


export const RoleProvider = [
  {
    provide: 'RoleProvider',
    useValue: Role,
  },
];
