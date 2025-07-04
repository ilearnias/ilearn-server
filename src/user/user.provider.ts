import { User } from './user.entity';

export const userProviders = [
  {
    provide: 'UserProvider',
    useValue: User,
  },
];
