import { PartialType } from '@nestjs/swagger';
import { CreateResultDto } from './create.dto';

export class UpdateResultDto extends PartialType(CreateResultDto) {}
