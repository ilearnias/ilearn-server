import { PartialType } from '@nestjs/swagger';
import { CreateGalleryTitleDto } from './create.dto';

export class UpdateGalleryTitleDto extends PartialType(CreateGalleryTitleDto) {}
