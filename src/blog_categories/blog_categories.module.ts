import { Module } from '@nestjs/common';
import { BlogCategoriesService } from './blog_categories.service';
import { blogCategoriesProviders } from './blog_categories.provider';
import { BlogCategoriesController } from './blog_categories.controller';

@Module({
  controllers: [BlogCategoriesController],
  providers: [BlogCategoriesService, ...blogCategoriesProviders],
  exports: [BlogCategoriesService],
})
export class BlogCategoriesModule {}
