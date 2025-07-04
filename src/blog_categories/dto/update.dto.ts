import { PartialType } from '@nestjs/swagger';
import { CreateBlogCategoriesDto } from './create.dto';

export class UpdateBlogCategoriesDto extends PartialType(
  CreateBlogCategoriesDto,
) {}
