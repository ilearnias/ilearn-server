import { PartialType } from '@nestjs/swagger';
import { CreateSubstanceTypeDto } from './create.dto';

export class UpdateSubstanceTypeDto extends PartialType(CreateSubstanceTypeDto) {
}