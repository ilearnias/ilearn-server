import { Journey } from './journey.entity';

export const journeyProviders = [
  {
    provide: 'JourneyProvider',
    useValue: Journey,
  },
];
