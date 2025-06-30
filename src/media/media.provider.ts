import { Media } from './media.entity';

export const mediaProviders = [
  {
    provide: 'MediaProvider',
    useValue: Media,
  },
];
