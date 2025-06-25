import { PartialType } from '@nestjs/swagger';
import { CreateSocialWorkSubstanceUseDto } from './create.dto';

export class UpdateSocialWorkSubstanceUseDto extends PartialType(CreateSocialWorkSubstanceUseDto) {}
