import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { blogProviders } from './blog.provider';
import { BlogController } from './blog.controller';
import { BlogCategoriesModule } from '../blog_categories/blog_categories.module';

@Module({
  imports: [BlogCategoriesModule],
  controllers: [BlogController],
  providers: [BlogService, ...blogProviders],
  exports: [BlogService],
})
export class BlogModule {}
