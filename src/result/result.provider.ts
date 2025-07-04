import { Result } from './result.entity';

export const resultProviders = [
  {
    provide: 'ResultProvider',
    useValue: Result,
  },
];
