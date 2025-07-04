import { Blog } from './blog.entity';

export const blogProviders = [
  {
    provide: 'BlogProvider',
    useValue: Blog,
  },
];
