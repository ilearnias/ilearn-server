import { PartialType } from '@nestjs/swagger';
import { CreateGalleryDto } from './create.dto';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {}
