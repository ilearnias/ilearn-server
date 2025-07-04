import { SuccessStories } from './success_stories.entity';

export const successStoriesProviders = [
  {
    provide: 'SuccessStoriesProvider',
    useValue: SuccessStories,
  },
];
