import { Team } from './team.entity';

export const teamProviders = [
  {
    provide: 'TeamProvider',
    useValue: Team,
  },
];
