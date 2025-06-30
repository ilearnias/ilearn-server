import { PartialType } from '@nestjs/swagger';
import { CreateSuccessStoriesDto } from './create.dto';

export class UpdateSuccessStoriesDto extends PartialType(
  CreateSuccessStoriesDto,
) {}
