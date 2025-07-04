import { Program } from './program.entity';

export const programProviders = [
  {
    provide: 'ProgramProvider',
    useValue: Program,
  },
];
