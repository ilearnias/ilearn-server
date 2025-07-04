import { BlogCategories } from './blog_categories.entity';

export const blogCategoriesProviders = [
  {
    provide: 'BlogCategoriesProvider',
    useValue: BlogCategories,
  },
];
