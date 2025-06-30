import { Achievers } from './achievers.entity';

export const achieversProviders = [
  {
    provide: 'AchieversProvider',
    useValue: Achievers,
  },
];
